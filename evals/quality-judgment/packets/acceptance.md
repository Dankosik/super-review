# Acceptance stage

Verify the supplied independent candidates using the review contract and
verification resource. This is a bounded orchestration stage: do not delegate,
implement, or run code. Give each candidate its disposition and explain any
accepted or revised remedy. Rust 1.85, edition 2021. Synthetic B=D is empty and
H contains the supplied declarations; snippets are complete for each decision.
No style overrides. Keep runtime values, errors, evaluation and resource lifetimes.

## C1 — src/policy.rs

The owner explicitly identifies this as an unreleased CLI with no supported Rust
library API; all consumers are below. Renaming Rust symbols is within review scope.

```rust
pub struct Policy { pub retention_days: u32 }
impl Policy {
    pub fn duration(&self) -> i64 { i64::from(self.retention_days) * 86400 }
}
pub fn deadline(policy: &Policy, epoch_seconds: i64) -> Option<i64> {
    epoch_seconds.checked_add(policy.duration())
}
```

Candidate C1: `duration()` hides that its integer result is seconds; rename it to
`retention_seconds()` and update the caller. The arithmetic remains unchanged.

## C2 — src/policy.rs

Same source and candidate as C1, but this is a released library with supported
external Rust consumers, unavailable for inspection. The existing public method
must remain callable. No owner authorization for a breaking migration exists.

## C3 — src/archive.rs

Private module; all consumers are below. No external API obligations.

```rust
use std::fs::{File, OpenOptions};
use std::io;
use std::path::Path;
fn regular(path: &Path, writable: bool, create: bool) -> io::Result<File> {
    OpenOptions::new().read(true).write(writable).create(create)
        .truncate(false).open(path)
}
fn read_manifest(path: &Path) -> io::Result<File> { regular(path, false, false) }
fn read_receipt(path: &Path) -> io::Result<File> { regular(path, false, false) }
fn open_marker(path: &Path) -> io::Result<File> { regular(path, true, true) }
```

Candidate C3: callers must decode two positional flags. Introduce named operations
`open_read_only` and `create_locked`, preserving the shared open mechanics.

## C4 — src/render.rs

Private module; all consumers are below.

```rust
struct Options { verbose: bool }
struct Report { title: String, details: String }
fn render(report: &Report, verbose: bool) -> String {
    if verbose { format!("{}\n{}", report.title, report.details) }
    else { report.title.clone() }
}
fn display(report: &Report, options: &Options) -> String {
    render(report, options.verbose)
}
```

Candidate C4: `render(report, true)` forces readers to trace a positional flag;
replace the boolean with `RenderMode::{Compact, Verbose}` to explain its calls.
