package game

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"guess460/internal/data"
	"guess460/internal/errors"
	"guess460/internal/server"
	"time"
)

var RoomSeatKeys = []string {
	"seat_1", "seat_2","seat_3","seat_4","seat_5","seat_6","seat_7", "seat_8",
}

// 创建房间
func createRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	roomId := hasJoinedRoom( userInfo.Id)
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
	// 创建房间并写入
	err := server.SystemDB.HSet(roomKey, "owner", userInfo.Id).Err()
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
	err = server.SystemDB.Set(fmt.Sprintf("joined:room:%s", userInfo.Id), roomId,  2 * time.Hour).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.JoinRoomError)
		return
	}
	// 设置2小时过期
	server.SystemDB.Expire(roomKey, 2 * time.Hour)
	server.SendRESTSuccessResult(ctx, struct {
		RoomId string  `json:"room_id"`
	}{
		RoomId: roomId,
	})
}

// 加入房间
func joinRoom(ctx iris.Context) {
	userInfo := ctx.Values().Get("user_info").(*data.AccountEntity)

	uRoomId := hasJoinedRoom( userInfo.Id)
	if uRoomId != "" {
		// 已有房间，报错
		server.SendESTErrorResult(ctx, errors.HasJoinedRoomError)
		return
	}

	// 判断房间是否存在
	roomId := ctx.Params().GetString("rid")
	yes, err := isRoomExists(roomId)
	if err != nil {
		server.SendESTErrorResult(ctx, errors.RedisConnectionError)
		return
	}
	if !yes {
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
	// 没找到座位
	if found < 0 {
		server.SendESTErrorResult(ctx, errors.RoomMemberFullError)
		return
	}
	// 写入已在房间的状态
	err = server.SystemDB.Set(fmt.Sprintf("joined:room:%s", userInfo.Id), roomId,  2 * time.Hour).Err()
	if err != nil {
		server.SendESTErrorResult(ctx, errors.JoinRoomError)
		return
	}

	server.SendRESTSuccessResult(ctx, struct {
		Seat int  `json:"seat"`
	}{
		Seat: found + 1,
	})
}

// 退出房间（无须指定）
func leaveRoom(ctx iris.Context) {

}

// 解散房间
func destroyRoom(ctx iris.Context) {

}

// 踢人
func removeMember(ctx iris.Context) {

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