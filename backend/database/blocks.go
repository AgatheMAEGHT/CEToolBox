package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type BlockType string

const (
	MARKDOWN_BLOCK BlockType = "MARKDOWN_BLOCK"
	MERMAID_BLOCK  BlockType = "MERMAID_BLOCK"
	KATEX_BLOCK    BlockType = "KATEX_BLOCK"
	IMAGE_BLOCK    BlockType = "IMAGE_BLOCK"
	TABLE_BLOCK    BlockType = "TABLE_BLOCK"
)

var (
	BlockCollection *mongo.Collection
)

type Block struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Type        BlockType          `json:"type" bson:"type"`
	LinkedBlock primitive.ObjectID `json:"linkedBlock" bson:"linkedBlock"`
}

func (u *Block) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := BlockCollection.InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}
	u.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (u *Block) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return BlockCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneBlock(ctx context.Context, query bson.M) (Block, error) {
	b := Block{}
	err := BlockCollection.FindOne(ctx, query).Decode(&b)
	return b, err
}

func FindBlocks(ctx context.Context, query bson.M) ([]Block, error) {
	var blocks []Block
	cursor, err := BlockCollection.Find(ctx, query)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &blocks); err != nil {
		return nil, err
	}
	return blocks, nil
}

func (u *Block) DeleteOne(ctx context.Context) (*mongo.DeleteResult, error) {
	return BlockCollection.DeleteOne(ctx, bson.M{"_id": u.ID})
}

func initBlock(ctx context.Context, db *mongo.Database) {
	BlockCollection = db.Collection("blocks")

	// Create indexes
	BlockCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.M{
			"linkedBlockId": 1,
		},
	})
}
