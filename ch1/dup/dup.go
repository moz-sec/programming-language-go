package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	counts := make(map[string]int)
	files := os.Args[1:]
	if len(files) == 0 {
		countLines(os.Stdin, counts)
	} else {
		for _, arg := range files {
			f, err := os.Open(arg)
			if err != nil {
				fmt.Fprintf(os.Stderr, "dup: %v\n", err)
				continue
			}
			countLines(f, counts)
			f.Close()
		}
	}

	fmt.Println()
	for line, n := range counts {
		if n > 1 {
			files := searchFile(files, line)
			fileList := strings.Join(files, " ")
			fmt.Printf("%d\t%s\t%s\n", n, line, fileList)
		}
	}
}

func countLines(f *os.File, counts map[string]int) {
	input := bufio.NewScanner(f)
	for input.Scan() {
		counts[input.Text()]++
	}
}

func searchFile(files []string, word string) []string {
	var result []string
	for _, file := range files {
		data, err := os.ReadFile(file)
		if err != nil {
			fmt.Fprintf(os.Stderr, "dup: %v\n", err)
			continue
		}
		if strings.Contains(string(data), word) {
			result = append(result, file)
		}
	}

	return result
}
