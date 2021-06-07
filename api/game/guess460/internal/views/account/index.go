package account

import "github.com/kataras/iris/v12"

func RegisterAccount (app iris.Party) {
	app.Get("/login", loginCheckView)
	app.Get("/info", getUserInfoView)
}