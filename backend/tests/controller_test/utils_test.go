package controller_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func requesterFile(path string, method string, auth string, fileName string) (map[string]interface{}, int) {
	url := "http://localhost:8080" + path

	content := []byte{}
	contentType := "image/png"
	if fileName != "" {
		file, err := os.Open(fileName)
		if err != nil {
			panic(err)
		}
		defer file.Close()

		content, err = io.ReadAll(file)
		if err != nil {
			panic(err)
		}

		ext := fileName[len(fileName)-3:]
		contentType = "image/" + ext
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(content))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", contentType)
	if auth != "" {
		req.Header.Set("Authorization", "Bearer "+auth)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 {
		result := make(map[string]interface{})
		json.NewDecoder(resp.Body).Decode(&result)
		return result, resp.StatusCode
	}

	if method == http.MethodPost {
		result := make(map[string]interface{})
		json.NewDecoder(resp.Body).Decode(&result)
		return result, resp.StatusCode
	}

	if method == http.MethodGet {
		resultFile, err := os.Create("resTest.png")
		if err != nil {
			panic(err)
		}
		defer resultFile.Close()
		_, err = io.Copy(resultFile, resp.Body)
		if err != nil {
			panic(err)
		}
		return nil, resp.StatusCode
	}

	return nil, 0
}

func requesterList(path string, method string, body map[string]interface{}, auth string) ([]map[string]interface{}, int, string) {
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

	if resp.StatusCode != 200 {
		result := make(map[string]interface{})
		json.NewDecoder(resp.Body).Decode(&result)
		return nil, resp.StatusCode, result["err"].(string)
	}

	result := make([]map[string]interface{}, 0)
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		panic(err)
	}
	return result, resp.StatusCode, ""
}

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

func getAdminAccessToken(t *testing.T) string {
	body := map[string]interface{}{
		"email":    "quentinescudier@hotmail.fr",
		"password": "admin",
	}
	result, status := requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])
	res, ok := result["access_token"].(string)
	assert.True(t, ok)
	return res
}

func createTestAccount(t *testing.T, email string, adminTok string) string {
	body := map[string]interface{}{
		"email":     email,
		"firstName": "test",
		"lastName":  "test",
		"password":  "test",
	}
	result, status := requester("/user/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])
	res, ok := result["access_token"].(string)
	assert.True(t, ok)
	return res
}

func deleteAccount(t *testing.T, tok string) {
	result, status := requester("/user/delete", http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}
