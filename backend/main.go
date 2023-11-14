package main

import (
	"CEToolBox/controller"
	"CEToolBox/database"
	"context"
	"fmt"
	"os"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
)

func conf() {
	// Config logrus
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(logrus.Formatter(&logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
	}))
}

func main() {
	conf()
	ctx := context.Background()
	log := logrus.WithContext(ctx)
	log.Info("Starting api")
	_, err := database.Connect(ctx, os.Getenv("MONGO_URL"))
	if err != nil {
		log.Fatal(err)
	}

	// Create first user
	user := database.User{
		Email:     "quentinescudier@hotmail.fr",
		Password:  "test",
		FirstName: "Quentin",
		LastName:  "Escudier",
	}
	_, err = user.Create(ctx)
	if mongo.IsDuplicateKeyError(err) {
		log.Info("User already exists")
	} else if err != nil {
		log.Fatal(err)
	}

	// Start server
	controller.StartServer(fmt.Sprintf("%s:%s", os.Getenv("HOSTNAME"), os.Getenv("PORT")))
}
