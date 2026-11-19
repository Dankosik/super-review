# Rust performance reader probes, 2026-11-19

The current reader already distinguished a map that remembers an external
assignment from a map that recomputes a shard from the key's byte length.
Adding a question about cache hits produced the same four decisions on the
same inputs. The question was dropped. Performance Review 0.10.3 instead
corrects the UTF-8 API guidance and keeps the existing cost and equivalence
criteria.

## Cache comparison

One fresh reader per input per arm. AP33 and AP34 exercised the allocation
lens inside a multi-lens fixture. AP37 and AP38 exercised complexity.

| Case | Baseline | Trial | Maintainer's source check |
| --- | --- | --- | --- |
| AP33, first accepted shard wins | fir | oak | Both moved the already owned tenant into the map, eliminating its clone on hits and misses. Both retained the first assignment on conflicting records. |
| AP34, same contract | lime | ash | Both retained the borrowed lookup and allocation on demand. The first accepted assignment can differ from every later one, including in another file. |
| AP37, derived shard | olive | fern | Both removed the map. The default hasher processes tenant bytes on each lookup. The original expression uses the byte length already stored in the string slice. Output order and duplicates survive. |
| AP38, direct calculation | elm | birch | Both retained the linear pass that produces the required ordered result. |

The baseline Rust context came from `6b77a9f530f5ea410e63ec20cfd13d6a19d66460`.
The trial added only these two lines under map lookups:

```text
For a cache hit, compare the lookup with computing the value directly. Trace
who supplies or updates entries before treating their values as derivable.
```

The dispatched Rust context hashes were
`7be353a3f29e09bce51fc5cab441d3e577ea95788f95d78881af0b8b5e463962` and
`8441a16d651a7f8ef1272f2aab1214f988d78b722561078e01c4a2179380cfda`.
The UTF-8 factual correction was outside this comparison.

## Copy-on-write and task lifetime

These four probes used the baseline instructions. Each pair keeps the same
public interface, observable outputs and workload within the pair.

| Case | Run | What the source supports |
| --- | --- | --- |
| AP39, command-local snapshot | beech | A temporary strong owner lives past its last read and forces a full flag-image copy on every successful toggle. Borrowing the length avoids the extra owner. |
| AP40, real reader snapshot | maple | The unique version can be edited in place. The first edit of a version still held by a reader has to preserve that reader's bytes. An old snapshot does not make every later edit copy. |
| AP41, abandoned reply task | aspen | The owned join handle detaches on timeout. The extra watch subscriber continues to process updates alongside the subscriber that delivers the ledger receipt. The reader proposed stopping only the reply task and classified the producer-visible change in receiver count as a tradeoff. Updates can coalesce. |
| AP42, shared completion | yew | The surviving worker provides the ledger receipt even after caller departure. The reader retained it and identified a producer-side terminal signal as outside the supplied scope. |

The AP39 reader incorrectly described the supplied manifest as outside its
packet and left compatibility unverified. The compiler check below supplies
separate evidence. The AP40 reader also described copying at snapshot creation
as a tradeoff: snapshots taken without a later edit would pay for an otherwise
unnecessary copy. Neither observation earns a further allocation finding.

## Counterexamples found while preparing the corpus

- Both readers of the preliminary AP34 observed that an escaped tag was
  decoded into owned storage solely to check its presence. In the final pair,
  records with equal folded codes are ordered by the decoded tag. The value
  has an observable use, and an exact tie retains input order. Both arms
  received both revised packets.
- The first journal control had a genuine capacity tradeoff after detaching
  a shared vector and immediately pushing into it. An indexed write removed
  growth from the comparison. A fixed-size `Arc<Vec<u8>>` then exposed a
  different representation tradeoff. Moving fixed-size flags into
  `Arc<[u8]>` separated that cost from the lifetime under review.
- A public loader that took an `Arc<[u8]>` allowed its caller to keep a
  `Weak`. A reader showed why the proposed edit could change what that caller
  observed. The final loader takes borrowed bytes and creates its own
  allocation. Only the opaque board and its reader snapshots own this image.

## Compiler and behavior checks

| Inputs | Checks performed |
| --- | --- |
| AP33 / AP34 | Cargo test with Rust 1.80.0 on Linux ARM64, locked offline dependencies and warnings denied. Both produced the same stable order for escaped and literal tags, retained the first shard across conflicting records, and preserved an earlier assignment after a later missing-tag error. The first Alpine container attempt lacked `crti.o`; installing `musl-dev` in the disposable container allowed both to link. |
| AP37 / AP38 | Rust 1.100.0, warnings denied. Both produced the expected ordered shards for an empty list, empty and repeated names, a non-ASCII name and a length at the modulo boundary. |
| AP39 / AP40 | Strict offline Cargo checks and an optimized Rust 1.100.0 witness. With a 64-byte board and no external reader, 64 valid edits changed the backing pointer 64 times in AP39 and zero in AP40. Both preserved a pinned snapshot, unrelated bits and invalid-index behavior. The borrowed source had independent ownership after loading. Counts describe buffer detachments. |
| AP41 / AP42 | Rust 1.100.0, Tokio 1.54.1, warnings denied. The current-thread witness observed two subscriptions versus one after timeout and explicit caller drop. Both delivered the terminal value to the ledger and agreed on ready and closed-feed outcomes. |
| UTF-8 API | Calling `String::from_utf8_lossy_owned` failed with E0658 on Rust 1.98.1. It compiled on 1.99.0 and matched lossy decoding on empty, valid and malformed input. The API leaves buffer reuse unspecified. [Rust documentation](https://doc.rust-lang.org/std/string/struct.String.html#method.from_utf8_lossy_owned) |

## Evidence and limits

The [reader reports](reports.md) include the preliminary results. The
[compressed JSONL traces](reader-traces.jsonl.gz) contain the dispatched
source, assignment, policy hashes, CLI tool events and exit codes, final
responses, usage, and compiler witnesses. Local path prefixes are normalized.
Grader files and peer reports were outside each packet. The maintainer graded
the results with the arm identities visible.

The paired host was Codex CLI 0.169.0-alpha.11.1 with read-only sandboxing,
requesting `gpt-6.1-terra` at high effort. The completion events do not
independently attest to the backend model. An initial CLI launch with user
configuration disabled ended in HTTP 401 before inference. A supplementary
fresh desktop reader using the same model and effort also found the redundant
map in AP37. Neither attempt enters the paired comparison.

These are assigned-reader decisions on synthetic modules, with one observation
per final arm and input. Orchestration, independent challenge, production
workloads and elapsed-time improvements were outside this experiment.
