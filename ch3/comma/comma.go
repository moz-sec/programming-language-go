package main

import "fmt"

func comma(s string) string {
	n := len(s)
	if n <= 3 {
		return s
	}

	return comma(s[:n-3]) + "," + s[n-3:]
}

func main() {
	// comma("12345") => "12,345"
	fmt.Println(comma("12345"))
	// comma("123456789") => "123,456,789"
	fmt.Println("1233456789")
	// comma("1234567890") => "1,234,567,890"
	fmt.Println("1234567890")
}
