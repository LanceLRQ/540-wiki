package views

import "github.com/kataras/iris/v12"

func IndexView (ctx iris.Context) {
	ctx.HTML("Congratulation! Your server is running.")
}

