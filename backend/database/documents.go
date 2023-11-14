package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	// DocumentsCollection
	DocumentsCollection *mongo.Collection
)

type Document struct {
	ID     primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Blocks []Block            `json:"blocks" bson:"blocks"`
}

func (u *Document) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := DocumentsCollection.InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}
	u.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (u *Document) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return DocumentsCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneDocument(ctx context.Context, query bson.M) (Document, error) {
	b := Document{}
	err := DocumentsCollection.FindOne(ctx, query).Decode(&b)
	return b, err
}

func FindDocuments(ctx context.Context, query bson.M) ([]Document, error) {
	var documents []Document
	cursor, err := DocumentsCollection.Find(ctx, query)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &documents); err != nil {
		return nil, err
	}
	return documents, nil
}

func initDocuments(ctx context.Context, db *mongo.Database) {
	DocumentsCollection = db.Collection("Documents")
}
