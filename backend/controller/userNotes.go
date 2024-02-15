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

func userNotesDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		getUserNotes(w, r, user)
	case http.MethodPost:
		addNoteToUser(w, r, user)
	case http.MethodPatch:
		removeNoteFromUser(w, r, user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr(fmt.Sprintf("Method %s not allowed", r.Method)).ToJson())
	}
}

func getUserNotes(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getUserNotes")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Bad request").ToJson())
		return
	}

	notes, err := database.FindNotes(ctx, bson.M{"_id": bson.M{"$in": user.Notes}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr("No notes found").ToJson())
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(notes)
}

func addNoteToUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("addNoteToUser")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Bad request").ToJson())
		return
	}

	if r.PostFormValue("note") == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing note").ToJson())
		return
	}

	noteID, resErr := utils.IsStringObjectIdValid(r.PostFormValue("note"), database.NotesCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userID, resErr := utils.IsStringObjectIdValid(r.PostFormValue("user"), database.UserCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userToUpdate, err := database.FindOneUser(ctx, bson.M{"_id": userID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("User %s not found", userID)).ToJson())
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	note, err := database.FindOneNote(ctx, bson.M{"_id": noteID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Note %s not found", noteID)).ToJson())
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userToUpdate.Notes == nil {
		userToUpdate.Notes = []primitive.ObjectID{}
	}

	isIn := false
	for _, n := range userToUpdate.Notes {
		if n == note.ID {
			isIn = true
			break
		}
	}

	if isIn {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(fmt.Sprintf("Note %s already added to user %s", note.ID.Hex(), userToUpdate.ID.Hex())).ToJson())
		return
	}

	userToUpdate.Notes = append(userToUpdate.Notes, note.ID)

	_, err = userToUpdate.UpdateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Note added").ToJson())
}

func removeNoteFromUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("removeNoteFromUser")

	if r.Method != http.MethodPatch {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Bad request").ToJson())
		return
	}

	noteID, resErr := utils.IsStringObjectIdValid(r.Form.Get("note"), database.NotesCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userID, resErr := utils.IsStringObjectIdValid(r.Form.Get("user"), database.UserCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userToUpdate, err := database.FindOneUser(ctx, bson.M{"_id": userID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("User %s not found", userID)).ToJson())
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	note, err := database.FindOneNote(ctx, bson.M{"_id": noteID})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Note %s not found", noteID)).ToJson())
			return
		}

		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userToUpdate.Notes == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(fmt.Sprintf("Note %s not found in user %s", note.ID.Hex(), userToUpdate.ID.Hex())).ToJson())
		return
	}

	isIn := false
	for i, n := range userToUpdate.Notes {
		if n == note.ID {
			userToUpdate.Notes = append(userToUpdate.Notes[:i], userToUpdate.Notes[i+1:]...)
			isIn = true
			break
		}
	}

	if !isIn {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(fmt.Sprintf("Note %s not found in user %s", note.ID.Hex(), userToUpdate.ID.Hex())).ToJson())
		return
	}

	_, err = userToUpdate.UpdateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Note removed").ToJson())
}
