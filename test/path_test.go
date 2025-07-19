package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"github.com/dage212/fire-doc/firedoc"
)

// TestPath tests the path function.
func TestPath(t *testing.T) {
	var modCache string
	if dir := os.Getenv("GOMODCACHE"); dir != "" {
		modCache = dir
	} else {
		cmd := exec.Command("go", "env", "GOMODCACHE")
		output, err := cmd.Output()
		if err != nil {
			t.Error("Failed to get GOMODCACHE")
		}
		modCache = strings.TrimSpace(string(output))
	}
	pkg := "github.com/dage212/fire-doc"
	path := firedoc.Dir()
	if path != filepath.Join(modCache, pkg+"@v1.0.9", "frontend/dist") {
		t.Error(path)
	} else {
		t.Logf("Path: %s", path)
	}
}
