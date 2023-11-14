package controller

import (
	"CEToolBox/database"
	"net/http"
	"strings"

	"github.com/sirupsen/logrus"
)

type HandlerFunc func(w http.ResponseWriter, r *http.Request, user database.User)

func middleware(w http.ResponseWriter, r *http.Request, next HandlerFunc) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("middleware")

	if r.Header.Get("Authorization") == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("No authorization header"))
		return
	}

	tok := strings.Split(r.Header.Get("Authorization"), " ")
	if len(tok) != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Invalid authorization header"))
		return
	}

	user, err := verifyAccessToken(ctx, tok[1])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Invalid token"))
		return
	}

	next(w, r, user)
}

func middlewareWrapper(next HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		middleware(w, r, next)
	}
}
