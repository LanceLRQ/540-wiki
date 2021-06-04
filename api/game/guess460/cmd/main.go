package main

import (
	"github.com/urfave/cli/v2"
	"guess460/internal/server"
	"log"
	"os"
)

func main () {
	app := &cli.App{
		Name: "Guess460 Server",
		Usage: "Start a game server!",
		Flags: []cli.Flag {
			&cli.StringFlag{
				Name: "config",
				Aliases: []string { "c" },
				Value: "./configs/server.yml",
				Usage: "server config file",
			},
			&cli.StringFlag{
				Name: "listen",
				Aliases: []string { "l" },
				Value: "127.0.0.1:8460",
				Usage: "listen address",
			},
		},
		Action: func(context *cli.Context) error {
			// Load
			err := server.LoadConfiguration(context.String("config"))
			if err != nil { return err }
			server.ParseListenAddress(context.String("listen"))
			// Run server
			err = server.RunHttpServer()
			if err != nil { return err }
			return nil
		},
		Commands: []*cli.Command{

		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
