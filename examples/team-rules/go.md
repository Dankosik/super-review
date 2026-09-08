# Go conventions

## team.go.customer-vocabulary
Language: Go
Paths: internal/customer/
Lens: naming
Action: add

Use customer rather than client for the business entity. Client refers to an
outbound protocol client in this codebase, so the distinction prevents ambiguity.

## team.go.options-at-boundary
Language: Go
Paths: api/server/
Lens: api-clarity
Action: override go.api.express-the-call

Use the existing ServerOptions value for public server construction options,
including small option sets. A single documented convention helps callers
recognize configuration. Do not introduce a new builder or new fields.
