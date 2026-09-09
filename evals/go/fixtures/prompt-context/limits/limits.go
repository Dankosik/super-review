package limits

type Config struct {
	WarningBytes int64
	MaximumBytes int64
}

func (c Config) Values() (int64, int64) {
	return c.WarningBytes, c.MaximumBytes
}
