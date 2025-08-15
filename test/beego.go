package main

import (
	"io/ioutil"
	"net/http"

	"github.com/beego/beego/v2/server/web"
	"github.com/dage212/fire-doc/firedoc"
)

// 控制器
type ApiController struct {
	web.Controller
}

// GET /api/get?name=xxx
func (c *ApiController) GetAPI() {
	name := c.GetString("name")

	// 设置 cookie，支持 SameSite=None
	c.Ctx.SetCookie("tokensv", "example-token", 3600, "/", "", true, true)

	c.Data["json"] = map[string]interface{}{
		"message": "Hello, World!",
		"name":    name,
	}
	c.ServeJSON()
}

// POST /api/post?uuid=xxx
func (c *ApiController) PostAPI() {
	uuid := c.GetString("uuid")
	var example Example
	if err := c.ParseForm(&example); err == nil {
		c.Data["json"] = map[string]interface{}{
			"code":   200,
			"status": "success",
			"data": map[string]interface{}{
				"data": example,
				"uuid": uuid,
			},
			"message": "Received POST request on /api/example",
		}
	} else {
		c.Data["json"] = map[string]interface{}{
			"code":    400,
			"status":  "error",
			"message": err.Error(),
		}
	}
	c.ServeJSON()
}

// POST /api/raw
func (c *ApiController) PostRaw() {
	rawData, err := ioutil.ReadAll(c.Ctx.Request.Body)
	if err != nil {
		c.Data["json"] = map[string]interface{}{
			"code":    400,
			"status":  "error",
			"message": "Failed to read request body",
		}
		c.ServeJSON()
		return
	}

	strData := string(rawData)

	c.Data["json"] = map[string]interface{}{
		"code":    200,
		"status":  "success",
		"data":    strData,
		"message": "Successfully received raw string data",
	}
	c.ServeJSON()
}

func MyHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from net/http"))
}

type UserController struct {
	web.Controller
}

func Beego() {
	// 注册 API 路由
	web.Router("/api/get", &ApiController{}, "get:GetAPI")
	web.Router("/api/post", &ApiController{}, "post:PostAPI")
	web.Router("/api/raw", &ApiController{}, "post:PostRaw")

	web.Handler("/fire-doc/*", http.HandlerFunc(firedoc.FireDocIndexHandler))

	// 启动 Beego
	web.Run(":8080")
}
