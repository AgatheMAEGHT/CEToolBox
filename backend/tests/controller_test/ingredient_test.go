package controller_test

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIngredient(t *testing.T) {
	adminTok := getAdminAccessToken(t)

	// Post ingredient tag
	body := map[string]interface{}{
		"name":  "testTag1",
		"color": "000000",
	}

	result, status := requester("/ingredient-tags", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tagID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name":  "testTag2",
		"color": "000000",
	}

	result, status = requester("/ingredient-tags", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tagID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete ingredient tag
		for _, id := range []string{tagID1, tagID2} {
			result, status = requester("/ingredient-tags?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Post ingredient
	body = map[string]interface{}{
		"name": "testIngredient1",
		"tags": []string{tagID1},
	}
	result, status = requester("/ingredients", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testIngredient2",
		"tags": []string{tagID2},
	}

	result, status = requester("/ingredients", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resID2, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testIngredient11",
		"tags": []string{tagID1},
	}

	result, status = requester("/ingredients", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resID3, ok := result["_id"].(string)
	assert.True(t, ok)

	// Get ingredient
	resultList, status, errList := requesterList("/ingredients", http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, 3, len(resultList))

	// Get ingredient by id
	resultList, status, errList = requesterList("/ingredients?_id="+resID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, 1, len(resultList))

	// Get ingredient by name
	resultList, status, errList = requesterList("/ingredients?name=testIngredient1", http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, 1, len(resultList))

	// Get ingredient by tag
	resultList, status, errList = requesterList("/ingredients?tags="+tagID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, 2, len(resultList))

	resultList, status, errList = requesterList("/ingredients?tags="+tagID1+"&tags="+tagID2, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, 3, len(resultList))

	// Put ingredient
	body = map[string]interface{}{
		"_id":  resID1,
		"name": "testIngredient12",
		"tags": []string{tagID1, tagID2},
	}

	result, status = requester("/ingredients", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.Equal(t, resID1, result["_id"])
	assert.Equal(t, "testIngredient12", result["name"])
	assert.Equal(t, []interface{}{tagID1, tagID2}, result["tags"])

	// Delete ingredient
	for _, id := range []string{resID1, resID2, resID3} {
		result, status = requester("/ingredients?_id="+id, http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}
}
