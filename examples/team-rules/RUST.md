# Example Rust convention

This is an optional example, not installed policy. In a reviewed repository,
explicitly link an adopted version from `SUPER_REVIEW.md` at the target revision.
A Go override never implicitly changes a Rust rule.

## team.rust.linear-flow
Language: Rust
Paths: crates/importer/src/
Lens: function-cohesion
Action: refine rust.functions.extract-for-clarity

Keep a linear conversion together unless a helper names a meaningful operation
or removes repeated knowledge. We value local reading; extra lifetime parameters
and trait bounds must be justified by the knowledge the extraction removes.
