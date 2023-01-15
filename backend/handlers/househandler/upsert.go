package househandler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"cetoolbox.com/config"
	"cetoolbox.com/database/models"
	"github.com/sirupsen/logrus"
)

type upsertParams struct {
	Item models.HouseItem `json:"item"`
}

func PostUpsert(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	ctx := log.Context
	log.Info("Upsert endpoint triggered")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	upsertParams := upsertParams{}
	err := json.NewDecoder(r.Body).Decode(&upsertParams)
	if err != nil {
		log.WithError(err).Errorf("fail to decode body")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to decode body'}")
		return
	}

	err = config.HouseDB.Upsert(ctx, upsertParams)
	if err != nil {
		log.WithError(err).Errorf("fail to upsert: '%v'", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to decode body'}")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
