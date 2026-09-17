# Java rationale

## java.rationale.explain-constraints

**Design rationale.** Is a non-obvious choice or caller obligation visible where
the next maintainer needs it? Inspect source and available contracts before
proposing an explanation. A changed method may need a reason even when its comment
was not edited. Prefer a better name or clearer expression when it removes the
need for commentary; retain a useful explanation rather than calling it noise.

Javadoc can explain supported null/absence, ownership, live view versus snapshot,
required sequencing, units, and exception meaning that a signature cannot convey.
Comments can preserve evidence-backed reasons for framework constraints, deliberate
copying, ordering, or compatibility workarounds. Do not restate each accessor,
require Javadoc on every method, or invent a rationale from a plausible story.
Annotation-driven contracts may need a short explanation, not another layer.

Remove or update an explanation only with evidence that it is redundant or stale
in the changed context. Keep caller obligations close to the declaration instead
of scattering them across implementation comments. An unknown reason is an
evidence gap, not permission to assert why the original author chose it.

State the misunderstanding the explanation prevents and the source supporting
its content. Do not turn this lens into a missing-test or bug report.
