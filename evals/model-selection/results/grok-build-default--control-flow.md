## C-control-flow-1: Flatten nested conditionals in Publish to show main path directly

- Lens and task: control-flow / go.flow.show-main-path
- Snapshot: PR https://github.com/example/model-fixture/pull/1, H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D: cccccccccccccccccccccccccccccccccccccccc
- Location: internal/delivery/publish.go, Publish (lines 3-14 at H as supplied)
- Rules: effective default (no team overrides)
- Observation and cost: Audit is unconditional. The rest is `if enabled { if body != "" { return emit } else { return nil } } else { return nil }`. The emit (the only non-nil outcome) is buried under two levels of nesting with two identical else-nil arms. The main path is not visually prominent.
- Transformation and benefit: Keep the audit, then
  ```
  if enabled && body != "" {
      return s.Emit(body)
  }
  return nil
  ```
  One early return at the first indent level for the effectful case; the two nil cases collapse to the final return. Removes redundant else and one nesting level while keeping the code short and linear.
- Counterargument: The original structure makes the three distinct cases (disabled, enabled-but-empty, enabled-with-body) explicit at the cost of extra indentation. However, all three paths are simple returns with no side effects after the audit, so the nesting does not protect ordering or cleanup.
- Preserve: Audit remains the first statement and is always executed. Emit is invoked at most once with its error returned unchanged. No change to call counts or effect order. IsAllowed is a separate declaration and is untouched.
- Affected files: internal/delivery/publish.go (local change only)
- Missing context: none (full declaration supplied for the scoped file)
