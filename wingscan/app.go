package main

import (
	"context"
	"errors"
	"fmt"
	"net"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Scan specified hosts and ports
func (a *App) ScanPort(host string, port int) (bool, error) {
	address := net.JoinHostPort(host, fmt.Sprintf("%d", port))
	timeout := time.Second
	conn, err := net.DialTimeout("tcp", address, timeout)
	if err != nil {
		return false, errors.New("port is closed")
	}
	defer conn.Close()
	return true, nil
}

// Scans multiple ports on a given host
func (a *App) ScanPorts(host string, startPort, endPort int) map[int]bool {
	results := make(map[int]bool)
	for port := startPort; port <= endPort; port++ {
		isOpen, _ := a.ScanPort(host, port)
		results[port] = isOpen
	}
	return results
}
