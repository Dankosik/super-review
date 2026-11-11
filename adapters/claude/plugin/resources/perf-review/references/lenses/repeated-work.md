# Repeated work

**Is work that gives the same answer every time done again on each pass?**

## Expect

- Work whose inputs do not change across iterations or requests is done
  once: hoisted out of the loop, built at startup, held in a `static`
  through `LazyLock` or `OnceLock`, or cached with a stated key and
  lifetime.
- Input is parsed once where it enters and passed on as the parsed value.
- A value one request needs in several places is computed once for that
  request.

## Look for

For each computation on the hot path, list its inputs and ask whether any of
them changes between passes.

- Compilation per call: `Regex::new`, a template, a schema, a glob or a SQL
  statement built inside a function that runs per request or per line.
- Parsing or reading per use: a configuration value, an environment
  variable, a URL, a date format or a header parsed or looked up on each
  call; a file read per request whose content changes only on deploy.
- Loop-invariant work: a lookup, a conversion, an allocation or a formatting
  of values that do not change inside the loop, which hoisting would move
  out.
- The same value computed twice on one path: a key serialized, hashed or
  validated in two layers; `contains_key` followed by `get` or `insert` on
  the same key, where the entry API looks it up once.
- A table, map or set rebuilt from constant data on every call.
- A value formatted for a log line before the logging macro, so the work is
  done even when that level is disabled.

## Not a finding

- Loop-invariant arithmetic or a field read the optimizer may hoist. A claim
  that it does not is about code generation and needs a profile.
- A cache whose staleness would change results callers rely on, such as
  configuration a reload must refresh. A cache with a stated staleness is a
  tradeoff.
- Work a dependency already caches inside, at the locked version; say where
  its cache is.
- Work done once per process or per connection, at startup or on a cold
  path.
