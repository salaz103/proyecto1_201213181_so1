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

type tasks struct {
	Procesos    []proceso `json:"procesos"`
	Ejecucion   int       `json:"ejecucion"`
	Suspendidos int       `json:"suspendidos"`
	Detenidos   int       `json:"detenidos"`
	Zombies     int       `json:"zombies"`
	Otros       int       `json:"otros"`
	Total       int       `json:"total"`
}

type proceso struct {
	PID     int    `json:"PID"`
	Nombre  string `json:"Nombre"`
	Usuario int    `json:"Usuario"`
	Estado  string `json:"Estado"`
	Memoria int    `json:"Memoria"`
	Hijos   []hijo `json:"hijos"`
}

type hijo struct {
	ProcesoPadre int    `json:"Proceso padre"`
	PID          int    `json:"PID"`
	Nombre       string `json:"Nombre"`
	Estado       int    `json:"Estado"`
}

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

func transformar() string {

	//h := &tasks{}
	info, err := ioutil.ReadFile("/proc/cpu_201213181")
	if err != nil {
		fmt.Println("Error al abrir archivo cpu_201213181")
		return ""
	}

	//lectura := string(info)
	//fmt.Println(lectura)

	/*err2 := json.Unmarshal([]byte(lectura), &h)
	if err2 != nil {
		fmt.Println(err2)

		log.Printf("error decoding sakura response: %v", err2)
		if e, ok := err2.(*json.SyntaxError); ok {
			log.Printf("syntax error at byte offset %d", e.Offset)
		}
	}*/

	/*for _, d := range h.Procesos {
		//do something with the d

		mutable := reflect.ValueOf(&d).Elem()
		mutable.FieldByName("Usuario").SetInt(1500)
		fmt.Println(d.Usuario)
	}*/
	//fmt.Printf("%+v\n", h)
	return string(info)
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

func EnvioProcesos(conn *websocket.Conn) {

	fmt.Printf("Updating information PROCESSES")

	if err := conn.WriteMessage(websocket.TextMessage, []byte(transformar())); err != nil {
		fmt.Println(err)
		return
	}
}
