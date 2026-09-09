# Go context

**Compatibility.** Read the nearest enclosing `go.mod` at H and the relevant
file's build constraints. The module's `go` directive is the starting language
and library baseline; a newer local toolchain, `toolchain` preference, or sibling
module does not by itself authorize newer syntax or APIs here. Account for
version/platform-specific files when relevant. Do not assume mutually exclusive
implementations coexist. Missing version or consumer context limits the advice;
it is not permission to upgrade or run a build.

**Judgment.** Apply Go knowledge inside the assigned lens, not in an extra broad
idiom pass. Optimize the reader's understanding of the package and actual calls,
not resemblance to another language's clean-code patterns. Ordinary functions,
small capability interfaces, multiple returns, useful zero values, explicit
errors, and local mutation can already express the solution well. A struct does
not need an interface twin, constructor, getter layer, or immutable replacement
by default. Existing team rules govern style; external guides are context, not
silently adopted policy. Do not emit formatting/import-order chores or spelling
preferences without a concrete cost or an effective team rule. Never run tools
such as gofmt or goimports during the review.

**Reuse.** Actively compare handwritten mechanics implicated by the change with
existing project helpers and supported standard-library operations, including
ordinary string, slice, map, and I/O operations. Identify the exact operation
and why its contract expresses the work more directly; keep domain adaptation.
A familiar loop can beat a callback or iterator pipeline. Newer syntax, generics,
or a dependency is not an improvement by itself. Establish availability and the
relevant semantics from reliable language knowledge and permitted evidence;
when uncertain, narrow or withhold that replacement rather than inventing an API
or requesting broader tools. Do not require a web/tutorial lookup on every PR.

**Preservation.** Inspect the properties implicated by the proposed change, not
a bug checklist: nil versus empty and absent versus zero; sharing and mutation;
receiver and promoted method sets; error identity and matching; ordering and
short-circuiting; defer scope and resource lifetime. A shallow copy is not deep
independence. A public rename, type/signature change, embedding change, or new
wrapped error can change a contract even when the example call still looks right.
Explain the relevant constraint concretely, without claiming tested equivalence,
performance gains, or coverage of excluded tests and generated code.

Background: [Go review comments](https://go.dev/wiki/CodeReviewComments),
[Go style principles](https://google.github.io/styleguide/go/guide),
[modules](https://go.dev/ref/mod#go-mod-file-go), and
[Effective Go](https://go.dev/doc/effective_go). These are engineering context;
version-sensitive details require the supported baseline, not historical examples.
