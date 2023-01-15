# Backend
This backend is written in `Go` and corresponds to the `backend` container started by the `docker-compose.yml` at the root of the project.  
The project is an `API` that interact with a `PostgreSQL` database.

# Routes
## `/house`
This route allows to interact with the `house_items` table

### GET
By default it returns every `house item` in the database but can be filtered by adding a `category` field in the query.  
Ex:  
```js
GET /house
or
GET /house?category=type1,type2
```

### POST
This function is an `upsert`, that means that if an object with the same `ID` exists, it will replace it and if not, it will insert a new entry.  
Ex:  
Insert in first place
```js
POST /house
{
  "item": {
    "name":     "string",
    "quantity": int,
    "category": "string"
  }
}
```
Then replace by giving the `ID`
```js
POST /house
{
  "item": {
    "id":       int,
    "name":     "string",
    "quantity": int,
    "category": "string"
  }
}
```

### DELETE
It Delete the `house item` using the `ID` in the query  
Ex:  
```js
DELETE /house?id=1
```
