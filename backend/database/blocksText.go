package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	// BlockTextCollection
	BlockTextCollection *mongo.Collection
)

type BlockText struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Text string             `json:"text" bson:"text"`
}

func (u *BlockText) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := BlockTextCollection.InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}
	u.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (u *BlockText) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return BlockTextCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneBlockText(ctx context.Context, query bson.M) (BlockText, error) {
	b := BlockText{}
	err := BlockTextCollection.FindOne(ctx, query).Decode(&b)
	return b, err
}

func FindBlocksText(ctx context.Context, query bson.M) ([]BlockText, error) {
	var blocks []BlockText
	cursor, err := BlockTextCollection.Find(ctx, query)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &blocks); err != nil {
		return nil, err
	}
	return blocks, nil
}

func (u *BlockText) DeleteOne(ctx context.Context) (*mongo.DeleteResult, error) {
	return BlockTextCollection.DeleteOne(ctx, bson.M{"_id": u.ID})
}

func initBlockText(ctx context.Context, db *mongo.Database) {
	BlockTextCollection = db.Collection("blockTexts")

	// Create indexes
	BlockTextCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.M{
			"linkedBlockTextId": 1,
		},
	})
}
