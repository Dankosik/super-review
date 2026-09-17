# Go quality-depth inputs

Developer fixtures, not runtime resources or real PRs. Give a reviewer this
preamble and exactly one numbered section plus the existing contract, Go context,
assigned lens/profile and candidate format. Do not send peer sections, cases.json,
the README, validation receipts or grading expectations. Each section is an
isolated synthetic repository; files with the same path in different sections
are unrelated. Each source fence is one complete file at its preceding path.

Review source is read-only and must not be executed. For specialist stages, shown
production declarations are newly added at synthetic H = case ID, D = empty;
for verification, assess only the stated proposed transformation against shown H.
The section establishes scope and consumer evidence; do not assume other callers
are absent unless it says the inventory is complete. Assume existing behavior is
intentional. Assess expression and maintenance, not correctness, security,
performance, tests or formatting. Configuration files are compatibility context.

## GD01

Stage: specialist
Lens: api-clarity
Baseline: Go 1.23; no extra team convention.
Request: Review construction and the shown calls as one API contract.

New package-private code. These are all uses of newFormatter and option; neither is an extension point. Both inputs are supplied by every caller. No resource acquisition or validation occurs during construction.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package format

type formatter struct { prefix, suffix string }
type option func(*formatter)

func withPrefix(s string) option { return func(f *formatter) { f.prefix = s } }
func withSuffix(s string) option { return func(f *formatter) { f.suffix = s } }
func newFormatter(opts ...option) formatter {
    var f formatter
    for _, opt := range opts { opt(&f) }
    return f
}
func (f formatter) label(s string) string { return f.prefix + s + f.suffix }
func report(s, prefix, suffix string) string {
    return newFormatter(withPrefix(prefix), withSuffix(suffix)).label(s)
}
func audit(s, prefix, suffix string) string {
    return newFormatter(withPrefix(prefix), withSuffix(suffix)).label(s)
}
```

## GD02

Stage: specialist
Lens: api-clarity
Baseline: Go 1.23; no extra team convention.
Request: Review construction and the shown calls as one API contract.

Released library API. The zero Client and New both use the default label when labels is nil; a supplied empty slice explicitly suppresses labels. WithLabels retains the supplied backing storage. Options are applied left to right; repeated settings replace the previous value. The consumers shown are representative, not a closed public inventory.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package client

import "strings"

type Client struct { labels []string }
type Option func(*Client)

func WithLabels(labels []string) Option {
    return func(c *Client) { c.labels = labels }
}
func New(opts ...Option) *Client {
    c := &Client{}
    for _, opt := range opts { opt(c) }
    return c
}
func (c *Client) Label() string {
    if c.labels == nil { return "default" }
    return strings.Join(c.labels, ",")
}
func examples(labels []string) []string {
    var zero Client
    return []string{
        zero.Label(), New().Label(), New(WithLabels([]string{})).Label(),
        New(WithLabels([]string{"first"}), WithLabels(labels)).Label(),
    }
}
```

## GD03

Stage: specialist
Lens: abstractions
Baseline: Go 1.23; no extra team convention.
Request: Review whether the collection mechanics express the operation directly.

New private code; these are all uses. list returns an eagerly materialized, sorted list. Nil and empty maps both produce a nil slice. No callback, custom collation or interleaved effect is involved.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package catalog

import "sort"

func list(m map[string]int) []string {
    var out []string
    for key := range m { out = append(out, key) }
    sort.Strings(out)
    return out
}
func names(m map[string]int) []string { return list(m) }
```

## GD04

Stage: verification
Lens: data-flow
Baseline: Go 1.23; no extra team convention.
Request: Assess replacing snapshot with a returned iter.Seq over t.rows and consuming it later.

New private code; all uses are shown. snapshot establishes the data observed before replace. The caller may traverse the resulting slice repeatedly; rows are strings. The proposed sequence would close over t and read t.rows when traversed.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package table

import "slices"

type table struct { rows []string }
func (t *table) snapshot() []string { return slices.Clone(t.rows) }
func (t *table) replace(rows []string) { t.rows = rows }
func beforeReplace(t *table, next []string) []string {
    rows := t.snapshot()
    t.replace(next)
    return rows
}
```

## GD05

Stage: specialist
Lens: abstractions
Baseline: Go 1.23; no extra team convention.
Request: Review the mechanics of copying this stream.

