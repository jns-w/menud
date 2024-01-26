package models

import (
	"github.com/google/uuid"
	"time"
)

type Cart struct {
	ID     int `db:"id" json:"id"`
	Orders []Order
}

type Order struct {
	Quantity     int       `db:"quantity" json:"quantity"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
	MenuItemID   uuid.UUID `db:"menu_item_id" json:"menu_item_id"`
	MenuItemName string    `db:"menu_item_name" json:"menu_item_name"`
	Price        float32   `db:"price" json:"price"`
}
