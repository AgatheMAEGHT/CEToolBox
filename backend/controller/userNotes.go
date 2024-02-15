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
	case http.MethodPut:
		updateNoteOrderFromUser(w, r, user)
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

	if user.Notes == nil {
		user.Notes = []primitive.ObjectID{}
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

	// Reorder notes
	tmpNotes := make([]database.Note, len(notes))
	for i, id := range user.Notes {
		for _, n := range notes {
			if n.ID == id {
				tmpNotes[i] = *n
				break
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tmpNotes)
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

	bodyMap := map[string]string{}
	err := utils.ParseBody(r.Body, &bodyMap)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if bodyMap["note"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing note").ToJson())
		return
	}

	noteID, resErr := utils.IsStringObjectIdValid(bodyMap["note"], database.NotesCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userID, resErr := utils.IsStringObjectIdValid(bodyMap["user"], database.UserCollection)
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

	bodyMap := map[string]string{}
	err := utils.ParseBody(r.Body, &bodyMap)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	noteID, resErr := utils.IsStringObjectIdValid(bodyMap["note"], database.NotesCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	userID, resErr := utils.IsStringObjectIdValid(bodyMap["user"], database.UserCollection)
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

	// Delete note if no user is using it
	users, err := database.FindUsers(ctx, bson.M{"notes": note.ID})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if len(users) == 0 {
		_, err = database.DeleteOneNote(ctx, note.ID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Note removed").ToJson())
}

func updateNoteOrderFromUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("updateNoteOrderFromUser")

	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	notes := []primitive.ObjectID{}
	err := utils.ParseBody(r.Body, &notes)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if utils.IsListObjectIdExist(notes, database.NotesCollection) != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid notes").ToJson())
		return
	}

	user.Notes = notes

	_, err = user.UpdateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Notes order updated").ToJson())
}
