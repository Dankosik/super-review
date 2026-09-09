# Example team conventions

Apply [Go conventions](go.md) to Go source.

## team.importer.linear-flow
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: refine go.functions.extract-for-clarity

Keep an ordered conversion locally readable unless extraction names a distinct
concept. A line-count threshold is not a reason to extract.

Code reference: [ordered conversion](reference-import.go), symbol `Names`.
It illustrates keeping normalization, filtering and collection visible as one
operation. Use this for the stated cohesion choice, not as a naming convention or
a requirement to replace other algorithms. The link resolves at the policy's pinned
revision, normally B, even if this PR also changes the example.

## team.public.compatibility
Language: Go
Paths: api/
Lens: naming
Action: disable go.naming.intent

Public identifier spelling is externally owned in this directory. Defer cosmetic
renames to an explicitly requested API migration.
