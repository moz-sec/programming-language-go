package main

import (
	"context"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
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

// ConvertSize は指定されたサイズを全ての単位に変換します
func (a *App) ConvertSize(input string) map[string]float64 {
	fmt.Printf("Received input: %s\n", input)

	re := regexp.MustCompile(`^(\d+(?:\.\d+)?)([A-Za-z]+)$`)
	matches := re.FindStringSubmatch(input)

	fmt.Printf("Regex matches: %v\n", matches)

	if matches == nil {
		fmt.Println("No matches found")
		return nil
	}

	size, err := strconv.ParseFloat(matches[1], 64)
	if err != nil {
		fmt.Printf("Error parsing size: %v\n", err)
		return nil
	}

	unit := strings.ToUpper(matches[2])
	fmt.Printf("Parsed size: %f, unit: %s\n", size, unit)

	bytes := a.convertToBytes(size, unit)
	if bytes < 0 {
		fmt.Println("Invalid unit")
		return nil
	}

	result := a.getAllUnits(bytes)
	fmt.Printf("Conversion result: %v\n", result)
	return result
}

func (a *App) convertToBytes(size float64, unit string) float64 {
	units := []string{"B", "KB", "MB", "GB", "TB", "PB"}
	index := -1
	for i, u := range units {
		if u == unit {
			index = i
			break
		}
	}
	if index == -1 {
		return -1
	}

	return size * math.Pow(1024, float64(index))
}

func (a *App) getAllUnits(bytes float64) map[string]float64 {
	units := []string{"B", "KB", "MB", "GB", "TB", "PB"}
	result := make(map[string]float64)
	size := bytes

	for _, unit := range units {
		result[unit] = size
		size /= 1024
	}

	return result
}
