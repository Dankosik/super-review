## C-duplication-1: Centralize the shared free-shipping threshold

- Lens and task: Duplication — unify shared pricing knowledge.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbb…`, comparison D `cccc…`.
- Location: `internal/shipping/fees.go`, `Fee` and `CartMessage`, lines 2–8.
- Rules: Pricing owns one shared free-shipping threshold; no team overrides supplied.
- Observation and cost: The `15000` threshold is duplicated in two pricing paths. Changing the threshold requires coordinated edits and can leave checkout fees and cart messaging inconsistent.
- Transformation and benefit: Introduce one small shipping/pricing operation or named constant representing the shared threshold, used by both functions.
- Counterargument: The repetition is currently only one comparison and remains easy to read locally.
- Preserve: Keep the existing inclusive threshold (`>= 15000`), return values, and effect ordering.
- Affected files: Local change in `internal/shipping/fees.go`.
- Missing context: none.

Inspected all supplied Go files for duplication. The two eligibility predicates are intentionally independent purchasing and supplier-onboarding policies, so they should not be unified.

Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.

completed.
