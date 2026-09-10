Coverage: **completed** for C1–C4 using the supplied complete declarations and consumers. Synthetic B=D is empty; H contains the supplied Rust 1.85, edition 2021 source. No style overrides. Instruction content identity unverified; no package revision or digest was supplied. No code or checks executed.

| Candidate | Disposition | Recommendation |
|---|---|---|
| C1 | **Accepted** | R1: Rename `duration()` to `retention_seconds()` and update `deadline`. |
| C2 | **Accepted with revised remedy** | R2: Add `retention_seconds()`, retain callable `duration()`, and update the internal caller. |
| C3 | **Accepted with revised remedy** | R3: Introduce `open_read_only` and `open_or_create_read_write`; preserve the shared opening mechanics. |
| C4 | **Rejected** | The supplied caller already communicates the boolean’s meaning through `options.verbose`. |

**R1 — Make the returned unit explicit.**  
`duration()` returns an untyped integer whose unit requires inspecting its multiplication by `86400`. `retention_seconds()` exposes that information at the call site. The owner explicitly establishes that this unreleased CLI has no supported library API and that all consumers are supplied, so the public visibility does not prohibit this rename. Keep the return type, arithmetic and `checked_add` unchanged.

**R2 — Expose the unit while preserving the released API.**  
The same naming observation remains supported, but deleting or renaming the existing public method would violate the stated compatibility requirement. A supported remedy is:

```rust
impl Policy {
    pub fn retention_seconds(&self) -> i64 {
        i64::from(self.retention_days) * 86400
    }

    pub fn duration(&self) -> i64 {
        self.retention_seconds()
    }
}
```

Update `deadline` to call `retention_seconds()`. Existing external callers can continue calling `duration()` with its original signature and result. The extra public spelling creates an ongoing compatibility obligation, but the forwarding method keeps the computation in one place while allowing clearer calls. No deprecation or breaking migration is required.

**R3 — Replace positional flag knowledge with accurate operation names.**  
The three supplied callers require readers to decode `false, false` or `true, true` against `regular`’s parameter order. Named operations make those choices explicit:

```rust
fn open_read_only(path: &Path) -> io::Result<File> {
    regular(path, false, false)
}

fn open_or_create_read_write(path: &Path) -> io::Result<File> {
    regular(path, true, true)
}
```

Route `read_manifest` and `read_receipt` through `open_read_only`, and `open_marker` through `open_or_create_read_write`. Retain `regular` unchanged, including `.truncate(false)`. Reject the proposed name `create_locked`: the supplied implementation acquires no lock and can open an existing file. The revised wrappers preserve one opening operation per call, its flags and errors, and ownership of the returned `File`; they add no intermediate file lifetime.

**Decision appendix — C4.**  
The candidate cites `render(report, true)`, but the complete supplied consumer is `render(report, options.verbose)`. That expression already identifies what controls rendering. Introducing `RenderMode` would require translating the existing boolean into an enum and mapping those variants back to the same two branches. Within this complete scope, that duplicates the mode representation without resolving the asserted call-site ambiguity. Retain the boolean.

C1 and C2 are independent scenarios, so R1 and R2 are alternatives under their respective compatibility boundaries, not simultaneous edits.
