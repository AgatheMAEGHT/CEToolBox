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
	RecipeCategoriesCollection *mongo.Collection
)

type RecipeCategory struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Icon  string             `json:"icon" bson:"icon"`
	Name  string             `json:"name" bson:"name"`
	Color string             `json:"color" bson:"color"`
}

func (a *RecipeCategory) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := RecipeCategoriesCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *RecipeCategory) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return RecipeCategoriesCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneRecipeCategory(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return RecipeCategoriesCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneRecipeCategory(ctx context.Context, filter bson.M) (*RecipeCategory, error) {
	var a RecipeCategory
	err := RecipeCategoriesCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindRecipeCategories(ctx context.Context, filter bson.M) ([]*RecipeCategory, error) {
	cursor, err := RecipeCategoriesCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var recipeCategories []*RecipeCategory
	for cursor.Next(ctx) {
		var a RecipeCategory
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		recipeCategories = append(recipeCategories, &a)
	}

	return recipeCategories, nil
}

func initRecipeCategories(ctx context.Context, db *mongo.Database) {
	RecipeCategoriesCollection = db.Collection("recipeCategories")

	// Create indexes
	RecipeCategoriesCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultRecipeCategories(ctx context.Context) error {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package": "database",
		"context": "defaultCategories",
	})

	categories := []RecipeCategory{
		{
			Name:  "Entrée",
			Color: "#FF0000",
		},
		{
			Name:  "Plat",
			Color: "#00FF00",
		},
		{
			Name:  "Dessert",
			Color: "#0000FF",
		},
		{
			Name:  "Boisson",
			Color: "#FFFF00",
		},
		{
			Name:  "Apéritif",
			Color: "#FF00FF",
		},
		{
			Name:  "Sauce",
			Color: "#00FFFF",
		},
		{
			Name:  "Goûter",
			Color: "#FFA500",
		},
		{
			Name:  "Petit déjeuner",
			Color: "#800080",
		},
		{
			Name:  "Accompagnement",
			Color: "#008000",
		},
	}

	for _, category := range categories {
		_, err := category.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debugf("Category %s already exists", category.Name)
				continue
			}

			log.Errorf("Error while creating category %s: %s", category.Name, err.Error())
			return err
		}
	}

	return nil
}
