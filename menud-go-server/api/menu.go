package api

import (
	"github.com/gin-gonic/gin"
	"github.com/jns-w/menud/menud-go-server/database"
	"net/http"
)

func GetMenu(c *gin.Context) {
	menu, err := database.GetMenu("default")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, menu)
}
