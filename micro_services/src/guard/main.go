package guard

import (
	"fmt"
	"micro_services/src/guard/models"
	"time"
)

func NewGuardClientWorker() {
	if client, err := NewBilibiliGuardClient(146088); err != nil {
		panic(err)
	} else {
		client.onMessage = func(message models.DanmakuProtocol) {
			fmt.Println("Receive:")
			fmt.Println(string(message.Content))
		}
		if err :=  client.ConnectToLiveStreamService(); err != nil {
			panic(err)
		}
	}
	time.Sleep(100 * time.Second)
}