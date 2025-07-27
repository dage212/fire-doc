# Fire-Doc - API Documentation Generator

fire-doc is a lightweight Postman alternative that requires no additional software installation. Simply import the fire-doc package to use it, supporting various request types.

## ✨ Key Features

- **Code-First Approach**: Generate docs directly from your Go code
- **Multiple Output Formats**: Support for OpenAPI/Swagger, Markdown and HTML
- **Live Reload**: Preview changes instantly during development
- **CLI Tool**: Easy to integrate into your build process
- **Custom Templates**: Flexible template system for documentation

## 🚀 Installation

### Prerequisites

- Go 1.20 or later
- Gin v1.10.1 or later

### Quick Start

1. Install the fire-doc package:
```powershell
go get github.com/dage212/fire-doc/firedoc@latest
```

2. Modify the code:
```powershell
r.Static("/fire-doc", firedoc.Dir())
```



## 🎯 Code Examples


```go
package main

import (
	"fmt"
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/gin-gonic/gin"
)

type Example struct {
	Name string `json:"name"`
	List []List `json:"list"`
}

type List struct {
	First  string `json:"first"`
	Second string `json:"second"`
}

func main() {
	fmt.Println("Starting server...", firedoc.Dir())
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:8080")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Name")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	r.GET("/api/get", func(c *gin.Context) {
		name, _ := c.GetQuery("name")
		c.SetSameSite(http.SameSiteNoneMode)
		c.SetCookie("tokensv", "example-token", 3600, "/", "", true, true)
		c.JSON(200, gin.H{
			"message": "Hello, World!",
			"name":    name,
		})
	})
	r.POST("/api/post", func(c *gin.Context) {
		uuid, _ := c.GetQuery("uuid")
		var example Example
		if err := c.ShouldBindJSON(&example); err == nil {
			c.JSON(200, gin.H{
				"code:":  200,
				"status": "success",
				"data": gin.H{
					"data": example,
					"uuid": uuid,
				},
				"message": "Received POST request on /api/example",
			})
		} else {
			c.JSON(400, gin.H{
				"code:":   400,
				"status":  "error",
				"message": err.Error(),
			})
		}
	})
	// TIPS: start 
	r.Static("/fire-doc", firedoc.Dir())
        // TIPS: end 
	r.Run()
}

```