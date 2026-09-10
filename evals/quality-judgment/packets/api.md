# API review stage

Review the following complete production declarations and their complete uses
through the Rust API-clarity lens. Treat each case as an independent supplied
change, not as shared code. Rust 1.85, edition 2021, std only. Synthetic B=D is
the empty source; H is the supplied source. All declarations and uses are present;
there are no test targets, other consumers, function values, or team overrides.
These are private modules in an unreleased CLI. Preserve effects and returned
values. Do not implement or run code. Return the specialist result for each case.

## A — src/archive.rs

```rust
use std::fs::{File, OpenOptions};
use std::io;
use std::path::Path;

fn regular(path: &Path, writable: bool, create: bool) -> io::Result<File> {
    OpenOptions::new().read(true).write(writable).create(create)
        .truncate(false).open(path)
}

fn read_manifest(path: &Path) -> io::Result<File> {
    regular(path, false, false)
}

fn read_receipt(path: &Path) -> io::Result<File> {
    regular(path, false, false)
}

fn open_marker(path: &Path) -> io::Result<File> {
    regular(path, true, true)
}
```

## B — src/render.rs

```rust
struct Options { verbose: bool }
struct Report { title: String, details: String }

fn render(report: &Report, verbose: bool) -> String {
    if verbose {
        format!("{}\n{}", report.title, report.details)
    } else {
        report.title.clone()
    }
}

fn display(report: &Report, options: &Options) -> String {
    render(report, options.verbose)
}
```
