package main

import (
	"fmt"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/gin-gonic/gin"
)

type User struct {
	Name string     `json:"name"`
	List []UserList `json:"list"`
}

type UserList struct {
	First  string `json:"first"`
	Second string `json:"second"`
}

func main() {
	fmt.Println("Starting server...", firedoc.Dir())
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})
	r.POST("/api/user", func(c *gin.Context) {
		fmt.Println("Received POST request on /api/user", c.Request.Body)
		var user User
		if err := c.ShouldBindJSON(&user); err == nil {
			c.JSON(200, gin.H{
				"code:":  200,
				"status": "success",
				"data": gin.H{
					"data": user,
				},
				"message": "Received POST request on /api/user",
			})
		} else {
			c.JSON(400, gin.H{
				"code:":   400,
				"status":  "error",
				"message": err.Error(),
			})
		}
	})

	r.Static("/fire-doc", firedoc.Dir())
	// 启动 Gin，监听并在 0.0.0.0:8080 上提供服务
	r.Run()
}
