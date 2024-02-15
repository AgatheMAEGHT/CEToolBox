package database

import (
	"context"
	"time"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var (
	UserCollection *mongo.Collection
)

type UserRes struct {
	ID             primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Pseudo         string             `json:"pseudo" bson:"pseudo"`
	Password       string             `json:"-" bson:"password"`
	IsAdmin        bool               `json:"isAdmin" bson:"isAdmin" default:"false"`
	CreatedAt      primitive.DateTime `json:"createdAt" bson:"createdAt"`
	Notes          []Note             `json:"notes" bson:"notes"`
	ProfilePicture string             `json:"profilePicture" bson:"profilePicture"`
}

type User struct {
	ID             primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Pseudo         string               `json:"pseudo" bson:"pseudo"`
	Password       string               `json:"-" bson:"password"`
	IsAdmin        bool                 `json:"isAdmin" bson:"isAdmin" default:"false"`
	CreatedAt      primitive.DateTime   `json:"createdAt" bson:"createdAt"`
	Notes          []primitive.ObjectID `json:"notes" bson:"notes"`
	ProfilePicture primitive.ObjectID   `json:"profilePicture" bson:"profilePicture"`
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

func (u *User) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	u.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	var err error
	u.Password, err = HashPassword(u.Password)
	if err != nil {
		return nil, err
	}

	res, err := UserCollection.InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}

	u.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (u *User) UpdatePassword(ctx context.Context, password string) error {
	var err error
	u.Password, err = HashPassword(password)
	if err != nil {
		return err
	}

	_, err = UserCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": bson.M{"password": u.Password}})
	return err
}

func (u *User) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return UserCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneUser(ctx context.Context, query bson.M) (User, error) {
	user := User{}
	err := UserCollection.FindOne(ctx, query).Decode(&user)
	return user, err
}

func FindUsers(ctx context.Context, query bson.M) ([]User, error) {
	cursor, err := UserCollection.Find(ctx, query)
	if err != nil {
		return nil, err
	}

	var users []User
	for cursor.Next(ctx) {
		var user User
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func DeleteOneUser(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return UserCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func (u *User) Populate(ctx context.Context) (UserRes, error) {
	userRes := UserRes{
		ID:        u.ID,
		Pseudo:    u.Pseudo,
		IsAdmin:   u.IsAdmin,
		CreatedAt: u.CreatedAt,
	}

	notes, err := FindNotes(ctx, bson.M{"_id": bson.M{"$in": u.Notes}})
	if err != nil {
		return UserRes{}, err
	}
	userRes.Notes = make([]Note, len(notes))
	for i, note := range notes {
		userRes.Notes[i] = *note
	}

	file, err := FindOneFile(ctx, bson.M{"_id": u.ProfilePicture})
	if err != nil {
		return UserRes{}, err
	}
	userRes.ProfilePicture = file.FullName()

	return userRes, nil
}

func initUser(ctx context.Context, db *mongo.Database) {
	UserCollection = db.Collection("users")

	UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"pseudo": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultUsers(ctx context.Context) {
	log := logrus.WithContext(ctx)
	// Create admins
	admins := []User{
		{
			Pseudo:   "eavi",
			Password: "admin",
			IsAdmin:  true,
		},
		{
			Pseudo:   "cataaa",
			Password: "admin",
			IsAdmin:  true,
		},
	}
	for _, admin := range admins {
		_, err := admin.CreateOne(ctx)
		if mongo.IsDuplicateKeyError(err) {
			log.Debug("User already exists")
		} else if err != nil {
			log.Fatal(err)
		}
	}
}
