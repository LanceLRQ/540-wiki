package main

import (
	"log"
	"micro_services/src"
	"micro_services/src/utils"
)

func main() {
	utils.InitGlobal()
	server := src.NewServer()
	if err := server.RunServer(); err != nil {
		log.Fatal(err)
	}
}


