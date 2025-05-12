package main

import (
	"fmt"
	"net"
)

func main() {
	conn, err := net.Dial("udp", "127.0.0.1:8080")
	if err != nil {
		fmt.Println("Error dialing UDP:", err)
		return
	}
	defer conn.Close()

	conn.Write([]byte("Hello, World!"))

	buffer := make([]byte, 1024)
	n, err := conn.Read(buffer)
	if err != nil {
		fmt.Println("Error reading from TCP:", err)
		return
	}
	fmt.Printf("Received message: %s\n", string(buffer[:n]))
}
