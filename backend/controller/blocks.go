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

	blockID := r.Form.Get("blockId")
	if blockID == "" {
		http.Error(w, "blockId is required", http.StatusBadRequest)
		return
	}

	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockID,
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

	if r.Form.Get("type") == "" {
		http.Error(w, "type is required", http.StatusBadRequest)
		return
	}
	if r.Form.Get("linkedBlock") == "" {
		http.Error(w, "linkedBlock is required", http.StatusBadRequest)
		return
	}

	linkedBlockId, err := primitive.ObjectIDFromHex(r.Form.Get("linkedBlock"))
	if err != nil {
		http.Error(w, "linkedBlock is not a valid ObjectId", http.StatusBadRequest)
		return
	}

	switch database.BlockType(r.Form.Get("type")) {
	case database.TEXT_BLOCK:
		_, err := database.FindOneBlock(ctx, bson.M{
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
		Type:        database.BlockType(r.Form.Get("type")),
		LinkedBlock: linkedBlockId,
	}

	result, err := block.CreateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(fmt.Sprintf(`{"blockId": "%s"}`, result.InsertedID.(primitive.ObjectID).Hex())))
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

	blockID := r.Form.Get("blockId")
	if blockID == "" {
		http.Error(w, "blockId is required", http.StatusBadRequest)
		return
	}

	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockID,
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
		linkedBlock, err := database.FindOneBlock(ctx, bson.M{
			"_id": block.LinkedBlock,
		})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, fmt.Sprintf("Block %s not found", block.LinkedBlock), http.StatusNotFound)
				return
			}
			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = database.DeleteLinkedBlock(ctx, block, linkedBlock)
		if err != nil {
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

	w.WriteHeader(http.StatusNoContent)
}