New private code, all uses below. The contract is transfer through EOF, return bytes written and the original read/write error, with nil on ordinary EOF. No caller depends on individual Read/Write batch sizes or optional WriterTo/ReaderFrom dispatch, and no framing or progress callbacks exist.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package transfer

import "io"

func transfer(dst io.Writer, src io.Reader) (int64, error) {
    buf := make([]byte, 4096)
    var total int64
    for {
        n, readErr := src.Read(buf)
        if n > 0 {
            written, writeErr := dst.Write(buf[:n])
            total += int64(written)
            if writeErr != nil { return total, writeErr }
            if written != n { return total, io.ErrShortWrite }
        }
        if readErr != nil {
            if readErr == io.EOF { return total, nil }
            return total, readErr
        }
    }
}
func relay(dst io.Writer, src io.Reader) (int64, error) { return transfer(dst, src) }
```

## GD06

Stage: verification
Lens: abstractions
Baseline: Go 1.23; no extra team convention.
Request: Assess replacing records with io.Copy or io.ReadAll as a shorter stream operation.

New private code with a fixed line protocol. emit runs once per complete or partial record and can fail; it receives the delimiter when present. The result counts emitted records, not bytes. A final partial record is emitted before the original read error is returned. These semantics and order are intentional.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package records

import (
    "bufio"
    "io"
)

func records(r *bufio.Reader, emit func(string) error) (int, error) {
    count := 0
    for {
        line, readErr := r.ReadString('\n')
        if len(line) > 0 {
            if err := emit(line); err != nil { return count, err }
            count++
        }
        if readErr != nil {
            if readErr == io.EOF { return count, nil }
            return count, readErr
        }
    }
}
```

## GD07

Stage: specialist
Lens: data-flow
Profile: lifecycle-ownership
Baseline: Go 1.23; no extra team convention.
Request: Review how the caller understands ownership of starting and finishing this background operation.

New private code; use is the sole caller. start returns immediately. action(true) requests cancellation; action(false) waits for completion. While work runs the caller performs foreground, then cancels and waits in that order. Existing queue, cancellation and consume behavior is settled.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package worker

import "context"

func start(parent context.Context, input <-chan string, consume func(string)) func(bool) {
    ctx, cancel := context.WithCancel(parent)
    done := make(chan struct{})
    go func() {
        defer close(done)
        for {
            select {
            case <-ctx.Done(): return
            case value, ok := <-input:
                if !ok { return }
                consume(value)
            }
        }
    }()
    return func(stop bool) {
        if stop { cancel(); return }
        <-done
    }
}
func use(ctx context.Context, input <-chan string, consume func(string), foreground func()) {
    action := start(ctx, input, consume)
    foreground()
    action(true)
    action(false)
}
```

## GD08

Stage: specialist
Lens: data-flow
Profile: lifecycle-ownership
Baseline: Go 1.23; no extra team convention.
Request: Review ownership of this subscription and its caller.

New private code; all uses shown. Events are deliberately streamed. The producer owns closing Events and Done. Cancel requests stopping; Done marks completion after Events is closed. The caller can leave after the first event, cancels, then joins. Cancellation may race with delivery by the settled protocol; deciding which event wins is not this review.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package watch

import "context"

type subscription struct {
    Events <-chan string
    Done <-chan struct{}
    Cancel context.CancelFunc
}
func watch(parent context.Context, input <-chan string) subscription {
    ctx, cancel := context.WithCancel(parent)
    events := make(chan string)
    done := make(chan struct{})
    go func() {
        defer close(done)
        defer close(events)
        for {
            select {
            case <-ctx.Done(): return
            case value, ok := <-input:
                if !ok { return }
                select {
                case events <- value:
                case <-ctx.Done(): return
                }
            }
        }
    }()
    return subscription{events, done, cancel}
}
func first(ctx context.Context, input <-chan string) (string, bool) {
    sub := watch(ctx, input)
    defer func() { sub.Cancel(); <-sub.Done }()
    value, ok := <-sub.Events
    return value, ok
}
```

## GD09

Stage: specialist
Lens: data-flow
Profile: lifecycle-ownership
Baseline: Go 1.23; no extra team convention.
Request: Review how the operation expresses transaction ownership.

