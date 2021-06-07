package account

import (
	"github.com/go-redis/redis"
	"github.com/kataras/iris/v12"
	uuid "github.com/satori/go.uuid"
	"guess460/internal/constants"
	"guess460/internal/data"
	"guess460/internal/errors"
	"guess460/internal/server"
	"guess460/internal/utils"
	"net/http"
	"strings"
	"time"
)


func getUserInfo(userId string) (*data.AccountEntity, error) {
	var userInfo data.AccountEntity

	// read from redis
	userInfoJSON, err := server.UserDB.Get(constants.AccountIdDBPrefix + userId).Result()
	if err == redis.Nil {
		return nil, errors.UserInfoNotExists
	} else if err != nil {
		return nil, errors.RedisConnectionError
	} else {
		ok := utils.JSONStringToObject(userInfoJSON, &userInfo)
		if !ok {
			return nil, errors.JSONParseError
		}
	}
	return &userInfo, nil
}

// 登录检查和发号（GET)
func loginCheckView (ctx iris.Context) {
	// 前端调用这个接口申请code标识符，然后默认发给cookie，前端再存一份到localstorage
	// code作为每个客户端独立的一个标识符，丢失就丢失了，不管了。暂时不做用户系统

	userId := getUserIdFromRequest(ctx)
	isNew := false
	var userInfo *data.AccountEntity
	var err error

	if userId == "" {
		// 没读到就是没有
		userId = uuid.NewV4().String()
		isNew = true
	} else {
		// 如果有id，从数据库里获取用户信息
		userInfo, err = getUserInfo(userId)
		if err == errors.UserInfoNotExists {
			userId = uuid.NewV4().String()
			isNew = true
		} else if err != nil {
			server.SendESTErrorResult(ctx, err)
			return
		}
	}

	if isNew {
		userInfo = &data.AccountEntity{
			UserId:       userId,
			RegisterTime: time.Now().Unix(),
		}
		// 入库
		_, err := server.UserDB.Set(constants.AccountIdDBPrefix + userId, utils.ObjectToJSONString(userInfo, false), 0).Result()
		if err != nil {
			server.SendESTErrorResult(ctx, errors.RedisConnectionError)
			return
		}
	}

	// 这里当做是刷新cookie了
	ctx.SetCookie(&http.Cookie{
		Name: constants.AccountIdCookieName,
		Value: userId,
		Expires: time.Now().AddDate(1, 0, 0), // 1年有效期
		Path: "/",
	})
	server.SendRESTSuccessResult(ctx, userInfo)
}

// 获取用户信息 （GET)
func getUserInfoView (ctx iris.Context) {
	userId := strings.TrimSpace(ctx.URLParam("user_id"))
	if userId == "" {
		userId = getUserIdFromRequest(ctx)
	}

	userInfo, err := getUserInfo(userId)
	if err != nil {
		server.SendESTErrorResult(ctx, err)
		return
	}
	server.SendRESTSuccessResult(ctx, userInfo)
}

// 设置用户信息 （POST)
func setUserInfoView (ctx iris.Context) {
	userId := getUserIdFromRequest(ctx)
	if userId == "" {
		server.SendESTErrorResult(ctx, errors.LoginSessionInvalid)
		return
	}
	userInfo, err := getUserInfo(userId)
	if err != nil {
		server.SendESTErrorResult(ctx, err)
		return
	}

	// 昵称校验
	nickName := strings.TrimSpace(ctx.PostValue("nick_name"))
	if nickName == "" {
		server.SendESTErrorResult(ctx, errors.UserNickNameEmpty)
		return
	}
	if len(nickName) > 8 {
		server.SendESTErrorResult(ctx, errors.UserNickNameLengthInvalid)
		return
	}

	userInfo.NickName = nickName

	// 入库
	err = server.UserDB.Set(constants.AccountIdDBPrefix + userId, utils.ObjectToJSONString(userInfo, false), 0).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RedisConnectionError)
		return
	}

	server.SendRESTSuccessResultWithMessage(ctx, userInfo, "修改成功")
}