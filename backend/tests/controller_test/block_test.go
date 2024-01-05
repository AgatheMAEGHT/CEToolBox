package controller_test

import (
	"CEToolBox/database"
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBlock(t *testing.T) {
	tok := getAdminAccessToken(t)
	body := map[string]interface{}{
		"text": "Hello World, This is me, Can't you see ?",
	}

	// PUT BLOCK TEXT
	result, status := requester("/blocks/text", http.MethodPut, body, tok)
	assert.Equal(t, 200, status)
	assert.Equal(t, "Hello World, This is me, Can't you see ?", result["text"])

	// END OF INIT

	// POST BLOCK
	body = map[string]interface{}{
		"type":        "GLOUBIBOULGA",
		"linkedBlock": result["_id"],
	}
	_, status = requester("/blocks", http.MethodPost, body, tok)
	assert.Equal(t, 400, status)

	body = map[string]interface{}{
		"type":        database.MARKDOWN_BLOCK,
		"linkedBlock": result["_id"],
	}
	result, status = requester("/blocks", http.MethodPost, body, tok)
	assert.Equal(t, 200, status)
	assert.Equal(t, string(database.MARKDOWN_BLOCK), result["type"])

	// DELETE BLOCK
	result, status = requester(fmt.Sprintf("/blocks?_id=%s", result["_id"]), http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status)
	assert.Empty(t, result)
}
