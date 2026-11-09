<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD61; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD61

- Snapshot: whole supplied source (no diff, no base revision). Location: `.../scratchpad/packets/RD61`. Crate `rust-depth-61`, edition 2021, `rust-version = "1.85"`.
- Instructions: `content identity unverified`. Resources were read from the installed baseline skill root.
- Assignment: lens api-clarity (`rust.api.express-the-call`). Profiles: none. Scope: all production declarations and uses in `src/lib.rs`, a private unreleased module with no external API commitment. Team policy: none.
- Status: completed
- Inspected evidence: `Cargo.toml`. `src/lib.rs` in full: `AppConfig`, `HttpConfig`, `StorageConfig`, `RetryConfig`, `retry_delay`, `tenant_dir`, `object_path`. Caller facts from PACKET.md: `retry_delay` has two callers, the uploader and the webhook sender. `tenant_dir` has one caller, `object_path`. The callers' own source was not supplied.
- Coverage: base api-clarity question completed over every declaration and the in-file use of `tenant_dir`. No profiles selected. Missing evidence: the uploader and webhook sender source (known only from the packet facts) and whether `object_path` has other callers. Neither is needed for the observations below.
- New applicability signals: none

## C-RD61-1: `retry_delay` takes the whole `AppConfig` but reads only `retry.base_delay`

- Change anchor: `src/lib.rs`, `retry_delay`, `config.retry.base_delay * 2u32.saturating_pow(attempt)` (lines 25-27). Whole-project snapshot.
- Basis: `rust.api.express-the-call`. Not convention-only.
- Observation: The signature `retry_delay(config: &AppConfig, attempt: u32)` suggests the delay depends on any part of the application config. The body uses only `retry.base_delay`, and `retry` is a separate `RetryConfig` struct. A reader has to open the body to learn that `http` and `storage` are irrelevant. Per the packet, both callers hold the whole `AppConfig` only to pass it here. That ties the uploader and the webhook sender to the entire config type for one retry setting.
- Remedy: take the narrower type that already exists, `pub fn retry_delay(retry: &RetryConfig, attempt: u32) -> Duration`. Callers then write `retry_delay(&config.retry, attempt)`. Alternatively, make it a method, `RetryConfig::delay(&self, attempt)`, so `max_attempts` and the backoff policy sit on the same type. Either form shows at the call site which setting matters. The callers can then be handed `&RetryConfig` instead of `&AppConfig`, which removes the dependency on unrelated config. Keep alternative: the whole-config signature leaves room for a later setting from another section. That is a hypothetical future need, and the current body does not use it.
- Preserve: the delay arithmetic and the `Duration` return are unchanged, and `RetryConfig` is borrowed read-only. Known from the packet: the callers are only the two named. Unverified: how those callers obtain their config. Moving to `&RetryConfig` is a signature change confined to this private module and its two callers.
- Affected files: `src/lib.rs` (inspected). The uploader and webhook sender call sites are not supplied and are still needed to update them.

## C-RD61-2: `tenant_dir` generics describe flexibility its one caller does not use, and force an allocation

- Change anchor: `src/lib.rs`, `tenant_dir<P: AsRef<Path>, S: Into<String>>` (lines 29-32) and its only call, `tenant_dir(&config.storage.root, tenant.to_owned())` in `object_path` (line 35). Whole-project snapshot.
- Basis: `rust.api.express-the-call`. Not convention-only.
- Observation: The signature suggests several accepted types for the root and for the tenant. The only call passes a `&PathBuf` and a `String` that `object_path` has just built with `tenant.to_owned()` from a `&str`. `Into<String>` also hides an ownership decision. The tenant is converted to an owned `String` and then used only as a borrowed path component by `join`. So the allocation exists only to satisfy the signature. A reader sees the `to_owned()` at the call site and has to work out why an owned value is needed. It is not needed. The two type parameters add a generic signature to read, with no second use that benefits from them. The `AsRef` and `Into` guidance in the lens says not to generalize without an actual gain, and none is visible here.
- Remedy: use borrowed views that match access-only work, `fn tenant_dir(root: &Path, tenant: &str) -> PathBuf { root.join(tenant) }`. The call becomes `tenant_dir(&config.storage.root, tenant)`, with no `to_owned()` and no generics. Keep alternative: the generic form would help future callers that pass a `String` or a `&str` of mixed origin. The packet shows exactly one caller, and `&str` already accepts a `&String` by deref coercion.
- Preserve: the join result is unchanged. `Path::join` receives the tenant as a path component either way, so the string-to-path behavior is the same. If `tenant_dir` is later exposed beyond this module, generic callers would need rechecking. That is not the case here, since it is private and unreleased.
- Affected files: `src/lib.rs` (inspected). Only `object_path` is the caller, per the packet.
