# Decoder reset maintenance

`Decoder::reset(&mut self)` now discards the current stream's progress and restores a fresh decoder with the original byte cap. It delegates initialization to `Decoder::new`, clearing reservations, a retained count, pending repetitions, completion, and terminal failure in every state. Previously returned byte vectors remain caller-owned.

Only decoder reset was added. Existing encoder behavior, decoder calls, errors, wire format, output budgets, and dependency declarations were left unchanged. No tests were added or modified.

Source inspection supports the intended reset behavior: the constructor initializes all per-stream fields, and `max` remains the original constructor limit. No compilation, formatting tools, programs, tests, benchmarks, or network operations were run. Compilation and runtime behavior remain unverified under the code-only scope; this report does not establish delivery acceptance.
