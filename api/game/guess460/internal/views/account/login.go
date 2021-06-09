package account

import (
	"github.com/kataras/iris/v12"
	uuid "github.com/satori/go.uuid"
	"guess460/internal/constants"
	"guess460/internal/data"
	"guess460/internal/errors"
	"guess460/internal/server"
	"guess460/internal/utils"
	"strings"
	"time"
)

// 登录检查（GET)
func loginCheckView(ctx iris.Context) {
	jwt := server.GetUserJWTFromRequest(ctx)
	if jwt == nil {
		server.SendESTErrorResult(ctx, errors.LoginSessionInvalid)
		return
	}

	userInfo, err := server.GetUserInfo(jwt.UserId)
	if err != nil {
		server.SendESTErrorResult(ctx, err)
		return
	}
	server.SendRESTSuccessResult(ctx, userInfo)
}

// 执行登录（POST)
func doLoginView(ctx iris.Context) {
	// 前端调用这个接口申请code标识符，然后默认发给cookie，前端再存一份到localstorage
	// code作为每个客户端独立的一个标识符，丢失就丢失了，不管了。暂时不做用户系统

	jwt := server.GetUserJWTFromRequest(ctx)

	isNew := false
	var userInfo *data.AccountEntity
	var err error
	var userId string

	if jwt == nil {
		// 没读到就是没有
		userId = uuid.NewV4().String()
		isNew = true
	} else {
		userId = jwt.UserId
		// 如果有id，从数据库里获取用户信息
		userInfo, err = server.GetUserInfo(userId)
		if err == errors.UserInfoNotExists {
			userId = uuid.NewV4().String()
			isNew = true
		} else if err != nil {
			server.SendESTErrorResult(ctx, err)
			return
		}
	}

	if isNew {

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

		avatar := strings.TrimSpace(ctx.PostValue("avatar"))
		if avatar != "" {
			avatar = "p:fumei:07.png"
		}

		userInfo = &data.AccountEntity{
			Id:           userId,
			NickName:     nickName,
			RegisterTime: time.Now().Unix(),
		}
		// 入库
		_, err := server.UserDB.Set(constants.AccountIdDBPrefix+userId, utils.ObjectToJSONString(userInfo, false), 0).Result()
		if err != nil {
			server.SendESTErrorResult(ctx, errors.RedisConnectionError)
			return
		}
	}

	server.SendUserJWTToCookie(ctx, userInfo)
	server.SendRESTSuccessResult(ctx, userInfo)
}

//// 批量获取用户信息 （GET)
//func getUserInfoView (ctx iris.Context) {
//	userId := strings.TrimSpace(ctx.URLParam("user_id"))
//	if userId == "" {
//		userId = server.GetUserIdFromRequest(ctx)
//	}
//
//	userInfo, err := getUserInfo(userId)
//	if err != nil {
//		server.SendESTErrorResult(ctx, err)
//		return
//	}
//	server.SendRESTSuccessResult(ctx, userInfo)
//}

// 设置用户信息 （POST)
func setUserInfoView(ctx iris.Context) {
	//jwt := ctx.Values().Get("user_jwt").(*data.AccountJWT)
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

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

	avatar := strings.TrimSpace(ctx.PostValue("avatar"))
	if avatar != "" {
		userInfo.Avatar = avatar
	}

	// 入库
	err := server.UserDB.Set(constants.AccountIdDBPrefix+userInfo.Id, utils.ObjectToJSONString(userInfo, false), 0).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RedisConnectionError)
		return
	}

	server.SendRESTSuccessResultWithMessage(ctx, userInfo, "修改成功")
}
