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

func whoAmI(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("whoAmI")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	b, err := json.MarshalIndent(user, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to login").ToJson())
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func createUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("createUser")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Bad request").ToJson())
		return
	}

	mapBody := map[string]interface{}{}
	err = utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}

	pseudo := ""
	if mapBody["pseudo"] != nil {
		pseudo = mapBody["pseudo"].(string)
	}
	password := ""
	if mapBody["password"] != nil {
		password = mapBody["password"].(string)
	}
	isAdmin := false
	if mapBody["isAdmin"] != nil {
		isAdmin = mapBody["isAdmin"].(bool)
	}

	if pseudo == "" || password == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing pseudo or password").ToJson())
		return
	}

	log.Infof("Creating user %s", mapBody["pseudo"])

	newUser := database.User{
		Pseudo:   pseudo,
		Password: password,
		IsAdmin:  isAdmin,
	}

	_, err = newUser.CreateOne(ctx)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while creating user").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newUser)
}

func deleteUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteAccount")

	if r.Method != http.MethodDelete {
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

	userIDToDelete := user.ID

	if r.Form.Get("_id") != "" {
		if !user.IsAdmin {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(utils.NewResErr("Unauthorized").ToJson())
			return
		}

		userIDToDelete, err = primitive.ObjectIDFromHex(r.Form.Get("_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Wrong ID format").ToJson())
			return
		}
	}

	log.Infof("Deleting user %s", userIDToDelete)
	res, err := database.DeleteOneUser(ctx, userIDToDelete)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while deleting user").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr(fmt.Sprintf("User %s not found", userIDToDelete)).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("User deleted").ToJson())
}

func changePassword(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("changePassword")

	if r.Method != http.MethodPut {
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

	mapBody := make(map[string]string)
	err = utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}
	if mapBody["newPassword"] == "" || mapBody["oldPassword"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing password").ToJson())
		return
	}

	userToUpdate := user
	if r.Form.Get("_id") != "" {
		if !user.IsAdmin && user.ID.Hex() != r.Form.Get("_id") {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(utils.NewResErr("Unauthorized").ToJson())
			return
		}

		userID, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Wrong ID format").ToJson())
			return
		}
		userToUpdate, err = database.FindOneUser(ctx, bson.M{"_id": userID})
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
	}

	err = userToUpdate.ComparePassword(mapBody["oldPassword"])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Wrong password").ToJson())
		return
	}

	log.Infof("Changing password for user %s", userToUpdate.ID.Hex())
	err = userToUpdate.UpdatePassword(ctx, mapBody["newPassword"])
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("User password changed").ToJson())
}

func updateUser(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("updateAccount")

	if r.Method != http.MethodPut {
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

	mapBody := database.User{}
	err = utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}

	if mapBody.ID.Hex() != user.ID.Hex() && !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	if mapBody.IsAdmin && !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	log.Infof("Updating user %s", user.ID.Hex())
	_, err = user.UpdateOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("User updated").ToJson())
}

func getUsers(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getUsers")

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

	query := bson.M{}

	if r.Form.Get("_id") != "" {
		userID, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Wrong ID format").ToJson())
			return
		}
		query["_id"] = userID
	}

	users, err := database.FindUsers(ctx, query)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if r.Form.Get("populate") == "true" {
		usersRes := make([]database.UserRes, len(users))
		for i, u := range users {
			usersRes[i], err = u.Populate(ctx)
			if err != nil {
				log.Error(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(usersRes)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}