New private code; saveBatch is the sole user of begin. The three returned operations act on the same transaction. SQL, order, returned errors and the policy of ignoring deferred rollback results are fixed. No query or write may leave the transaction. Assess responsibility, not database correctness.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package batch

import (
    "context"
    "database/sql"
)

func begin(ctx context.Context, db *sql.DB) (func(int) error, func() error, func() error, error) {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil { return nil, nil, nil, err }
    save := func(amount int) error {
        _, err := tx.ExecContext(ctx, "INSERT INTO batch(amount) VALUES ($1)", amount)
        return err
    }
    return save, tx.Commit, tx.Rollback, nil
}
func saveBatch(ctx context.Context, db *sql.DB, amounts []int) error {
    save, finish, undo, err := begin(ctx, db)
    if err != nil { return err }
    defer undo()
    for _, amount := range amounts {
        if err := save(amount); err != nil { return err }
    }
    return finish()
}
```

## GD10

Stage: specialist
Lens: data-flow
Profile: lifecycle-ownership
Baseline: Go 1.23; no extra team convention.
Request: Review how the operation and its helper express transaction ownership.

New private code; all participating declarations below. saveBatch owns the transaction, saveAmounts participates in it. Queries, statement order and rollback-result handling are settled. No other use requires a database abstraction.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package batch

import (
    "context"
    "database/sql"
)

func saveBatch(ctx context.Context, db *sql.DB, amounts []int) error {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil { return err }
    defer tx.Rollback()
    if err := saveAmounts(ctx, tx, amounts); err != nil { return err }
    return tx.Commit()
}
func saveAmounts(ctx context.Context, tx *sql.Tx, amounts []int) error {
    for _, amount := range amounts {
        if _, err := tx.ExecContext(ctx, "INSERT INTO batch(amount) VALUES ($1)", amount); err != nil {
            return err
        }
    }
    return nil
}
```

## GD11

Stage: specialist
Lens: abstractions
Profile: dependency-boundaries
Baseline: Go 1.23; no extra team convention.
Request: Review what the HTTP and job callers must know to request this operation.

New package-private code; this is the complete usage inventory. sender.Send is the established application operation. The HTTP query uses the first email value; jobs already carry the email. Empty email and the response/status contracts are settled. No additional application policy or framework is hidden.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package notify

import (
    "context"
    "net/http"
    "net/url"
)

type sender interface { Send(context.Context, string) error }
func notifyRequest(ctx context.Context, r *http.Request, s sender) error {
    return s.Send(ctx, r.URL.Query().Get("email"))
}
func handler(s sender) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if err := notifyRequest(r.Context(), r, s); err != nil {
            http.Error(w, err.Error(), http.StatusBadGateway)
            return
        }
        w.WriteHeader(http.StatusNoContent)
    })
}
func fromJob(ctx context.Context, email string, s sender) error {
    query := url.Values{"email": {email}}
    r := &http.Request{URL: &url.URL{RawQuery: query.Encode()}}
    return notifyRequest(ctx, r, s)
}
```

## GD12

Stage: specialist
Lens: abstractions
Profile: dependency-boundaries
Baseline: Go 1.23; no extra team convention.
Request: Review whether this HTTP operation needs another application boundary.

New private code. This is a transport-only file response with HTTP range, conditional-request and header behavior owned by net/http. No non-HTTP caller or separate application decision is present. RootFS is supplied by composition; no environment lookup occurs here.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package files

import (
    "net/http"
    "os"
    "path/filepath"
)

func download(rootFS string) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        f, err := os.Open(filepath.Join(rootFS, "report.txt"))
        if err != nil { http.Error(w, err.Error(), http.StatusNotFound); return }
        defer f.Close()
        info, err := f.Stat()
        if err != nil { http.Error(w, err.Error(), http.StatusInternalServerError); return }
        http.ServeContent(w, r, info.Name(), info.ModTime(), f)
    })
}
```

## GD13

Stage: verification
Lens: abstractions
Baseline: Owning module go 1.22; file constraints partition Go 1.23+ from older implementations.
Request: Assess replacing keys in keys_modern.go with slices.Sorted(maps.Keys(m)).

Only keys_modern.go changes. Both implementations return nil for no keys and otherwise a sorted snapshot. Consumers support Go 1.22; the public List signature and fallback remain unchanged. Files below are the complete module and a representative consumer.

### go.mod

