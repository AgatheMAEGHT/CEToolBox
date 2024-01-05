package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFile(t *testing.T) {
	adminTok := getAdminAccessToken(t)
	testTok := createTestAccount(t, "test@file.fr", adminTok)
	defer deleteAccount(t, testTok)

	// Post file
	// Not admin
	result, status := requesterFile("/file/create", http.MethodPost, testTok, "screenTest.png")
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resID, ok := result["_id"].(string)
	assert.True(t, ok)
	resExt, ok := result["ext"].(string)
	assert.True(t, ok)
	assert.Equal(t, "png", resExt)

	// Get file
	result, status = requesterFile(fmt.Sprintf("/file/download/%s.%s", resID, resExt), http.MethodGet, "", "")
	assert.Equal(t, 200, status, result["err"])

	// Delete file
	// Not admin
	result, status = requester(fmt.Sprintf("/file/delete/%s.%s", resID, resExt), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/file/delete/%s.%s", resID, resExt), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])
}
