package models

type HouseItem struct {
	Id          int64  `json:"id,omitempty"`
	Name        string `json:"name"`
	Quantity    int    `json:"quantity"`
	Category    string `json:"category,omitempty"`
	Description string `json:"description,omitempty"`
}
