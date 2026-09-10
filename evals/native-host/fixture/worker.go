package worker

func delay(at int64, n int64) int64 { return at + n*1000 }
func schedule(nowMillis int64, retrySeconds int64) int64 {
 return delay(nowMillis, retrySeconds)
}
