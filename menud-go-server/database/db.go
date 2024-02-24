package database

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

// InitDB initializes the database connection.
func InitDB(source string) error {
	var err error
	//source := "user=" + user + " dbname=" + dbName + " sslmode=disable"
	DB, err = sqlx.Connect("postgres", source)
	if err != nil {
		return err
	}

	// Create database settings
	if err := createDbSettings(); err != nil {
		return err
	}

	// Create tables if they don't exist
	if err := createTables(); err != nil {
		return err
	}

	//fmt.Printf("\nConnected to database %s \n \n", dbName)
	fmt.Printf("\nConnected to database \n \n")

	return nil
}

func createDbSettings() error {
	uuidSettings := `
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`
	if _, err := DB.Exec(uuidSettings); err != nil {
		return fmt.Errorf("failed to create settings: %v", err)
	}
	return nil
}

func createTables() error {
	createMenuTableSQL := `
		CREATE TABLE IF NOT EXISTS menus (
			id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL,
			created_at TIMESTAMPTZ,
			updated_at TIMESTAMPTZ,
			category_ids UUID[]
		)`

	createCategoriesTableSQL := `
		CREATE TABLE IF NOT EXISTS menu_categories (
			id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			created_at TIMESTAMPTZ,
			updated_at TIMESTAMPTZ,
			menu_item_ids UUID[]
		)`

	// SQL statement to create the menu items table
	createMenuItemsTableSQL := `
		CREATE TABLE IF NOT EXISTS menu_items (
			id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name TEXT UNIQUE NOT NULL,
			price FLOAT NOT NULL,
			description TEXT NOT NULL,
			image_url TEXT NOT NULL,
			price_suffix TEXT,
			created_at TIMESTAMPTZ,
			updated_at TIMESTAMPTZ
		)`

	createCartTableSQL := `
		CREATE TABLE IF NOT EXISTS carts (
			id SMALLSERIAL PRIMARY KEY,
			created_at TIMESTAMPTZ,
			updated_at TIMESTAMPTZ,
			order_ids UUID[]
		)`

	// Execute the SQL statements to create tables
	if _, err := DB.Exec(createMenuTableSQL); err != nil {
		return fmt.Errorf("failed to create menu table: %v", err)
	} else {
		fmt.Println("created menu table")
	}

	if _, err := DB.Exec(createCategoriesTableSQL); err != nil {
		return fmt.Errorf("failed to create menu categories table: %v", err)
	} else {
		fmt.Println("created menu categories table")
	}

	if _, err := DB.Exec(createMenuItemsTableSQL); err != nil {
		return fmt.Errorf("failed to create menu items table: %v", err)
	} else {
		fmt.Println("created menu items table")
	}

	if _, err := DB.Exec(createCartTableSQL); err != nil {
		return fmt.Errorf("failed to create cart table: %v", err)
	} else {
		fmt.Println("created cart table")
	}

	return nil
}
