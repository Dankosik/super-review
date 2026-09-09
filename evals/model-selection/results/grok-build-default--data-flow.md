## C-data-flow-1: Use distinct variables for each transformation stage in Export

- Lens and task: data-flow (go.data.make-transformations-visible)
- Snapshot: PR https://github.com/example/model-fixture/pull/1 (offline), H bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D cccccccccccccccccccccccccccccccccccccccc
- Location: internal/exporter/address.go, Export (lines 5-11 at H)
- Rules: go.data.make-transformations-visible (effective default; no team overrides supplied)
- Observation and cost: `data` is declared once then reassigned after each stage (`TrimSpace`, `ToUpper`, `QueryEscape`), so the same name successively holds the raw address, the trimmed value, the uppercased value, and the escaped value. Readers must track the current stage of `data` to follow the distinct representations produced by the address pipeline.
- Transformation and benefit: Replace the single temporary with one named value per stage (smallest change that preserves the exact operations and order):

  ```go
  func Export(row Row, writer Writer) error {
      address := row.Address
      trimmed := strings.TrimSpace(address)
      upper := strings.ToUpper(trimmed)
      escaped := url.QueryEscape(upper)
      return writer.WriteAddress(escaped)
  }
  ```

  Each intermediate now visibly carries its origin and the effect of the prior step.
- Counterargument: The function body is short and linear; a single rebinding temporary is ordinary Go for sequential string work and the four names could be viewed as unnecessary verbosity.
- Preserve: exact call order, the final value passed to WriteAddress, string immutability (no shared storage), the Row/Writer contracts, and the error return.
- Affected files: internal/exporter/address.go (local change inside one new declaration; no other files inspected)
- Missing context: none (whole declaration supplied; no callers in scope)
