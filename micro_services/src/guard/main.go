package guard

import (
	"fmt"
	"micro_services/src/guard/models"
)

func NewGuardClientWorker() {
	// 146088 沐哥
	if client, err := NewBilibiliGuardClient(21721813); err != nil {
		panic(err)
	} else {
		client.onMessage = func(message models.DanmakuProtocol) {
			fmt.Println("Receive:")
			fmt.Println(string(message.Content))
		}
		if err :=  client.ConnectToLiveStreamService(false); err != nil {
			panic(err)
		}
	}
}