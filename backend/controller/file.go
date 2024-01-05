package controller

import (
	"CEToolBox/database"
	"CEToolBox/utils"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	contentLengthLimit = 1024 * 1024 * 100 // 10MB
)

func postFile(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postFile")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	isValidType, fileType, ext := database.IsFileTypeValid(r.Header.Get("Content-Type"))

	if !isValidType {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid content type").ToJson())
		return
	}

	if r.Header.Get("Content-Length") == "" {
		log.Errorf("Header %v", r.Header)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("No content length").ToJson())
		return
	}

	contentLength, err := strconv.Atoi(r.Header.Get("Content-Length"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid content length").ToJson())
		return
	}

	if contentLength > contentLengthLimit {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Content length too big").ToJson())
		return
	}

	// Create file model
	fileModel := database.File{
		Type: fileType,
		Ext:  ext,
	}

	_, err = fileModel.CreateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating file model").ToJson())
		return
	}

	// Create file
	file, err := os.Create(fmt.Sprintf("%s/%s/%s.%s", database.FileFolder, fileModel.Type, fileModel.ID.Hex(), fileModel.Ext))
	if err != nil {
		log.Errorf("Error creating file %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating file").ToJson())
		_, err := database.DeleteOneFile(ctx, fileModel.ID)
		if err != nil {
			log.Errorf("Error deleting file model %v", err)
		}

		return
	}
	defer file.Close()

	// Write file
	_, err = io.Copy(file, r.Body)
	if err != nil {
		log.Errorf("Error writing file %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error writing file").ToJson())
		_, err := database.DeleteOneFile(ctx, fileModel.ID)
		if err != nil {
			log.Errorf("Error deleting file model %v", err)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(fileModel)
}

func deleteFile(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteFile")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	url := strings.Split(r.URL.Path, "/")
	endpoint := strings.Split(url[len(url)-1], ".")
	if len(endpoint) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid endpoint").ToJson())
		return
	}

	ext := endpoint[1]
	fileID, err := primitive.ObjectIDFromHex(endpoint[0])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	file, err := database.FindOneFile(ctx, bson.M{"_id": fileID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("File not found").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error finding file").ToJson())
		return
	}

	err = os.Remove(fmt.Sprintf("%s/%s/%s.%s", database.FileFolder, file.Type, file.ID.Hex(), ext))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting file").ToJson())
		return
	}

	_, err = database.DeleteOneFile(ctx, fileID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting file").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(utils.NewResMsg("File deleted"))
}

func downloadFile(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("downloadFile")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	url := strings.Split(r.URL.Path, "/")
	endpoint := strings.Split(url[len(url)-1], ".")
	if len(endpoint) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid endpoint").ToJson())
		return
	}

	fileID, err := primitive.ObjectIDFromHex(endpoint[0])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	fileModel, err := database.FindOneFile(ctx, bson.M{"_id": fileID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("File model not found").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error finding file model").ToJson())
		return
	}

	filePath := fmt.Sprintf("%s/%s/%s.%s", database.FileFolder, fileModel.Type, fileModel.ID.Hex(), fileModel.Ext)
	file, err := os.Open(filePath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error opening file").ToJson())
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", string(fileModel.Type)+"/"+fileModel.Ext)

	_, err = io.Copy(w, file)
	if err != nil {
		log.Errorf("Error writing file %v", err)
		return
	}
}
