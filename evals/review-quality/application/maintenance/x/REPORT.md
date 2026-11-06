# Decoder reset

Added `Decoder::reset(&mut self)` to start an independent stream with the
constructor's original byte limit. The decoder now retains that limit separately
from its remaining capacity; reset reconstructs the initial state, discarding
pending input progress, pending output, completion, and failure.

Existing encoder behavior and decoder processing paths are unchanged. The
additional retained state is one `usize`; reset performs no allocation, input
consumption, or output production. Returned batches remain owned by their callers.

Source inspection supports resetting from every phase, repeated resets, and
restoring both zero and `usize::MAX` limits without arithmetic. Compilation,
formatting, runtime behavior, and tests were not executed, as required by the
code-only scope. No tests or dependencies were added or modified. No requirement
ambiguity or source/contract inconsistency was identified in the inspected scope.
