package data

type AccountEntity struct {
	// 用户名
	UserId string `json:"user_id"`
	// 昵称
	NickName string `json:"nickname"`
	// 分数（预留）
	Score int `json:"score"`
	// 注册时间（发号）
	RegisterTime int64 `json:"register_time"`
}
