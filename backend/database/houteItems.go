package database

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

var (
	HouseItemCollection *mongo.Collection
)

func initHouseItem(ctx context.Context, db *mongo.Database) {
	HouseItemCollection = db.Collection("houseItems")
}
