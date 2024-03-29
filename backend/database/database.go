package database

import (
	"context"
	"fmt"
	"os"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	// db is the database instance
	db *mongo.Database
)

func defaultValues(ctx context.Context) {
	defaultUsers(ctx)
	defaultRecipeCategories(ctx)
	defaultRecipeOrigins(ctx)
	defaultRecipeStatus(ctx)
	defaultRecipeTypes(ctx)
}

func initCollections(ctx context.Context) {
	initUser(ctx, db)
	initBlock(ctx, db)
	initBlockText(ctx, db)
	initDocuments(ctx, db)
	initFile(ctx, db)
	initHouseItem(ctx, db)
	initRecipe(ctx, db)
	initIngredientTags(ctx, db)
	initRecipeCategories(ctx, db)
	initRecipeOrigins(ctx, db)
	initRecipeStatus(ctx, db)
	initRecipeTypes(ctx, db)
	initNotes(ctx, db)
}

func Connect(ctx context.Context, url string) (*mongo.Client, error) {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package":  "database",
		"function": "Connect",
	})
	if os.Getenv("MONGO_INITDB_ROOT_USERNAME") == "" {
		return nil, fmt.Errorf("MONGO_INITDB_ROOT_USERNAME is not set")
	}
	if os.Getenv("MONGO_INITDB_ROOT_PASSWORD") == "" {
		return nil, fmt.Errorf("MONGO_INITDB_ROOT_PASSWORD is not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(url), options.Client().SetAuth(options.Credential{
		Username: os.Getenv("MONGO_INITDB_ROOT_USERNAME"),
		Password: os.Getenv("MONGO_INITDB_ROOT_PASSWORD"),
	}))
	if err != nil {
		return nil, err
	}
	log.Info("Connected to database")

	db = client.Database("CEToolBox")

	// Init collections
	initCollections(ctx)

	// Default values
	defaultValues(ctx)

	return client, nil
}
