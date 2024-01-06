package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	IngredientCollection *mongo.Collection
)

type Restrictions struct {
	IsVegan      bool `json:"isVegan" bson:"isVegan"`
	IsVeggie     bool `json:"isVeggie" bson:"isVeggie"`
	IsGlutenFree bool `json:"isGlutenFree" bson:"isGlutenFree"`
	IsCheeseFree bool `json:"isCheeseFree" bson:"isCheeseFree"`
	IsFishFree   bool `json:"isFishFree" bson:"isFishFree"`
}

type Ingredient struct {
	ID           primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Name         string               `json:"name" bson:"name"`
	Tags         []primitive.ObjectID `json:"tags" bson:"tags"`
	KcalPerGram  float64              `json:"kcalPerGram" bson:"kcalPerGram"`
	ToGramFactor float64              `json:"toGramFactor" bson:"toGramFactor"`
	Restrictions Restrictions         `json:"restrictions" bson:"restrictions"`
}

func (a *Ingredient) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := IngredientCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Ingredient) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return IngredientCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneIngredient(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return IngredientCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneIngredient(ctx context.Context, filter bson.M) (*Ingredient, error) {
	var a Ingredient
	err := IngredientCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindIngredients(ctx context.Context, filter bson.M) ([]*Ingredient, error) {
	cursor, err := IngredientCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var ingredients []*Ingredient
	for cursor.Next(ctx) {
		var a Ingredient
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		ingredients = append(ingredients, &a)
	}

	return ingredients, nil
}

func initIngredient(ctx context.Context, db *mongo.Database) {
	IngredientCollection = db.Collection("ingredients")

	// Create indexes
	IngredientCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
