package models

import (
	"bufio"
	"bytes"
	"compress/flate"
	"encoding/binary"
	"fmt"
	"io"
)

type BilibiliLiveDanmuStreamConf struct {
	 Code int			`json:"code"`
	 Message string		`json:"message"`
	 Msg string			`json:"msg"`
	 Data struct {
		Host string 	`json:"host"`
		Port int 		`json:"port"`
		Token string 	`json:"token"`
	} `json:"data"`
}

type DanmakuProtocol struct {
	// 消息总长度 (协议头 + 数据长度)
	PacketLength uint32
	// 消息头长度 (固定为16[sizeof(DanmakuProtocol)])
	HeaderLength uint16
	// 消息版本号
	Version uint16
	// 消息类型
	Action uint32
	// 参数, 固定为1
	Parameter uint32
	// 数据内容
	Content []byte
}

func (proto *DanmakuProtocol) DumpBuffer() (*bytes.Buffer, error) {
	packetlength := proto.PacketLength
	if proto.PacketLength == 0 { packetlength = uint32(len(proto.Content)) + 16 }
	buffer := bytes.NewBuffer(nil)
	writer := bufio.NewWriter(buffer)
	buf16 := make([]byte, 2)
	buf32 := make([]byte, 4)
	// PacketLength
	binary.BigEndian.PutUint32(buf32, packetlength)
	if _, err := writer.Write(buf32); err != nil {
		return nil, err
	}
	// HeaderLength
	binary.BigEndian.PutUint16(buf16, proto.HeaderLength)
	if _, err := writer.Write(buf16); err != nil {
		return nil, err
	}
	// version
	binary.BigEndian.PutUint16(buf16, proto.Version)
	if _, err := writer.Write(buf16); err != nil {
		return nil, err
	}
	// action
	binary.BigEndian.PutUint32(buf32, proto.Action)
	if _, err := writer.Write(buf32); err != nil {
		return nil, err
	}
	// param
	binary.BigEndian.PutUint32(buf32, proto.Parameter)
	if _, err := writer.Write(buf32); err != nil {
		return nil, err
	}
	if len(proto.Content) > 0 {
		if _, err := writer.Write(proto.Content); err != nil {
			return nil, err
		}
	}
	_ = writer.Flush()
	return buffer, nil
}

//func (proto *DanmakuProtocol) LoadBuffer(stream io.Reader) error {
//	buffer := make([]byte, 16)
//	reader := bufio.NewReader(stream)
//	protoLen, err := reader.Read(buffer)
//	if protoLen == 0 { return nil }
//	if err != nil || protoLen < 16 {
//		return fmt.Errorf("danmaku message protocal error")
//	}
//	// PacketLength
//	proto.PacketLength = binary.BigEndian.Uint32(buffer[0:4])
//	// HeaderLength
//	proto.HeaderLength = binary.BigEndian.Uint16(buffer[4:6])
//	// version
//	proto.Version = binary.BigEndian.Uint16(buffer[6:8])
//	// action
//	proto.Action = binary.BigEndian.Uint32(buffer[8:12])
//	// Parameter
//	proto.Parameter = binary.BigEndian.Uint32(buffer[12:16])
//
//	// Content
//	if proto.PacketLength > 16 {
//		contentByte := make([]byte, proto.PacketLength - 16)
//		lng, _ := reader.Read(contentByte) // ignore_error
//		proto.Content = contentByte
//		isZiped1 := proto.Version == 2 && proto.Action == 5
//		isZiped2 := contentByte[0] == 0x78 && contentByte[1] == 0xDA
//		if isZiped1 || isZiped2 {     	// 处理deflate消息
//			contentByte = contentByte[2: lng-1] 			// Skip 0x78 0xDA
//			buf := bytes.NewBuffer(contentByte)
//			fReader := flate.NewReader(buf)
//			return proto.LoadBuffer(fReader)
//		}
//	}
//	return nil
//}

func (proto *DanmakuProtocol) Unpack(reader io.Reader) error {
	var err error
	err = binary.Read(reader, binary.BigEndian, &proto.PacketLength)
	err = binary.Read(reader, binary.BigEndian, &proto.HeaderLength)
	err = binary.Read(reader, binary.BigEndian, &proto.Version)
	err = binary.Read(reader, binary.BigEndian, &proto.Action)
	err = binary.Read(reader, binary.BigEndian, &proto.Parameter)
	contentByte := make([]byte, proto.PacketLength - 16)
	err = binary.Read(reader, binary.LittleEndian, &contentByte)
	proto.Content = contentByte
	return err
}

func (proto *DanmakuProtocol) LoadBuffer(stream io.Reader) error {
	scanner := bufio.NewScanner(stream)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if !atEOF && len(data) >= 16 {  // 收到的数据大于等于16字节
			packetLength := uint32(0)
			_ = binary.Read(bytes.NewReader(data[0:4]), binary.BigEndian, &packetLength)
			if int(packetLength) <= len(data) {
				return int(packetLength), data[:packetLength], nil
			}
		}
		return
	})
	for scanner.Scan() {
		_ = proto.Unpack(bytes.NewReader(scanner.Bytes()))
		isZiped1 := proto.Version == 2 && proto.Action == 5
		isZiped2 := proto.Content[0] == 0x78 && proto.Content[1] == 0xDA
		if isZiped1 || isZiped2 {     	// 处理deflate消息
			contentByte := proto.Content[2: len(proto.Content)] 			// Skip 0x78 0xDA
			buf := bytes.NewBuffer(contentByte)
			fReader := flate.NewReader(buf)
			return proto.Unpack(fReader)
		}
	}
	return nil
}

func (proto *DanmakuProtocol) String() string {
	return fmt.Sprintf(
		"packetLength=%d; headerLength=%d; version=%d; action=%d; Parameter=%d",
		proto.PacketLength,
		proto.HeaderLength,
		proto.Version,
		proto.Action,
		proto.Parameter,
	)
}
