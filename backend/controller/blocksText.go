package controller

import (
	"CEToolBox/database"
	"CEToolBox/utils"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

	blockTextID := r.Form.Get("_id")
	if blockTextID == "" {
		http.Error(w, "blockTextId is required", http.StatusBadRequest)
		return
	}

	blockTextObjectID, err := primitive.ObjectIDFromHex(blockTextID)
	if err != nil {
		http.Error(w, "_id must be a valid ObjectID", http.StatusBadRequest)
		return
	}

	blockText, err := database.FindOneBlockText(ctx, bson.M{"_id": blockTextObjectID})
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

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockText := database.BlockText{}
	body := map[string]interface{}{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid body").ToJson())
		return
	}

	if body["text"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("text is required").ToJson())
		return
	}

	if body["_id"] == nil { // Create new blockText
		blockText.Text = body["text"].(string)
		_, err := blockText.CreateOne(ctx)
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error creating blockText").ToJson())
			return
		}
	} else { // Update existing blockText
		var err error
		blockTextID, ok := body["_id"].(string)
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("_id must be a string").ToJson())
			return
		}

		blockTextObjectID, err := primitive.ObjectIDFromHex(blockTextID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("_id must be a valid ObjectID").ToJson())
			return
		}

		blockText, err = database.FindOneBlockText(ctx, bson.M{"_id": blockTextObjectID})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				w.Write(utils.NewResErr("BlockText not found").ToJson())
				return
			}
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error finding blockText").ToJson())
			return
		}

		blockText.Text = body["text"].(string)
		_, err = blockText.UpdateOne(ctx)
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error updating blockText").ToJson())
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

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	blockTextID := r.Form.Get("_id")
	if blockTextID == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("blockTextId is required").ToJson())
		return
	}

	blockTextObjectID, err := primitive.ObjectIDFromHex(blockTextID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("_id must be a valid ObjectID").ToJson())
		return
	}
	blockText, err := database.FindOneBlockText(ctx, bson.M{"_id": blockTextObjectID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr("BlockText not found").ToJson())
			return
		}
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error finding blockText").ToJson())
		return
	}

	_, err = blockText.DeleteOne(ctx)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting blockText").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
}
