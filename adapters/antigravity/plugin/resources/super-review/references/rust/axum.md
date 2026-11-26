# Axum mechanisms inside existing Rust questions

Use only for an implicated Axum HTTP boundary under [Rust context](../languages/rust.md),
verifying resolved `axum`/`axum-core` versions and enabled features without
prescribing a web stack or executing procedural macros.

## api-clarity

- **Handler signatures and responses**: express standard HTTP inputs via typed
  extractors (`State`, `Path`, `Query`, `Json`) and centralize repeated HTTP
  error mapping in an adapter-local `IntoResponse` impl so domain errors stay
  independent of HTTP.
- **Keep when**: custom extraction adapts headers, body limits, or status codes;
  `Result<Json<T>, JsonRejection>` preserves local rejection formatting (never
  silently replace with bare `Json<T>`); extractor order matters (extractors run
  left to right with the body-consuming extractor last); or heterogeneous
  branches return concrete `Response` values via `.into_response()` (`impl IntoResponse`
  still requires one return type).

## function-cohesion with effects-separation

- **Thin HTTP adapters**: keep handlers as thin adapters (extract inputs, call
  the domain/application operation, map outcomes/errors to responses) when
  non-trivial business rules live inside the handler, while keeping short CRUD
  handlers flat without 1:1 service/mapper layers.
- **State and middleware**: use `FromRef` substates or
  `middleware::from_fn_with_state` over whole-state threading or bespoke state
  wrappers; replace pass-through `tower::Layer`/`Service` plus boxed-future
  middleware (where `poll_ready` merely delegates and `Error = Infallible`) with
  `middleware::from_fn` / `from_fn_with_state` or a declared `tower_http` layer.
- **Keep when**: a custom `tower::Service` implements genuine `poll_ready`
  backpressure or readiness state, stays generic over non-Axum body/error types,
  or avoids `from_fn`'s boxed future or `Clone + Sync` inner-service bounds.
  Preserve lock/guard drop scopes across `.await` and the handler future's
  `Send` bound without papering over helper friction with `Arc` or `Box`.

Sources: [extractors](https://docs.rs/axum/latest/axum/extract/index.html),
[State](https://docs.rs/axum/latest/axum/extract/struct.State.html),
[responses](https://docs.rs/axum/latest/axum/response/index.html),
[error handling](https://docs.rs/axum/latest/axum/error_handling/index.html),
and [Handler](https://docs.rs/axum/latest/axum/handler/trait.Handler.html).
