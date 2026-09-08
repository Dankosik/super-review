# Example team conventions

Apply [Go conventions](go.md) to Go source.

## team.importer.linear-flow
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: refine go.functions.extract-for-clarity

Keep an ordered conversion locally readable unless extraction names a distinct
concept. A line-count threshold is not a reason to extract.

## team.public.compatibility
Language: Go
Paths: api/
Lens: naming
Action: disable go.naming.intent

Public identifier spelling is externally owned in this directory. Defer cosmetic
renames to an explicitly requested API migration.
