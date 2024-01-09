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
	RecipeOriginsCollection *mongo.Collection
)

type RecipeOrigin struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Icon  string             `json:"icon" bson:"icon"`
	Name  string             `json:"name" bson:"name"`
	Color string             `json:"color" bson:"color"`
}

func (a *RecipeOrigin) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := RecipeOriginsCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *RecipeOrigin) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return RecipeOriginsCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneRecipeOrigin(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return RecipeOriginsCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneRecipeOrigin(ctx context.Context, filter bson.M) (*RecipeOrigin, error) {
	var a RecipeOrigin
	err := RecipeOriginsCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindRecipeOrigins(ctx context.Context, filter bson.M) ([]*RecipeOrigin, error) {
	cursor, err := RecipeOriginsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var recipeOrigins []*RecipeOrigin
	for cursor.Next(ctx) {
		var a RecipeOrigin
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		recipeOrigins = append(recipeOrigins, &a)
	}

	return recipeOrigins, nil
}

func initRecipeOrigins(ctx context.Context, db *mongo.Database) {
	RecipeOriginsCollection = db.Collection("recipeOrigins")

	// Create indexes
	RecipeOriginsCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultRecipeOrigins(ctx context.Context) error {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package": "database",
		"context": "defaultOrigins",
	})

	origins := []RecipeOrigin{
		{
			Name:  "France",
			Color: "#FF0000",
			Icon:  "🇫🇷",
		},
		{
			Name:  "Italie",
			Color: "#008000",
			Icon:  "🇮🇹",
		},
		{
			Name:  "Espagne",
			Color: "#0000FF",
			Icon:  "🇪🇸",
		},
		{
			Name:  "Chine",
			Color: "#FFFF00",
			Icon:  "🇨🇳",
		},
		{
			Name:  "Japon",
			Color: "#FF00FF",
			Icon:  "🇯🇵",
		},
		{
			Name:  "Corée",
			Color: "#00FFFF",
			Icon:  "🇰🇷",
		},
		{
			Name:  "Autriche",
			Color: "#800000",
			Icon:  "🇦🇹",
		},
		{
			Name:  "Allemagne",
			Color: "#808080",
			Icon:  "🇩🇪",
		},
		{
			Name:  "Royaume-Uni",
			Color: "#C0C0C0",
			Icon:  "🇬🇧",
		},
		{
			Name:  "Nordique",
			Color: "#808000",
			Icon:  "🇸🇪",
		},
		{
			Name:  "Amérique du Sud",
			Color: "#008080",
			Icon:  "🇲🇽",
		},
		{
			Name:  "Asie",
			Color: "#800080",
		},
		{
			Name:  "Europe",
			Color: "#808000",
			Icon:  "🇪🇺",
		},
		{
			Name:  "Amérique",
			Color: "#008080",
			Icon:  "🇨🇦",
		},
		{
			Name:  "Afrique",
			Color: "#FFA500",
			Icon:  "🇿🇦",
		},
		{
			Name:  "Océanie",
			Color: "#800000",
			Icon:  "🇦🇺",
		},
	}

	for _, origin := range origins {
		_, err := origin.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debugf("Origin %s already exists", origin.Name)
				continue
			}

			log.Errorf("Error while creating origin %s: %s", origin.Name, err.Error())
			return err
		}
	}

	return nil
}
