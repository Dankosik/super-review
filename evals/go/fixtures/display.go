package sample

import "strings"

func DisplayName(first, last string) string {
	return strings.TrimSpace(first + " " + last)
}
