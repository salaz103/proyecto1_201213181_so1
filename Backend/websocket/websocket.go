package websocket

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return ws, err
	}

	return ws, nil

}

func informacionRAM() string {
	inforam, err := ioutil.ReadFile("/proc/memo_201213181")
	if err != nil {
		fmt.Println("Error al abrir archivo memo_201213181")
		return ""
	}
	return string(inforam)
}

func Writer(conn *websocket.Conn) {

	for {
		ticker := time.NewTicker(1 * time.Second)

		for t := range ticker.C {
			fmt.Printf("Updating information: %+v\n", t)

			if err := conn.WriteMessage(websocket.TextMessage, []byte(informacionRAM())); err != nil {
				fmt.Println(err)
				return
			}

		}

	}

}
