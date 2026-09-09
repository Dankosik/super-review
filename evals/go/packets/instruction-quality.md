# Instruction-quality inputs

Evaluator: feed only the selected input below to a fresh review context, with
its assigned runtime instructions. Do not send this whole document or the
separate expectations file. These are isolated synthetic Go 1.23 snapshots,
not a live GitHub acquisition or end-to-end review. Source is read-only; do not
execute it. In Q01-Q08, the displayed non-test source is newly added at H and
absent at D. Unshown callers are unavailable, not assumed absent.

## Q01

Lens: function-cohesion. File: internal/render/totals.go.

```go
package render

import "strconv"

type totals struct{ net, tax int64 }

func renderTotals(t totals) string {
    prefix := labelStart()
    net := renderNet(t)
    tax := renderTax(t)
    return joinParts(prefix, net, tax)
}
func labelStart() string { return "net=" }
func renderNet(t totals) string { return strconv.FormatInt(t.net, 10) }
func renderTax(t totals) string { return strconv.FormatInt(t.tax, 10) }
func joinParts(prefix, net, tax string) string {
    return prefix + net + ",tax=" + tax
}
```

## Q02

Lens: function-cohesion. File: internal/accounts/keys.go.

```go
package accounts

type store interface { Get(string) string; Delete(string) }

// accountKey owns the stored key representation shared by account operations.
func accountKey(tenantID, accountID string) string {
    return tenantID + ":" + accountID
}
func find(s store, tenantID, accountID string) string {
    return s.Get(accountKey(tenantID, accountID))
}
func remove(s store, tenantID, accountID string) {
    s.Delete(accountKey(tenantID, accountID))
}
```

## Q03

Lens: duplication. File: internal/display/labels.go.

```go
package display

import (
    "strconv"
    "strings"
)

// Display labels follow presentation policy. Audit values follow log encoding
// policy. Neither policy owns the other's representation.
func displayLabel(name string) string { return label(name, true, false) }
func auditValue(name string) string { return label(name, false, true) }
func label(name string, trim, quote bool) string {
    if trim { name = strings.TrimSpace(name) }
    if quote { name = strconv.Quote(name) }
    return name
}
```

## Q04

Lens: duplication. File: internal/importer/codes.go.

```go
package importer

import "strings"

// Both import paths store the same canonical identifier representation.
func canonicalCode(raw string) string {
    return strings.ToUpper(strings.TrimSpace(raw))
}
func csvCode(raw string) string { return canonicalCode(raw) }
func formCode(raw string) string { return canonicalCode(raw) }
```

## Q05

Lens: abstractions. File: internal/render/tags.go.

```go
package render

import "strings"

func joinedTags(tags []string) string {
    var out strings.Builder
    for i, tag := range tags {
        if i > 0 { out.WriteString(",") }
        out.WriteString(tag)
    }
    return out.String()
}
```

## Q06

Lens: abstractions. File: internal/render/csv.go.

```go
package render

import (
    "encoding/csv"
    "strings"
)

func csvRecord(fields []string) (string, error) {
    var out strings.Builder
    writer := csv.NewWriter(&out)
    if err := writer.Write(fields); err != nil { return "", err }
    writer.Flush()
    if err := writer.Error(); err != nil { return "", err }
    return out.String(), nil
}
```

## Q07

Lens: change-locality. These two files are in the same package.

File: internal/export/archive.go.

```go
package export

// Header values for a format have one shared representation in this package.
func archiveHeader(format string) string {
    switch format {
    case "text": return "text/plain"
    case "json": return "application/json"
    default: return "application/octet-stream"
    }
}
```

File: internal/export/download.go.

```go
package export

func downloadHeader(format string) string {
    switch format {
    case "text": return "text/plain"
    case "json": return "application/json"
    default: return "application/octet-stream"
    }
}
```

## Q08

Lens: change-locality. These two files are in the same package.

File: internal/export/path.go.

```go
package export

func extension(format string) string {
    switch format {
    case "text": return ".txt"
    case "json": return ".json"
    default: return ".bin"
    }
}
```

File: internal/export/download.go.

```go
package export

func mediaType(format string) string {
    switch format {
    case "text": return "text/plain"
    case "json": return "application/json"
    default: return "application/octet-stream"
    }
}
```

## Q09

Stage: candidate verification. Use the contract and verification instructions.
The following declaration is newly added at H in internal/names/first.go:

```go
package names

func First(names []string) string { return names[0] }
```

Candidate C-data-1 proposes returning an empty string for empty input. Its only
stated benefit is preventing an index panic. There are no supplied requirements
for empty input, callers, or effective team rules about this operation. Decide
whether this belongs in Super Review's implementation recommendations. Do not
execute the code or design a test.

## Q10

Stage: specialist handoff. An orchestrator is assigning data-flow for a pinned
Go PR. Assume the adapter has a working reader and fresh child contexts; model
selection and permissions are already resolved. Produce only the child assignment
and required skill-resource paths. The parent has a hypothesis that copying the
map would be clearer, but has not verified the supporting callers. An unrelated
specialist has already submitted a report that was not requested for this task.
Use symbolic B/H/D and scope identifiers; do not start tools or invent findings.

## Q11

Stage: candidate verification. A PR changes only the user-facing wording of an
error in internal/parser/parse.go. Candidate C-flow-1 cites an unchanged helper
in another package and recommends flattening its branches. The candidate's
own evidence says that helper is neither called by the changed declaration nor
needed for the proposed wording change. The helper's branches could be made
shorter. Decide its disposition within this PR's Super Review.
