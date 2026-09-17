# Spring HTTP error expression

Owner: control-flow
Rule: java.flow.show-main-path

**Failure meaning.** Does the changed translation path reveal the operation's
failure and its HTTP meaning, or force readers through repeated catch wrappers,
response factories and string/class-name dispatch? Use
[Spring context](../../spring/context.md) and the actual MVC or WebFlux APIs.
An ordinary catch or established domain exception is not a finding by itself.

Compare repeated translations of the same failure contract with an appropriately
scoped @ExceptionHandler or controller advice. Preserve local handling when
recovery or response meaning belongs to one endpoint. A global advice is not
necessarily clearer: inspect existing selectors, precedence, exception matching,
causes and rethrows before moving translation. Equal field assignments across
independent APIs do not establish one shared error policy.

ProblemDetail, ErrorResponse and the stack's ResponseEntityExceptionHandler may
express an already compatible response without custom plumbing. They do not
justify replacing a public error envelope, changing status/headers/content type,
turning absence into an error or converting domain exceptions into HTTP types.
Keep existing validation groups, binding field names and message/code obligations.
MVC and WebFlux have different argument-validation exception types; method
validation and AOP validation also depend on the established mechanism/version.

Do not add a reflection-based universal error registry when a local handler names
the existing contract. Conversely, a business error-code mapping can be genuine
policy, not a duplicate of Spring exception dispatch. Retain established logging
obligations and cause identity; no retries, swallowed failures or new validation
requirements are authorized by a simplification. If catch/translation moves across
a transactional boundary, preserve its established exception/rollback contract.

Show the main path and failure interpretation a reader no longer reconstructs,
and why the proposed translation owner is sufficient. Bug scenarios or a general
error-handling audit cannot supply the missing readability benefit.

Background: [MVC error responses](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html),
[WebFlux error responses](https://docs.spring.io/spring-framework/reference/web/webflux/ann-rest-exceptions.html).
