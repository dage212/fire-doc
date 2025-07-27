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
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
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
		// 设置名为 token 的 Cookie，值为 "example-token"，有效期 3600 秒，路径为 /
		// 修改为 SameSite=None 且 Secure=true
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
	// 远程包
	// r.Static("/fire-doc", firedoc.Dir())
	//本地
	r.Static("/fire-doc", "../frontend/dist")
	// 启动 Gin，监听并在 0.0.0.0:8080 上提供服务
	r.Run()
}
