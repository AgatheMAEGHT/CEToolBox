package database

import (
	"context"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type HouseItem struct {
	Id          int64  `json:"id,omitempty"`
	Name        string `json:"name"`
	Quantity    int    `json:"quantity"`
	Category    string `json:"category,omitempty"`
	Description string `json:"description,omitempty"`
}

type HouseItemsTable struct {
	db *pg.DB
}

func NewHouseItemsTable(pgOpt pg.Options) (HouseItemsTable, error) {
	db := pg.Connect(&pgOpt)

	pg := HouseItemsTable{db: db}

	err := pg.db.Model(&HouseItem{}).CreateTable(&orm.CreateTableOptions{
		IfNotExists: true,
	})
	if err != nil {
		return pg, errors.Wrap(err, "fail to init house table")
	}

	return pg, nil
}

func (pg HouseItemsTable) Upsert(ctx context.Context, item *HouseItem) error {
	log := logrus.WithContext(ctx)
	log.Infof("Upserting '%v'", item)
	_, err := pg.db.Model(item).OnConflict("(id) DO UPDATE").Insert()
	if err != nil {
		return errors.Wrap(err, "fail to update on conflict or insert item in db")
	}
	return nil
}

func (pg HouseItemsTable) GetWhereCategory(ctx context.Context, filter []string) ([]HouseItem, error) {
	log := logrus.WithContext(ctx).WithField("model", "HouseItem")
	items := []HouseItem{}

	log.Infof("Get HouseItems by filters '%v'", filter)
	err := pg.db.Model(&items).WhereIn("category IN (?)", filter).Select()
	if err != nil {
		return nil, errors.Wrap(err, "fail to get HouseItem by category")
	}
	return items, nil
}

func (pg HouseItemsTable) GetAll(ctx context.Context) ([]HouseItem, error) {
	log := logrus.WithContext(ctx).WithField("model", "HouseItem")
	items := []HouseItem{}

	log.Info("Get all HouseItems")
	err := pg.db.Model(&items).Select()
	if err != nil {
		return nil, errors.Wrap(err, "fail to get all HouseItems")
	}
	return items, nil
}

func (pg HouseItemsTable) DeleteByID(ctx context.Context, id int64) error {
	log := logrus.WithContext(ctx).WithField("model", "HouseItem")
	item := HouseItem{
		Id: id,
	}

	log.Info("Delete HouseItem with ID='%v'", id)
	_, err := pg.db.Model(&item).WherePK().Delete()
	if err != nil {
		return errors.Wrap(err, "fail to delete HouseItems")
	}
	return nil
}
