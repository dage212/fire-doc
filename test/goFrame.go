package main

import (
	"net/http"
	"path/filepath"

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

	// POST /api/upload - handle file uploads
	s.BindHandler("/api/upload", func(r *ghttp.Request) {
		// Get uploaded files (key "file" is commonly used)
		files := r.GetUploadFiles("file")
		if files == nil {
			r.Response.WriteStatus(http.StatusBadRequest, "No files uploaded")
			return
		}

		// Process uploaded files
		fileInfos := make([]map[string]interface{}, 0)
		for _, file := range files {
			// Save file to upload directory
			savePath := filepath.Join("upload", file.Filename)

			// Save the file to the upload directory
			if _, err := file.Save(savePath, true); err != nil {
				r.Response.WriteStatus(http.StatusInternalServerError, "Failed to save file: "+err.Error())
				return
			}

			fileInfo := map[string]interface{}{
				"name": file.Filename,
				"size": file.Size,
				"path": savePath,
			}
			fileInfos = append(fileInfos, fileInfo)
		}

		r.Response.WriteJson(g.Map{
			"code":  200,
			"msg":   "success",
			"files": fileInfos,
			"count": len(fileInfos),
		})
	})

	s.BindHandler("/fire-doc/*path", func(r *ghttp.Request) {
		firedoc.FireDocIndexHandler(r.Response.Writer, r.Request)
	})
	s.SetPort(8080)
	s.Run()
}
