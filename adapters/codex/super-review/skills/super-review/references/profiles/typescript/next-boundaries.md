# Next.js boundaries

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**Framework and feature.** Can a reader see which code adapts a route/request,
which code expresses the feature, and which code needs a client interaction?
Inspect the route entry, its import graph and relevant callers before suggesting
a boundary. Separate route parameter/header handling or repeated orchestration
when a named feature operation becomes easier to understand. Keep a simple async
page, colocated helper, or direct loader call; thin-route dogma, folder conventions
and a maximum file length do not establish a benefit.

Establish App versus Pages Router first. In the App Router, server/client
placement is a module-graph boundary, not just a visual nesting rule. A server
parent can pass rendered children through a Client Component. Do not move an
entire page to the client because one leaf is interactive, or remove a meaningful
client boundary because a component currently looks presentational. `'use server'`
marks Server Functions; it is not a Server Component annotation. Providers and
feature wrappers should own an actual dependency, not an invented architecture.

Retain framework entry signatures/exports, parameter awaiting, runtime assumptions,
server/client module placement and the established serialization and callable
Server Function contracts. Next.js 16 request APIs must not be rewritten to older
synchronous patterns. Do not introduce an internal HTTP hop for a server-local
operation, nor remove an existing Route Handler that has real external consumers.
Do not mandate App Router migration, Server Actions, a data layer, feature-sliced
folders, bundle optimization or a security audit. An extraction must earn its
boundary through a concrete reading/navigation benefit.

Background: [server/client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[project structure](https://nextjs.org/docs/app/getting-started/project-structure),
[Next.js 16 compatibility](https://nextjs.org/docs/app/guides/upgrading/version-16).
