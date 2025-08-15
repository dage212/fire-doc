package main

import (
	"fmt"
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/gin-gonic/gin"
)

type Example struct {
	Class    string    `json:"class"`
	Students []Student `json:"students"`
}

type Student struct {
	Name string `json:"name"`
	Age  string `json:"age"`
}

func Gin() {
	fmt.Println("Starting server...", firedoc.Dir())
	r := gin.Default()

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

	r.POST("/api/raw", func(c *gin.Context) {

		rawData, err := c.GetRawData()
		if err != nil {
			c.JSON(400, gin.H{
				"code":    400,
				"status":  "error",
				"message": "Failed to read request body",
			})
			return
		}

		strData := string(rawData)

		c.JSON(200, gin.H{
			"code":    200,
			"status":  "success",
			"data":    strData,
			"message": "Successfully received raw string data",
		})
	})
	// TIPS: example start
	// r.Static("/fire-doc", firedoc.Dir())
	// TIPS: example end
	r.Any("/fire-doc/*path", gin.WrapH(http.HandlerFunc(firedoc.FireDocIndexHandler)))
	r.Run(":8082") // listen and serve on
}
