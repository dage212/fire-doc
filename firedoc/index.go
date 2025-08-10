package firedoc

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// SaveHandler handles POST requests, parses parameters, and generates a JSON file.
func AddHandler(w http.ResponseWriter, r *http.Request) {
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
			"msg":  "操作成功",
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
			"msg":  "操作成功",
		}
		json.NewEncoder(w).Encode(response)
	}
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse query parameters for filtering
	id := r.URL.Query().Get("id")
	urlFilter := r.URL.Query().Get("url")
	methodFilter := r.URL.Query().Get("method")
	descriptionFilter := r.URL.Query().Get("description")

	// Check if fire-doc.json exists
	if _, err := os.Stat("fire-doc.json"); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
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
	var filteredData []map[string]interface{}
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

func DelHandler(w http.ResponseWriter, r *http.Request) {
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

func FireDocHandler(w http.ResponseWriter, r *http.Request) {
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

func FireDocIndexHandler(w http.ResponseWriter, r *http.Request) {
	if strings.Contains(r.URL.Path, "save") {
		AddHandler(w, r)
	} else if strings.Contains(r.URL.Path, "get") {
		GetHandler(w, r)
	} else if strings.Contains(r.URL.Path, "del") {
		DelHandler(w, r)
	} else {
		FireDocHandler(w, r)
	}
}

func generateUniqueID() string {
	// Implement your logic to generate a unique ID
	// For example, you can use a UUID library or any other method
	return time.Now().Format("20060102150405")
}
