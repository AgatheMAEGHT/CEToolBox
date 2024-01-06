package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	IngredientTagsCollection *mongo.Collection
)

type IngredientTag struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name  string             `json:"name" bson:"name"`
	Color string             `json:"color" bson:"color"`
}

func (a *IngredientTag) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := IngredientTagsCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *IngredientTag) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return IngredientTagsCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneIngredientTag(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return IngredientTagsCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneIngredientTag(ctx context.Context, filter bson.M) (*IngredientTag, error) {
	var a IngredientTag
	err := IngredientTagsCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindIngredientTags(ctx context.Context, filter bson.M) ([]*IngredientTag, error) {
	cursor, err := IngredientTagsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var ingredientTags []*IngredientTag
	for cursor.Next(ctx) {
		var a IngredientTag
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		ingredientTags = append(ingredientTags, &a)
	}

	return ingredientTags, nil
}

func initIngredientTags(ctx context.Context, db *mongo.Database) {
	IngredientTagsCollection = db.Collection("ingredientTags")

	// Create indexes
	IngredientTagsCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
