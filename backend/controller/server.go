package controller

import (
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
)

func root(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("Root endpoint triggered")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "Not found")
}

func corsWrapper(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Everything is JSON
		w.Header().Set("Content-Type", "application/json")

		next(w, r)
	}
}

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/", corsWrapper(root))
	server.HandleFunc("/ping", corsWrapper(ping))

	// User-related endpoints
	server.HandleFunc("/login", corsWrapper(login))
	server.HandleFunc("/refresh", corsWrapper(refresh))
	server.HandleFunc("/user", corsWrapper(middlewareWrapper(getUsers)))
	server.HandleFunc("/user/create", corsWrapper(middlewareWrapper(createUser)))
	server.HandleFunc("/user/delete", corsWrapper(middlewareWrapper(deleteUser)))
	server.HandleFunc("/user/update", corsWrapper(middlewareWrapper(updateUser)))
	server.HandleFunc("/user/password", corsWrapper(middlewareWrapper(changePassword)))
	server.HandleFunc("/who-am-i", corsWrapper(middlewareWrapper(whoAmI)))

	server.HandleFunc("/user-notes", corsWrapper(middlewareWrapper(userNotesDispatch)))

	// Block-related endpoints
	server.HandleFunc("/blocks", corsWrapper(middlewareWrapper(BlockDispatch)))
	server.HandleFunc("/blocks/text", corsWrapper(middlewareWrapper(BlockTextDispatch)))

	// Recipe-related endpoints
	server.HandleFunc("/ingredients", corsWrapper(middlewareWrapper(IngredientDispatch)))
	server.HandleFunc("/ingredient-tags", corsWrapper(middlewareWrapper(IngredientTagDispatch)))
	server.HandleFunc("/recipes", corsWrapper(middlewareWrapper(RecipeDispatch)))
	server.HandleFunc("/recipe-categories", corsWrapper(middlewareWrapper(RecipeCategoryDispatch)))
	server.HandleFunc("/recipe-origins", corsWrapper(middlewareWrapper(RecipeOriginDispatch)))
	server.HandleFunc("/recipe-status", corsWrapper(middlewareWrapper(RecipeStatusDispatch)))
	server.HandleFunc("/recipe-types", corsWrapper(middlewareWrapper(RecipeTypeDispatch)))

	// Note-related endpoints
	server.HandleFunc("/notes", corsWrapper(middlewareWrapper(NoteDispatch)))

	// File-related endpoints
	server.HandleFunc("/file/download/", corsWrapper(downloadFile))
	server.HandleFunc("/file/create", corsWrapper(middlewareWrapper(postFile)))
	server.HandleFunc("/file/delete/", corsWrapper(middlewareWrapper(deleteFile)))

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}
