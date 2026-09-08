# Super Review

Write in the user's language. Omit empty boilerplate inside sections; preserve
the information below and every accepted recommendation.

## Context and status

PR URL; B, H, D; Super Review version; `complete` or `partial`; independent or
explicitly limited sequential execution. Explain any missing identity or scope.

## Applied rules

Go versions, team policy sources and revisions, overrides, disabled rules, and
unresolved conflicts.

## Coverage

| Area/files | Lens/task | Completed / not applicable / unfinished | Reason or evidence |
| --- | --- | --- | --- |

List excluded tests, generated/vendor/binary files, and unsupported languages.
Do not imply an excluded area was reviewed.

## Outcome

Summarize the useful changes. When none were accepted, say no useful changes
were found under the completed plan; do not claim the code is perfect.

## File map

| File | Reason it participates | Recommendation IDs |
| --- | --- | --- |

## Recommendations

### R-001 — <concrete change>

Location at H: file, symbol, verified lines/link. Scope: local or cross-file.
Basis: applicable rule(s), including team consistency when that is the reason.
Describe the observed cost, proposed transformation, and practical benefit.
Address the strongest counterargument and list properties to preserve.
Include affected files and originating candidate IDs. Small examples are useful;
a full patch is unnecessary. Repeat for **every** accepted recommendation.

## Implementation order

State only real dependencies, independent changes, or explicitly labeled
alternatives. Do not manufacture an implementation project for a simple change.

## Limits and decisions

Explain unfinished coverage and missing context. State that behavior, bugs,
security, product requirements, and test coverage were not independently
validated and that no project checks or source edits were performed.

| Candidate | Accepted / rejected / merged / unresolved | Reason | R-ID if accepted/merged |
| --- | --- | --- | --- |

This decision appendix is traceability, not a second list of coding tasks.
