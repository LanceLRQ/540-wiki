package guard

import (
	"fmt"
	"io/ioutil"
	"micro_services/src/guard/models"
	"micro_services/src/utils"
	"net"
	"net/http"
	"time"
)

type BilibiliGuardClient struct {
	confUrl string				// 直播配置api

	broadcastHost string		// b站的广播地址
	broadcastPort int			// b站的广播端口
	broadcastToken string		// 广播token

	roomId int					// 房间ID
	liveConf *models.BilibiliLiveDanmuStreamConf		// 广播配置信息

	danmakuClient *net.TCPConn		// 弹幕服务器
	onMessage func(message models.DanmakuProtocol)
}

func NewBilibiliGuardClient(roomId int) (*BilibiliGuardClient, error) {
	client := BilibiliGuardClient{
		confUrl: "https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=%d",
		broadcastHost: "broadcastlv.chat.bilibili.com",
		broadcastPort: 2243,
		roomId: roomId,
	}
	err := client.getBilibiliLiveConfig()
	if err != nil {
		return nil, err
	}
	return &client, nil
}

/**
	获取b站直播间的广播配置信息
 */
func (client *BilibiliGuardClient) getBilibiliLiveConfig() error {
	resp, err := http.Get(fmt.Sprintf(client.confUrl, client.roomId))
	if err != nil {
		return fmt.Errorf("faild to get live config: %s", err.Error())
	}
	defer resp.Body.Close()
	bodyByte, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("faild to read live config body: %s", err.Error())
	}
	conf := models.BilibiliLiveDanmuStreamConf{}
	if !utils.JSONStringByteToObject(bodyByte, &conf) {
		return fmt.Errorf("faild to parse live config json body")
	}
	client.liveConf = &conf
	client.broadcastToken = client.liveConf.Data.Token
	client.broadcastPort = client.liveConf.Data.Port
	client.broadcastHost = client.liveConf.Data.Host
	return nil
}

/**
	连接b站的直播弹幕服务器
*/
func (client *BilibiliGuardClient) ConnectToLiveStreamService(async bool) error {
	addr := fmt.Sprintf("%s:%d", client.broadcastHost, client.broadcastPort)
	tcpAddr, err := net.ResolveTCPAddr("tcp4", addr)
	if err != nil {
		return fmt.Errorf("ip addr faild: %s", err.Error())
	}
	if conn, err := net.DialTCP("tcp", nil, tcpAddr); err != nil {
		return fmt.Errorf("fail to connect bilibili live danmaku server")
	} else {
		client.danmakuClient = conn
	}
	// 握手
	if err := client.sendShakehandMessage(); err != nil {
		return err
	}
	// 如果握手成功， 启动监听函数
	go func() {
		for {
			time.Sleep(30 * time.Second)
			_ = client.heartBeat()
		}
	}()
	if async {
		go client.receiveDanmakuMessage()
	} else {
		client.receiveDanmakuMessage()
	}
	return nil
}

/**
	发送握手信息
*/
func (client *BilibiliGuardClient) sendShakehandMessage() error {
	payload := struct {
		RoomId int		`json:"roomid"`
		UID int			`json:"uid"`
		ProtoVer int	`json:"protover"`
		Token string	`json:"token"`
		Platform string	`json:"platform"`
	}{
		RoomId: client.roomId,
		UID: 0,
		ProtoVer: 2,
		Token: client.broadcastToken,
		Platform: "danmuji",
	}
	return client.simpleSend(7, utils.ObjectToJSONString(&payload, false))
}

/**
	快捷发送消息
 */
func (client *BilibiliGuardClient) simpleSend(action uint32, body string) error {
	return client.send(16, 2, action, 1, body)
}

/**
	发送心跳消息
 */
func (client *BilibiliGuardClient) heartBeat() error {
	return client.send(16, 2, 2, 1, "")
}

/**
	发送消息
 */
func (client *BilibiliGuardClient) send(headerLength uint16, ver uint16, action uint32, param uint32, body string) error {
	payload := models.DanmakuProtocol{
		PacketLength: 0,		// for Auto.
		HeaderLength: headerLength,
		Version: ver,
		Action: action,
		Parameter: param,
		Content: []byte(body),
	}
	if buffer, err := payload.DumpBuffer(); err == nil {
		if _, err := client.danmakuClient.Write(buffer.Bytes()); err != nil {
			return fmt.Errorf("send message error: %s", err.Error())
		}
	} else {
		return err
	}
	return nil
}

func (client *BilibiliGuardClient) receiveDanmakuMessage() {
	message := models.DanmakuProtocol{}
	defer client.danmakuClient.Close()
	for {
		err := message.LoadBuffer(client.danmakuClient, false)
		if err != nil {
			fmt.Printf("receive message error: %s\n", err.Error())
			continue
		}
		if client.onMessage != nil {
			client.onMessage(message)
		}
	}
}