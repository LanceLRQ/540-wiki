package server

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
	"guess460/internal/views"
)

func RunHttpServer() error {
	app := iris.New()

	if Config.DebugMode {
		app.Logger().SetLevel("debug")
	} else {
		app.Logger().SetLevel("info")
	}
	// Optionally, add two builtin handlers
	// that can recover from any http-relative panics
	// and log the requests to the terminal.
	app.Use(recover.New())
	app.Use(logger.New())

	views.RegisterRouter(app)

	err := app.Run(iris.Addr(fmt.Sprintf("%s:%d", Config.Server.Listen, Config.Server.Port)))
	if err != nil { return err }

	return err
}

func ParseListenAddress(address string) {

}