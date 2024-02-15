package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	NotesCollection *mongo.Collection
)

type Note struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Icon    string             `json:"icon" bson:"icon"`
	Title   string             `json:"title" bson:"title"`
	Content string             `json:"content" bson:"content"`
	Color   string             `json:"color" bson:"color"`
}

func (a *Note) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := NotesCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Note) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return NotesCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneNote(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return NotesCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneNote(ctx context.Context, filter bson.M) (*Note, error) {
	var a Note
	err := NotesCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindNotes(ctx context.Context, filter bson.M) ([]*Note, error) {
	cursor, err := NotesCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var notes []*Note
	for cursor.Next(ctx) {
		var a Note
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		notes = append(notes, &a)
	}

	return notes, nil
}

func initNotes(ctx context.Context, db *mongo.Database) {
	NotesCollection = db.Collection("notes")
}
