package main

import (
	"encoding/json"
	"net/http"

	"github.com/dage212/fire-doc/firedoc"
	"github.com/go-chi/chi/v5"
)

func Chi() {
	r := chi.NewRouter()

	r.Get("/api/get", func(w http.ResponseWriter, req *http.Request) {
		name := req.URL.Query().Get("name")

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(name)
	})

	r.Post("/api/post", func(w http.ResponseWriter, req *http.Request) {
		uuid := req.URL.Query().Get("uuid")

		var example Example
		if err := json.NewDecoder(req.Body).Decode(&example); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		response := map[string]interface{}{
			"code":   200,
			"msg":    "success",
			"data":   example,
			"uuid":   uuid,
			"status": "Received POST request on /api/example",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	})

	// 匹配任意方法 /fire-doc/*
	// r.Method("ANY", "/fire-doc/*", http.HandlerFunc(firedoc.FireDocIndexHandler))
	r.Handle("/fire-doc/*", http.HandlerFunc(firedoc.FireDocIndexHandler))
	http.ListenAndServe(":8080", r)
}
