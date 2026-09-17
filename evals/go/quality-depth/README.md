# Go quality-depth evaluation

Maintainer-only research and evaluation material. Baseline inspected on
2026-09-17: `f5a67021bbc54995648fe032d07bccdb88a32fa6`. No canonical runtime
instruction, rule ID, default routing, adapter, model selection or dependency is
changed. This corpus tests existing decisions before proposing more instruction
text. It is not a new broad Go-idioms pass or a mandatory API checklist.

## What was established

The baseline's Go context and lenses already cover package-qualified names,
consumer capability interfaces versus interface twins, concrete returns,
embedding/method sets, useful zero values, ordinary results, local mutation,
generics, error identity, context values and extraction/defer boundaries.
Absence of an API name does not establish a missing rule. The original
`go-idioms-cases.json`, `aspect-cases.json` and `instruction-quality-cases.json`
are proposed/unexecuted evidence, not measured Go-model quality. The historical
`quality-judgment` comparison is narrower and is not a Go-specific result.

One source-backed correction is in `../cases.json`: `mixed-language` previously
expected Go-only review although TypeScript is supported by the current language
router. It now specifies a default routing stage; `go-only-language` contrasts
explicit user narrowing. Both retain generated/test/vendor and unsupported-JS
exclusions. File inventories do not imply completed source reviews.

## New decisions to exercise

Paths in this table are relative to `skills/super-review/references/`. They name
existing owners, not proposed new modules. Each numbered input has its own source,
consumer/version facts and question. `cases.json` separately records the useful
change or retention expectation, preservation constraints and source IDs.

| Inputs | Existing instruction owner | Question and contrast | Distinct constraint/source |
| --- | --- | --- | --- |
| GD01/GD02 | `lenses/api-clarity.md` | Does construction clarify real calls, or hide required inputs in options? Ordinary parameters versus useful defaults/options/zero value. | Omitted/nil/empty, option precedence, capture/aliasing, released API; [specification][spec], [Google options guidance][google-options]. |
| GD03/GD04 | `lenses/abstractions.md`, `lenses/data-flow.md` | Does a standard collection operation remove mechanics without moving observation? Sorted materialization versus a deferred live view. | Eager snapshot, replay, nil output, element ownership; [iter][iter], [maps][maps], [slices][slices], [Go 1.23][go123]. |
| GD05/GD06 | `lenses/abstractions.md` | Is this byte transfer or an application record protocol? `io.Copy` versus a meaningful explicit loop. | Partial data/error, EOF, counts, dispatch, delimiter and callback order; [io][io], [bufio][bufio]. |
| GD07/GD08 | `profiles/lifecycle-ownership.md` | Can readers distinguish start, cancellation and completion? Boolean-selected control protocol versus an explicit streaming subscription. | Cancel is not join; channel direction/close/return timing; [context][context], [specification][spec], [review comments][review-comments]. |
| GD09/GD10 | `profiles/lifecycle-ownership.md` | Who owns `sql.Tx` and who merely participates? Callback tuple versus a local transaction with a meaningful helper. | Commit errors, rollback/defer order, no reads/writes moved across the boundary; [transactions][transactions], [database/sql][sql]. |
| GD11/GD12 | `profiles/dependency-boundaries.md` | Does an application caller need HTTP representation? A synthetic request in a job versus a genuinely transport-specific `ServeContent` adapter. | Query/absence semantics, context, error identity, wire behavior, seek/close lifetime; [net/http][http], [context][context]. |
| GD13/GD14 | `languages/go.md` through `lenses/abstractions.md` | Is the replacement supported for this file and consumers? Version-tagged implementation with a fallback versus an untagged nested legacy module. | Nearest module, file constraints and public API; toolchain preference is not permission to raise the minimum; [toolchains][toolchains], [Go 1.23][go123]. |
| GD15/GD16 | `lenses/abstractions.md` | Does `maps.Clone` preserve the actual copy contract? Nil-preserving shallow snapshot versus an always-writable result. | Nil/empty and shared pointees, no deep-copy promise; [maps][maps], [specification][spec]. |
| GD17 | `profiles/lifecycle-ownership.md` | Does extraction leave the iterator's stop operation with its consumer? | Single-use/early stop and defer scope; [iter][iter], [specification][spec]. |
| GD18 | `lenses/data-flow.md` | Can allocating selection be replaced with in-place deletion? | Existing aliases and non-nil empty result; [slices][slices]. |

The baseline module in most inputs is Go 1.23, not a new minimum for Super Review
users. GD13/GD14 explicitly exercise 1.22 consumers. The fixtures require no chi,
Gin, Echo, pgx, GORM, database driver or evaluation service.

## Retained controls, not duplicate rules

Keep existing G01/G02 (generic type relationship), G03/G04 (slice equality and
nil/empty), G09/G10/G24 (wrapper identity and matching), G11/G12 (context options
versus request metadata), G13/G14 (borrowed view), G15/G16 (names), G21 (nested
baseline), G22/G23 (defer and promoted methods), Q05/Q06 (join versus CSV) and
J09 (calculation inside a transaction) as unchanged control candidates. Select
only controls affected by a later proposed instruction change, not the entire
historical library. Useful error wrapping and a concrete consumer interface
remain valid even with one implementation; neither layers nor newer APIs are
inherently improvements.

