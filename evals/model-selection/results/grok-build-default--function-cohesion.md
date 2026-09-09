## C-function-cohesion-1: Extract row-to-customer interpretation into a named helper

- Lens and task: function-cohesion, go.functions.extract-for-clarity
- Snapshot: PR https://github.com/example/model-fixture/pull/1 (synthetic/offline), H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D: cccccccccccccccccccccccccccccccccccccccc
- Location: internal/importer/load.go, Load (lines 5-18 at H); NormalizeRegion (lines 19-24 at H) remains available for use
- Rules: go.functions.extract-for-clarity (effective default; no team overrides)
- Observation and cost: Load interleaves CSV row format interpretation (length check, per-field TrimSpace/ToLower/ToUpper/Atoi/defaulting, Customer construction) directly inside the iteration-and-Save loop. The format boundary details sit at the same level as the loop control and persistence step, forcing every reader of the "load" task to decode CSV specifics to understand the overall flow. NormalizeRegion already isolates one coherent normalization but is unused in the primary path, leaving the rest of the row logic unseparated.
- Transformation and benefit: Introduce a helper that owns only the format boundary:

```go
func rowToCustomer(row []string) (Customer, error) {
	if len(row) != 4 {
		return Customer{}, fmt.Errorf("expected four fields")
	}
	name := strings.TrimSpace(row[0])
	email := strings.ToLower(strings.TrimSpace(row[1]))
	age, err := strconv.Atoi(strings.TrimSpace(row[2]))
	if err != nil {
		return Customer{}, fmt.Errorf("parse age: %w", err)
	}
	region := NormalizeRegion(row[3])
	return Customer{Name: name, Email: email, Age: age, Region: region}, nil
}
```

Update Load to:

```go
func Load(ctx context.Context, rows [][]string, store Store) error {
	for _, row := range rows {
		customer, err := rowToCustomer(row)
		if err != nil {
			return err
		}
		if err := store.Save(ctx, customer); err != nil {
			return err
		}
	}
	return nil
}
```

The call site now expresses the loop's purpose at the right level of detail; the helper names the distinct row-to-customer contract. A reader sees the iteration/persistence sequence first and can jump only when they need the format rules.
- Counterargument: The whole body is short and every statement contributes to loading customers from this exact CSV shape; an extra function adds a jump with no repetition to remove. Inline code can be acceptable when the task is a single narrow importer.
- Preserve: fail-fast on first error, exact error messages and wrapping, sequential Save order and ctx passing, Customer field population, region defaulting semantics via NormalizeRegion, and the Load signature/contract.
- Affected files: internal/importer/load.go (local change inside one file; NormalizeRegion already present; no other callers or files involved)
- Missing context: none
