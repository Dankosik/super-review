# Go context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Go code states its cost

Doc comments noting complexity, allocation behavior or reuse contracts,
`Benchmark*` functions in `*_test.go` (`b.ReportAllocs()`, input sizes),
committed `pprof` or `benchstat` outputs, `make(..., 0, cap)` and `sync.Pool`
usage upstream, and the `go` version and dependencies in `go.mod`.

## Verify in source

The version in use is what `go.mod` and `go.sum` resolve, never memory. Inspect
dependency source already on disk (`vendor/` or `GOMODCACHE`, typically
`~/go/pkg/mod`) and local standard library source (`GOROOT/src`) when present.
Verify both the current cost and the cheaper form's behavior, and check API
availability against the `go` directive in `go.mod` because the installed
toolchain may be newer. Do not download modules. When needed source is absent on
disk, mark the step as an assumption: name the package, the version, and the
question its source would answer.

## Questions to settle before claiming

- **Slices, strings, and buffers**: does slicing share backing bytes, or does
  `string([]byte)`/`[]byte(string)` conversion, loop `+` concatenation, or
  unsized `append` copy and reallocate on every step where pre-sizing or buffer
  reuse avoids it? Check whether pre-sizing trusts an uncapped external length.
- **Formatting, reflection, and regexes**: does hot-path `fmt` formatting,
  reflection-based encoding (`encoding/json`), or per-call regex compilation
  repeat allocation or parsing where direct formatting, streaming/buffer reuse,
  or hoisted compilation keeps behavior?
- **I/O and SQL**: does full-stream buffering, unbuffered small reads/writes, or
  per-row statement preparation and execution multiply syscalls or round trips
  where buffered I/O, batching, or pooled reuse avoids them?
- **Concurrency and channels**: does spawning a goroutine per tiny item exceed
  the work it does, or does a `sync.Mutex` stay held across network/disk I/O or
  exclude readers when writes are rare?

## Go boundaries

- **Finding**: builds under the `go` version and modules in `go.mod` without
  `unsafe` and keeps observable behavior.
- **Tradeoff**: uses `unsafe` (`unsafe.String`, `unsafe.SliceData`), adds a
  dependency, introduces `sync.Pool` with lifetime or peak-memory hazards, or
  changes flush, commit, or cancellation semantics.

## Not a finding in Go

Style preferences. Claims about Go compiler escape analysis, bounds-check
elimination or inlining without a committed or user-supplied profile or
compiler escape report: these are claims about code generation.
