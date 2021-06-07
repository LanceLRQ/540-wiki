package server

import (
	"fmt"
	"github.com/go-redis/redis"
	"log"
	"time"
)

var UserDB *redis.Client
var RoomDB *redis.Client
//RedisClient := NewRedisClient(Config.)

// NewRedisClient 初始化redis链接池
func NewRedisClient(db int) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:        fmt.Sprintf("%s:%d", Config.Redis.Host, Config.Redis.Port), // Redis地址
		Password:    Config.Redis.Password,                                      // Redis账号
		DB:          db,                                                         // Redis库
		PoolSize:    16,                                                         // Redis连接池大小
		MaxRetries:  3,                                                          // 最大重试次数
		IdleTimeout: 10*time.Second,                                             // 空闲链接超时时间
	})
	_, err := client.Ping().Result()
	if err == redis.Nil {
		return nil, fmt.Errorf("redis connection failed")
	} else if err != nil {
		return nil, fmt.Errorf("redis connection failed:%s", err)
	}
	return client, nil
}

func RedisClientWatcher () {
	var err error
	for {
		UserDB, err = NewRedisClient(Config.Redis.UserDB)
		if err != nil {
			log.Printf("[Redis] %s\n", err.Error())
			time.Sleep(3 * time.Second)  // wait 3 seconds.
			continue
		}
		fmt.Println("[Redis] Connected.")
		for {
			time.Sleep(10 * time.Second)  // ping pre 10 seconds.
			err = UserDB.Ping().Err()
			if err != nil {
				log.Printf("[Redis] %s\n", err.Error())
				time.Sleep(3 * time.Second)  // wait 3 seconds.
				break
			}
		}
	}
}