package main

import "micro_services/src/guard"

func main() {
	//if *watcherMode {
	guard.NewGuardClientWorker()
	//} else {
	//	utils.InitGlobal()
	//	server := src.NewServer()
	//	if err := server.RunServer(); err != nil {
	//		log.Fatal(err)
	//	}
	//}
}


