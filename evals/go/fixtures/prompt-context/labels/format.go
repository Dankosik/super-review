package labels

func Title(name string) string {
	return surround(forward(name))
}

func forward(name string) string {
	return name
}

func surround(name string) string {
	return "[" + name + "]"
}
