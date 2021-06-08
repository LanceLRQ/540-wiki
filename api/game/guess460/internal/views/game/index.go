package game

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
)

func RegisterRoom (app iris.Party) {
	app.Get("/", websocket.Handler(newGameWebsocketView()))
}
