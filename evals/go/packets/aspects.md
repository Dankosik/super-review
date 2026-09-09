# Contextual-aspect raw inputs

Developer fixture packet, not instructions loaded during real PR reviews.
Give a reviewer only its selected section and explicitly referenced source sections,
plus the actual skill resources. Keep `aspect-cases.json` out of the reviewing
context. Each scenario is independent. Go baseline is 1.22; revisions are synthetic
B/H/D labels, not GitHub receipts. For judgment cases the shown declarations are
new/changed at H unless stated otherwise; supplied constraints are fixture facts.
No code/test execution or GitHub acquisition is implied by these scenarios.

## J01

Stage: judgment.

Review the newly added declarations in internal/report/batch.go using representation. These are private, transient values, constructed and consumed only below; there is no serialized or external representation.

```go
package report

import "fmt"

type batch struct {
    names []string
    totals []int
}

func collect(values map[string]int) batch {
    var b batch
    for name, total := range values {
        b.names = append(b.names, name)
        b.totals = append(b.totals, total)
    }
    return b
}

func lines(b batch) []string {
    out := make([]string, 0, len(b.names))
    for i, name := range b.names {
        out = append(out, fmt.Sprintf("%s: %d", name, b.totals[i]))
    }
    return out
}
```

## J02

Stage: judgment.

Review the changed type and operation in internal/columns/page.go using representation. A supplied system constraint fixes the columnar in-memory layout: the existing bulk encoder accepts the columns directly without row conversion. Layout redesign and measurement are outside this task.

```go
package columns

type page struct {
    keys []uint64
    values []float64
}

type encoder interface {
    EncodeColumns(keys []uint64, values []float64) error
}

func encode(p page, out encoder) error {
    return out.EncodeColumns(p.keys, p.values)
}
```

## J03

Stage: judgment.

Review the newly added compute function in internal/wire/checksum.go using rationale. The user supplied this contract: the final byte is an already-reserved checksum slot; the current device format computes an 8-bit sum of the preceding bytes. This is a fixed implementation constraint, not a rule to validate.

```go
package wire

func compute(frame []byte) byte {
    var sum byte
    for i := 0; i < len(frame)-1; i++ {
        sum += frame[i]
    }
    return sum
}
```

## J04

Stage: judgment.

Review the changed Go declarations below using rationale; do not inspect tests. The user confirms the comment describes the same fixed device contract as J03. No further historical context is available.

```go
package wire

// compute excludes the reserved checksum slot and wraps modulo 256, as required
// by the device frame format. Including the final byte changes the wire contract.
func compute(frame []byte) byte {
    var sum byte
    for i := 0; i < len(frame)-1; i++ {
        sum += frame[i]
    }
    return sum
}

func double(n int) int { return n * 2 }
```

## J05

Stage: judgment.

Review only lifecycle ownership under data-flow in the added internal/session/session.go declarations. The private constructor has exactly one caller, run. In this snapshot source.acquire/release transfer one session resource; the existing lifetime/order is intentional. Assess its expression, not leak correctness.

```go
package session

type source interface {
    acquire() (int, error)
    release(int)
    consume(int) error
}

func open(s source) (func() error, func(), error) {
    id, err := s.acquire()
    if err != nil { return nil, nil, err }
    return func() error { return s.consume(id) }, func() { s.release(id) }, nil
}

func run(s source) error {
    use, finish, err := open(s)
    if err != nil { return err }
    defer finish()
    return use()
}
```

## J06

Stage: judgment.

Review only lifecycle ownership under data-flow for the changed run declaration in internal/session/session.go. The source contract is identical to J05; acquire/use/release are intentionally kept at this sole owner.

```go
package session

type source interface {
    acquire() (int, error)
    release(int)
    consume(int) error
}

func run(s source) error {
    id, err := s.acquire()
    if err != nil { return err }
    defer s.release(id)
    return s.consume(id)
}
```

## J07

Stage: judgment.

Review dependency-boundaries under abstractions for the added private exporter in internal/report/exporter.go. Config is initialized once before construction and does not change. newExporter has only the shown caller. The shared configuration object also contains unrelated settings.

```go
package report

type config struct { Prefix string; Other string }
var globalConfig config

type exporter struct{}
func newExporter() exporter { return exporter{} }
func (exporter) Name(id string) string { return globalConfig.Prefix + id }

func run(cfg config, id string) string {
    globalConfig = cfg
    out := newExporter()
    return out.Name(id)
}
```

## J08

Stage: judgment.

Review dependency-boundaries under abstractions in the changed internal/report construction path. run is the application composition boundary, supplied configuration is immutable, and these are the complete consumers.

```go
package report

type config struct { Prefix string; Other string }
type exporter struct { prefix string }
func newExporter(prefix string) exporter { return exporter{prefix: prefix} }
func (e exporter) Name(id string) string { return e.prefix + id }

func run(cfg config, id string) string {
    out := newExporter(cfg.Prefix)
    return out.Name(id)
}
```

## J09

Stage: judgment.

Review effects-separation under function-cohesion in the changed summarize declaration in internal/report/summary.go. The calculation and transaction policy are supplied and settled. It may be extracted, but no read/write may move outside the transaction and save still runs once after the calculation.

