# Axum mechanisms inside existing Rust questions

Use only for an implicated Axum HTTP boundary and the assigned owner under
[Rust context](../languages/rust.md). This is not a separate web profile. Check
actual Axum/axum-core versions, `json`/`query` features and `macros` where a derive
such as `FromRef` is proposed. Do not prescribe a web stack or dependency upgrade.

## api-clarity

Does a handler expose its HTTP inputs and response, or reconstruct a standard
protocol manually? `State`, `Path`, `Query` or `Json` can put an established input
contract in the signature. Keep custom extraction when it carries meaningful
adaptation. Compare status, headers, body limits, parsing and rejection behavior.

A `Result<Json<Input>, JsonRejection>` parameter can retain local rejection
handling; bare `Json<Input>` must not silently replace it. Extractors run left to
right and a body-consuming extractor belongs last. These are constraints on a
proposed simplification, not an invitation to audit all handler correctness.

An adapter-local `IntoResponse` impl can give a repeated HTTP error mapping one
home. Domain errors need not depend on HTTP. Keep an explicit `Response` with
branch-local `.into_response()` when alternatives have different concrete types;
`impl IntoResponse` does not erase those differences. Preserve the supported
status/header/body and error/source contracts rather than changing diagnostics.

## function-cohesion with effects-separation

Separate request adaptation from a meaningful application operation when the
resulting call removes HTTP knowledge. Retain a short handler that already tells
one story; service/repository/mapper wrappers are not an end in themselves.
`State`/`FromRef` may expose an existing substate instead of the entire application,
but a new state type per handler can add navigation without removing knowledge.
A shared-handle clone can be the intended transfer, not excess copying.

For an implicated extraction, preserve guard/drop boundaries and the handler
future's `Send` requirement. Inspect actual state and suspension points rather
than solving a helper's manufactured constraints with boxing or `Arc`. No compile,
procedural-macro execution or soundness claim is needed for a supported observation.

Sources: [extractors](https://docs.rs/axum/latest/axum/extract/index.html),
[State](https://docs.rs/axum/latest/axum/extract/struct.State.html),
[responses](https://docs.rs/axum/latest/axum/response/index.html),
[error handling](https://docs.rs/axum/latest/axum/error_handling/index.html),
and [Handler](https://docs.rs/axum/latest/axum/handler/trait.Handler.html).
