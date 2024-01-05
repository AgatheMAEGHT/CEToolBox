package database

import (
	"context"
	"fmt"
	"os"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type FileType string

const (
	FileTypeImage FileType = "image"
	FileTypeVideo FileType = "video"
)

const (
	FileFolder = ".files"
)

var (
	FileCollection *mongo.Collection
)

type File struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Ext  string             `json:"ext" bson:"ext"`
	Type FileType           `json:"type" bson:"type"`
}

func IsFileTypeValid(fileType string) (bool, FileType, string) {
	splitType := strings.Split(fileType, "/")
	if len(splitType) != 2 {
		return false, "", ""
	}

	isValidType := splitType[0] == string(FileTypeImage) || splitType[0] == string(FileTypeVideo)
	return isValidType, FileType(splitType[0]), splitType[1]
}

func (a *File) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := FileCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *File) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return FileCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneFile(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return FileCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneFile(ctx context.Context, filter bson.M) (*File, error) {
	var a File
	err := FileCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindFiles(ctx context.Context, filter bson.M) ([]*File, error) {
	cursor, err := FileCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var files []*File
	for cursor.Next(ctx) {
		var a File
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		files = append(files, &a)
	}

	return files, nil
}

func (a *File) FullName() string {
	return fmt.Sprintf("%s.%s", a.ID.Hex(), a.Ext)
}

func initFile(ctx context.Context, db *mongo.Database) {
	FileCollection = db.Collection("files")

	if _, err := os.Stat(FileFolder); os.IsNotExist(err) {
		os.Mkdir(FileFolder, os.ModePerm)
	}
	if _, err := os.Stat(fmt.Sprintf("%s/%s", FileFolder, FileTypeImage)); os.IsNotExist(err) {
		os.Mkdir(fmt.Sprintf("%s/%s", FileFolder, FileTypeImage), os.ModePerm)
	}
	if _, err := os.Stat(fmt.Sprintf("%s/%s", FileFolder, FileTypeVideo)); os.IsNotExist(err) {
		os.Mkdir(fmt.Sprintf("%s/%s", FileFolder, FileTypeVideo), os.ModePerm)
	}
}
