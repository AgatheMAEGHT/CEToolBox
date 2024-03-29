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

func RecipeDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		recipeGet(w, r, user)
	case http.MethodPost:
		recipePost(w, r, user)
	case http.MethodPut:
		recipePut(w, r, user)
	case http.MethodDelete:
		recipeDelete(w, r, user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr(fmt.Sprintf("Method %s not allowed", r.Method)).ToJson())
	}
}

func recipeGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("recipeGet")

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
	if r.Form.Get("name") != "" {
		query["name"] = r.Form.Get("name")
	}

	if r.Form.Get("recipeCategoryIds") != "" {
		recipeCategoryIds, err := utils.IsStringListObjectIdValid(r.Form["recipeCategoryIds"], database.RecipeCategoriesCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["categories"] = bson.M{"$in": recipeCategoryIds}
	}

	if r.Form.Get("recipeOriginIds") != "" {
		recipeOriginIds, err := utils.IsStringListObjectIdValid(r.Form["recipeOriginIds"], database.RecipeOriginsCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["origin"] = bson.M{"$in": recipeOriginIds}
	}

	if r.Form.Get("recipeStatusIds") != "" {
		recipeStatusIds, err := utils.IsStringListObjectIdValid(r.Form["recipeStatusIds"], database.RecipeStatusCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["status"] = bson.M{"$in": recipeStatusIds}
	}

	if r.Form.Get("recipeTypeIds") != "" {
		recipeTypeIds, err := utils.IsStringListObjectIdValid(r.Form["recipeTypeIds"], database.RecipeTypesCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["type"] = bson.M{"$in": recipeTypeIds}
	}

	if r.Form.Get("ingredientIds") != "" {
		ingredientIds, err := utils.IsStringListObjectIdValid(r.Form["ingredientIds"], database.HouseItemCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["ingredients"] = bson.M{"$in": ingredientIds}
	}

	query["isIngredient"] = false
	if r.Form.Get("isIngredient") != "" {
		query["isIngredient"] = true
	}

	recipes, err := database.FindRecipes(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if r.Form.Get("populate") != "" {
		recipesRes := []database.RecipeRes{}
		for _, recipe := range recipes {
			recipeRes, err := recipe.Populate(ctx)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write(utils.NewResErr(err.Error()).ToJson())
				return
			}

			recipesRes = append(recipesRes, recipeRes)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(recipesRes)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(recipes)
}

func recipePost(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("recipePost")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	recipe := database.Recipe{}
	err := utils.ParseBody(r.Body, &recipe)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if len(recipe.Ingredients) != len(recipe.Quantities) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Ingredients and quantities must have the same length").ToJson())
		return
	}

	_, err = recipe.CreateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(recipe)
}

func recipePut(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("recipePut")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	recipe := database.Recipe{}
	err := utils.ParseBody(r.Body, &recipe)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	_, err = recipe.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(recipe)
}

func recipeDelete(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("recipeDelete")

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

	res, err := database.DeleteOneRecipe(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr(fmt.Sprintf("Recipe %s not found", id)).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
}
