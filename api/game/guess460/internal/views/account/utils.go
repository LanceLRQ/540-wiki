package account

import "github.com/kataras/iris/v12"

func getUserIdFromRequest (ctx iris.Context) string {
	userId := ctx.GetHeader("GUESS460-ACCOUNT-ID")
	if userId == "" {
		// 如果header里没有，去cookie里读
		userId = ctx.GetCookie("guess460-account-id")
	}
	return userId
}
