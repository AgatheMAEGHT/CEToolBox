package controller

import (
	"CEToolBox/database"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func BlockTextDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		blockTextGet(w, r, user)
	case http.MethodPut:
		blockTextPut(w, r, user)
	case http.MethodDelete:
		blockTextDelete(w, r, user)
	default:
		http.Error(w, fmt.Sprintf("Method %s not allowed", r.Method), http.StatusMethodNotAllowed)
	}
}

func blockTextGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockTextGet",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockTextID := r.Form.Get("blockTextId")
	if blockTextID == "" {
		http.Error(w, "blockTextId is required", http.StatusBadRequest)
		return
	}

	blockText, err := database.FindOneBlockText(ctx, bson.M{"_id": blockTextID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "BlockText not found", http.StatusNotFound)
			return
		}
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(blockText)
}

func blockTextPut(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockTextPut",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockTextID := r.Form.Get("blockTextId")
	body := map[string]interface{}{}
	blockText := database.BlockText{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if body["text"] == nil {
		http.Error(w, "text is required", http.StatusBadRequest)
		return
	}

	if blockTextID == "" { // Create new blockText
		blockText.Text = body["text"].(string)
		_, err := blockText.CreateOne(ctx)
		if err != nil {
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else { // Update existing blockText
		var err error
		blockText, err = database.FindOneBlockText(ctx, bson.M{"_id": blockTextID})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "BlockText not found", http.StatusNotFound)
				return
			}
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		blockText.Text = body["text"].(string)
		_, err = blockText.UpdateOne(ctx)
		if err != nil {
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(blockText)
}

func blockTextDelete(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockTextDelete",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockTextID := r.Form.Get("blockTextId")
	if blockTextID == "" {
		http.Error(w, "blockTextId is required", http.StatusBadRequest)
		return
	}

	blockText, err := database.FindOneBlockText(ctx, bson.M{"_id": blockTextID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "BlockText not found", http.StatusNotFound)
			return
		}
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = blockText.DeleteOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
