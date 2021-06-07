package main

import (
	"guess460/internal"
	"log"
)

func main()  {
	err := internal.RunServer("./configs/server.yml", "")
	if err != nil {
		log.Fatal(err)
	}
}
