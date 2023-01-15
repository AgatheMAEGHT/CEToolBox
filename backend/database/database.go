package database

import (
	"context"

	"cetoolbox.com/database/models"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type Psql struct {
	db *pg.DB
}

func NewPsql(pgOpt pg.Options) (Psql, error) {
	db := pg.Connect(&pgOpt)

	pg := Psql{db: db}

	err := pg.initTable(&models.HouseItem{})
	if err != nil {
		return pg, errors.Wrap(err, "fail to init house table")
	}

	if err != nil {
		return pg, errors.Wrap(err, "fail to upsert item in house table")
	}

	return pg, nil
}

func (pg Psql) initTable(model interface{}) error {
	err := pg.db.Model(model).CreateTable(&orm.CreateTableOptions{
		IfNotExists: true,
	})
	if err != nil {
		return err
	}
	return nil
}

func (pg Psql) Upsert(ctx context.Context, item interface{}) error {
	log := logrus.WithContext(ctx)
	log.Infof("Upserting '%v'", item)
	_, err := pg.db.Model(item).OnConflict("(id) DO UPDATE").Insert()
	if err != nil {
		return errors.Wrap(err, "fail to update on conflict or insert item in db")
	}
	return nil
}
