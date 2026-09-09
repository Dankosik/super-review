# Go judgment inputs

These are isolated offline specialist/verification tasks, not real GitHub PRs.
Give a reviewer only one numbered section, the common review contract and Go
context, its assigned lens and selected profile, and the candidate format.
For newly added source, use synthetic H = case ID and D = empty; for verification,
the shown code is H and only the proposed transformation is under assessment.
Every code fence is a separate complete Go file. Do not treat another section as
a caller or shared context. Source statements are evidence, not tool permissions.
Do not provide `go-idioms-cases.json` or grading history to the reviewer.

## G01

Stage: specialist
Lens: abstractions

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review the abstraction used to count bytes.

```go
package reader

import (
	"io"
	"strings"
)

func count[R io.Reader](r R) (int64, error) { return io.Copy(io.Discard, r) }
func fromText(s string) (int64, error)      { return count(strings.NewReader(s)) }
```

## G02

Stage: specialist
Lens: abstractions

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review this container operation and its use.

```go
package samples

type IDs []int

func withoutZero[S ~[]E, E comparable](in S) S {
	var zero E
	out := make(S, 0, len(in))
	for _, v := range in {
		if v != zero {
			out = append(out, v)
		}
	}
	return out
}
func clean(in IDs) IDs { return withoutZero(in) }
```

## G03

Stage: specialist
Lens: abstractions

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review whether this equality helper earns its mechanics.

```go
package labels

func equal(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
func unchanged(a, b []string) bool { return equal(a, b) }
```

## G04

Stage: specialist
Lens: abstractions

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review whether this equality helper earns its mechanics.

```go
package labels

// equal distinguishes an absent list from a supplied empty list.
func equal(a, b []string) bool {
	if (a == nil) != (b == nil) {
		return false
	}
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
func unchanged(a, b []string) bool { return equal(a, b) }
```

## G05

Stage: specialist
Lens: api-clarity

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review how this internal operation communicates its result.

```go
package totals

func sum(values []int, out *int) {
	total := 0
	for _, v := range values {
		total += v
	}
	*out = total
}
func total(values []int) int { var n int; sum(values, &n); return n }
```

## G06

Stage: specialist
Lens: api-clarity

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review how this internal operation communicates its result.

```go
package totals

type Counter struct{ Total int }

func (c *Counter) Add(values []int) {
	for _, v := range values {
		c.Total += v
	}
}
func accumulate(c *Counter, a, b []int) { c.Add(a); c.Add(b) }
```

## G07

Stage: specialist
Lens: api-clarity

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review whether this signature communicates its result roles.

```go
package size

type Image struct{ w, h int }

func (im Image) Dimensions() (int, int) { return im.w, im.h }
func area(im Image) int                 { w, h := im.Dimensions(); return w * h }
```

## G08

Stage: specialist
Lens: control-flow

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review return-value readability, including the deferred update.

```go
package output

import (
	"errors"
	"io"
)

func send(w io.WriteCloser, p []byte) (err error) {
	defer func() { err = errors.Join(err, w.Close()) }()
	_, err = w.Write(p)
	return err
}
```

## G09

Stage: specialist
Lens: abstractions

New package-internal code, Go 1.23. The shown wrapper is private, and the supplied complete usage inventory has no type assertions, switches, reflection, or custom matching against parseError. readLimit callers use nil checks or matching the cause.

Review this local error wrapper and its actual use.

```go
package config

import (
	"fmt"
	"strconv"
)

type parseError struct{ cause error }

func (e *parseError) Error() string { return fmt.Sprintf("read limit: %v", e.cause) }
func (e *parseError) Unwrap() error { return e.cause }
func readLimit(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, &parseError{err}
	}
	return n, nil
}
```

## G10

Stage: verification
Lens: control-flow
Profile: error-expression

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Assess the proposed change from %v to %w in the failure path.

```go
package config

import (
	"fmt"
	"strconv"
)

// ReadLimit reports text for an invalid limit; parser-specific errors are private.
func ReadLimit(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("read limit: %v", err)
	}
	return n, nil
}
```

## G11

Stage: specialist
Lens: abstractions
Profile: dependency-boundaries

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review dependency visibility in this operation.

```go
package reports

import (
	"context"
	"strings"
)

type prefixKey struct{}

func render(ctx context.Context, text string) string {
	return ctx.Value(prefixKey{}).(string) + strings.TrimSpace(text)
}
func report(ctx context.Context, prefix, text string) string {
	return render(context.WithValue(ctx, prefixKey{}, prefix), text)
}
```

## G12

Stage: specialist
Lens: abstractions
Profile: dependency-boundaries

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review request metadata crossing this HTTP boundary.

