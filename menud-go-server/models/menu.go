package models

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"time"
)

type Menu struct {
	ID          uuid.UUID          `db:"id" json:"id"`
	Name        string             `db:"name" json:"name"`
	CreatedAt   time.Time          `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `db:"updated_at" json:"updated_at"`
	CategoryIDs []uuid.UUID        `db:"category_ids" json:"-"`
	Categories  JSONMenuCategories `db:"categories" json:"categories"`
}

type MenuCategory struct {
	ID          uuid.UUID     `db:"id" json:"id"`
	Name        string        `db:"name" json:"name"`
	Description string        `db:"description" json:"description"`
	CreatedAt   time.Time     `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time     `db:"updated_at" json:"updated_at"`
	MenuItemIDs []uuid.UUID   `db:"menu_item_ids" json:"-"`
	MenuItems   JSONMenuItems `db:"menu_items" json:"menu_items"`
}

type MenuItem struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	ImageURL    string    `db:"image_url" json:"image_url"`
	Price       float32   `db:"price" json:"price"`
	PriceSuffix string    `db:"price_suffix" json:"price_suffix"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}

type JSONMenuCategories []MenuCategory
type JSONMenuItems []MenuItem

// Scan custom function for MenuCategories as it is JSON format
func (j *JSONMenuCategories) Scan(src interface{}) error {
	// If the source value is nil, set the JSONMenuCategories slice to nil and return.
	if src == nil {
		*j = nil
		return nil
	}
	var str string
	switch src := src.(type) {
	// If the source is a []byte, convert it to a string
	case []byte:
		str = string(src)
	// If the source is a string, use it
	case string:
		str = src
	default:
		return fmt.Errorf("unsupported Scan, storing driver.Value type %T into JSONMenuCategories", src)
	}
	return json.Unmarshal([]byte(str), j)
}

// Scan custom function for MenuCategories as it is JSON format
func (j *JSONMenuItems) Scan(src interface{}) error {
	// If the source value is nil, set the JSONMenuCategories slice to nil and return.
	if src == nil {
		*j = nil
		return nil
	}
	var str string
	switch src := src.(type) {
	// If the source is a []byte, convert it to a string
	case []byte:
		str = string(src)
	// If the source is a string, use it
	case string:
		str = src
	default:
		return fmt.Errorf("unsupported Scan, storing driver.Value type %T into JSONMenuCategories", src)
	}
	return json.Unmarshal([]byte(str), j)
}
