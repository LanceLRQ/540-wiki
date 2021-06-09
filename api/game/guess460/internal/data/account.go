package data

type AccountEntity struct {
	// 用户名
	Id string `json:"id"`
	// 昵称
	NickName string `json:"nickname"`
	// 头像（默认值：p:fumei:07.png）
	Avatar string `json:"avatar"`
	// 分数（预留）
	Score int `json:"score"`
	// 注册时间（发号）
	RegisterTime int64 `json:"register_time"`
}

// 授权信息参数表
type AccountJWT struct {
	// 签名信息
	Signature string `json:"signature"`
	//// 时间戳
	//Expire int `json:"expire"`
	// 随机字符串
	Nonce string `json:"nonce"`
	// 令牌内容
	UserId string `json:"user_id"`
}