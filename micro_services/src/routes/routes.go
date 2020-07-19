package routes

import (
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris/v12"
	"micro_services/src/views"
)

func InitRoutes(app *iris.Application) {
	app.Get("/", views.IndexView)
	app.Get("/api/first_video", cors.AllowAll(), views.GetFirstVideoView)
}