package main

import (
	"context"
	"fmt"

	"tinygo.org/x/bluetooth"
)

// App struct
type App struct {
	ctx        context.Context
	adapter    *bluetooth.Adapter
	rssiData   map[string][]int
	isScanning bool
	scanDone   chan struct{}
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		rssiData: make(map[string][]int),
		scanDone: make(chan struct{}),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// InitializeBLE initializes and enables the BLE adapter
func (a *App) InitializeBLE() error {
	if a.adapter != nil {
		return nil
	}

	fmt.Println("Initializing BLE adapter...")
	a.adapter = bluetooth.DefaultAdapter
	if a.adapter == nil {
		return fmt.Errorf("no bluetooth adapter available")
	}

	fmt.Println("Enabling BLE interface...")
	err := a.adapter.Enable()
	if err != nil {
		return fmt.Errorf("failed to enable bluetooth: %s", err)
	}

	fmt.Println("BLE adapter initialized successfully")
	return nil
}

// StartScan starts BLE scanning
func (a *App) StartScan() error {
	fmt.Println("StartScan called")

	if a.isScanning {
		return fmt.Errorf("scan is already in progress")
	}

	if a.adapter == nil {
		return fmt.Errorf("bluetooth adapter not initialized")
	}

	// Reset scan data
	a.rssiData = make(map[string][]int)
	a.isScanning = true

	// Start scanning
	fmt.Println("Starting scan...")
	err := a.adapter.Scan(func(adapter *bluetooth.Adapter, device bluetooth.ScanResult) {
		uuid := device.Address.String()
		a.rssiData[uuid] = append(a.rssiData[uuid], int(device.RSSI))
	})

	if err != nil {
		a.isScanning = false
		return fmt.Errorf("failed to start scan: %s", err)
	}

	fmt.Println("Scan started successfully")
	return nil
}

// StopScan stops BLE scanning
func (a *App) StopScan() {
	if !a.isScanning {
		fmt.Println("Not scanning, returning")
		return
	}

	a.adapter.StopScan()
	a.isScanning = false
	fmt.Println("Scan stopped successfully")
}

// IsScanning returns the current scanning status
func (a *App) IsScanning() bool {
	return a.isScanning
}

// GetAverageRSSI returns the average RSSI values for all scanned devices
func (a *App) GetAverageRSSI() map[string]float64 {
	averages := make(map[string]float64)
	for uuid, rssiValues := range a.rssiData {
		if len(rssiValues) == 0 {
			continue
		}

		sum := 0
		for _, rssi := range rssiValues {
			sum += rssi
		}
		averages[uuid] = float64(sum) / float64(len(rssiValues))
	}

	return averages
}
