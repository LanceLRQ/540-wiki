package account

import (
	"github.com/kataras/iris/v12"
	"guess460/internal/constants"
	"strings"
)

func getUserIdFromRequest (ctx iris.Context) string {
	userId := strings.TrimSpace(ctx.GetHeader(constants.AccountHeaderKey))
	if userId == "" {
		// 如果header里没有，去cookie里读
		userId = strings.TrimSpace(ctx.GetCookie(constants.AccountIdCookieName))
	}
	return userId
}
