package constants

const (
	RoomStatusWaiting = iota        // 等人中
	RoomStatusGuessing              // 游戏中：猜词中
	RoomStatusWaitNextPeople        // 游戏中：本轮结束，等待下一个人
	RoomStatusGameOver              // 游戏结束
)