package main

import (
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type DataMenuItem struct {
	ID          uuid.UUID `db:"id"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	Price       float32   `db:"price" json:"price,string"`
	ImageURL    string    `db:"image_url" json:"imageUrl"`
	PriceSuffix string    `db:"price_suffix" json:"priceSuffix"`
}

type DataMenuCategory struct {
	ID          uuid.UUID      `db:"id"`
	Index       int            `db:"index" json:"index"`
	Name        string         `db:"name" json:"category"`
	Description string         `db:"description" json:"description"`
	Items       []DataMenuItem `json:"items"`
	MenuItemIDs []uuid.UUID    `db:"menu_item_ids"`
}

type DataMenu struct {
	ID          uuid.UUID          `db:"id"`
	Name        string             `db:"name" json:"name"`
	CreatedAt   time.Time          `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `db:"updated_at" json:"updated_at"`
	CategoryIDs []uuid.UUID        `db:"category_ids" json:"category_ids"`
	Categories  []DataMenuCategory `json:"categories"`
}

func goDotEnvVar(key string) string {
	err := godotenv.Load("../.env")

	if err != nil {
		log.Fatalf("Error loading env file")
	}

	return os.Getenv(key)
}

func main() {
	// Replace these connection details with your PostgreSQL server information
	//connectionString := "user=jnsw dbname=menud sslmode=disable"

	dbUser := goDotEnvVar("DB_USER")
	dbName := goDotEnvVar("DB_NAME")

	fmt.Printf("User: %s \n DB: %s", dbUser, dbName)

	source := "user=" + dbUser + " dbname=" + dbName + " sslmode=disable"
	db, err := sqlx.Connect("postgres", source)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	// Read the JSON data from file
	jsonFile, err := os.Open("data.json")
	if err != nil {
		log.Fatal(err)
	}
	defer jsonFile.Close()

	var menu DataMenu
	err = json.NewDecoder(jsonFile).Decode(&menu)
	if err != nil {
		log.Fatal(err)
	}

	err = db.QueryRow(`
			INSERT INTO menus (name, created_at, updated_at) 
			VALUES($1, $2, $3) 
			RETURNING id, name`,
		"default", time.Now(), time.Now()).Scan(&menu.ID, &menu.Name)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("ID is %s \n Name is %s", menu.ID, menu.Name)
	//var createdCategoryIDs []models.IndexedMenuCategoryID
	for _, category := range menu.Categories {
		err = db.QueryRow(`
		INSERT INTO menu_categories (name, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4) RETURNING id`,
			category.Name, category.Description, time.Now(), time.Now()).Scan(&category.ID)
		if err != nil {
			log.Fatal(err)
		} else {
			fmt.Printf("Inserted category: %s", category.Name)
			_, err = db.Exec(`
			UPDATE menus m
			SET category_ids = array_append(m.category_ids, $1)
			WHERE m.id = $2`,
				category.ID, menu.ID)
		}
		//Create new menu items for each category
		for _, item := range category.Items {
			err := db.QueryRow(`
				INSERT INTO menu_items (name, description, image_url, price, price_suffix, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
				item.Name, item.Description, item.ImageURL, item.Price, item.PriceSuffix, time.Now(), time.Now()).Scan(&item.ID)
			if err != nil {
				log.Fatal(err)
			} else {
				fmt.Printf("Inserted item.. id: %s", item.Name)
				_, err = db.Exec(`
				UPDATE menu_categories c
				SET menu_item_ids = array_append(c.menu_item_ids, $1)
				WHERE c.id = $2`,
					item.ID, category.ID)
			}
		}
	}

	fmt.Println("Data seeded successfully!")
}
