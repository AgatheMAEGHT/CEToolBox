package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
)

func ping(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path": r.URL.Path,
	})
	log.Info("ping!")
	fmt.Fprintf(w, "Hello World! %s", time.Now())
}
