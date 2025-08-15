package main

import (
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

func goFrame() {
	s := g.Server()

	// GET /api/get?name=xxx
	s.BindHandler("/api/get", func(r *ghttp.Request) {
		name := r.GetQuery("name")
		r.Response.WriteJson(name)
	})

	// POST /api/post?uuid=xxx
	s.BindHandler("/api/post", func(r *ghttp.Request) {
		uuid := r.GetQuery("uuid")

		var example Example
		if err := r.Parse(&example); err != nil {
			r.Response.WriteStatus(http.StatusBadRequest, err.Error())
			return
		}

		r.Response.WriteJson(g.Map{
			"code":   200,
			"msg":    "success",
			"data":   example,
			"uuid":   uuid,
			"status": "Received POST request on /api/example",
		})
	})

	s.BindHandler("/fire-doc/*path", func(r *ghttp.Request) {
		firedoc.FireDocIndexHandler(r.Response.Writer, r.Request)
	})
	s.SetPort(8080)
	s.Run()
}
