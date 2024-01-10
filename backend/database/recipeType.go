package database

import (
	"context"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	RecipeTypesCollection *mongo.Collection
)

type RecipeType struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Icon  string             `json:"icon" bson:"icon"`
	Name  string             `json:"name" bson:"name"`
	Color string             `json:"color" bson:"color"`
}

func (a *RecipeType) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := RecipeTypesCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *RecipeType) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return RecipeTypesCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneRecipeType(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return RecipeTypesCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneRecipeType(ctx context.Context, filter bson.M) (*RecipeType, error) {
	var a RecipeType
	err := RecipeTypesCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindRecipeTypes(ctx context.Context, filter bson.M) ([]*RecipeType, error) {
	cursor, err := RecipeTypesCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var recipeTypes []*RecipeType
	for cursor.Next(ctx) {
		var a RecipeType
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		recipeTypes = append(recipeTypes, &a)
	}

	return recipeTypes, nil
}

func initRecipeTypes(ctx context.Context, db *mongo.Database) {
	RecipeTypesCollection = db.Collection("recipeTypes")

	// Create indexes
	RecipeTypesCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultRecipeTypes(ctx context.Context) error {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package": "database",
		"context": "defaultRecipeTypes",
	})
	types := []RecipeType{
		{
			Name:  "Sucré",
			Color: "#ff0000",
		},
		{
			Name:  "Salé",
			Color: "#00ff00",
		},
		{
			Name:  "Sucré/Salé",
			Color: "#0000ff",
		},
	}

	for _, t := range types {
		_, err := t.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debugf("Type %s already exists", t.Name)
				continue
			}

			log.Errorf("Error while creating type %s: %s", t.Name, err.Error())
			return err
		}
	}

	return nil
}
