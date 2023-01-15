package househandler

import (
	"net/http"
)

func Dispatch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		get(w, r)
	} else if r.Method == http.MethodPost {
		upsert(w, r)
	} else if r.Method == http.MethodDelete {
		delete(w, r)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}
