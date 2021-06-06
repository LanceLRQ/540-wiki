package account

import (
	"github.com/go-redis/redis"
	"github.com/kataras/iris/v12"
	uuid "github.com/satori/go.uuid"
	"guess460/internal/constants"
	"guess460/internal/data"
	"guess460/internal/server"
	"guess460/internal/utils"
	"net/http"
	"time"
)

func LoginCheckView (ctx iris.Context) {
	// 登录发号器
	// 前端调用这个接口申请code标识符，然后默认发给cookie，前端再存一份到localstorage
	// code作为每个客户端独立的一个标识符，丢失就丢失了，不管了。暂时不做用户系统

	redisConn := server.UserDB

	userId := ctx.GetHeader("GUESS460-ACCOUNT-ID")
	if userId == "" {
		// 如果header里没有，去cookie里读
		userId = ctx.GetCookie("guess-460-account-id")
	}
	isNew := false
	var userInfo data.AccountEntity
	if userId == "" {
		// 没读到就是没有
		userId = uuid.NewV4().String()
		isNew = true
	} else {
		// 如果有id，从数据库里获取用户信息
		userInfoJSON, err := redisConn.Get(constants.AccountIdDBPrefix + userId).Result()
		if err == redis.Nil {
			userId = uuid.NewV4().String()
			isNew = true
		} else if err != nil {
			server.SendESTErrorResult(ctx, 1000)
			return
		} else {
			ok := utils.JSONStringToObject(userInfoJSON, &userInfo)
			if !ok {
				server.SendESTErrorResult(ctx, 1001)
				return
			}
		}
	}

	if isNew {
		userInfo = data.AccountEntity{
			UserId:       userId,
			RegisterTime: time.Now().Unix(),
		}
		// 入库
		_, err := redisConn.Set(constants.AccountIdDBPrefix + userId, utils.ObjectToJSONString(userInfo, false), 0).Result()
		if err != nil {
			server.SendESTErrorResult(ctx, 1000)
			return
		}
	}

	// 这里当做是刷新cookie了
	ctx.SetCookie(&http.Cookie{
		Name: "guess-460-account-id",
		Value: userId,
		Expires: time.Now().AddDate(1, 0, 0), // 1年有效期
		Path: "/",
	})

}