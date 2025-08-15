package main

import (
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/labstack/echo/v4"
)

func EchoRun() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/api/get", func(c echo.Context) error {
		name := c.QueryParam("name")
		return c.JSON(http.StatusOK, name)
	})
	e.POST("/api/post", func(c echo.Context) error {
		uuid := c.QueryParam("uuid")
		var example Example
		if err := c.Bind(&example); err != nil {
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		return c.JSON(http.StatusOK, echo.Map{
			"code":   200,
			"msg":    "success",
			"data":   example,
			"uuid":   uuid,
			"status": "Received POST request on /api/example",
		})
	})
	e.Any("/fire-doc/*", echo.WrapHandler(http.HandlerFunc(firedoc.FireDocIndexHandler)))
	e.Logger.Fatal(e.Start(":8080"))
}
