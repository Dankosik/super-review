# Raw Rust evaluation packets

Evaluator supplies the normal installed contract and the stated lens. These are
isolated source snapshots, not code to execute. Each section's stated manifest
and consumer evidence is part of that case, not a global assumption. No expected
answer is included in a reviewer packet.

## R01

Lens: api-clarity. Rust 2021, MSRV 1.70. Private helper; all uses shown.
Changed declaration and caller:
```rust
fn label_len(label: String) -> usize { label.len() }
fn print_label(label: String) {
    println!("{}: {}", label, label_len(label.clone()));
}
```

## R02

Lens: data-flow with lifecycle-ownership. Rust 2021, MSRV 1.75.
`dispatch` enqueues work onto a configured Tokio executor and returns immediately.
The shown task reads the owned string after its caller can return.
```rust
fn dispatch(label: String) {
    tokio::spawn(async move { consume(label).await; });
}
```

## R03

Lens: control-flow with error-expression. Rust 2021, MSRV 1.70.
Private helper, `read` returns exactly `Result<String, ReadError>`.
```rust
fn load() -> Result<String, ReadError> {
    let text = match read() { Ok(v) => v, Err(e) => return Err(e) };
    Ok(text.trim().to_owned())
}
```

## R04

Lens: control-flow with error-expression. Same baseline; `cache`, `record_miss`
and `refresh` contracts are shown: a cache failure is recorded before refresh.
```rust
fn load() -> Result<String, ReadError> {
    match cache() {
        Ok(value) => Ok(value),
        Err(error) => { record_miss(&error); refresh() }
    }
}
```

## R05

Lens: function-cohesion with lifecycle context. Rust 2021, MSRV 1.70.
`gate` returns a guard that releases exclusive access on Drop; both writes must
remain in that existing scope. The proposed extraction returns only a prepared value.
```rust
fn publish(store: &Store) {
    let _guard = store.gate();
    let value = prepare(store);
    store.write(value);
    store.mark_published();
}
```

## R06

Lens: data-flow. Rust 2021, MSRV 1.70.
`pending` borrows the store; `apply` mutates it. `collect` establishes a snapshot
of IDs before any application. The methods' contracts are available as stated.
```rust
fn process(store: &mut Store) {
    let ids: Vec<_> = store.pending().map(|item| item.id).collect();
    for id in ids { store.apply(id); }
}
```

## R07

Lens: abstractions. Rust 2021, MSRV 1.70. `Renderer` is dyn-compatible.
The collection stores existing text and image renderers chosen at runtime.
```rust
struct Panel { renderers: Vec<Box<dyn Renderer>> }
```

## R08

Lens: representation. Rust 2021, MSRV 1.70. This is a published wire DTO.
Serde consumers require exactly these two boolean fields; no domain conversion
or consumer migration is part of the change.
```rust
#[derive(serde::Serialize, serde::Deserialize)]
pub struct WireFlags { pub enabled: bool, pub archived: bool }
```

## R09

Lens: control-flow. Root workspace declares edition 2024 and rust-version 1.85.
Changed crate `legacy/Cargo.toml` explicitly declares edition 2021, rust-version
1.56, without workspace inheritance. Local rust-toolchain.toml pins 1.85.
```rust
fn display(value: Option<&str>) {
    let value = match value { Some(v) => v, None => return };
    println!("{}", value);
}
```

## R10

Lens: abstractions with dependency-boundaries. Rust 2021, MSRV 1.70.
The crate is `#![no_std]`, without an alloc dependency or feature. A changed
borrowed-view function accepts a slice; all required data remains borrowed.
```rust
fn records(bytes: &[u8]) -> impl Iterator<Item = &[u8]> { bytes.chunks(4) }
```

## R11

Task: plan an otherwise unrestricted mixed Go/Rust PR. Changed `api.go` and
`crates/app/src/lib.rs` each contain production functions. The Rust file also
contains `#[cfg(test)] mod tests` with `#[test]` functions. There is no change
in the contract excluding test code. Manifests and complete source are available.

## R12

Task: plan source coverage. Changed `checks/smoke.rs` is explicitly the path of a
Cargo `[[test]]` target. Changed `src/lib.rs` contains production code and calls
an `include!` of generated OUT_DIR source absent from the snapshot. Neither the
build script nor macro expansion has been executed. Other declarations are available.
