package importer

import "strings"

type Record struct {
	Name string
}

func Names(records []Record) []string {
	names := make([]string, 0, len(records))
	for _, record := range records {
		name := strings.TrimSpace(record.Name)
		if name == "" {
			continue
		}
		names = append(names, name)
	}
	return names
}
