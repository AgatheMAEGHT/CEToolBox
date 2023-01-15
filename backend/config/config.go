package config

import (
	"os"

	"cetoolbox.com/database"
)

var (
	Env = map[string]string{
		"HOSTNAME":   "127.0.0.1",
		"PORT":       "3000",
		"PGHOST":     "host.docker.internal",
		"PGPORT":     "5432",
		"PGUSER":     "Dev",
		"PGPASSWORD": "bliblabloubliblui",
		"PGDBNAME":   "house",
	}

	HouseDB database.Psql
)

func init() {
	for k := range Env {
		v := os.Getenv(k)

		if v != "" {
			Env[k] = v
		}
	}

	// var err error
	// HouseDB, err = database.NewPsql(pg.Options{
	// 	Addr:     fmt.Sprintf("%s:%s", Env["PGHOST"], Env["PGPORT"]),
	// 	User:     Env["PGUSER"],
	// 	Password: Env["PGPASSWORD"],
	// 	Database: Env["PGDBNAME"],
	// })
	// if err != nil {
	// 	panic(err)
	// }
}
