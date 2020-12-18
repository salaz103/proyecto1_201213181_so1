package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/salaz103/monitoreo_py1/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func prueba(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	go websocket.Writer(ws)
}

func cpu(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	go websocket.EnvioCPU(ws)
}

func procesos(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	go websocket.EnvioProcesos(ws)

}

func setupRoutes() {

	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/procesos", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})

	http.HandleFunc("/prueba", prueba)
	http.HandleFunc("/cpu", cpu)
	http.HandleFunc("/procesos2", procesos)

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
	fmt.Println("Backend en GO listo...")
	setupRoutes()
	//websocket.Transformar()
}
