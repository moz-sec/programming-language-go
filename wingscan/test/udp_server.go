package main

import (
	"fmt"
	"log"
	"net"
)

func main() {
	addr, err := net.ResolveUDPAddr("udp", ":8080")
	if err != nil {
		log.Fatal(err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	handleUDPConnection(conn)
}

func handleUDPConnection(conn *net.UDPConn) {
	buf := make([]byte, 1024)
	for {
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil {
			log.Println("Error reading from UDP:", err)
			continue
		}
		fmt.Printf("%s: %s\n", addr, string(buf[:n]))
		_, err = conn.WriteToUDP(buf[:n], addr)
		if err != nil {
			log.Println("Error writing to UDP:", err)
			return
		}
	}
}
