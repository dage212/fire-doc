# fire-doc

fire-doc is a streamlined integration of postman and swagger. Unlike Swagger, which necessitates extensive annotation code, and unlike postman, which mandates downloading, installing, logging in, and registering, fire-doc merely requires altering a single line of code to facilitate interface documentation and debugging.

## fire-doc vs swagger
 
- **Simple**: No need to write code comments
- **Better Experience** : The page experience is better than swagger

## fire-doc vs postman
- **Simple**: No additional software installation required
- **Better Experience**: fire-doc does not require login or registration, just open the page and use it

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
3. Run the fire-doc, port is your local service port:
```
open localhost:8080/fire-doc
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
	Class string `json:"class"`
	Students []Student `json:"students"`
}

type Student struct {
	Name  string `json:"name"`
	Age string `json:"age"`
}

func main() {
	fmt.Println("Starting server...", firedoc.Dir())
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		// allow cors requests
		c.Header("Access-Control-Allow-Origin", "http://localhost:8080")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
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
	// TIPS: example start 
	r.Static("/fire-doc", firedoc.Dir())
        // TIPS: example end 
	r.Run()
}

```