package firedoc

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// 文件信息结构体
type FileInfo struct {
	Name    string `json:"name"`
	Size    int64  `json:"size"`
	ModTime string `json:"modified_time"`
	Path    string `json:"path"`
}

// SaveHandler handles POST requests, parses parameters, and generates a JSON file.
func addHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body
	var params map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
		return
	}

	if payload, ok := params["payload"]; ok {
		if payloadMap, ok := payload.(map[string]interface{}); ok {
			if body, ok := payloadMap["body"]; ok {
				if bodyMap, ok := body.(map[string]interface{}); ok {
					if _, ok := bodyMap["data"]; ok {

					}
				}
			}
		}
	}

	// Add updateTime field to params
	params["updateTime"] = time.Now().Format("2006/01/02 15:04")

	// Handle ID assignment - use existing or generate new one
	if id, exists := params["id"]; !exists || id == "" {
		params["id"] = generateUniqueID()
	}

	// Check if fire-doc.json exists
	if _, err := os.Stat("fire-doc.json"); os.IsNotExist(err) {
		// If file doesn't exist, always create new entry

		file, err := os.Create("fire-doc.json")
		if err != nil {
			http.Error(w, "Failed to create file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		// Wrap the new content in an array
		jsonData, err := json.MarshalIndent([]map[string]interface{}{params}, "", "  ")
		if err != nil {
			http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
			return
		}

		_, err = file.Write(jsonData)
		if err != nil {
			http.Error(w, "Failed to write to file", http.StatusInternalServerError)
			return
		}

		// Return JSON response with code, data, and msg
		w.Header().Set("Content-Type", "application/json")
		response := map[string]interface{}{
			"code": 200,
			"data": params["id"],
			"msg":  "Operation successful",
		}
		json.NewEncoder(w).Encode(response)
		return
	} else {
		// File exists, check if it's an update or create operation
		file, err := os.OpenFile("fire-doc.json", os.O_RDWR, 0644)
		if err != nil {
			http.Error(w, "Failed to open file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		var existingData []map[string]interface{}
		err = json.NewDecoder(file).Decode(&existingData)
		if err != nil {
			http.Error(w, "Failed to parse existing JSON", http.StatusInternalServerError)
			return
		}

		// Check if ID is provided in params
		id := params["id"]
		found := false
		for i, entry := range existingData {
			if entry["id"] == id {
				// Update the entry
				existingData[i] = params
				found = true
				break
			}
		}

		// If ID not found, create new entry
		if !found {
			existingData = append(existingData, params)
		}

		// Truncate the file and write the updated JSON
		file.Truncate(0)
		file.Seek(0, 0)
		jsonData, err := json.MarshalIndent(existingData, "", "  ")
		if err != nil {
			http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
			return
		}

		_, err = file.Write(jsonData)
		if err != nil {
			http.Error(w, "Failed to write to file", http.StatusInternalServerError)
			return
		}

		// Return JSON response with code, data, and msg
		w.Header().Set("Content-Type", "application/json")
		response := map[string]interface{}{
			"code": 200,
			"data": params["id"],
			"msg":  "Operation successful",
		}
		json.NewEncoder(w).Encode(response)
	}
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse query parameters for filtering
	id := r.URL.Query().Get("id")
	urlFilter := r.URL.Query().Get("url")
	methodFilter := r.URL.Query().Get("method")
	descriptionFilter := r.URL.Query().Get("description")
	var filteredData []map[string]interface{}
	// Check if fire-doc.json exists
	if _, err := os.Stat("fire-doc.json"); os.IsNotExist(err) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(filteredData)
		return
	}

	// Open and read the file
	file, err := os.Open("fire-doc.json")
	if err != nil {
		http.Error(w, "Failed to open file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Decode the JSON content
	var data []map[string]interface{}
	err = json.NewDecoder(file).Decode(&data)
	if err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusInternalServerError)
		return
	}

	// Apply filters

	for _, entry := range data {
		general := entry["general"].(map[string]interface{})
		if id != "" && entry["id"] != id {
			continue
		}
		url := general["url"].(string)
		if urlFilter != "" && !strings.Contains(url, urlFilter) {
			continue
		}
		if methodFilter != "" && general["method"] != methodFilter {
			continue
		}
		if descriptionFilter != "" {
			if desc, ok := general["description"]; !ok || desc != descriptionFilter {
				continue
			}
		}
		filteredData = append(filteredData, entry)
	}

	// Write the filtered JSON content to the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filteredData)
}

func delHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// 从URL路径中获取id参数
	pathParts := strings.Split(r.URL.Path, "/")
	var id string
	if len(pathParts) > 0 {
		id = pathParts[len(pathParts)-1]
	}

	// Check if id parameter is provided
	if id == "" {
		http.Error(w, "ID parameter is required", http.StatusBadRequest)
		return
	}

	// Check if fire-doc.json exists
	if _, err := os.Stat("fire-doc.json"); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Open and read the file
	file, err := os.OpenFile("fire-doc.json", os.O_RDWR, 0644)
	if err != nil {
		http.Error(w, "Failed to open file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	var data []map[string]interface{}
	err = json.NewDecoder(file).Decode(&data)
	if err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusInternalServerError)
		return
	}

	// Find and remove the entry with the specified ID
	found := false
	newData := []map[string]interface{}{}
	for _, entry := range data {
		if entry["id"] == id {
			found = true
			// Skip this entry (effectively deleting it)
			continue
		}
		newData = append(newData, entry)
	}

	// If ID was not found, return an error
	if !found {
		http.Error(w, "Entry with specified ID not found", http.StatusNotFound)
		return
	}

	// Truncate the file and write the updated JSON
	file.Truncate(0)
	file.Seek(0, 0)
	jsonData, err := json.MarshalIndent(newData, "", "  ")
	if err != nil {
		http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		http.Error(w, "Failed to write to file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Entry deleted successfully"))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Check request method
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form data
	r.ParseMultipartForm(32 << 20) // 32 MB max memory

	// Retrieve form fields
	id := r.FormValue("id")
	fileKey := r.MultipartForm.Value["fileKey"]

	// Retrieve multiple files
	files := r.MultipartForm.File["file"]

	if len(files) == 0 {
		http.Error(w, "No files provided", http.StatusBadRequest)
		return
	}

	// Create uploads directory if not exists
	uploadsDir := filepath.Join("./fire-doc", "temp", id)
	if _, err := os.Stat(uploadsDir); err == nil {
		// 如果目录已存在，先删除（包括所有子文件和子目录）
		if err := os.RemoveAll(uploadsDir); err != nil {
			http.Error(w, "Delete dir fail", http.StatusBadRequest)
			return
		}
	}

	// 重新创建目录（权限 0755）
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		http.Error(w, "Failed to create directory", http.StatusBadRequest)
		return
	}

	// Process each file
	uploadedFiles := make([]map[string]interface{}, 0)

	for index, fileHeader := range files {
		// Open the file
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening the file: "+err.Error(), http.StatusBadRequest)
			return
		}

		uploadsDir := filepath.Join(uploadsDir, fileKey[index])

		if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
			os.MkdirAll(uploadsDir, 0755)
		}
		// Create destination file
		dstPath := filepath.Join(uploadsDir, fileHeader.Filename)

		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, "Unable to save the file", http.StatusInternalServerError)
			return
		}

		// Copy uploaded file content
		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, "Error saving the file", http.StatusInternalServerError)
			return
		}

		// Close files
		dst.Close()
		file.Close()

		// Add file info to response
		uploadedFiles = append(uploadedFiles, map[string]interface{}{
			"fileName": fileHeader.Filename,
			"fileUrl":  dstPath,
		})
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"code": 200,
		"data": map[string]interface{}{
			"id":      id,
			"fileKey": fileKey,
			"files":   uploadedFiles,
		},
		"msg": "Files uploaded successfully",
	}
	json.NewEncoder(w).Encode(response)
}

func getUploadHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	fileKey := r.URL.Query().Get("fileKey")
	if id == "" {
		http.Error(w, "Missing 'id' parameter", http.StatusBadRequest)
		return
	}

	// Define the base directory for uploads
	uploadsDir := filepath.Join("./fire-doc", "temp", id, fileKey)

	// If no specific file path is provided, list all files in the directory

	var fileInfos []FileInfo

	files, _ := os.ReadDir(uploadsDir)
	for _, file := range files {
		info, err := file.Info()
		if err != nil {
			return
		}
		path := strings.TrimPrefix(uploadsDir, "fire-doc")
		path = filepath.ToSlash(path)
		fileInfos = append(fileInfos, FileInfo{
			Name:    info.Name(),
			Size:    info.Size(),
			ModTime: info.ModTime().Format(time.RFC3339),
			Path:    filepath.Join(path, file.Name()),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fileInfos)
}

func fireDocHandler(w http.ResponseWriter, r *http.Request) {
	// Serve the FireDoc frontend files
	urlPath := strings.SplitN(r.URL.Path, "/", 3)
	if len(urlPath) > 2 {
		urlPath = urlPath[2:]
	} else {
		urlPath = []string{""}
	}
	var absPath string
	if !strings.Contains(urlPath[0], ".") || urlPath[0] == "" {
		absPath = filepath.Join(Dir(), "index.html")
	} else {
		absPath = filepath.Join(Dir(), urlPath[0])

	}

	http.ServeFile(w, r, absPath)
}

func getExampleHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"code": 200,
		"data": "Hello World!",
		"msg":  "get successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getTempFile(w http.ResponseWriter, r *http.Request) {
	baseDir := "fire-doc/temp"

	// 去掉前导路径，比如你的路由是 /fire-doc/api/temp/*
	relPath := strings.TrimPrefix(r.URL.Path, "/fire-doc/api/temp/")

	// 拼接完整路径
	absPath := filepath.Join(baseDir, relPath)

	// 设置响应头，让浏览器当作附件下载
	filename := filepath.Base(absPath)
	w.Header().Set("Content-Disposition", "attachment; filename=\""+filename+"\"")
	w.Header().Set("Content-Type", "application/octet-stream") // 二进制流
	w.Header().Set("Content-Transfer-Encoding", "binary")

	// 返回文件
	http.ServeFile(w, r, absPath)
}

func FireDocIndexHandler(w http.ResponseWriter, r *http.Request) {
	if strings.Contains(r.URL.Path, "save") {
		addHandler(w, r)
	} else if strings.Contains(r.URL.Path, "get") {
		getHandler(w, r)
	} else if strings.Contains(r.URL.Path, "del") {
		delHandler(w, r)
	} else if strings.Contains(r.URL.Path, "upload") {
		uploadHandler(w, r)
	} else if strings.Contains(r.URL.Path, "example") {
		getExampleHandler(w, r)
	} else if strings.Contains(r.URL.Path, "files") {
		getUploadHandler(w, r)
	} else if strings.Contains(r.URL.Path, "temp") {
		getTempFile(w, r)
	} else {
		fireDocHandler(w, r)
	}
}

func generateUniqueID() string {
	// Implement your logic to generate a unique ID
	// For example, you can use a UUID library or any other method
	return time.Now().Format("20060102150405")
}
