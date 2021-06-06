package data

type ServerConfiguration struct {
	// 服务器配置  （优先级比-l低）
	Server  struct {
		// 监听IP
		Listen string `yaml:"listen" json:"listen"`
		// 监听端口
		Port int `yaml:"port" json:"port,int"`
	} `yaml:"server" json:"server"`

	// REDIS CLI配置
	Redis struct {
		// 数据库IP
		Host string `yaml:"host" json:"host"`
		// 数据库端口
		Port int `yaml:"port" json:"port,int"`
		// 数据库密码
		Password string `yaml:"password" json:"password"`
		// 用户数据库ID
		UserDB int `yaml:"user_db" json:"user_db"`
		// 房间数据库ID
		RoomDB int `yaml:"room_db" json:"room_db"`
	} `yaml:"redis" json:"redis"`

	// 调试模式
	DebugMode bool `yaml:"debug" json:"debug"`
}
