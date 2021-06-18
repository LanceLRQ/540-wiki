package game

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"guess460/internal/data"
	"guess460/internal/errors"
	"guess460/internal/server"
	"time"
)

var RoomSeatKeys = []string{
	"seat_1", "seat_2", "seat_3", "seat_4", "seat_5", "seat_6", "seat_7", "seat_8",
}

// 创建房间
func createRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	roomId := hasJoinedRoom(userInfo.Id)
	if roomId != "" {
		// 已有房间，报错
		server.SendESTErrorResult(ctx, errors.HasJoinedRoomError)
		return
	}

	roomId = genRoomId()
	if roomId == "" {
		server.SendESTErrorResult(ctx, errors.CreateRoomError)
		return
	}

	roomKey := fmt.Sprintf("room:%s", roomId)
	// 创建房间并写入创建者
	err := server.SystemDB.HSet(roomKey, "owner", userInfo.Id).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.CreateRoomError)
		return
	}
	// 写入游戏状态
	err = server.SystemDB.HSet(roomKey, "status", 0).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.CreateRoomError)
		return
	}
	// 写入当前回合状态 (第几轮 * 10 + 第几回合，一开始是0)
	err = server.SystemDB.HSet(roomKey, "round", 0).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.CreateRoomError)
		return
	}

	// 加入房间
	err = server.SystemDB.HSet(roomKey, "seat_1", userInfo.Id).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.JoinRoomError)
		return
	}
	// 写入已在房间的状态
	err = server.SystemDB.Set(fmt.Sprintf("joined:room:%s", userInfo.Id), roomId, 2*time.Hour).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.JoinRoomError)
		return
	}

	// 设置2小时过期
	server.SystemDB.Expire(roomKey, 2*time.Hour)
	server.SendRESTSuccessResult(ctx, struct {
		RoomId string `json:"room_id"`
	}{RoomId: roomId})
}

// 加入房间
func joinRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	// 判断当前用户所在房间
	uRoomId := hasJoinedRoom(userInfo.Id)
	if uRoomId != "" {
		// 已有房间，报错
		server.SendESTErrorResult(ctx, errors.HasJoinedRoomError)
		return
	}

	// 判断房间是否存在
	roomId := ctx.Params().GetString("rid")
	yes, err := isRoomExists(roomId)
	if err != nil || !yes {
		server.SendESTErrorResult(ctx, errors.RoomInfoNotExists)
		return
	}

	// 获取座位信息
	roomKey := fmt.Sprintf("room:%s", roomId)
	userIds, err := server.SystemDB.HMGet(roomKey, RoomSeatKeys...).Result()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RedisConnectionError)
		return
	}

	// 寻找座位
	found := -1
	for i := 0; i < len(userIds); i++ {
		if userIds[i] == nil {
			err = server.SystemDB.HSet(roomKey, RoomSeatKeys[i], userInfo.Id).Err()
			if err != nil {
				server.SendESTErrorResult(ctx, errors.JoinRoomError)
				return
			}
			found = i
			break
		}
	}
	// 找不到可以坐的座位
	if found < 0 {
		server.SendESTErrorResult(ctx, errors.RoomMemberFullError)
		return
	}
	// 写入已在房间的状态
	err = server.SystemDB.Set(fmt.Sprintf("joined:room:%s", userInfo.Id), fmt.Sprintf("%s:%s", roomId, RoomSeatKeys[found]), 2*time.Hour).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.JoinRoomError)
		return
	}

	server.SendRESTSuccessResultWithMessage(ctx, struct {
		Seat int `json:"seat"`
	}{ Seat: found + 1 }, "玩家成功加入房间")
}

// 退出房间（无须指定）
func leaveRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	// 判断当前用户所在房间
	uRoomId := hasJoinedRoom(userInfo.Id)
	if uRoomId == "" {
		// 没有房间，报错
		server.SendESTErrorResult(ctx, errors.NotJoinedRoomError)
		return
	}

	err := leaveRoomCommon(uRoomId, userInfo.Id)
	if err != nil {
		server.SendESTErrorResult(ctx, err)
		return
	}
	server.SendRESTSuccessResultWithMessage(ctx, struct {
		UserId string `json:"user_id"`
	}{UserId: userInfo.Id}, fmt.Sprintf("玩家已离开房间"))
}

// 解散房间
func destroyRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	// 判断当前用户所在房间
	uRoomId := hasJoinedRoom(userInfo.Id)
	if uRoomId == "" {
		// 没有房间，报错
		server.SendESTErrorResult(ctx, errors.NotJoinedRoomError)
		return
	}

	roomKey := fmt.Sprintf("room:%s", uRoomId)
	roomJoinedKeyPrefix := fmt.Sprintf("joined:room:*")
	// 获取归属
	ownerId, err := server.SystemDB.HGet(roomKey, "owner").Result()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RoomOperateError)
		return
	}
	// 权限判定
	if ownerId != userInfo.Id {
		server.SendESTErrorResult(ctx, errors.NotRoomCreatorError)
		return
	}

	// 删除房间信息
	err = server.SystemDB.Del(roomKey).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RoomOperateError)
		return
	}
	// 删除加入状态信息
	joinKeys, err := server.SystemDB.Keys(roomJoinedKeyPrefix).Result()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RoomOperateError)
		return
	}
	err = server.SystemDB.Del(joinKeys...).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RoomOperateError)
		return
	}

	server.SendRESTSuccessResultWithMessage(ctx, nil, "房间解散成功")
}

// 踢人
func kickPeople(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	// 判断当前用户所在房间
	uRoomId := hasJoinedRoom(userInfo.Id)
	if uRoomId == "" {
		// 没有房间，报错
		server.SendESTErrorResult(ctx, errors.NotJoinedRoomError)
		return
	}

	roomKey := fmt.Sprintf("room:%s", uRoomId)
	// 获取归属
	ownerId, err := server.SystemDB.HGet(roomKey, "owner").Result()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RoomOperateError)
		return
	}
	// 权限判定
	if ownerId != userInfo.Id {
		server.SendESTErrorResult(ctx, errors.NotRoomCreatorError)
		return
	}

	// 踢用户
	targetUid := ctx.URLParam("uid")
	err = leaveRoomCommon(uRoomId, targetUid)
	if err != nil {
		server.SendESTErrorResult(ctx, err)
		return
	}

	server.SendRESTSuccessResultWithMessage(ctx, struct {
		UserId string `json:"user_id"`
	}{UserId: targetUid}, fmt.Sprintf("玩家已被踢出"))
}

// 获取房间信息
func getRoomInfo(ctx iris.Context) {

}

// 获取成员在线状态
func checkOnlineStatus(ctx iris.Context) {

}

// 换座位
func setSeatOrder(ctx iris.Context) {

}

// 开始游戏
func startGame(ctx iris.Context) {

}

// 准备
func setReady(ctx iris.Context) {

}
