package firedoc

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// Dir returns the dist directory path under github.com/dage212/fire-doc package
// The path uses Windows-style backslashes (\)
func Dir() string {
	// Get module cache directory
	var modCache string
	if dir := os.Getenv("GOMODCACHE"); dir != "" {
		modCache = dir
	} else {
		cmd := exec.Command("go", "env", "GOMODCACHE")
		output, err := cmd.Output()
		if err != nil {
			return ""
		}
		modCache = strings.TrimSpace(string(output))
	}
	pkg := "github.com/dage212/fire-doc"
	// Get module version dynamically
	cmd := exec.Command("go", "list", "-m", "-f", "{{.Version}}", pkg)
	versionBytes, err := cmd.Output()
	if err != nil {
		return ""
	}
	version := strings.TrimSpace(string(versionBytes))

	// Construct full path including dist subdirectory
	basePath := filepath.Join(modCache, pkg+version, "frontend/dist")
	return basePath
}
