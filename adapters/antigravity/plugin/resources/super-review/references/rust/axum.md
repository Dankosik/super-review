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

- **Adapter vs operation**: separate HTTP extraction/response mapping from a
  domain operation only when the extracted call drops HTTP knowledge (keep short
  cohesive handlers flat rather than adding service/mapper layers). Use `FromRef`
  substates or `middleware::from_fn_with_state` to avoid passing whole app state
  or per-request state-cloning closures around `from_fn`, while avoiding bespoke
  per-handler state wrappers. Replace hand-written `tower::Layer`/`Service` plus
  `Pin<Box<dyn Future>>` middleware whose `poll_ready` simply delegates to
  `self.inner.poll_ready(cx)` with `middleware::from_fn` / `from_fn_with_state`
  (or an already declared `tower_http` layer) when it handles Axum `Request`/
  `Response` with `Error = Infallible`.
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
