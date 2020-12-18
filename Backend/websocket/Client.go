package websocket

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Body: string(p)}
		fmt.Printf("MENSAJE DEL CLIENTE: %+v \n", message)
		output, err := exec.Command("kill", "-9", message.Body).CombinedOutput()
		if err != nil {
			os.Stderr.WriteString(err.Error())
		}

		fmt.Println(string(output))
	}
}
