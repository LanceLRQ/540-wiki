package utils

import (
	"bytes"
	"encoding/json"
)

// ObjectToJSONString 对象转JSON字符串
func ObjectToJSONString(obj interface{}, format bool) string {
	b, err := json.Marshal(obj)
	if err != nil {
		return "{}"
	} else {
		if format {
			var out bytes.Buffer
			err = json.Indent(&out, b, "", "    ")
			if err != nil {
				return "{}"
			}
			return out.String()
		}
		return string(b)
	}
}

// JSONStringToObject JSON字符串转对象
func JSONStringToObject(jsonStr string, obj interface{}) bool {
	return JSONStringByteToObject([]byte(jsonStr), obj)
}

// JSONStringByteToObject JSON字节流转对象
func JSONStringByteToObject(jsonStrByte []byte, obj interface{}) bool {
	err := json.Unmarshal(jsonStrByte, &obj)
	if err != nil {
		return false
	} else {
		return true
	}
}
