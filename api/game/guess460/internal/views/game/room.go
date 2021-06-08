package game

import (
	gorilla "github.com/gorilla/websocket"
	"github.com/kataras/iris/v12/websocket"
	"github.com/kataras/neffos"
	neffosGorilla "github.com/kataras/neffos/gorilla"
	"log"
	"net/http"
)

func newRoomWsView() *neffos.Server {
	// Almost all features of neffos are disabled because no custom message can pass
	// when app expects to accept and send only raw websocket native messages.
	// When only allow native messages is a fact?
	// When the registered namespace is just one and it's empty
	// and contains only one registered event which is the `OnNativeMessage`.
	// When `Events{...}` is used instead of `Namespaces{ "namespaceName": Events{...}}`
	// then the namespace is empty "".
	ws := websocket.New(neffosGorilla.Upgrader(gorilla.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}), websocket.Events{
		websocket.OnNativeMessage: func(nsConn *websocket.NSConn, msg websocket.Message) error {
			log.Printf("Server got: %s from [%s]", msg.Body, nsConn.Conn.ID())

			nsConn.Conn.Server().Broadcast(nsConn, msg)
			return nil
		},
	})

	ws.OnConnect = func(c *websocket.Conn) error {
		log.Printf("[%s] Connected to server!", c.ID())
		//c.Write(websocket.Message{ })

		return nil
	}

	ws.OnDisconnect = func(c *websocket.Conn) {
		log.Printf("[%s] Disconnected from server", c.ID())
	}

	return ws
}