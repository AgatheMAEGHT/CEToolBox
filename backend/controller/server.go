package controller

import (
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
)

func root(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("Root endpoint triggered")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "Not found")
}

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/", root)
	server.HandleFunc("/ping", ping)
	server.HandleFunc("/login", login)
	server.HandleFunc("/refresh", refresh)
	server.HandleFunc("/who-am-i", middlewareWrapper(whoAmI))
	server.HandleFunc("/blocks", middlewareWrapper(BlockDispatch))
	server.HandleFunc("/blocks/text", middlewareWrapper(BlockTextDispatch))

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}