```text
module example.com/catalog

go 1.22
```

### list.go

```go
package catalog

func List(m map[string]int) []string { return keys(m) }
```

### keys_modern.go

```go
//go:build go1.23

package catalog

import "sort"

func keys(m map[string]int) []string {
    var out []string
    for key := range m { out = append(out, key) }
    sort.Strings(out)
    return out
}
```

### keys_legacy.go

```go
//go:build !go1.23

package catalog

import "sort"

func keys(m map[string]int) []string {
    var out []string
    for key := range m { out = append(out, key) }
    sort.Strings(out)
    return out
}
```

### consumer/use.go

```go
package consumer

import "example.com/catalog"

func List(m map[string]int) []string { return catalog.List(m) }
```

## GD14

Stage: verification
Lens: abstractions
Baseline: Root go 1.23, toolchain go1.23.2; owning legacy module go 1.22.
Request: Assess replacing List in legacy/list.go with slices.Sorted(maps.Keys(m)).

Only legacy/list.go changes. Consumers of the nested legacy module support Go 1.22. The newer root module and installed Go 1.23.2 toolchain are available. No tags, fallback or version upgrade is supplied; this is the complete module-boundary evidence.

### go.mod

```text
module example.com/root

go 1.23

toolchain go1.23.2
```

### root.go

```go
package root
```

### legacy/go.mod

```text
module example.com/legacy

go 1.22
```

### legacy/list.go

```go
package legacy

import "sort"

func List(m map[string]int) []string {
    var out []string
    for key := range m { out = append(out, key) }
    sort.Strings(out)
    return out
}
```

## GD15

Stage: specialist
Lens: abstractions
Baseline: Go 1.23; no extra team convention.
Request: Review whether the map-copy mechanics express the stated operation directly.

New private code. The output is a shallow copy of map bindings; pointers remain shared. A nil input returns a nil map, while a supplied empty map yields a writable empty map. These are all uses; no deep-copy contract exists.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package bindings

type value struct { Label string }
func snapshot(src map[string]*value) map[string]*value {
    if src == nil { return nil }
    out := make(map[string]*value, len(src))
    for key, value := range src { out[key] = value }
    return out
}
func capture(src map[string]*value) map[string]*value { return snapshot(src) }
```

## GD16

Stage: verification
Lens: abstractions
Baseline: Go 1.23; no extra team convention.
Request: Assess replacing snapshot with maps.Clone(src).

New private code. snapshot promises a writable map even for nil input. Map bindings are independent, but pointed-to values are intentionally shared. The caller below relies on the returned map accepting an added binding.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package bindings

type value struct { Label string }
func snapshot(src map[string]*value) map[string]*value {
    out := make(map[string]*value, len(src))
    for key, value := range src { out[key] = value }
    return out
}
func withLocal(src map[string]*value, v *value) map[string]*value {
    out := snapshot(src)
    out["local"] = v
    return out
}
```

## GD17

Stage: verification
Lens: data-flow
Profile: lifecycle-ownership
Baseline: Go 1.23; no extra team convention.
Request: Assess extracting iter.Pull and its defer into a helper returning only next.

New private code. seq may be single-use and may release a resource when stopped. atMost consumes at most two values. The proposal moves both next, stop := iter.Pull(seq) and defer stop() into a helper; the caller would receive next after that helper returns.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package sample

import "iter"

func atMost(seq iter.Seq[int]) []int {
    next, stop := iter.Pull(seq)
    defer stop()
    var out []int
    for range 2 {
        value, ok := next()
        if !ok { break }
        out = append(out, value)
    }
    return out
}
```

## GD18

Stage: verification
Lens: data-flow
Baseline: Go 1.23; no extra team convention.
Request: Assess replacing positives with slices.DeleteFunc(in, func(n int) bool { return n <= 0 }).

New private code. positives returns independent slice storage and a non-nil empty result for nil input. Its caller retains the original sequence, including an alias, and may modify the result independently.

### go.mod

```text
module example.com/fixture

go 1.23
```

### subject.go

```go
package numbers

func positives(in []int) []int {
    out := make([]int, 0, len(in))
    for _, n := range in {
        if n > 0 { out = append(out, n) }
    }
    return out
}
func both(in []int) ([]int, []int) {
    alias := in
    selected := positives(in)
    return alias, selected
}
```
