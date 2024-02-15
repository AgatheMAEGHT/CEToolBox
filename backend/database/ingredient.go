package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const HouseItemIngredientType = "ingredient"

type IngredientRes struct {
	Icon         string          `json:"icon" bson:"icon"`
	Name         string          `json:"name" bson:"name"`
	Tags         []IngredientTag `json:"tags" bson:"tags"`
	KcalPerGram  float64         `json:"kcalPerGram" bson:"kcalPerGram"`
	ToGramFactor float64         `json:"toGramFactor" bson:"toGramFactor"`
	Restrictions Restrictions    `json:"restrictions" bson:"restrictions"`
}

type IngredientWrapperRes struct {
	ID     primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Type   string             `json:"type" bson:"type"`
	Fields IngredientRes      `json:"fields" bson:"fields"`
}

type Restrictions struct {
	IsVegan      bool `json:"isVegan" bson:"isVegan"`
	IsVeggie     bool `json:"isVeggie" bson:"isVeggie"`
	IsGlutenFree bool `json:"isGlutenFree" bson:"isGlutenFree"`
	IsCheeseFree bool `json:"isCheeseFree" bson:"isCheeseFree"`
	IsFishFree   bool `json:"isFishFree" bson:"isFishFree"`
}

type Ingredient struct {
	Icon         string               `json:"icon" bson:"icon"`
	Name         string               `json:"name" bson:"name"`
	Tags         []primitive.ObjectID `json:"tags" bson:"tags"`
	KcalPerGram  float64              `json:"kcalPerGram" bson:"kcalPerGram"`
	ToGramFactor float64              `json:"toGramFactor" bson:"toGramFactor"`
	Restrictions Restrictions         `json:"restrictions" bson:"restrictions"`
}

type IngredientWrapper struct {
	ID     primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Type   string             `json:"type" bson:"type"`
	Fields Ingredient         `json:"fields" bson:"fields"`
}

func (a *IngredientWrapper) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	a.Type = HouseItemIngredientType
	res, err := HouseItemCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *IngredientWrapper) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	a.Type = HouseItemIngredientType
	return HouseItemCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneIngredient(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return HouseItemCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneIngredient(ctx context.Context, filter bson.M) (*IngredientWrapper, error) {
	filter["type"] = HouseItemIngredientType
	var a IngredientWrapper
	err := HouseItemCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindIngredients(ctx context.Context, filter bson.M) ([]*IngredientWrapper, error) {
	filter["type"] = HouseItemIngredientType
	cursor, err := HouseItemCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var ingredients []*IngredientWrapper
	for cursor.Next(ctx) {
		var a IngredientWrapper
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		ingredients = append(ingredients, &a)
	}

	return ingredients, nil
}

func (a *IngredientWrapper) Populate(ctx context.Context) (IngredientWrapperRes, error) {
	var res IngredientWrapperRes
	tags, err := FindIngredientTags(ctx, bson.M{"_id": bson.M{"$in": a.Fields.Tags}})
	if err != nil {
		return res, err
	}

	res.ID = a.ID
	res.Type = a.Type
	res.Fields.Name = a.Fields.Name
	res.Fields.Tags = make([]IngredientTag, len(tags))
	for i, tag := range tags {
		res.Fields.Tags[i] = *tag
	}
	res.Fields.KcalPerGram = a.Fields.KcalPerGram
	res.Fields.ToGramFactor = a.Fields.ToGramFactor
	res.Fields.Restrictions = a.Fields.Restrictions

	return res, nil
}
