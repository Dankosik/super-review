# Repeated work

**Is work that gives the same answer every time done again on each pass?**

## Expect

- Work whose inputs do not change across iterations or requests is done once:
  hoisted out of the loop, built at startup, initialized lazily once, or cached
  with a stated key and lifetime.
- Input is parsed once at entry and passed on as the parsed value.
- A value one unit needs in several places is computed or looked up once.

## Look for

For each computation on the hot path, list its inputs and ask whether any of
them changes between passes.

- **Compilation per call**: compiling a regex, template, schema, glob, or SQL
  statement inside a function called per request or per item.
- **Invariant parsing or environment reads**: re-reading or re-parsing an
  environment variable, configuration value, URL, date format, header, or
  deploy-static file on every pass.
- **Loop-invariant or render-invariant work**: repeating lookups, conversions,
  formatter/schema setup, or `O(N)` passes over unchanged inputs on every
  iteration or unrelated update; eagerly initializing unused modules or static
  client subtrees on route entry.
- **Coarse UI fan-out and per-row setup**: driving high-frequency frame values
  through broad component state, subscribing `N` rows to a whole collection so
  one edit re-renders all `N`, running synchronous derived effects for an extra
  render pass, re-rendering finished stream items per chunk, or duplicating
  observers, closed portals, or invariant setup per row.
- **Duplicate work on one path**: validating, hashing, serializing, or fetching
  the same value twice across layers in one unit; probing a map twice for the
  same key (`contains` then `get`/`insert`) when a single non-allocating lookup
  suffices.
- **Constant tables rebuilt per call**: rebuilding a static lookup map, set, or
  table from constant data on each invocation.
- **Eager observability overhead**: formatting log arguments before a level
  check, recording per-element trace spans and arguments on enabled hot paths,
  or resolving metric handles by name and labels on every call.

## Not a finding

- Loop-invariant arithmetic or a field read the optimizer may hoist. A claim
  that it does not is about code generation and needs a profile.
- A cache whose staleness changes results callers rely on, such as reloaded
  configuration. A cache with a stated staleness is a tradeoff.
- Work a dependency already caches inside at the locked version; say where its
  cache is.
- Work done once per process or per connection, at startup or on a cold path.
