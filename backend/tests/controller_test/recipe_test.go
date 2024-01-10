package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRecipe(t *testing.T) {
	adminTok := getAdminAccessToken(t)

	// Post recipe category
	body := map[string]interface{}{
		"name": "testCategory1",
	}

	result, status := requester("/recipe-categories", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	catID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testCategory2",
	}

	result, status = requester("/recipe-categories", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	catID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete recipe category
		for _, id := range []string{catID1, catID2} {
			result, status = requester("/recipe-categories?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Post recipe origin
	body = map[string]interface{}{
		"name": "testOrigin1",
	}

	result, status = requester("/recipe-origins", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	originID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testOrigin2",
	}

	result, status = requester("/recipe-origins", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	originID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete recipe origin
		for _, id := range []string{originID1, originID2} {
			result, status = requester("/recipe-origins?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Post ingredient
	body = map[string]interface{}{
		"name": "testIngredient1",
	}

	result, status = requester("/ingredients", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	ingID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testIngredient2",
	}

	result, status = requester("/ingredients", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	ingID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete ingredient
		for _, id := range []string{ingID1, ingID2} {
			result, status = requester("/ingredients?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Get number of recipes
	resultList, status, errList := requesterList("/recipes", http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	nbRecipes := len(resultList)

	// Post recipe status
	body = map[string]interface{}{
		"name": "testStatus1",
	}

	result, status = requester("/recipe-status", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	statusID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testStatus2",
	}

	result, status = requester("/recipe-status", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	statusID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete recipe status
		for _, id := range []string{statusID1, statusID2} {
			result, status = requester("/recipe-status?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Post recipe type
	body = map[string]interface{}{
		"name": "testType1",
	}

	result, status = requester("/recipe-types", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	typeID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name": "testType2",
	}

	result, status = requester("/recipe-types", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	typeID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete recipe type
		for _, id := range []string{typeID1, typeID2} {
			result, status = requester("/recipe-types?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Post recipe
	body = map[string]interface{}{
		"name":        "testRecipe1",
		"categories":  []string{catID1},
		"origin":      originID1,
		"status":      statusID1,
		"type":        typeID1,
		"ingredients": []string{ingID1},
		"quantities":  []float64{1},
	}

	result, status = requester("/recipes", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	recipeID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name":        "testRecipe2",
		"categories":  []string{catID2},
		"origin":      originID2,
		"status":      statusID2,
		"type":        typeID2,
		"ingredients": []string{ingID2},
		"quantities":  []float64{2},
	}

	result, status = requester("/recipes", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	recipeID2, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"name":        "testRecipe3",
		"categories":  []string{catID1, catID2},
		"origin":      originID1,
		"status":      statusID1,
		"type":        typeID1,
		"ingredients": []string{ingID1, ingID2},
		"quantities":  []float64{1, 2},
	}

	result, status = requester("/recipes", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	recipeID3, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete recipe
		for _, id := range []string{recipeID1, recipeID2, recipeID3} {
			result, status = requester("/recipes?_id="+id, http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}()

	// Get recipes
	resultList, status, errList = requesterList("/recipes", http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+3, len(resultList))

	// Get recipe by id
	resultList, status, errList = requesterList("/recipes?_id="+recipeID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+1, len(resultList))

	// Get recipe by name
	resultList, status, errList = requesterList("/recipes?name=testRecipe1", http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+1, len(resultList))

	// Get recipe by category
	resultList, status, errList = requesterList("/recipes?recipeCategoryIds="+catID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by origin
	resultList, status, errList = requesterList("/recipes?recipeOriginIds="+originID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by status
	resultList, status, errList = requesterList("/recipes?recipeStatusIds="+statusID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by type
	resultList, status, errList = requesterList("/recipes?recipeTypeIds="+typeID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by ingredient
	resultList, status, errList = requesterList("/recipes?ingredientIds="+ingID1, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by ingredient
	resultList, status, errList = requesterList("/recipes?ingredientIds="+ingID2, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+2, len(resultList), fmt.Sprintf("%v", resultList))

	// Get recipe by ingredient
	resultList, status, errList = requesterList("/recipes?ingredientIds="+ingID1+"&ingredientIds="+ingID2, http.MethodGet, nil, adminTok)
	assert.Equal(t, 200, status, errList)
	assert.Equal(t, nbRecipes+3, len(resultList), fmt.Sprintf("%v", resultList))
}
