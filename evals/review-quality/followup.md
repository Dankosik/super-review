# Reuse a decoder for another stream

Add a way to reuse a `pebble_runs::Decoder` for an independent stream after
abandoning, completing, or failing the current stream. Add exactly this public
method:

```rust
impl Decoder {
    pub fn reset(&mut self);
}
```

`reset` returns `()` and leaves the decoder observably equivalent to a newly
constructed `Decoder::new(max_decoded_bytes)` with the same limit originally
passed to this decoder's constructor. The limit cannot be changed by reset.
It applies afresh to each stream begun by reset; reservations from the previous
stream do not reduce the new stream's capacity.

The method is available in every decoder state, including before any input,
while awaiting a pair's value, while repetitions remain to be emitted, after a
successful end marker or `finish`, and after any error. It discards all progress
and pending output for the old stream, clears completion and terminal failure,
and neither consumes input nor returns output. It does not invalidate bytes
already returned by successful calls. Repeated resets have the same observable
effect as one reset.

After reset, all existing rules apply from the start of a stream. In particular:

- Empty input with a zero output budget returns zero consumption, no bytes,
  and `ended: false`.
- `finish` before a new end marker returns `Truncated`, making subsequent
  `push` and `finish` calls return `Failed` until another reset.
- A zero constructor limit still accepts the empty stream and rejects a
  complete nonempty pair with `LimitExceeded`. The original inclusive cap and
  support for `usize::MAX` remain unchanged.
- Any input supplied after reset belongs to the new stream. The caller remains
  responsible for unconsumed input; reset does not recover or carry over an
  unconsumed suffix from an earlier call.

Keep all existing public calls and behavior compatible for callers that never
invoke `reset`. Preserve the wire format, error variants, output-budget rules,
resource bounds, and prohibition on panics for API inputs. Internal
representation and implementation choices remain open.

Limit this edit to the decoder reset capability. Do not add an encoder reset,
change the byte cap API, add dependencies, introduce runtime or I/O behavior,
or add or modify tests. This is a code-only maintenance edit: do not compile,
run the program or tests, or perform benchmarks.
