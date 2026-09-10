> Historical design/evaluation record. For version 3 source access and installation, see [native integrations](native-integrations.md).

# Go-specific review judgment

Audited against `34acd519d93e79c2b1a1324ed974bbb58861c3bc` on 2026-09-09.
This is instruction development, not a review of that repository for Go defects.
The existing eight base lenses, two conditional lenses, four owner profiles,
eleven rule IDs, permissions, models, and waiting mechanics remain unchanged.

## What the audit changes

The shared Go context already covered version awareness, ordinary Go, and semantic
preservation. The gap was precision: these principles did not always discriminate
between a useful Go rewrite and an attractive but incompatible one. The additions
are targeted decisions, not a generic Go checklist or another specialist.

| Decision | Instruction owner | Important counterexample |
| --- | --- | --- |
| Reuse a supported operation instead of custom mechanics | Go context, abstractions | A nil-sensitive equality or domain adapter is not the generic operation. |
| Choose a function, capability interface, or type parameter | abstractions | A useful generic return type and deliberate factory interface must survive. |
| Express results without unnecessary output bookkeeping | api-clarity | Intentional mutation and named results updated by defer are real contracts. |
| Preserve pointer, zero, and representation meaning | data-flow, representation | Optional false is not the same as absent; a shallow copy still shares data. |
| Make failure paths direct without inventing new behavior | error-expression | Wrapping, chain matching, and direct identity comparison are not interchangeable. |
| Clarify ownership and package boundaries | lifecycle-ownership, dependency-boundaries | New files do not create package privacy; request metadata is not a service locator. |
| Document the usable Go contract | rationale and its selection signal | Caller obligations may need documentation even when the implementation is simple. |
| Verify the actual transformed contract | verification | A happy-path call does not cover promoted methods, indirect users, or defer timing. |

Already strong: short scoped names, package-qualified naming, ordinary error checks,
local linear handlers, meaningful one-implementation interfaces, and keeping clear
code. Naming, duplication, change-locality, and effects-separation resources did
not need another rewrite. Their existing decisions and independent ownership stay.

## Source basis and limits

Primary sources checked during development:

- [Go review comments](https://go.dev/wiki/CodeReviewComments): consumer interfaces,
  named results, receiver contracts, synchronous functions, and idiomatic naming.
- [Google Go principles](https://google.github.io/styleguide/go/guide): reader clarity
  before concision; deliberate complexity rather than automatic flattening.
- [When to use generics](https://go.dev/blog/when-generics): shared algorithms/type
  relationships versus interface method dispatch and genuinely dynamic reflection.
- [Working with errors](https://go.dev/blog/go1.13-errors): wrapping is an API choice;
  wrapped matching differs from inspecting only the top-level error.
- [Errors are values](https://go.dev/blog/errors-are-values): improve error expression
  when repeated mechanics really share a policy, not by counting error checks.
- [Effective Go](https://go.dev/doc/effective_go#embedding): embedding promotes methods;
  explicit delegation can intentionally expose a narrower surface.
- [Go module reference](https://go.dev/ref/mod#go-mod-file-go): the nearest module and
  its baseline matter; a developer's newer toolchain is not a compatibility promise.
- [slices documentation](https://pkg.go.dev/slices#Equal) and
  [Go 1.21 notes](https://go.dev/doc/go1.21): exact equality semantics and availability.
- [context documentation](https://pkg.go.dev/context): request metadata versus hidden
  ordinary function options; preserve legitimate protocol adapters.
- [Go doc comments](https://go.dev/doc/comment): document the caller's usable contract.

External style guides do not override effective team rules. Their test, correctness,
security, tooling, and performance advice is not imported into this review scope.
No model must fetch these sources on every PR. No speed/quality increase is measured
by this audit; `evals/go/go-idioms-evaluation.md` in the source repository specifies
what evidence is still needed. The source links are documentation, not permissions.
