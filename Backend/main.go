package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/salaz103/monitoreo_py1/websocket"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func prueba(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	go websocket.Writer(ws)

}

func setupRoutes() {
	http.HandleFunc("/", homePage)
	http.HandleFunc("/prueba", prueba)
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
	fmt.Println("Youtube Subscriber monitor")
	setupRoutes()
}
