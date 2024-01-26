package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jns-w/menud/menud-go-server/api"
	"github.com/jns-w/menud/menud-go-server/database"
	"github.com/jns-w/menud/menud-go-server/middleware"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func goDotEnvVar(key string) string {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading env file")
	}

	return os.Getenv(key)
}

func main() {

	//dbSource := goDotEnvVar("DB_SOURCE") // osEnv -> DB_SOURCE="user=user dbname=dbname sslmode=disable"
	dbUser := goDotEnvVar("DB_USER")
	dbName := goDotEnvVar("DB_NAME")

	// Connect to the database
	if err := database.InitDB(dbUser, dbName); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.DB.Close()

	// Initialize Gin router
	r := gin.Default()

	// Set up CORS
	r.Use(middleware.SetCors())

	r.Use(middleware.CreateRateLimiter())

	// Set up API routes
	api.SetupRoutes(r)

	// Start Server
	port := ":8080"

	fmt.Printf("Server is running on port %s \n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
