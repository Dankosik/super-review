# Existing behavior

The following document is behavior evidence for this source-only evaluation. Its original requests to run Cargo or write tests are superseded by the current code-only evaluation scope. Do not execute programs or author tests.

# Streaming pebble-run codec

Implement the library in `starter/` for an in-memory fictional byte compressor.
Keep the public API below compatible; internal types, representation, helpers,
and algorithms are yours to choose. Add your own useful tests. The library must
not read files, contact services, print payloads, or panic on any API input.
Ordinary allocation failure is outside this task's contract. Bytes are opaque;
there is no text normalization, and byte values including zero are valid data.

## Wire format

A stream consists of `(count, value)` byte pairs and a single zero count byte
that ends the stream. Counts 1 through 255 mean that many copies of `value`.
For example, `aaa\0\0b` encodes as `[3, 97, 2, 0, 1, 98, 0]`. An empty stream
is `[0]`. No bytes may follow the end marker, including a second end marker.
A decoder accepts adjacent pairs with the same value; it does not require a
canonical wire encoding. Missing a value or the end marker is truncation.

An encoder produces the canonical encoding: combine equal adjacent input bytes
across calls, split each maximal run into as many 255-byte runs as possible,
then one residual run if needed. Emit each full 255-byte run immediately.
Hold an incomplete run until a different byte arrives or `finish` is called.
Do not insert chunk boundaries into the encoding.

## API

The package and crate name is `pebble_runs`. Expose:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Error { Closed, Truncated, LimitExceeded, TrailingData, Failed }

pub struct Encoder { /* private */ }
impl Encoder {
    pub fn new() -> Self;
    pub fn push(&mut self, input: &[u8]) -> Result<Vec<u8>, Error>;
    pub fn finish(&mut self) -> Result<Vec<u8>, Error>;
}

#[derive(Debug, PartialEq, Eq)]
pub struct Decoded {
    pub consumed: usize,
    pub bytes: Vec<u8>,
    pub ended: bool,
}
pub struct Decoder { /* private */ }
impl Decoder {
    pub fn new(max_decoded_bytes: usize) -> Self;
    pub fn push(&mut self, input: &[u8], output_limit: usize)
        -> Result<Decoded, Error>;
    pub fn finish(&mut self) -> Result<(), Error>;
}
```

## Encoder behavior

`push` consumes its entire input and returns only the bytes ready at that call.
An empty push before completion returns no bytes. `finish` returns any pending
run followed by the end marker. Repeating `finish` succeeds with an empty
vector, so concatenating all returned vectors produces exactly one stream.
Every `push` after completion, even an empty push, returns `Closed`.

## Decoder behavior

`push` takes a wire prefix and an output budget. `consumed` counts only bytes
consumed from that call's input. The caller must resubmit the unconsumed suffix.
The decoder may retain a count awaiting its value and the remaining repetitions
of one decoded run, but must not retain unconsumed input. It can therefore
produce pending output even when a later call supplies empty input.

For an active decoder and a positive budget, work greedily in stream order:
drain pending repetitions first, then read pairs and emit their repetitions.
Stop immediately when `bytes.len() == output_limit`; do not inspect subsequent
wire bytes even if they are a terminator or error. Otherwise stop only on input
exhaustion or an end marker. A count without its value is consumed and retained
for the next call. With a zero budget, an active decoder performs a no-op:
consume nothing, emit nothing, and return `ended: false`.

Accepting a complete pair reserves its entire expanded count against the
constructor's cumulative byte cap, including output deferred to later calls.
Reject a pair that would exceed that cap with `LimitExceeded` before emitting
any byte of that pair. The cap is inclusive and does not reset per call.
A count alone does not trigger a cap error; a missing value is still truncation.
The zero count end marker consumes one byte and reserves no output.

On seeing an end marker, if any bytes remain in the same input, fail with
`TrailingData`; otherwise return `ended: true`. After a successful end marker,
empty pushes succeed with zero consumption/output and `ended: true`, including
with a zero budget. A nonempty push fails with `TrailingData`, even with a zero
budget. `finish` succeeds only after the end marker was consumed; repeated
successful `finish` calls succeed. Otherwise `finish` returns `Truncated`.
In particular, callers must drain pending output and resubmit the remaining
wire bytes before `finish`; it does not generate output or imply an end marker.

The first decoder error is terminal. Every subsequent `push` or `finish`
returns `Failed`, which takes precedence over all other conditions. On the
call returning the first error, any earlier output from that same call is
discarded (the API returns no batch); previous successful batches stay valid.
No error carries payload bytes or diagnostic text.

## Resource and completion requirements

Neither codec may accumulate the whole stream. Retained state must use memory
bounded independently of total input/output length, apart from the output
vector returned by the current call. Output allocation should follow actual
produced output, not blindly allocate `output_limit` bytes: `usize::MAX` is a
valid budget for a tiny stream. Decoder calls return at most their output
budget and do work proportional to input consumed plus output produced, with
constant overhead. Arithmetic must remain correct for `usize::MAX` limits.
Do not expose payload data through errors or external effects. Internal design
and additional nonbreaking conveniences are open.

Run a build and your tests with the project-local `./cargo` launcher. Keep the
launcher intact; it supplies the assigned Rust toolchain and validation queue.
