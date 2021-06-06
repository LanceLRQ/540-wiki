package views

import (
	"github.com/kataras/iris/v12"
	"guess460/internal/views/account"
)

func RegisterRouter(app *iris.Application) {
	app.Get("/", func (ctx iris.Context) {
		_, _ = ctx.HTML("Hello world")
	})
	account.RegisterAccount(app.Party("/account"))
}
