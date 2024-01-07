package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWhoAmI(t *testing.T) {
	adminTok := getAdminAccessToken(t)
	tok := createTestAccount(t, "test@test.fr", adminTok)
	defer deleteAccount(t, tok)
	assert.NotEmpty(t, tok)

	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"], result)
	assert.NotEmpty(t, result["pseudo"], result)
	assert.Contains(t, "truefalse", fmt.Sprintf("%t", result["isAdmin"]), result)
}

func TestUpdateAccount(t *testing.T) {
	adminTok := getAdminAccessToken(t)
	tok := createTestAccount(t, "test@test.fr", adminTok)
	defer deleteAccount(t, tok)
	assert.NotEmpty(t, tok)

	// Who am I
	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	testId, ok := result["_id"].(string)
	assert.True(t, ok)

	body := map[string]interface{}{
		"_id":    testId,
		"pseudo": "test2",
	}
	result, status = requester("/user/update", http.MethodPut, body, tok)
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/update", http.MethodPut, nil, "")
	assert.Equal(t, 401, status, result["err"])
}

func TestChangePassword(t *testing.T) {
	adminTok := getAdminAccessToken(t)
	testTok := createTestAccount(t, "test@test.fr", adminTok)
	defer deleteAccount(t, testTok)
	assert.NotEmpty(t, testTok)

	body := map[string]interface{}{
		"newPassword": "test2",
		"oldPassword": "test",
	}
	result, status := requester("/user/password", http.MethodPut, body, testTok)
	assert.Equal(t, 200, status, result["err"])
	// Login with new password
	body = map[string]interface{}{
		"pseudo":   "test@test.fr",
		"password": "test2",
	}
	result, status = requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/delete", http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Missing password
	body = map[string]interface{}{
		"password": "",
	}
	result, status = requester("/user/password", http.MethodPut, body, testTok)
	assert.Equal(t, 400, status, result["err"])

	/* Test as admin */

	// Get test@test.fr id with who-am-i
	result, status = requester("/who-am-i", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	testId, ok := result["_id"].(string)
	assert.True(t, ok)

	// Not admin
	notAdminTok := createTestAccount(t, "test2@test.fr", adminTok)
	defer deleteAccount(t, notAdminTok)

	// Update password
	body = map[string]interface{}{
		"newPassword": "test3",
		"oldPassword": "test2",
	}
	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testId), http.MethodPut, body, notAdminTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testId), http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
}

func TestDeleteAccount(t *testing.T) {
	adminTok := getAdminAccessToken(t)
	tok := createTestAccount(t, "test@test.fr", adminTok)
	assert.NotEmpty(t, tok)
	result, status := requester("/user/delete", http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/delete", http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	/* Test as admin */

	// Not admin

	// Create test account
	testTok := createTestAccount(t, "test2@test.fr", adminTok)
	assert.NotEmpty(t, testTok)
	result, status = requester("/who-am-i", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	testId, ok := result["_id"].(string)
	assert.True(t, ok)

	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testId), http.MethodDelete, nil, tok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	tok = getAdminAccessToken(t)
	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testId), http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}

func TestLogin(t *testing.T) {
	tok := getAdminAccessToken(t)

	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}
