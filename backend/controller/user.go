package controller

import (
	"CEToolBox/database"
	"encoding/json"
	"net/http"
)

func whoAmI(w http.ResponseWriter, r *http.Request, user database.User) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Method not allowed"))
		return
	}

	b, err := json.MarshalIndent(user, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to login"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}
