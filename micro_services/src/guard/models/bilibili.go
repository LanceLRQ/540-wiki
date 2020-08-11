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
	// packetlength
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

func (proto *DanmakuProtocol) LoadBuffer(stream io.Reader, deflate bool) error {
	var reader io.Readerg
	if deflate {
		reader = flate.NewReader(stream)
	} else{
		reader = bufio.NewReader(stream)
	}
	buffer := make([]byte, 16)
	protoLen, err := reader.Read(buffer)
	if protoLen == 0 { return nil }
	if err != nil || protoLen < 16 {
		return fmt.Errorf("danmaku message protocal error")
	}
	// packetlength
	proto.PacketLength = binary.BigEndian.Uint32(buffer[0:4])
	// HeaderLength
	proto.HeaderLength = binary.BigEndian.Uint16(buffer[4:6])
	// version
	proto.Version = binary.BigEndian.Uint16(buffer[6:8])
	// action
	proto.Action = binary.BigEndian.Uint32(buffer[8:12])
	// Parameter
	proto.Parameter = binary.BigEndian.Uint32(buffer[12:16])
	// Content
	if proto.PacketLength > 16 {
		contentByte := make([]byte, proto.PacketLength - 16)
		if _, err := reader.Read(contentByte); err != nil {
			return err
		}
		proto.Content = contentByte
		isZiped1 := proto.Version == 2 && proto.Action == 5
		isZiped2 := contentByte[0] == 0x78 && contentByte[1] == 0xDA
		if !deflate && (isZiped1 || isZiped2)  {     	// 处理deflate消息
			contentByte = contentByte[2:len(contentByte) -1] 			// Skip 0x78 0xDA
			buf := bytes.NewBuffer(contentByte)
			return proto.LoadBuffer(buf, true)
		}
	}
	return nil
}
