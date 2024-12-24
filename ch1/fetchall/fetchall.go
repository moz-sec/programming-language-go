package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"strings"
	"time"
)

func main() {
	start := time.Now()
	ch := make(chan string)
	for _, u := range os.Args[1:] {
		u2, err := url.Parse(u)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetchall: parse %s: %v\n", u, err)
			os.Exit(1)
		}
		go fetch(*u2, ch)
	}

	for range os.Args[1:] {
		fmt.Println(<-ch)
	}
	fmt.Printf("%.2fs elapsed\n", time.Since(start).Seconds())

}

func fetch(url url.URL, ch chan<- string) {
	start := time.Now()
	resp, err := http.Get(url.String())
	if err != nil {
		ch <- fmt.Sprint(err)
		return
	}

	fileName := path.Base(url.Path)
	if fileName == "" || strings.HasSuffix(url.Path, "/") {
		fileName = "index.html"
	}
	f, err := os.Create(fileName)
	if err != nil {
		ch <- fmt.Sprintf("open file: %v\n", err)
		return
	}
	defer f.Close()

	nbytes, err := io.Copy(f, resp.Body)
	resp.Body.Close()
	if err != nil {
		ch <- fmt.Sprintf("while reading %s: %v\n", url.String(), err)
		return
	}

	secs := time.Since(start).Seconds()
	ch <- fmt.Sprintf("%.2fs %7d %s", secs, nbytes, url.String())
}
