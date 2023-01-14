package config

import (
	"fmt"
	"os"

	"cetoolbox.com/database"
	"github.com/go-pg/pg/v10"
)

var (
	Env = map[string]string{
		"HOSTNAME":          "localhost",
		"PORT":              "3000",
		"POSTGRES_HOSTNAME": "localhost",
		"POSTGRES_PORT":     "5432",
		"POSTGRES_USER":     "Dev",
		"POSTGRES_PASSWORD": "bliblabloubliblui",
		"POSTGRES_DBNAME":   "dev",
	}

	Db database.Psql
)

func init() {
	for k := range Env {
		v := os.Getenv(k)
		if v != "" {
			Env[k] = v
		}
	}

	pgUrl := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disabled",
		Env["POSTGRES_USER"], Env["POSTGRES_PASSWORD"], Env["POSTGRES_HOSTNAME"], Env["POSTGRES_PORT"], Env["POSTGRES_DBNAME"],
	)

	var err error
	Db, err = database.NewPsql(pg.Options{})
	if err != nil {
		panic(err)
	}
}
