# Java data flow

## java.data.make-transformations-visible

**Visible value history.** Trace each changed value from origin through
transformations, storage, and callers. Prefer local variables and direct
transformations over hidden mutable fields or single-element holder arrays, and
replace side-effecting stream lambdas or nested collectors with a direct loop or
named intermediate when that exposes state updates. Collapse cross-seam
repackaging where code builds temporary lists, maps, or adapter DTOs only to
cross a private helper boundary or feed a builder/formatter that accepts
elements directly, and drop round-trip formatting or re-parsing of
already-parsed values.

**Keep when:** a local accumulator, simple `filter`/`map` pipeline, or staging
step that preserves exception order, all-or-nothing output, or an intentional
snapshot already makes the value history clear. Distinguish mutable copies,
fixed-size lists, live unmodifiable views, and snapshots (`List.copyOf` rejects
nulls; `Stream.toList` is unmodifiable and permits nulls; `Collectors.toList`
makes no mutability promise; `final` freezes only the reference; and lazy or
resource-backed streams carry execution timing and close lifetimes). Do not
parallelize streams or claim performance gains here. Show which ownership or
transformation fact becomes visible.