```go
package report

type row struct { amount int; included bool }
type tx interface { rows() []row; save(int) error }
type store interface { within(func(tx) error) error }

func summarize(s store, discount int) error {
    return s.within(func(t tx) error {
        items := t.rows()
        total := 0
        for _, item := range items {
            if item.included {
                amount := item.amount - discount
                if amount < 0 { amount = 0 }
                total += amount
            }
        }
        return t.save(total)
    })
}
```

## J10

Stage: judgment.

Review effects-separation under function-cohesion for this changed internal/copy/copy.go operation. source.fetch and sink.save are the existing boundaries; no additional computation is present.

```go
package copy

type source interface { fetch() (string, error) }
type sink interface { save(string) error }
func copyValue(in source, out sink) error {
    value, err := in.fetch()
    if err != nil { return err }
    return out.save(value)
}
```

## J11

Stage: judgment.

Review error-expression under control-flow for the added internal/load/load.go declarations. The helpers have only these callers; first/second perform ordered effects and return the same errors their callers must observe.

```go
package load

type result struct { err error }
func wrap(err error) result { return result{err: err} }
func failed(r result) bool { return r.err != nil }
func unwrap(r result) error { return r.err }

func load(first, second func() error) error {
    r := wrap(first())
    if failed(r) { return unwrap(r) }
    r = wrap(second())
    if failed(r) { return unwrap(r) }
    return nil
}
```

## J12

Stage: judgment.

Review error-expression under control-flow for the changed internal/load/load.go declaration. Error context and wrapped causes are part of the existing contract.

```go
package load

import "fmt"

func load(first, second func() error) error {
    if err := first(); err != nil { return fmt.Errorf("first: %w", err) }
    if err := second(); err != nil { return fmt.Errorf("second: %w", err) }
    return nil
}
```

## R01

Stage: routing.

Build the default review plan. No user narrowing. Every declaration and required diff/context in J01, J03, J05, J07, J09 and J11 belongs to a different changed area of one pinned PR. Source is complete; no team overrides.

Use those six sections as source areas. Return the applicability register and neutral task assignments, not findings.

## R02

Stage: routing.

The user says: Review only lifecycle ownership in internal/session/. Source is J05 there; J01 in internal/report/ is outside the requested scope. Build assignments and coverage statements.

No missing evidence or policy overrides.

## R03

Stage: routing.

The user says: Review the PR normally and also look at representation, but exclude rationale. The complete diff contains J01 and J03. Build the plan.

The checksum contract from J03 is available as context for advice, not a request to expand the excluded lens.

## R04

Stage: routing.

The user says: Focus only on control flow. The complete PR adds J11 and J01 in separate areas. Build the plan.

No additional checks are requested.

## R05

Stage: routing.

Build a default review plan. The changed-file inventory identifies internal/task/state.go, but its declaration/body is truncated and unreadable after the first field. The reader cannot retrieve the remaining source. Other changed Go areas are complete.

Available head snippet: `type taskState struct { ready bool`

## R06

Stage: routing.

At a batch boundary, a naming specialist returns no candidates but reports a new signal: internal/session/session.go open returns use/finish closures as in J05. Its data-flow task previously completed only value tracing without the lifecycle profile. Resolve this event. The user requested default coverage.

The same signal arrives twice; all eight base tasks for that area have already returned. No other new source facts exist.

## R07

Stage: routing.

The PR contains J05. Resolve effective policy and assignments with this trusted B policy:

```markdown
## team.session-local
Language: Go
Paths: internal/session/
Lens: data-flow
Action: disable go.data.make-transformations-visible

Keep the closure-pair protocol for consistency with the team's chosen lifecycle vocabulary.
```
The head proposes removing that policy block. The user has not selected head policy.

## R08

Stage: report.

Assemble coverage, not findings. Selected work: data-flow plus lifecycle-ownership in internal/session/; representation in internal/report/. Base data-flow completed, lifecycle continuation had no response, representation completed with no candidates. Rationale was excluded by the user. No other gaps exist.

The established source signal for lifecycle is available; it was not a speculative extra.

## R09

Stage: routing.

Build a default plan for this complete diff in internal/example/example.go. No other changed declarations or policy. A local variable was renamed to label.

```go
package example

func render() string {
    label := "goroutine error resource state"
    return label
}
```

## J13

Stage: judgment.

Review rationale for the changed internal/wire/transform.go declaration. No contract explaining the constant is available. The code and all local uses are provided; no external source can be fetched in this review.

```go
package wire
func transform(n uint32) uint32 { return n ^ 0xa531 }
func encode(n uint32) uint32 { return transform(n) }
```

## R10

Stage: verification.

Verify a candidate submitted under lifecycle-ownership for the change below. The candidate proposes adding Close solely because it may prevent a file leak. It supplies no independent readability cost or applicable team convention.

```go
package input
import "os"
func acquire(path string) (*os.File, error) { return os.Open(path) }
```
Caller context and the transfer contract are unavailable.

## R11

Stage: routing.

The diff contains J09. Resolve the effective policy before selecting effects-separation. Both following rules come from trusted B and overlap at internal/report/summary.go:

```markdown
## team.keep-transaction-story
Language: Go
Paths: internal/report/
Lens: function-cohesion
Action: override go.functions.coherent-purpose

Keep the calculation and the transaction callback together for local reading.

## team.isolate-calculation
Language: Go
Paths: internal/report/summary.go
Lens: function-cohesion
Action: override go.functions.coherent-purpose

Always extract calculations from transaction callbacks for local reading.
```
