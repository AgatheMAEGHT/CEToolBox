package controller

import (
	"CEToolBox/database"
	"CEToolBox/utils"
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
		w.Write(utils.NewResErr("No authorization header").ToJson())
		return
	}

	tok := strings.Split(r.Header.Get("Authorization"), " ")
	if len(tok) != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Invalid authorization header").ToJson())
		return
	}

	user, err := verifyAccessToken(ctx, tok[1])
	if err != nil {
		log.Errorf("Failed to verify token: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Invalid token").ToJson())
		return
	}

	next(w, r, user)
}

func middlewareWrapper(next HandlerFunc) http.HandlerFunc {
	return corsWrapper(func(w http.ResponseWriter, r *http.Request) {
		middleware(w, r, next)
	})
}
