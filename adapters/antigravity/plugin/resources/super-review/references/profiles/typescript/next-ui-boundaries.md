# Next.js loading and recovery flow

Owner: control-flow
Rule: ts.flow.show-main-path

**A readable UI branch.** Can a reader identify what waits, what renders while it
waits, and which existing action recovers from failure? Follow the affected
component, route entry and relevant `loading`/`error`/layout boundaries. Name a
coherent branch or simplify a custom wrapper protocol when it removes scattered
flags or repeated fallback decisions. Keep a direct pending/result conditional,
a useful Suspense boundary or the existing route convention when already clear.

A Suspense or error boundary is not merely a formatting wrapper. Preserve its
scope, fallback and server HTML, reveal order, keys/state lifetime, data-start
and await placement, and navigation/recovery behavior. Moving an await across a
boundary can change presentation. Expected form/action results are not automatically
exceptions; do not convert them to throws or use Suspense as a universal fetch
replacement. This is not a missing-boundary, waterfall or rendering-speed audit.

For a supported Next.js 16.3+ client module, `catchError` from `next/error` is a
candidate replacement for custom component-level recovery infrastructure, not
an upgrade mandate. Its fallback receives props and error information separately;
`retry` re-fetches/re-renders whereas `reset` clears error state without fetching.
Compare logging, reset keys, navigation clearing and special redirect/notFound
handling before accepting any replacement. A custom recovery contract may warrant
retention. Keep the built-in boundary around `error.tsx`; do not wrap its export
again just to use the newer API. Earlier minors must not receive the stable import.

Background: [Suspense](https://react.dev/reference/react/Suspense),
[Next loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading),
[error handling](https://nextjs.org/docs/app/getting-started/error-handling),
[catchError](https://nextjs.org/docs/app/api-reference/functions/catchError).
