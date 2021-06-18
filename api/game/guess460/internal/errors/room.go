package errors

// 30 - 房间

var (
	HasJoinedRoomError = NewGuess460CustomError(3000, "你已经加入了一个游戏房间，不能执行操作")
	CreateRoomError = NewGuess460CustomError(3001, "创建游戏房间失败，请重试")
	NotJoinedRoomError = NewGuess460CustomError(3002, "你还没有加入游戏房间，不能执行操作")
	RoomInfoNotExists = NewGuess460CustomError(3003, "房间信息不存在")
	JoinRoomError = NewGuess460CustomError(3004, "加入房间失败")
	RoomMemberFullError = NewGuess460CustomError(3005, "房间人数已满，不能再进入")
	NotRoomCreatorError = NewGuess460CustomError(3006, "非房间创建者不能操作")
	SeatInfoNotExistsError = NewGuess460CustomError(3007, "玩家座位信息不存在")
	RoomOperateError = NewGuess460CustomError(3999, "操作失败，请重试")
)