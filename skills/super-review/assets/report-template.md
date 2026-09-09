# Super Review

Write in the user's language. Omit empty boilerplate inside sections; preserve
the information below and every accepted recommendation.

## Outcome

Lead with changes offering the clearest supported maintenance benefit, considering
scope and adoption cost, not bug severity or finding count. With none accepted,
say no implementation recommendations were accepted under the completed coverage;
do not claim perfection or absence of observations when unresolved ones remain.

## Context and status

PR URL; B, H, D; Super Review version; `complete` or `partial`; independent or
explicitly limited sequential execution; specialist model/profile and reasoning
effort when available. Explain missing identity/scope. Candidate disposition and
source coverage are separate: an unresolved remedy is not a missing worker.

## Applied rules

Go versions, team policy sources/revisions, overrides, disabled rules, and conflicts.

## Coverage

Record planned lens/profile selection and omissions with signals or structural
reasons; group matching scopes/reasons. Keep `not requested` and `not checked`
distinct from completed work or genuine non-applicability. Show later additions
and focused continuations without implying repeated full passes.

| Area/files | Lens, profiles, task | Selection and actual execution | Reason or evidence |
| --- | --- | --- | --- |

A profile-only task covers that question, not its whole owner. A failed selected
profile makes that area partial even when the base pass finished. Content profiles
are not model profiles. List excluded tests, generated/vendor/binary files and
unsupported languages; never imply they were reviewed.

## File map

| File | Reason it participates | Recommendation IDs |
| --- | --- | --- |

## Recommendations

### R-001 — <concrete change>

Location at H: file, symbol, verified lines/link. Scope: local or cross-file.
Basis: effective rules and contributing profiles, including convention-only advice.
Connect the observation to D..H; distinguish supporting unchanged context. Explain
the reading/maintenance task, supported transformation, net benefit, strongest keep
alternative, and relevant preservation constraints. Include affected files and
originating candidate IDs. Make the bounded change usable by a coding agent;
small examples may help, but a full patch or new feature design is unnecessary.
Repeat for **every** accepted recommendation, including merged contributions.

## Implementation order

State only real dependencies, independent accepted changes, or labeled alternatives.
Unresolved observations are not implementation steps. Do not manufacture a project
for a simple change.

## Limits and decisions

Explain unfinished coverage and missing context. State that behavior, bugs,
security, product requirements and test coverage were not independently validated,
and no project checks or source edits were performed.

| Candidate | Accepted / rejected / merged / unresolved | Reason or demonstrated observation and remaining gap | R-ID if accepted/merged |
| --- | --- | --- | --- |

Retain useful unresolved observations with their source anchors and the evidence
or user choice needed to settle the remedy; do not silently drop them or label
them required changes. This appendix is traceability, not a second task list.
