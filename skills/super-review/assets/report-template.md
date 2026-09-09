# Super Review

Write in the user's language. Omit empty boilerplate inside sections; preserve
the information below and every accepted recommendation.

## Outcome

Lead with the changes offering the clearest supported maintenance benefit,
considering their scope and adoption cost, not bug severity or finding count.
When none were accepted, say no useful changes
were found under the completed plan; do not claim the code is perfect.

## Context and status

PR URL; B, H, D; Super Review version; `complete` or `partial`; independent or
explicitly limited sequential execution; selected specialist model/profile and
reasoning effort when available. Explain any missing identity or scope.

## Applied rules

Go versions, team policy sources and revisions, overrides, disabled rules, and
unresolved conflicts.

## Coverage

Record planned lens/profile selection and omissions with source signals or
structural reasons; compactly group matching scopes/reasons. Keep `not requested`
and `not checked` distinct from completed work or genuine non-applicability.
Show later additions and their origin without claiming repeated full passes.

| Area/files | Lens, profiles, task | Selection and actual execution | Reason or evidence |
| --- | --- | --- | --- |

A profile-only task covers that question, not the whole owning lens. A failed
selected profile makes that area partial even when the base pass finished.
Do not confuse content profiles with the separately reported model profile.

List excluded tests, generated/vendor/binary files, and unsupported languages.
Do not imply an excluded area was reviewed.

## File map

| File | Reason it participates | Recommendation IDs |
| --- | --- | --- |

## Recommendations

### R-001 — <concrete change>

Location at H: file, symbol, verified lines/link. Scope: local or cross-file.
Basis: applicable rule(s) and contributing profiles, including team consistency
when that is the reason.
Connect the observation to D..H and distinguish supporting unchanged context.
Describe the concrete reading or maintenance task, proposed transformation, and
net benefit, including new indirection or obligations. Address the strongest
reason to keep the current design and list properties to preserve. Make the
bounded change understandable to a coding agent without designing a new feature.
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
