# Next.js boundaries

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**Sharp route and client seams.** Establish App versus Pages Router first, then
trace the route entry, its module import graph, and callers.

- **Client seam creep**: `"use client"` placed on a route/feature container or
  shared helper/barrel only because one leaf uses state or browser events,
  pulling server/domain modules, parsers, or heavy barrels into the client
  module graph -> isolate the interactive leaf and pass rendered `children` or
  narrow serializable props from the server parent. (`"use server"` marks
  callable Server Functions, never Server Components.)
- **Tangled route adaptation**: route param/header plumbing mixed with repeated
  domain orchestration -> extract a named feature operation when callers or
  readers gain a cleaner seam, without adding internal HTTP hops for
  server-local calls.
- **Hand-rolled route types**: manual param/slot interfaces duplicating App
  Router structure when generated `PageProps`, `LayoutProps`, or `RouteContext`
  globals are verified in project config -> use the generated globals directly
  (never run typegen/build or guess unverified shapes).

**Keep when:** a simple async page, colocated helper, direct loader call,
external-facing Route Handler, interactive client subtree owner, or narrower
domain type outside `.next` globals already earns its place. Preserve framework
entry exports, Next 16 async request/param awaiting, runtime targets, and
serialization contracts.

Background: [server/client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[project structure](https://nextjs.org/docs/app/getting-started/project-structure),
[Next.js 16 compatibility](https://nextjs.org/docs/app/guides/upgrading/version-16),
[route-aware type helpers](https://nextjs.org/docs/app/api-reference/config/typescript).
