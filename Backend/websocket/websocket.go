package websocket

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/shirou/gopsutil/cpu"
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

func porcentajeCPU() string {
	porcentajes, err := cpu.Percent(time.Second, true)

	if err != nil {
		fmt.Println("Error obtener porcentajes CPU")
		return ""
	}

	return fmt.Sprintf("{\"CPU_1\":%.2f,\"CPU_2\":%.2f,\"CPU_3\":%.2f,\"CPU_4\":%.2f}", porcentajes[0], porcentajes[1], porcentajes[2], porcentajes[3])

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

func EnvioCPU(conn *websocket.Conn) {

	for {
		ticker := time.NewTicker(1 * time.Second)

		for t := range ticker.C {
			fmt.Printf("Updating information CPU: %+v\n", t)

			if err := conn.WriteMessage(websocket.TextMessage, []byte(porcentajeCPU())); err != nil {
				fmt.Println(err)
				return
			}
		}
	}
}
