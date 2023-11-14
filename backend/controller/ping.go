package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
)

// Ping is a simple ping controller
func ping(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("ping!")
	fmt.Fprintf(w, "Pong! %s", time.Now())
}
