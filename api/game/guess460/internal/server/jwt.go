package server

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"github.com/go-redis/redis"
	"github.com/kataras/iris/v12"
	"guess460/internal/constants"
	"guess460/internal/data"
	"guess460/internal/errors"
	"guess460/internal/utils"
	"math/rand"
	"net/http"
	"sort"
	"strings"
	"time"
)


func Guess640JwtRequired(ctx iris.Context) {
	jwt := GetUserJWTFromRequest(ctx)
	if jwt == nil {
		SendESTErrorResult(ctx, errors.LoginSessionInvalid)
		return
	}
	if !CheckSignatures(*jwt) {
		SendESTErrorResult(ctx, errors.LoginSessionInvalid)
		return
	}
	userInfo, err := GetUserInfo(jwt.UserId)
	if err != nil {
		SendESTErrorResult(ctx, err)
		return
	}
	ctx.Values().Set("user_id", jwt.UserId)
	ctx.Values().Set("user_jwt", jwt)
	ctx.Values().Set("user_info", userInfo)
	ctx.Next()
}


func GetUserJWTFromRequest (ctx iris.Context) *data.AccountJWT {
	userJWTStr := strings.TrimSpace(ctx.GetHeader(constants.AccountJWTHeaderKey))
	if userJWTStr == "" {
		// 如果header里没有，去cookie里读
		userJWTStr = strings.TrimSpace(ctx.GetCookie(constants.AccountJWTCookieName))
	}
	if userJWTStr == "" { return nil}
	userJWTStrByte, err := base64.StdEncoding.DecodeString(userJWTStr)
	if err != nil { return nil }
	userJWTStr = string(userJWTStrByte)
	var jwt data.AccountJWT
	if ok := utils.JSONStringToObject(userJWTStr, &jwt); ok {
		return &jwt
	}
	return nil
}


func GetUserInfo(userId string) (*data.AccountEntity, error) {
	var userInfo data.AccountEntity

	// read from redis
	userInfoJSON, err := SystemDB.Get(constants.AccountIdDBPrefix + userId).Result()
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


func SendUserJWTToCookie(ctx iris.Context, userInfo *data.AccountEntity) {
	jwt := CreateToken(userInfo.Id)
	ctx.SetCookie(&http.Cookie{
		Name: constants.AccountJWTCookieName,
		Value: base64.StdEncoding.EncodeToString(utils.ObjectToJSONByte(jwt, false)),
		Expires: time.Now().AddDate(1, 0, 0), // 1年有效期, 重复设置当做是刷新cookie了
		Path: "/",
	})
}

func GenerateSignatures (jwt data.AccountJWT) string {
	s256 := sha256.New()
	msg := []string {
		Config.Server.SessionSalt,
		jwt.Nonce,
		jwt.UserId,
	}
	sort.Strings(msg)
	msgJoined := []byte(strings.Join(msg, ""))
	s256.Write(msgJoined)
	h := s256.Sum(nil)

	return fmt.Sprintf("%x", h)
}

func CreateToken (userId string) data.AccountJWT {
	jwt := data.AccountJWT{
		UserId: userId,
	}
	r := rand.New(rand.NewSource(time.Now().Unix()))
	nonceBytes := make([]byte, 16)
	for i := 0 ; i < 16 ; i++ {
		nonceBytes[i] = byte(r.Intn(26) + 97)
	}
	jwt.Nonce = string(nonceBytes)
	jwt.Signature = GenerateSignatures(jwt)
	return jwt
}

func CheckSignatures(jwt data.AccountJWT) bool {
	CorrectSignature := GenerateSignatures(jwt)
	return CorrectSignature == jwt.Signature // && (time.Now().Unix() < int64(params.Expire))
}