package sample

func CanSend(enabled, paused bool) bool {
	if enabled {
		if !paused {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}
