package controller

import (
	"CEToolBox/database"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func BlockDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		blockGet(w, r, user)
	case http.MethodPost:
		blockPost(w, r, user)
	case http.MethodDelete:
		blockDelete(w, r, user)
	default:
		http.Error(w, fmt.Sprintf("Method %s not allowed", r.Method), http.StatusMethodNotAllowed)
	}
}

func blockGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockGet",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockID := r.Form.Get("_id")
	if blockID == "" {
		http.Error(w, "blockId is required", http.StatusBadRequest)
		return
	}

	blockObjectID, err := primitive.ObjectIDFromHex(blockID)
	if err != nil {
		http.Error(w, "_id must be a valid ObjectID", http.StatusBadRequest)
		return
	}

	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockObjectID,
	})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, fmt.Sprintf("Block %s not found", blockID), http.StatusNotFound)
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(block)
}

func blockPost(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockPost",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	body := map[string]interface{}{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if body["type"] == nil {
		http.Error(w, "type is required", http.StatusBadRequest)
		return
	}
	blockType, ok := body["type"].(string)
	if !ok {
		http.Error(w, "type is not a string", http.StatusBadRequest)
		return
	}

	if body["linkedBlock"] == nil {
		http.Error(w, "linkedBlock is required", http.StatusBadRequest)
		return
	}
	linkedBlockString, ok := body["linkedBlock"].(string)
	if !ok {
		http.Error(w, "linkedBlock is not a string", http.StatusBadRequest)
		return
	}

	linkedBlockId, err := primitive.ObjectIDFromHex(linkedBlockString)
	if err != nil {
		http.Error(w, "linkedBlock is not a valid ObjectId", http.StatusBadRequest)
		return
	}

	switch database.BlockType(blockType) {
	case database.MARKDOWN_BLOCK, database.MERMAID_BLOCK, database.KATEX_BLOCK:
		_, err := database.FindOneBlockText(ctx, bson.M{
			"_id": linkedBlockId,
		})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, fmt.Sprintf("Block %s not found", linkedBlockId), http.StatusNotFound)
				return
			}
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "type is not valid", http.StatusBadRequest)
		return
	}

	block := database.Block{
		Type:        database.BlockType(blockType),
		LinkedBlock: linkedBlockId,
	}

	_, err = block.CreateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(block)
}

func blockDelete(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockDelete",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	blockID := r.Form.Get("_id")
	if blockID == "" {
		http.Error(w, "blockId is required", http.StatusBadRequest)
		return
	}

	blockIDObject, err := primitive.ObjectIDFromHex(blockID)
	if err != nil {
		http.Error(w, "_id must be a valid ObjectID", http.StatusBadRequest)
		return
	}
	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockIDObject,
	})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, fmt.Sprintf("Block %s not found", blockID), http.StatusNotFound)
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if block.LinkedBlock != primitive.NilObjectID {
		err = database.DeleteLinkedBlock(ctx, block)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, fmt.Sprintf("Block %s not found", block.LinkedBlock), http.StatusNotFound)
				return
			}
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	_, err = block.DeleteOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
