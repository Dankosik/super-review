# TypeScript existing helpers

Owner: duplication
Rule: ts.duplication.share-knowledge

**Maintained owners over hand-rolled plumbing.** When changed code writes a
general mechanism or inline boundary glue by hand, delegate the generic
mechanics to the first existing owner that fits and keep only domain rules local:

1. **Language, runtime, and web platform** within `target`, `lib`, and supported
   runtimes, including built-in collection/URL/Intl/abort primitives and native
   browser elements/observers (`<button type="button">`, `<label>`,
   `<dialog>`/`popover`, `FormData`, `matchMedia`, layout/intersection
   observers, clipboard APIs) -> replace `<div role="button" tabIndex={0}>`
   ceremony, resize polling, and legacy fallbacks.
2. **Workspace helpers and UI primitives**: search by parameter/return shape and
   listener structure, including local dialog/menu/popover primitives that
   already own outside-click, `Escape`, and focus return -> replace custom
   document-level `mousedown`/`keydown` scaffolding.
3. **Installed or documented dependencies** (`package.json`, lockfile, or
   project docs) -> call their direct API rather than re-implementing or
   wrapping indirect quirks.
4. **Net-new widely used packages**: propose only when custom code carries
   non-trivial edge cases, naming the dependency and bundle trade-off.
5. **Twin local helpers**: the same helper written under different names across
   two or more real call sites today -> extract to the concept's module (shared
   server/client helpers must stay safe in both). Single-caller extraction is
   Speculative Generality.

**Keep when:** a recorded project decision rejects the library, a two-line
helper carrying domain meaning avoids a new external dependency, or the
candidate replacement differs on an edge callers reach (`undefined` vs `null`,
empty inputs, `NaN`, sparse arrays, UTF-16 vs code points, mutation vs copy,
sort stability, time zones, error order, abort timing, or wire output; inspect
locked `.d.ts`/source rather than guessing, and flag missing `rationale` if an
edge justifies custom code silently).
