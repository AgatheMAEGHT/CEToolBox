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
)

func NoteDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		noteGet(w, r, user)
	case http.MethodPost:
		notePost(w, r, user)
	case http.MethodPut:
		notePut(w, r, user)
	case http.MethodDelete:
		noteDelete(w, r, user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr(fmt.Sprintf("Method %s not allowed", r.Method)).ToJson())
	}
}

func noteGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("noteGet")

	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	query := bson.M{}
	if r.Form.Get("_id") != "" {
		id, err := primitive.ObjectIDFromHex((r.Form.Get("_id")))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid _id").ToJson())
			return
		}

		query["_id"] = id
	}
	if r.Form.Get("title") != "" {
		query["title"] = r.Form.Get("title")
	}

	note, err := database.FindRecipeCategories(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(note)
}

func notePost(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("notePost")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	note := database.Note{}
	err := utils.ParseBody(r.Body, &note)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	_, err = note.CreateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(note)
}

func notePut(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("notePut")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	note := database.Note{}
	err := utils.ParseBody(r.Body, &note)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	_, err = note.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(note)
}

func noteDelete(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("noteDelete")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if r.Form.Get("_id") == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing _id").ToJson())
		return
	}

	id, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	// Get all users that have this note
	users, err := database.FindUsers(ctx, bson.M{"notes": id})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	// Remove the note from all users
	for _, user := range users {
		for i, note := range user.Notes {
			if note == id {
				user.Notes = append(user.Notes[:i], user.Notes[i+1:]...)
				break
			}
		}

		_, err = user.UpdateOne(ctx)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}
	}

	res, err := database.DeleteOneNote(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr(fmt.Sprintf("Note %s not found", id)).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Note deleted").ToJson())
}
