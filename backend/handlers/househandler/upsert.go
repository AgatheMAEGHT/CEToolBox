package househandler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"cetoolbox.com/config"
	"cetoolbox.com/database"
	"github.com/sirupsen/logrus"
)

type upsertParams struct {
	Item database.HouseItem `json:"item"`
}

func upsert(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	ctx := log.Context
	log.Info("Upsert endpoint triggered")

	upsertParams := upsertParams{}
	err := json.NewDecoder(r.Body).Decode(&upsertParams)
	if err != nil {
		log.WithError(err).Errorf("fail to decode body")
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to decode body'}")
		return
	}

	err = config.HouseDB.Upsert(ctx, &upsertParams.Item)
	if err != nil {
		log.WithError(err).Errorf("fail to upsert: '%v'", err)
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to upsert'}")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
