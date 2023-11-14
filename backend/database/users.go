package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var (
	// UserCollection
	UserCollection *mongo.Collection
)

type User struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Email     string             `json:"email" bson:"email"`
	FirstName string             `json:"firstName" bson:"firstName"`
	LastName  string             `json:"lastName" bson:"lastName"`
	Password  string             `json:"-" bson:"password"`
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

func (u *User) Create(ctx context.Context) (*mongo.InsertOneResult, error) {
	var err error
	u.Password, err = HashPassword(u.Password)
	if err != nil {
		return nil, err
	}

	return UserCollection.InsertOne(ctx, u)
}

func (u *User) Update(ctx context.Context) (*mongo.UpdateResult, error) {
	return UserCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneUser(ctx context.Context, query bson.M) (User, error) {
	user := User{}
	err := UserCollection.FindOne(ctx, query).Decode(&user)
	return user, err
}

func initUser(ctx context.Context, db *mongo.Database) {
	UserCollection = db.Collection("users")
	// Create index on email
	UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"email": 1},
		Options: options.Index().SetUnique(true),
	})

	// Create index on FirstName
	UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]int{"firstName": 1},
	})

	// Create index on LastName
	UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]int{"lastName": 1},
	})
}
