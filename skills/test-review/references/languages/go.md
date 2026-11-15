# Go context

Go, TypeScript, Rust and Java have language contexts in this review. Tests in
another language are listed as excluded.

## Where tests live

- Same-package white-box tests: `*_test.go` in `package foo`, with access to
  unexported items. External black-box tests: `*_test.go` in `package foo_test`,
  seeing only exported API. Runnable examples (`func Example...`) with `// Output:`
  or `// Unordered output:` comments; examples without an output comment are
  compiled, never executed as assertions. Fuzz targets (`func Fuzz...`) run
  their seed corpus during ordinary test runs unless skipped.
- Tests the default suite skips: `t.Skip` / `testing.Short()`, `//go:build`
  constraints (such as `integration` or `e2e`) not enabled in CI, and retries in
  CI scripts that mask flaky failures.

## Choosing a mutant

Go rejects unused local variables and imports at compile time, so a mutant that
leaves an unread local or import fails to compile and proves nothing about the
tests. Type-checked signatures and channel directions need no test.

Forms a plausible Go mistake takes:

- `<` for `<=`, off-by-one slice bounds `s[:n-1]` vs `s[:n]`, `min`/`max`
  swapped.
- Returning `nil` instead of `err`, wrapping with `%v` instead of `%w` when
  `errors.Is`/`errors.As` is promised, or returning a typed `nil` pointer as
  `error`.
- Dropping `rows.Err()` or `scanner.Err()` after iteration, or omitting `defer
  resp.Body.Close()`.
- Omitting `ctx` propagation (`context.Background()` passed to a downstream
  call) or dropping a `ctx.Done()` branch from `select`.
- Mutating a caller's slice without capping capacity (`s[:n:n]`) or omitting a
  field from a cache key, reset path or JSON tag.
- Early `return` before `defer` registration or counter/metric recording.

## Writing a witness

Place the witness beside the package's existing table-driven or subtest style
(`t.Run`), using its fakes and helpers. Use an injected clock or Go 1.24+
`testing/synctest` (check `go` in `go.mod`) rather than `time.Sleep`; coordinate
goroutines through channels, `sync.WaitGroup` or observable state, and assert
what callers observe (`errors.Is`, returned values, HTTP response, recorded
events).

## Reading a test for stability

`t.Parallel()` subtests sharing package globals, shared mocks, open ports,
`os.Setenv` (Go forbids `t.Setenv` alongside `t.Parallel()`), `time.Sleep`
before assertions, unjoined goroutines outliving `Test*` (calling `t.Errorf`
after completion panics), and asserting iteration order over a `map` produce
order-dependent failures.

## Dependencies

The version in use is resolved by `go.mod`/`go.sum`. Read dependency source on
disk under `vendor/` or `GOMODCACHE` (`~/go/pkg/mod`) without downloading. When
absent on disk, record the step as an assumption.

## Not a finding in Go

Table-driven test formatting style. Using `t.Fatal` on setup errors. Testing
unexported helpers when no team rule forbids it.
