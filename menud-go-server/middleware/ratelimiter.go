package middleware

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"net/http"
	"sync"
)

var (
	globalRateLimiter = rate.NewLimiter(rate.Limit(1000.0/60.0), 1000) // Global rate limiter for 1000 requests per minute
	clientRateLimiter = make(map[string]*rate.Limiter)                 // Rate limiters per client IP
	mu                sync.Mutex
)

// CreateRateLimiter returns a rate limiting middleware that combines global and per-client rate limiting
func CreateRateLimiter() gin.HandlerFunc {
	// Define the rate limit and burst limit per client
	clientRateLimit := 10 // 5 requests per second
	clientBurstLimit := 5 // 3 requests at a time

	return func(c *gin.Context) {
		// Get the client's IP address from the context
		clientIP := getClientIP(c)

		// Check if the request exceeds the global rate limit
		if !globalRateLimiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Server is busy, please try again later"})
			c.Abort()
			return
		}

		// Get or create a rate limiter for the client
		mu.Lock()
		limiter, exists := clientRateLimiter[clientIP]
		if !exists {
			// Create a new rate limiter for the client
			limiter = rate.NewLimiter(rate.Limit(clientRateLimit), clientBurstLimit)
			clientRateLimiter[clientIP] = limiter
		}
		mu.Unlock()

		// Check if the request exceeds the rate limit for the client
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// getClientIP gets the client's IP address from the request context
func getClientIP(c *gin.Context) string {
	// Try to get the client IP from request headers (e.g., X-Forwarded-For, X-Real-IP)
	clientIP := c.ClientIP()
	if clientIP != "" {
		return clientIP
	}

	// If headers don't provide the IP, fall back to the remote address
	return c.Request.RemoteAddr
}
