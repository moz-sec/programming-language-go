package main

import (
	"bytes"
	"fmt"
)

// func comma(s string) string {
// 	n := len(s)
// 	if n <= 3 {
// 		return s
// 	}
//
// 	return comma(s[:n-3]) + "," + s[n-3:]
// }

func comma(s string) string {
	n := len(s)
	if n <= 3 {
		return s
	}

	start := n % 3
	if start == 0 {
		start = 3
	}

	var buf bytes.Buffer
	buf.WriteString(s[:start])

	for i := start; i < n; i += 3 {
		buf.WriteByte(',')
		buf.WriteString(s[i : i+3])
	}

	return buf.String()
}

func main() {
	// comma("12345") => "12,345"
	fmt.Println(comma("12345"))
	// comma("123456789") => "123,456,789"
	fmt.Println(comma("123456789"))
	// comma("1234567890") => "1,234,567,890"
	fmt.Println(comma("1234567890"))
}