The language [specification][spec] and package documentation establish semantics;
release notes establish availability. [Code Review Comments][review-comments]
and [Google Go Style][google-options] supply design reasoning, not silently
adopted team policy. Google explicitly describes its best-practices document as
non-normative. Sources below were revisited on 2026-09-17. Their live/latest pages
must not override the supported version in an input. This corpus makes no claim
about the latest Go release and needs no newly released language feature.

## Conditional library follow-ups (not implemented profiles)

These remain separate research directions only after an owning `go.mod`, imports,
resolved dependency version, file constraints and consumer contracts establish
use. They do not add dependencies, automatic routing or migration requirements.

| Library | Mechanism to inspect, only when established | Primary reference |
| --- | --- | --- |
| chi v5 | Existing `http.Handler`/middleware composition versus a duplicate private adapter protocol. | [chi package documentation](https://pkg.go.dev/github.com/go-chi/chi/v5) |
| Gin | HTTP `*gin.Context` versus downstream `Request.Context()` and explicit operation data. Keep legitimate transport work in the adapter. | [Gin context documentation](https://gin-gonic.com/en/docs/server-config/context/) |
| Echo v4 | Handler error returns and `HTTPErrorHandler` versus redundant local result/error plumbing. Resolve major version first. | [Echo v4 documentation](https://pkg.go.dev/github.com/labstack/echo/v4) |
| pgx v5 | Manual wrappers versus `BeginFunc`/`BeginTxFunc`; preserve callback execution and transaction error/context contracts. | [pgx documentation](https://pkg.go.dev/github.com/jackc/pgx/v5) |
| GORM | Existing `Transaction` scope and the API variant already in use; no mandated generics or repository migration. | [GORM transactions](https://gorm.io/docs/transactions.html) |

These are questions for possible version-specific evidence, not findings that a
library or current specialized profile is missing from a consumer project.

## Run protocol

Follow [the bounded evaluation protocol](../../README.md). First run selected
new inputs against unchanged canonical instructions. With a native independent
worker mechanism, give each worker the packet preamble and one numbered section,
`references/review-contract.md`, `references/languages/go.md`, its declared lens
and optional profile, and `assets/finding-template.md` (also verification guidance
for verification stages). Pin all instruction/source identities. No grader,
source-ID table, research verdict, other case or peer output belongs in a reviewer
packet. A sequential author audit is not independent model evidence.

A baseline failure must distinguish an observed reader burden from an unsafe or
uncertain remedy. Only then propose a bounded edit to the owning canonical file
and compare baseline/candidate in fresh contexts with the same source, scope,
policy, actual model/effort and tools. Vary order and retain failures and missing
runs as well as successes. An alternative concrete remedy can satisfy an
opportunity; the rubric is not a required phrase/API or minimum finding count.

Grade supported burdens, useful remedies, retained clear code, unsupported churn,
compatibility, scope/coverage and forbidden actions separately. Record raw outputs,
traces, instruction/packet hashes, actual model/effort, host, repetitions and
per-case results. Mark unavailable runs `NOT RUN`; mechanical compilation cannot
establish reader benefit or behavioral equivalence. Existing public compatibility
uncertainty must not be fabricated away.

## Mechanical checks

```sh
python3 tests/go_quality_depth_test.py
bun test tests/go-quality-depth.test.ts
bun run typecheck
```

The Python suite is the substantive integrity check; the thin Bun wrapper follows
the existing frontend-test convention. It checks schema, sections, source paths,
owner metadata, pairs/guards, baseline context and routing fixtures. It neither
executes source nor invokes a model. No Go compiler is required by that CI test.
Optional maintainer compilation can materialize each section's files in a fresh
temporary directory and run `GOTOOLCHAIN=local GOPROXY=off GOSUMDB=off GOWORK=off
go build ./...` separately per `go.mod`. This is fixture compilation, never
permission for a reviewing model to execute user source. A new compiler does not
validate the oldest supported toolchain; record that separately.

See [validation.md](validation.md) for actual execution and limitations. No
unchanged install-tree rebuild, release, default-profile promotion or Go baseline
upgrade is part of this evaluation-only change.

[spec]: https://go.dev/ref/spec
[google-options]: https://google.github.io/styleguide/go/best-practices#variadic-options
[iter]: https://pkg.go.dev/iter
[maps]: https://pkg.go.dev/maps
[slices]: https://pkg.go.dev/slices
[go123]: https://go.dev/doc/go1.23
[io]: https://pkg.go.dev/io
[bufio]: https://pkg.go.dev/bufio#Reader.ReadString
[context]: https://pkg.go.dev/context#CancelFunc
[review-comments]: https://go.dev/wiki/CodeReviewComments
[transactions]: https://go.dev/doc/database/execute-transactions
[sql]: https://pkg.go.dev/database/sql#Tx
[http]: https://pkg.go.dev/net/http#ServeContent
[toolchains]: https://go.dev/doc/toolchain
