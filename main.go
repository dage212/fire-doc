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

func main() {
	fmt.Println("Starting server...", firedoc.Dir())
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		// allow cors requests
		// tips: Note that the port here is the port of your local gin service
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
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

	// 处理原始字符串POST请求
	r.POST("/api/raw", func(c *gin.Context) {
		// 读取原始请求体
		rawData, err := c.GetRawData()
		if err != nil {
			c.JSON(400, gin.H{
				"code":    400,
				"status":  "error",
				"message": "Failed to read request body",
			})
			return
		}

		// 转换为字符串
		strData := string(rawData)

		// 返回处理结果
		c.JSON(200, gin.H{
			"code":    200,
			"status":  "success",
			"data":    strData,
			"message": "Successfully received raw string data",
		})
	})
	r.Static("/fire-doc", firedoc.Dir())
	r.Any("/firedoc/*path", gin.WrapH(http.HandlerFunc(firedoc.FireDocIndexHandler)))
	r.Run()
}
