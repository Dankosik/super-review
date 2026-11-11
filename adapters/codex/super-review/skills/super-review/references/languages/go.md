# Go context

**Compatibility.** Read the nearest enclosing `go.mod` at H and the relevant
file's build constraints. The module's `go` directive is the starting language
and library baseline; a newer local toolchain, `toolchain` preference, or sibling
module does not by itself authorize newer syntax or APIs here. Account for
version/platform-specific files when relevant. Do not assume mutually exclusive
implementations coexist. Missing version or consumer context limits the advice;
it is not permission to upgrade or run a build.

**Craft.** Read the source against how an experienced Go author would write the
same operation today, under the module's baseline, by the defaults of Effective
Go, Go Code Review Comments and the Google Go Style Guide. Their core: names that
lean on the package qualifier; a plain function before a new type and a concrete
type before an interface, with interfaces usually declared where they are
consumed; useful zero values; errors returned last, annotated when that adds
information and handled once; the normal path at the left edge; a context passed
rather than stored; goroutines whose end reads clearly (how an existing end
reads, not a search for leaks); and the standard library's
vocabulary, within the baseline, before the project's own. Where the source falls short of this
and the gap costs a reader or the next change something you can name, report it,
however small.

**Idiom owners.** Idiom is evidence inside the assigned lens, not a separate
pass. Early returns, `switch` forms and error checks belong to control-flow, and
a check for a case the code already rules out to its defensive-checks profile;
scope, slice/map sharing and value versus pointer to data-flow; a standard or
project operation replacing custom mechanics to abstractions, and knowledge
repeated across copies to duplication; signatures,
results, `context` placement and standard interfaces to api-clarity; defined
types, zero values and constant sets to representation; `MixedCaps`, initialisms,
receiver names and package-qualified names to naming; helpers, wrappers,
embedding and interfaces to function-cohesion and abstractions; the project's
established way of handling a concern to conventions; where a declaration
lives to placement. Report an idiom under the lens that owns it and leave the
others to their owners.

**Judgment.** An idiom earns a recommendation by what it removes: a branch, a
variable, a repeated qualifier, a second check, another place to edit. Optimize
the reader's understanding of the package and actual calls, not resemblance to
another language's clean-code patterns. Ordinary functions,
small capability interfaces, multiple returns, useful zero values, explicit
errors, and local mutation can already express the solution well. A struct does
not need an interface twin, constructor, getter layer, or immutable replacement
by default. Existing team rules govern style; external guides are context, not
silently adopted policy. A committed linter configuration such as
`.golangci.yml` is the project's adopted choice: do not recommend what it denies,
and leave listing its violations to the project's own checks. Do not emit
formatting/import-order chores or spelling preferences without a concrete cost
or an effective team rule. Never run tools such as gofmt, goimports or linters
during the review.

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
receiver and promoted method sets; values the Code Review Comments copying rule
covers (methods on `*T`, `sync` types); error identity and matching; ordering and
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
