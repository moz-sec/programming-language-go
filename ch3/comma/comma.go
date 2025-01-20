package main

import (
	"bytes"
	"fmt"
	"strings"
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
	parts := strings.Split(s, ".")
	integerPart := parts[0]
	var fractionalPart string
	if len(parts) > 1 {
		fractionalPart = parts[1]
	}

	n := len(integerPart)
	if n <= 3 {
		if len(fractionalPart) > 0 {
			return integerPart + "." + fractionalPart
		}
		return integerPart
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

	if len(fractionalPart) > 0 {
		buf.WriteByte('.')
		buf.WriteString(fractionalPart)
	}

	return buf.String()
}

func main() {
	// comma("123") => "123"
	fmt.Println(comma("123"))
	// comma("12345") => "12,345"
	fmt.Println(comma("12345"))
	// comma("123456789") => "123,456,789"
	fmt.Println(comma("123456789"))
	// comma("1234567890") => "1,234,567,890"
	fmt.Println(comma("1234567890"))
	// comma("1.234567890") => "1.234,567,890"
	fmt.Println(comma("1.234567890"))
	// comma("1234567890.1234567890") => "1,234,567,890.123,456,789"
	fmt.Println(comma("1234567890.1234567890"))
}
