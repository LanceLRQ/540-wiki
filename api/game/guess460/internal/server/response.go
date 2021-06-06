package server

import (
	"github.com/kataras/iris/v12"
	"guess460/internal/constants"
	"guess460/internal/data"
)

func SendRESTSuccessResult(ctx iris.Context, content interface{}) {
	ctx.StatusCode(200)
	ctx.JSON(&data.RESTResult{
		Status: true,
		ErrCode: 0,
		Message: "",
		Data: content,
	})
}

func SendESTErrorResult (ctx iris.Context,code int) {
	ctx.StatusCode(500)
	message, ok := constants.ErrorsMessage[code]
	if !ok { message = "Unknown Error" }
	ctx.JSON(&data.RESTResult{
		Status: false,
		ErrCode: code,
		Message: message,
	})
}
func SendRESTErrorResultWithMsg (ctx iris.Context,code int, message string) {
	ctx.StatusCode(500)
	ctx.JSON(&data.RESTResult{
		Status: false,
		ErrCode: code,
		Message: message,
	})
}
