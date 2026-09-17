# Next.js data ownership

Owner: data-flow
Rule: ts.data.make-transformations-visible

**An explicit data path.** Can readers trace route/request inputs through data
loading, transformation, mutation results and the rendered view? Identify the
actual loader, caller and policy source. A named input/result boundary can make
hidden request dependencies or scattered transformations explicit. Keep a direct
`await` and render when an extra repository/service layer would only forward data.
Do not move server/query data into local state merely to standardize a frontend API.

For caching or invalidation code, inspect the owning Next.js version, configuration
and consumers before advice. Next.js 16's Cache Components are opt-in through
`cacheComponents`; `'use cache'`, React `cache`, fetch options and a client query
cache are not interchangeable. Clarify who owns an existing freshness/tag/path
policy when that knowledge is obscured or duplicated. Similar-looking reads may
have deliberately different lifetimes; preserve them rather than invent one
universal cache helper. No blanket claim that all fetches are cached or uncached.

Preserve request scoping, read/write timing, async order, cache scope/key inputs,
revalidation semantics, pending/optimistic meaning, error/redirect boundaries and
server/client data transfer. `updateTag`, `revalidateTag` and `revalidatePath` are
not spelling alternatives. Renaming/extracting must not silently choose a new
freshness policy, parallelize requests or change a mutation transport. Unknown
configuration blocks that specific remedy, not independent observations. Missing
invalidation, waterfalls, authorization and stale-data bugs are outside this
quality question; do not test routes or benchmark rendering.

Background: [data fetching](https://nextjs.org/docs/app/getting-started/fetching-data),
[Cache Components](https://nextjs.org/docs/app/getting-started/caching),
[mutating data](https://nextjs.org/docs/app/getting-started/mutating-data),
[revalidation](https://nextjs.org/docs/app/getting-started/revalidating).
