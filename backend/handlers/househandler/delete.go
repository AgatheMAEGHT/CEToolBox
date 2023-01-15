package househandler

import (
	"fmt"
	"net/http"
	"strconv"

	"cetoolbox.com/config"
	"github.com/sirupsen/logrus"
)

func delete(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	ctx := log.Context
	log.Info("Delete endpoint triggered")

	idQuery, ok := r.URL.Query()["id"]
	if !ok || len(idQuery[0]) == 0 {
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'An ID must be provisioned'}")
		return
	}

	id, err := strconv.ParseInt(idQuery[0], 10, 64)
	if err != nil {
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'ID must be int64'}")
		return
	}

	err = config.HouseDB.DeleteByID(ctx, id)
	if err != nil {
		log.WithError(err).Errorf("fail to delete: '%v'", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{'error': 'fail to delete'}")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
