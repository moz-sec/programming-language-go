package main

import (
	"fmt"
	"log"
	"net"
)

func main() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatal(err)
	}
	defer listener.Close()

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Println("Error accepting TCP connection:", err)
			continue
		}
		go handleTCPConnection(conn)
	}
}

func handleTCPConnection(conn net.Conn) {
	buffer := make([]byte, 1024)

	for {
		n, err := conn.Read(buffer)
		if err != nil {
			if err.Error() == "EOF" {
				return
			}
			log.Println("Error reading from TCP:", err)
			return
		}
		fmt.Printf("%s: %s\n", conn.RemoteAddr(), string(buffer[:n]))
		_, err = conn.Write(buffer[:n])
		if err != nil {
			log.Println("Error writing to TCP:", err)
			return
		}
	}
}
