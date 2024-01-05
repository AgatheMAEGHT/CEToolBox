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
	ID              primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name            string             `json:"name" bson:"name"`
	Ingredients     []Ingredient       `json:"ingredients" bson:"ingredients"`
	Quantity        []float64          `json:"quantity" bson:"quantity"`
	Image           string             `json:"image" bson:"image"`
	Category        string             `json:"category" bson:"category"`
	Origin          string             `json:"origin" bson:"origin"`
	Status          string             `json:"status" bson:"status"`
	Type            string             `json:"type" bson:"type"`
	PreparationTime int64              `json:"preparationTime" bson:"preparationTime"`
	CookingTime     int64              `json:"cookingTime" bson:"cookingTime"`
	Steps           []string           `json:"steps" bson:"steps"`
}

type Recipe struct {
	ID              primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Name            string               `json:"name" bson:"name"`
	Ingredients     []primitive.ObjectID `json:"ingredients" bson:"ingredients"`
	Quantity        []float64            `json:"quantity" bson:"quantity"`
	Image           File                 `json:"image" bson:"image"`
	Category        string               `json:"category" bson:"category"`
	Origin          string               `json:"origin" bson:"origin"`
	Status          string               `json:"status" bson:"status"`
	Type            string               `json:"type" bson:"type"`
	PreparationTime int64                `json:"preparationTime" bson:"preparationTime"`
	CookingTime     int64                `json:"cookingTime" bson:"cookingTime"`
	Steps           []string             `json:"steps" bson:"steps"`
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
	res.Category = a.Category
	res.Origin = a.Origin
	res.Status = a.Status
	res.Type = a.Type
	res.PreparationTime = a.PreparationTime
	res.CookingTime = a.CookingTime
	res.Steps = a.Steps
	res.Quantity = a.Quantity

	res.Ingredients = []Ingredient{}
	for _, id := range a.Ingredients {
		ingredient, err := FindOneIngredient(ctx, bson.M{"_id": id})
		if err != nil {
			return res, err
		}
		res.Ingredients = append(res.Ingredients, *ingredient)
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
