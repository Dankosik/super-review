# Go context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Go code states its cost

Doc comments noting complexity, allocation behavior or reuse contracts,
`Benchmark*` functions in `*_test.go` (`b.ReportAllocs()`, input sizes),
committed `pprof` or `benchstat` outputs, `make(..., 0, cap)` and `sync.Pool`
usage upstream, and the `go` version in `go.mod`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation or the resolved dependency version, not from memory.

- **Slices, strings and buffers.** Slicing a slice or `string` (`s[i:j]`) copies
  no backing bytes. Converting `string([]byte)` or `[]byte(string)` copies the
  bytes whenever the result escapes or can be mutated. Concatenating strings
  with `+` inside a loop allocates and copies the accumulated prefix each step;
  `strings.Builder` or `bytes.Buffer` with `Grow` amortizes or pre-sizes once.
  `append` on an un-sized slice reallocates geometrically; `make([]T, 0, n)`
  allocates once when `n` is known.
- **Formatting, reflection and regexes.** `fmt.Sprintf`/`fmt.Errorf` parses the
  format string and boxes arguments into `any`; `strconv` formats primitives
  directly. `encoding/json` reflects over types and allocates intermediate
  buffers when `json.Marshal` is called instead of streaming or reusing buffers.
  `regexp.MustCompile` / `regexp.Compile` compiles the automaton on every call
  unless hoisted to package or struct initialization.
- **I/O and SQL.** `io.ReadAll` buffers the entire stream before inspection;
  `bufio.Reader` / `bufio.Writer` coalesce small system calls. Preparing a SQL
  statement per row inside a loop adds round trips where a batch insert, `ANY` /
  `IN` query, or reused `*sql.Stmt` / connection pool avoids them.
- **Concurrency and channels.** Spawning a goroutine and channel per tiny item
  costs scheduling and synchronization per element compared with batched worker
  loops or `errgroup.SetLimit`. Holding a `sync.Mutex` across network/disk I/O
  queues every concurrent caller behind that wait; `sync.RWMutex` helps read-heavy
  maps only when writers are infrequent.
- **What a cheaper form may use.** The `go` directive in `go.mod` bounds
  available standard-library packages (`slices`, `maps`, `clear`, `min`/`max`
  from Go 1.21; `unique` from Go 1.23).

## Dependencies

The version in use is resolved by `go.mod` and `go.sum`. Read dependency source
already on disk (`vendor/` or `GOMODCACHE`, typically `~/go/pkg/mod`) without
downloading. When absent on disk, record the unresolved step as an assumption.

## Not a finding in Go

Style preferences. Claims about Go compiler escape analysis, bounds-check
elimination or inlining without a committed or user-supplied profile or
compiler escape report: these are claims about code generation. Using `unsafe`
(`unsafe.String`, `unsafe.SliceData`) or `sync.Pool` with lifetime hazards is a
tradeoff, never a plain finding.
