package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBlockText(t *testing.T) {
	tok := getAccessToken(t)
	body := map[string]interface{}{
		"text": "Hello World, This is me, Can't you see ?",
	}

	// PUT
	result, status := requester("/blocks/text", http.MethodPut, body, tok)
	assert.Equal(t, 200, status)
	assert.Equal(t, "Hello World, This is me, Can't you see ?", result["text"])

	// PUT to update
	result["text"] = "NOT THE SAME TEXT"
	result, status = requester("/blocks/text", http.MethodPut, result, tok)
	assert.Equal(t, 200, status)
	assert.Equal(t, "NOT THE SAME TEXT", result["text"])

	// GET
	result, status = requester(fmt.Sprintf("/blocks/text?_id=%s", result["_id"]), http.MethodGet, nil, tok)
	assert.Equal(t, 200, status)
	assert.Equal(t, "NOT THE SAME TEXT", result["text"])

	// DELETE
	result, status = requester(fmt.Sprintf("/blocks/text?_id=%s", result["_id"]), http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status)
	assert.Empty(t, result)
}
