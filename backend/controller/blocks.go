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

func BlockDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		blockGet(w, r, user)
	case http.MethodPost:
		blockPost(w, r, user)
	case http.MethodDelete:
		blockDelete(w, r, user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr(fmt.Sprintf("Method %s not allowed", r.Method)).ToJson())
	}
}

func blockGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"function": "blockGet",
	})

	if err := r.ParseForm(); err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	blockID := r.Form.Get("_id")
	if blockID == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("blockId is required").ToJson())
		return
	}

	blockObjectID, err := primitive.ObjectIDFromHex(blockID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("_id must be a valid ObjectID").ToJson())
		return
	}

	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockObjectID,
	})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Block %s not found", blockID)).ToJson())
			return
		}

		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr(err.Error()).ToJson())
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
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	body := map[string]interface{}{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if body["type"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("type is required").ToJson())
		return
	}
	blockType, ok := body["type"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("type is not a string").ToJson())
		return
	}

	if body["linkedBlock"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("linkedBlock is required").ToJson())
		return
	}
	linkedBlockString, ok := body["linkedBlock"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("linkedBlock is not a string").ToJson())
		return
	}

	linkedBlockId, err := primitive.ObjectIDFromHex(linkedBlockString)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("linkedBlock is not a valid ObjectID").ToJson())
		return
	}

	switch database.BlockType(blockType) {
	case database.MARKDOWN_BLOCK, database.MERMAID_BLOCK, database.KATEX_BLOCK:
		_, err := database.FindOneBlockText(ctx, bson.M{
			"_id": linkedBlockId,
		})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				w.Write(utils.NewResErr(fmt.Sprintf("BlockText %s not found", linkedBlockId)).ToJson())
				return
			}
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}
	default:
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(fmt.Sprintf("BlockType %s not found", blockType)).ToJson())
		return
	}

	block := database.Block{
		Type:        database.BlockType(blockType),
		LinkedBlock: linkedBlockId,
	}

	_, err = block.CreateOne(ctx)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr(err.Error()).ToJson())
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
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	blockID := r.Form.Get("_id")
	if blockID == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("blockId is required").ToJson())
		return
	}

	blockIDObject, err := primitive.ObjectIDFromHex(blockID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("_id must be a valid ObjectID").ToJson())
		return
	}
	block, err := database.FindOneBlock(ctx, bson.M{
		"_id": blockIDObject,
	})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Block %s not found", blockID)).ToJson())
			return
		}

		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if block.LinkedBlock != primitive.NilObjectID {
		err = database.DeleteLinkedBlock(ctx, block)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				w.Write(utils.NewResErr(fmt.Sprintf("BlockText %s not found", block.LinkedBlock)).ToJson())
				return
			}
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}
	}

	_, err = block.DeleteOne(ctx)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
}
