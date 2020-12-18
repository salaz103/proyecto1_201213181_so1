package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/salaz103/monitoreo_py1/websocket"
)

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
	http.HandleFunc("/prueba", prueba)
	http.HandleFunc("/cpu", cpu)
	http.HandleFunc("/procesos", procesos)

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
	fmt.Println("Backend en GO listo...")
	setupRoutes()
	//websocket.Transformar()
}
