package controller_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func requester(path string, method string, body map[string]interface{}, auth string) (map[string]interface{}, int) {
	url := "http://localhost:8080" + path
	jsonStr, err := json.Marshal(body)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonStr))
	if err != nil {
		panic(err)
	}
	req.Header.Set("Content-Type", "application/json")
	if auth != "" {
		req.Header.Set("Authorization", "Bearer "+auth)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	result := make(map[string]interface{})
	json.NewDecoder(resp.Body).Decode(&result)
	return result, resp.StatusCode
}

func getAccessToken(t *testing.T) string {
	body := map[string]interface{}{
		"email":    "quentinescudier@hotmail.fr",
		"password": "test",
	}
	result, status := requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status)
	res, ok := result["access_token"].(string)
	assert.True(t, ok)
	return res
}

func TestLogin(t *testing.T) {
	tok := getAccessToken(t)

	_, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status)
}
