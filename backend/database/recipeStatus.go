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
	RecipeStatusCollection *mongo.Collection
)

type RecipeStatus struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Icon  string             `json:"icon" bson:"icon"`
	Name  string             `json:"name" bson:"name"`
	Color string             `json:"color" bson:"color"`
}

func (a *RecipeStatus) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := RecipeStatusCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *RecipeStatus) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return RecipeStatusCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneRecipeStatus(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return RecipeStatusCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneRecipeStatus(ctx context.Context, filter bson.M) (*RecipeStatus, error) {
	var a RecipeStatus
	err := RecipeStatusCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindRecipeStatus(ctx context.Context, filter bson.M) ([]*RecipeStatus, error) {
	cursor, err := RecipeStatusCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var recipeStatus []*RecipeStatus
	for cursor.Next(ctx) {
		var a RecipeStatus
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		recipeStatus = append(recipeStatus, &a)
	}

	return recipeStatus, nil
}

func initRecipeStatus(ctx context.Context, db *mongo.Database) {
	RecipeStatusCollection = db.Collection("recipeStatus")

	// Create indexes
	RecipeStatusCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultRecipeStatus(ctx context.Context) error {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package": "database",
		"context": "defaultRecipeStatus",
	})
	status := []RecipeStatus{
		{
			Name:  "Approuvé",
			Color: "#FFA500",
		},
		{
			Name:  "À tester",
			Color: "#FF0000",
		},
		{
			Name:  "À améliorer",
			Color: "#FF0000",
		},
		{
			Name:  "Pas ouf",
			Color: "#FF0000",
		},
	}

	for _, s := range status {
		_, err := s.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debugf("Status %s already exists", s.Name)
				continue
			}

			log.Errorf("Error while creating status %s: %s", s.Name, err.Error())
			return err
		}
	}

	return nil
}
