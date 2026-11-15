# Go context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Go code says what it does

Doc comments on packages, types, functions and exported fields. Signatures and
types: `(T, error)` versus `(T, bool)`, sentinel `var Err*` values and custom
error types (`Unwrap`, `Is`, `As`), context parameters, struct tags (`json`,
`yaml`, `db`), channel direction (`<-chan`, `chan<-`), and units in constant,
field or flag names (`TimeoutMs`, `time.Duration`). Metric, log and flag
descriptions.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, `go.mod`
or the resolved dependency version, not from memory.

- **Typed nil inside an interface is not `nil`.** Returning a `nil` concrete
  pointer (`*MyError`) as `error` or `io.Reader` produces a non-nil interface
  whose `err != nil` check succeeds while dereferencing panics.
- **Cancellation and channels.** Sending on an unbuffered or full channel, or
  receiving from an empty one, blocks forever when the peer exits on
  `ctx.Done()` unless a `select` also listens for cancellation or closure.
  Closing a channel from a sender wakes all receivers with the zero value;
  sending on a closed channel or closing it twice panics.
- **Slices share backing storage.** `b := a[:n]` shares `a`'s capacity, so
  `append(b, x)` overwrites `a[n]` unless `a[:n:n]` caps capacity or a fresh
  slice is allocated.
- **Copying synchronization values.** Passing a struct by value copies its
  fields; copying a used `sync.Mutex`, `sync.RWMutex`, `sync.WaitGroup`,
  `sync.Once`, `sync.Cond` or `atomic.Value` splits its state.
- **`defer` runs when the surrounding function returns**, not when a loop
  iteration or block ends. Named return values can be read and modified by a
  deferred closure after `return expr` assigns them.
- **Iterators and scanners.** `sql.Rows.Next` and `bufio.Scanner.Scan` stop on
  both EOF and error; skipping `rows.Err()` or `scanner.Err()` treats a failed
  read as a clean short result. `http.Response.Body` must be closed when `err ==
  nil`.
- **Go version baselines (`go` in `go.mod`).** Loop variables are per-iteration
  starting in Go 1.22 (per-loop before 1.22). `time.After` and unstopped
  `time.Timer`/`time.Ticker` channels were not collected before firing prior to
  Go 1.23. Check `go.mod` before claiming either bug.
- **Maps and JSON.** Reading a `nil` map returns the zero value; writing to a
  `nil` map panics; concurrent map read and write crashes the process.
  `encoding/json.Unmarshal` matches struct fields case-insensitively without an
  exact match and leaves earlier fields mutated when a later field fails.

## Dependencies

The version in use is the one `go.mod` and `go.sum` (or `go.work`) resolve.
Read a dependency's source where it already is on disk: `vendor/`, or the Go
module cache (`GOMODCACHE`, typically `~/go/pkg/mod`). Do not download it. When
it is not on disk, a step that depends on it is an assumption: name the module,
version and question its source would answer.

## Not a bug in Go

A style or lint preference without observable harm. Returning a `nil` slice
where callers iterate or check `len` (`len(nil) == 0`). Omitting a `nil` check
on a receiver or error when `errors.Is`/`errors.As` or the method handles `nil`
by design.
