package account

import (
	"github.com/kataras/iris/v12"
	"guess460/internal/server"
)

func RegisterAccount (app iris.Party) {
	app.Get("/login", loginCheckView)
	app.Post("/login", doLoginView)
	//app.Get("/info", getUserInfoView)
	app.Post("/info", server.Guess640JwtRequired, setUserInfoView)
}