package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// SetupRoutes initializes API routes.
func SetupRoutes(router *gin.Engine) {
	ping := router.Group("/api")
	{
		ping.GET("/ping", Ping)
	}
	menuGroup := router.Group("/api/menu")
	{
		menuGroup.GET("", GetMenu)
	}
	//cartGroup := router.Group("/api/cart")
	//{
	//	cartGroup.GET("/:id", GetCart)
	//}
}

func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, "pong")
}