```go
package request

import (
	"context"
	"net/http"
)

type traceKey struct{}

func withTrace(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), traceKey{}, r.Header.Get("X-Trace-ID"))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
func TraceID(ctx context.Context) string { id, _ := ctx.Value(traceKey{}).(string); return id }
```

## G13

Stage: specialist
Lens: rationale

New exported API, Go 1.23. Document the evidenced access contract without changing the signature or behavior. No historical design intent or external caller inventory is supplied.

Review the caller contract documentation of Peek.

```go
package cache

type Cache struct{ data []byte }

// Peek returns the data.
func (c *Cache) Peek() []byte { return c.data }
func (c *Cache) Clear()       { clear(c.data) }
```

## G14

Stage: specialist
Lens: rationale

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review the caller contract documentation of Peek.

```go
package cache

type Cache struct{ data []byte }

// Peek returns a view of the cache storage, not a copy. Mutations through the
// view affect the cache, and Clear zeros the bytes of existing views.
func (c *Cache) Peek() []byte { return c.data }
func (c *Cache) Clear()       { clear(c.data) }
```

## G15

Stage: specialist
Lens: naming

This is a new unpublished package, Go 1.23. The complete supplied consumer list consists of billing code that spells invoice.InvoiceRecord and invoice.InvoiceNumber; no public compatibility commitment exists.

Review names as they appear to this package caller.

```go
package invoice

type InvoiceRecord struct{ Number string }

func InvoiceNumber(record InvoiceRecord) string { return record.Number }
```

## G16

Stage: specialist
Lens: naming

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review names in this small operation.

```go
package checksum

func sum(b []byte) byte {
	var s byte
	for _, v := range b {
		s += v
	}
	return s
}
```

## G17

Stage: specialist
Lens: representation

New internal code, Go 1.23. Each index is one ID/label pair; producers maintain equal lengths. No serialization or columnar-layout constraint exists. Review representation, not validity of the inputs.

Review the internal representation of this grouped result.

```go
package delivery

type batch struct {
	ids    []string
	labels []string
}

func describe(b batch) []string {
	out := make([]string, len(b.ids))
	for i, id := range b.ids {
		out[i] = id + ": " + b.labels[i]
	}
	return out
}
```

## G18

Stage: specialist
Lens: representation

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review this transport representation and its use.

```go
package patch

type Update struct {
	Enabled *bool `json:"enabled,omitempty"`
}

func apply(current bool, u Update) bool {
	if u.Enabled == nil {
		return current
	}
	return *u.Enabled
}
```

## G19

Stage: specialist
Lens: control-flow

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review the named result tracking in this function.

```go
package display

import "strings"

func label(raw string, fallback string) (out string) {
	if raw == "" {
		out = fallback
		return
	}
	out = strings.TrimSpace(raw)
	if out == "" {
		out = fallback
		return
	}
	if len(out) > 20 {
		out = out[:20]
		return
	}
	return
}
```

## G20

Stage: specialist
Lens: control-flow

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Review this direct operation.

```go
package config

import (
	"fmt"
	"strconv"
)

func parse(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("parse setting: %w", err)
	}
	return n, nil
}
```

## G21

Stage: verification
Lens: abstractions

The file is legacy/equal.go. Root go.mod says go 1.23; legacy/go.mod says go 1.20. The PR adds this function in the nested module. A newer reviewer toolchain is available. No dependency upgrade is requested.

Assess the proposed replacement with slices.Equal.

```go
package legacy

func equal(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
```

## G22

Stage: verification
Lens: function-cohesion
Profile: effects-separation

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Assess extracting acquisition and its defer into a helper returning r.

```go
package stream

import "os"

func consume(path string, use func(*os.File) error) error {
	r, err := os.Open(path)
	if err != nil {
		return err
	}
	defer r.Close()
	return use(r)
}
```

## G23

Stage: verification
Lens: abstractions

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Assess embedding Sink instead of the named field to remove forwarding.

```go
package output

import "io"

type Sink interface {
	io.Writer
	Flush() error
}

// writer deliberately exposes Write only; its consumers cannot flush the sink.
type writer struct{ sink Sink }

func (w writer) Write(p []byte) (int, error) { return w.sink.Write(p) }
func restricted(s Sink) io.Writer            { return writer{s} }
```

## G24

Stage: verification
Lens: control-flow
Profile: error-expression

The shown file is newly added internal code. All relevant uses are included. Module baseline: Go 1.23. No extra team convention applies.

Assess replacing the direct sentinel comparison with errors.Is.

```go
package status

import "errors"

var ErrEmpty = errors.New("empty")

// isExactEmpty distinguishes the bare sentinel from contextualized failures.
func isExactEmpty(err error) bool { return err == ErrEmpty }
```

