package handlers

import (
	"fmt"
	"net/http"

	"cetoolbox.com/handlers/househandler"
	"github.com/sirupsen/logrus"
)

func root(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("Upsert endpoint triggered")
}

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/", root)
	server.HandleFunc("/ping", ping)
	server.HandleFunc("/house/upsert", househandler.PostUpsert)

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}
