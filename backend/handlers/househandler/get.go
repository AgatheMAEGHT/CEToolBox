package househandler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"cetoolbox.com/config"
	"cetoolbox.com/database"
	"github.com/sirupsen/logrus"
)

func get(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	ctx := log.Context
	log.Info("Get endpoint triggered")

	categoryQuery, ok := r.URL.Query()["category"]

	var err error
	var houseItems []database.HouseItem
	if !ok || len(categoryQuery[0]) == 0 {
		houseItems, err = config.HouseDB.GetAll(ctx)
	} else {
		categoryFilter := []string{}

		for _, k := range categoryQuery {
			categoryFilter = append(categoryFilter, strings.Split(k, ",")...)
		}
		for _, k := range categoryFilter {
			fmt.Printf("'%s', ", k)
		}

		houseItems, err = config.HouseDB.GetWhereCategory(ctx, categoryFilter)
	}

	if err != nil {
		log.WithError(err).Errorf("fail to get: '%v'", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to get'}")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(houseItems)
}
