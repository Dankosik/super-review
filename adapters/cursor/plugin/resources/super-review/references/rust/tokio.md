# Tokio mechanisms inside existing Rust questions

Use only for established Tokio code and the assigned owner under
[Rust context](../languages/rust.md). This is not a separate profile or a
runtime recommendation. Check the resolved Tokio/tokio-util versions and features;
`JoinSet` and `TaskTracker` need their crates' `rt` feature, `select!` needs Tokio's
`macros`. Do not assume the newest operation exists in an older dependency.

## data-flow with lifecycle-ownership

Can the reader identify who owns the work, signals cancellation and waits for its
completion? Compare handwritten coordination with the mechanism matching that
existing responsibility, not with an abstract preference for structured tasks.

A `JoinSet` can give a same-output task group one owner and remove manual handle
bookkeeping. It yields completion order, not spawn order, and dropping it aborts
remaining tasks. Dropping a `JoinHandle` instead detaches its task. Keep handles
when intentional detachment, ordering or another established contract needs them.
Abort is not cooperative cleanup; already running blocking tasks are not
interrupted by abort. Preserve the actual task kinds and shutdown behavior.

For cooperative shutdown, distinguish notification from completion. An existing
`CancellationToken` can express the signal; `TaskTracker` can express waiting for
tracked work after closing the tracker. Its wait completes when closed and empty;
dropping the tracker does not abort tasks. It neither collects task results like a
`JoinSet` nor replaces the work's cancellation response. Keep a clear existing
sequence rather than introducing a generic lifecycle manager.

Owned inputs and cloned shared handles can make task ownership explicit. Check
the executor's actual `Send`/`'static` bounds and values held across suspension,
not a blanket `Send + Sync` rule. Do not replace ownership with borrows that
manufacture lifetime coupling, or change guard/drop scopes during extraction.

## control-flow

A direct `select!` often explains competing events better than a callback wrapper.
Preserve branch priority, polling and the losing future's cancellation contract
when changing that expression. Cancellation safety is operation-specific; neither
an `.await` nor a borrowed future establishes it. Treat this only as preservation
of a proposed clarity change, not a search for races, leaks or async defects.

Sources: [JoinSet](https://docs.rs/tokio/latest/tokio/task/struct.JoinSet.html),
[JoinHandle](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html),
[TaskTracker](https://docs.rs/tokio-util/latest/tokio_util/task/task_tracker/struct.TaskTracker.html),
[shutdown](https://tokio.rs/tokio/topics/shutdown),
and [select](https://docs.rs/tokio/latest/tokio/macro.select.html).
