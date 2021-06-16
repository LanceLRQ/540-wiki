package game

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
	"guess460/internal/server"
)

func RegisterRoom (app iris.Party) {
	app.Get("/srv", websocket.Handler(newGameWebsocketView()))
	app.Get("/room/create", server.Guess640JwtRequired, createRoom)
	app.Get("/room/join/{rid:string regexp(^\\d{4}$)}", server.Guess640JwtRequired, joinRoom)
}
