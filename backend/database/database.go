package database

import (
	"cetoolbox.com/models"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type Psql struct {
	Db *pg.DB
}

func NewPsql(pgOpt pg.Options) (Psql, error) {
	db := pg.Connect(&pgOpt)

	pg := Psql{Db: db}
	return pg, nil
}

func (pg Psql) initMaisonTable() error {
	models := []interface{}{
		(*models.HouseItem)(nil),
	}

	for _, model := range models {
		err := pg.Db.Model(model).CreateTable(&orm.CreateTableOptions{
			Temp: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
