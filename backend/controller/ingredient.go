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

func IngredientDispatch(w http.ResponseWriter, r *http.Request, user database.User) {
	switch r.Method {
	case http.MethodGet:
		ingredientGet(w, r, user)
	case http.MethodPost:
		ingredientPost(w, r, user)
	case http.MethodPut:
		ingredientPut(w, r, user)
	case http.MethodDelete:
		ingredientDelete(w, r, user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr(fmt.Sprintf("Method %s not allowed", r.Method)).ToJson())
	}
}

func ingredientGet(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("ingredientGet")

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
		query["fields.name"] = r.Form.Get("name")
	}
	if len(r.Form["tags"]) >= 1 {
		tagsID, err := utils.IsStringListObjectIdValid(r.Form["tags"], database.IngredientTagsCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		query["fields.tags"] = bson.M{
			"$in": tagsID,
		}
	}

	ingredients, err := database.FindIngredients(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if r.Form.Get("populate") != "" {
		ingredientsPopulated := make([]database.IngredientWrapperRes, len(ingredients))
		for i, ingredient := range ingredients {
			ingredientPopulated, err := ingredient.Populate(ctx)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write(utils.NewResErr(err.Error()).ToJson())
				return
			}

			ingredientsPopulated[i] = ingredientPopulated
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(ingredientsPopulated)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ingredients)
}

func ingredientPost(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("ingredientPost")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	ingredient := database.IngredientWrapper{}
	err := utils.ParseBody(r.Body, &ingredient)
	if err != nil {
		log.Errorf("Error creating ingredient: %s", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	resErr := utils.IsListObjectIdExist(ingredient.Fields.Tags, database.IngredientTagsCollection)
	if resErr != nil {
		log.Errorf("Error creating ingredient %s: %s", ingredient.Fields.Name, resErr)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	_, err = ingredient.CreateOne(ctx)
	if err != nil {
		log.Errorf("Error creating ingredient %s: %s", ingredient.Fields.Name, err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	recipe := database.Recipe{
		Name:       ingredient.Fields.Name,
		Quantities: []float64{1},
		Ingredients: []primitive.ObjectID{
			ingredient.ID,
		},
		IsIngredient: true,
	}

	_, err = recipe.CreateOne(ctx)
	if err != nil {
		log.Errorf("Error creating recipe related to ingredient %s: %s", ingredient.Fields.Name, err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ingredient)
}

func ingredientPut(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("ingredientPut")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	ingredient := database.IngredientWrapper{}
	err := utils.ParseBody(r.Body, &ingredient)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	resErr := utils.IsListObjectIdExist(ingredient.Fields.Tags, database.IngredientTagsCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(resErr.Error()).ToJson())
		return
	}

	ingredientFromDB, err := database.FindOneIngredient(ctx, bson.M{"_id": ingredient.ID})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if ingredientFromDB.Fields.Name != ingredient.Fields.Name {
		// Update recipe related to ingredient
		recipe, err := database.FindOneRecipe(ctx, bson.M{"name": ingredientFromDB.Fields.Name})
		if err != nil {
			if mongo.ErrNoDocuments == err {
				w.WriteHeader(http.StatusNotFound)
				w.Write(utils.NewResErr(fmt.Sprintf("Recipe %s not found", ingredientFromDB.Fields.Name)).ToJson())
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}

		recipe.Name = ingredient.Fields.Name
		_, err = recipe.UpdateOne(ctx)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr(err.Error()).ToJson())
			return
		}
	}

	_, err = ingredient.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ingredient)
}

func ingredientDelete(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("ingredientDelete")

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

	ingredient, err := database.FindOneIngredient(ctx, bson.M{"_id": id})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	res, err := database.DeleteOneIngredient(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr(fmt.Sprintf("Ingredient %s not found", id)).ToJson())
		return
	}

	// Delete ingredient from all recipes
	_, err = database.UpdateManyRecipes(ctx, bson.M{}, bson.M{
		"$pull": bson.M{
			"ingredients": id,
		},
	})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	// Delete recipe related to ingredient
	recipe, err := database.FindOneRecipe(ctx, bson.M{"name": ingredient.Fields.Name})
	if err != nil {
		if mongo.ErrNoDocuments == err {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Recipe %s not found", ingredient.Fields.Name)).ToJson())
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	_, err = database.DeleteOneRecipe(ctx, recipe.ID)

	if err != nil {
		if mongo.ErrNoDocuments == err {
			w.WriteHeader(http.StatusNotFound)
			w.Write(utils.NewResErr(fmt.Sprintf("Recipe %s not found", ingredient.Fields.Name)).ToJson())
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr(err.Error()).ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Ingredient deleted").ToJson())
}
