package game

import (
	"fmt"
	"guess460/internal/errors"
	"guess460/internal/server"
	"math/rand"
	"strconv"
	"strings"
)

// 判断是否在房间里，返回房间号或者空字符串
func hasJoinedRoom(userId string) string {
	uRoomJoinedKey := fmt.Sprintf("joined:room:%s", userId)
	room, err := server.SystemDB.Get(uRoomJoinedKey).Result()
	if err == nil && room != "" {
		return room
	}
	return ""
}

func genRoomId() string {
	try := 10
	for try > 0 {
		rid := rand.Int31n(9000) + 1000
		yes, err := server.SystemDB.Exists(fmt.Sprintf("room:%d", rid)).Result()
		if err != nil || yes == 1 {
			try--
			continue
		}
		return strconv.Itoa(int(rid))
	}
	return ""
}

func isRoomExists(rid string) (bool, error) {
	yes, err := server.SystemDB.Exists(fmt.Sprintf("room:%s", rid)).Result()
	fmt.Println(yes)
	return yes > 0, err
}

func leaveRoomCommon (roomId, userId string) error {
	roomKey := fmt.Sprintf("room:%s", roomId)
	// 获取座位信息
	roomJoinedKey := fmt.Sprintf("joined:room:%s", userId)
	seatText, err := server.SystemDB.Get(roomJoinedKey).Result()
	if err != nil {
		return errors.SeatInfoNotExistsError
	}

	seatInfo := strings.Split(seatText, ":")
	seatKey := seatInfo[1] // 获取座位号

	// 删除座位信息
	err = server.SystemDB.HDel(roomKey, seatKey).Err()
	if err != nil {
		return errors.RoomOperateError
	}
	// 删除加入房间的信息
	err = server.SystemDB.Del(roomJoinedKey).Err()
	if err != nil {
		return errors.RoomOperateError
	}
	return nil
}
