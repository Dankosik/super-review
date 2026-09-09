# Go context

Read the relevant module's `go.mod` and follow its supported language version.
For nested modules, use the nearest enclosing module; do not impose the reviewer's
installed Go version. If unavailable, keep version-dependent advice conditional.

Evaluate Go idioms within each assigned lens rather than launching another broad
idiomatic-code pass. Prefer ordinary Go that exposes intent: useful package names,
concrete values, narrow consumer interfaces where justified, explicit errors,
and visible effects. A single implementation can justify an interface that
isolates a real dependency.

When assessing a proposed simplification, preserve relevant distinctions such
as nil versus empty, error identity, receiver method sets, shared slice/map
storage, and effect ordering. This is a constraint on the recommendation, not
an invitation to hunt for unrelated bugs or add tests.

Check existing project helpers, the supported standard library, and declared
dependencies before recommending new mechanics. A library operation helps when
its semantics match and its name clarifies the work; a dependency is not justified
merely to shorten a few lines. Do not recommend a newer language feature without
checking module compatibility.

Background sources: [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)
and [Effective Go](https://go.dev/doc/effective_go). Use these as language context,
not a mandate to apply every historical suggestion to every project.
