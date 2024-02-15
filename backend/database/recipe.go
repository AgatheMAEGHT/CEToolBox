package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	RecipeCollection *mongo.Collection
)

type RecipeRes struct {
	ID               primitive.ObjectID     `json:"_id" bson:"_id,omitempty"`
	Icon             string                 `json:"icon" bson:"icon"`
	Name             string                 `json:"name" bson:"name"`
	Ingredients      []IngredientWrapperRes `json:"ingredients" bson:"ingredients"`
	Quantities       []float64              `json:"quantities" bson:"quantities"`
	NumberOfPortions int64                  `json:"numberOfPortions" bson:"numberOfPortions"`
	Image            string                 `json:"image" bson:"image"`
	Categories       []RecipeCategory       `json:"categories" bson:"categories"`
	Origin           RecipeOrigin           `json:"origin" bson:"origin"`
	Status           RecipeStatus           `json:"status" bson:"status"`
	Type             RecipeType             `json:"type" bson:"type"`
	PreparationTime  int64                  `json:"preparationTime" bson:"preparationTime"`
	CookingTime      int64                  `json:"cookingTime" bson:"cookingTime"`
	Steps            []string               `json:"steps" bson:"steps"`
}

type Recipe struct {
	ID               primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Icon             string               `json:"icon" bson:"icon"`
	Name             string               `json:"name" bson:"name"`
	Ingredients      []primitive.ObjectID `json:"ingredients" bson:"ingredients"`
	Quantities       []float64            `json:"quantities" bson:"quantities"`
	NumberOfPortions int64                `json:"numberOfPortions" bson:"numberOfPortions"`
	Image            File                 `json:"image" bson:"image"`
	Categories       []primitive.ObjectID `json:"categories" bson:"categories"`
	Origin           primitive.ObjectID   `json:"origin" bson:"origin"`
	Status           primitive.ObjectID   `json:"status" bson:"status"`
	Type             primitive.ObjectID   `json:"type" bson:"type"`
	PreparationTime  int64                `json:"preparationTime" bson:"preparationTime"`
	CookingTime      int64                `json:"cookingTime" bson:"cookingTime"`
	Steps            []string             `json:"steps" bson:"steps"`
	IsIngredient     bool                 `json:"isIngredient" bson:"isIngredient"`
}

func (a *Recipe) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := RecipeCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Recipe) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return RecipeCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func UpdateManyRecipes(ctx context.Context, filter bson.M, update bson.M) (*mongo.UpdateResult, error) {
	return RecipeCollection.UpdateMany(ctx, filter, update)
}

func DeleteOneRecipe(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return RecipeCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneRecipe(ctx context.Context, filter bson.M) (*Recipe, error) {
	var a Recipe
	err := RecipeCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindRecipes(ctx context.Context, filter bson.M) ([]*Recipe, error) {
	cursor, err := RecipeCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var recipes []*Recipe
	for cursor.Next(ctx) {
		var a Recipe
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		recipes = append(recipes, &a)
	}

	return recipes, nil
}

func (a *Recipe) Populate(ctx context.Context) (RecipeRes, error) {
	var res RecipeRes
	res.ID = a.ID
	res.Name = a.Name
	res.Icon = a.Icon
	res.Categories = []RecipeCategory{}
	for _, id := range a.Categories {
		category, err := FindOneRecipeCategory(ctx, bson.M{"_id": id})
		if err != nil {
			return res, err
		}
		res.Categories = append(res.Categories, *category)
	}

	if a.Origin != primitive.NilObjectID {
		origin, err := FindOneRecipeOrigin(ctx, bson.M{"_id": a.Origin})
		if err != nil {
			return res, err
		}
		res.Origin = *origin
	}

	if a.Status != primitive.NilObjectID {
		status, err := FindOneRecipeStatus(ctx, bson.M{"_id": a.Status})
		if err != nil {
			return res, err
		}
		res.Status = *status
	}

	if a.Type != primitive.NilObjectID {
		t, err := FindOneRecipeType(ctx, bson.M{"_id": a.Type})
		if err != nil {
			return res, err
		}
		res.Type = *t
	}

	res.PreparationTime = a.PreparationTime
	res.CookingTime = a.CookingTime
	res.Steps = a.Steps
	res.Quantities = a.Quantities

	ingredients, err := FindIngredients(ctx, bson.M{"_id": bson.M{"$in": a.Ingredients}})
	if err != nil {
		return res, err
	}

	res.Ingredients = make([]IngredientWrapperRes, len(ingredients))
	for i, ingredient := range ingredients {
		res.Ingredients[i], err = ingredient.Populate(ctx)
		if err != nil {
			return res, err
		}
	}

	file, err := FindOneFile(ctx, bson.M{"_id": a.Image})
	if err != nil {
		return res, err
	}

	res.Image = file.FullName()

	return res, nil
}

func initRecipe(ctx context.Context, db *mongo.Database) {
	RecipeCollection = db.Collection("recipes")

	// Create indexes
	RecipeCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
