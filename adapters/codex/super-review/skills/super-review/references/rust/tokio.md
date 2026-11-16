# Tokio mechanisms inside existing Rust questions

Use only for established Tokio code and the assigned owner under
[Rust context](../languages/rust.md), verifying resolved `tokio`/`tokio-util`
versions and enabled Cargo features before proposing an operation.

## data-flow with lifecycle-ownership

Compare handwritten task and wakeup plumbing with the Tokio primitive that owns
that exact contract:
- **Task groups and handles**: `JoinSet` owns a homogeneous task group, yields
  in completion (not spawn) order, and aborts remaining tasks on drop (`shutdown`
  discards outputs; keep a `join_next` drain loop when inspecting outcomes or
  panics). Dropping a bare `JoinHandle` detaches the task instead (`AbortOnDropHandle`
  replaces a one-off abort wrapper when `tokio-util` is declared). Keep detached
  handles or spawn-ordered vectors when intentional, and note that task abort is
  non-cooperative and does not interrupt running blocking pool closures.
- **State transitions vs wakeups**: when shared state (`Mutex`, atomics, or
  `watch::Sender`) is paired with a separate `Notify` solely so readers await a
  state transition, a single `watch` channel (`send_modify` + `Receiver::wait_for`)
  couples state and wakeup for late subscribers. Keep `Notify` when no state is
  stored or single-permit `notify_one` queue semantics are intended (`notify_waiters`
  wakes prior `notified()` futures directly, whereas `enable()` before checking
  state still prevents lost single-permit wakeups).
- **Cooperative shutdown**: `CancellationToken` signals cancellation while
  `TaskTracker` awaits completion after `close` without aborting tasks on drop
  or collecting return values. Keep explicit task ownership (`Send`/`'static`
  where the executor requires it) without manufacturing lifetime coupling or
  shifting lock/drop scopes across `.await`.

## control-flow

- **Competing events and conditions**: direct `select!` expresses competing
  branches without callback wrappers, and `watch::Receiver::wait_for` or an
  existing completion primitive replaces internal sleep-and-recheck loops.
  **Keep when:** polling external state that exposes no notification (given an
  owner, cadence, and terminal condition), or when rewriting `select!` would
  alter branch priority, polling order, or operation-specific cancellation
  safety (judge only to preserve behavior, never as an async bug audit).

Sources: [JoinSet](https://docs.rs/tokio/latest/tokio/task/struct.JoinSet.html),
[JoinHandle](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html),
[TaskTracker](https://docs.rs/tokio-util/latest/tokio_util/task/task_tracker/struct.TaskTracker.html),
[shutdown](https://tokio.rs/tokio/topics/shutdown),
and [select](https://docs.rs/tokio/latest/tokio/macro.select.html).
