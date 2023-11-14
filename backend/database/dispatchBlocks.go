package database

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

func FindOneLinkedBlock(ctx context.Context, block Block) (interface{}, error) {
	switch block.Type {
	case TEXT_BLOCK:
		return FindOneBlockText(ctx, bson.M{"_id": block.LinkedBlock})
	default:
		return nil, fmt.Errorf("unknown block type")
	}
}

func UpdateLinkedBlock(ctx context.Context, block Block, linkedBlock interface{}) error {
	switch block.Type {
	case TEXT_BLOCK:
		linkedBlockText, ok := linkedBlock.(BlockText)
		if !ok {
			return fmt.Errorf("linkedBlock is not a BlockText")
		}
		linkedBlockText.ID = block.LinkedBlock
		_, err := linkedBlockText.UpdateOne(ctx)
		return err
	default:
		return fmt.Errorf("unknown block type")
	}
}

func DeleteLinkedBlock(ctx context.Context, block Block, linkedBlock interface{}) error {
	switch block.Type {
	case TEXT_BLOCK:
		linkedBlockText, ok := linkedBlock.(BlockText)
		if !ok {
			return fmt.Errorf("linkedBlock is not a BlockText")
		}
		_, err := linkedBlockText.DeleteOne(ctx)
		return err
	default:
		return fmt.Errorf("unknown block type")
	}
}
