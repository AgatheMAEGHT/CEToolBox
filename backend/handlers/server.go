package handlers

import (
	"fmt"
	"net/http"
)

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/ping", ping)

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}