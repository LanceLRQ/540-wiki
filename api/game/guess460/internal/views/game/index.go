package game

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
)

func RegisterRoom (app iris.Party) {
	app.Get("/room/{room_id}", websocket.Handler(newRoomWsView()))
	app.Get("/room2", func(context iris.Context) {
		context.HTML("AAA")
	})
}
