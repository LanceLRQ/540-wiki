package errors

// 20 - 用户

var (
	LoginSessionInvalid = NewGuess460CustomError(2000, "登录信息失效，请重新登录")
	UserInfoNotExists = NewGuess460CustomError(2001, "用户信息不存在")
	UserNickNameEmpty = NewGuess460CustomError(2002, "昵称不能为空")
	UserNickNameLengthInvalid = NewGuess460CustomError(2003, "昵称不能超过8个字符")
)