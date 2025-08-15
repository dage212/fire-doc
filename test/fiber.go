package main

import (
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/gofiber/adaptor/v2" // 用于适配 net/http
	"github.com/gofiber/fiber/v2"
)

func Fiber() {
	app := fiber.New()

	app.Get("/api/get", func(c *fiber.Ctx) error {
		name := c.Query("name") // QueryParam 在 Fiber 里是 Query
		return c.Status(http.StatusOK).JSON(name)
	})

	// POST /api/post?uuid=xxx
	app.Post("/api/post", func(c *fiber.Ctx) error {
		uuid := c.Query("uuid")

		var example Example
		if err := c.BodyParser(&example); err != nil { // Echo 的 Bind 对应 Fiber 的 BodyParser
			return c.Status(http.StatusBadRequest).JSON(err.Error())
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"code":   200,
			"msg":    "success",
			"data":   example,
			"uuid":   uuid,
			"status": "Received POST request on /api/example",
		})
	})
	app.All("/fire-doc/*", adaptor.HTTPHandler(http.HandlerFunc(firedoc.FireDocIndexHandler)))

	app.Listen(":8080")
}
