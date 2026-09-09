package payload

import (
	"io"
	"os"
)

// View lends a read-only interface; the owner retains Close and Seek.
func View(file *os.File) io.Reader {
	return readView{file: file}
}

type readView struct {
	file *os.File
}

func (v readView) Read(p []byte) (int, error) {
	return v.file.Read(p)
}
