# Spring HTTP contracts

Owner: api-clarity
Rule: java.api.express-the-call

**Boundary vocabulary.** Read the changed handler with representative requests,
response construction and application calls. Under
[Spring context](../../spring/context.md), establish MVC, WebFlux, or a client-only
API before using their mechanisms. Can callers understand binding, absence,
validation, response shape and adaptation without reading a generic dispatcher?

Compare handwritten path/method/header/media-type selection with the established
@RequestMapping or functional RouterFunction mechanism for that same HTTP contract.
Do not call an existing functional router custom infrastructure. A command kind in
a message body may be application data, not a request to redesign endpoint URLs.
Framework 7 API versioning can replace repeated version dispatch only when that
baseline and the existing resolution rules are established; no upgrade is implied.
Preserve matching/precedence, binding, status, headers, content negotiation and
serialization contracts implicated by the replacement, not only the happy path.

Prefer an existing precise input/result or a small named boundary value when maps,
positions, boolean modes or generic converters make callers decode the operation.
HTTP input, application argument and persistent entity can have different owners;
do not merge them to save files, or demand three identical shapes without evidence
of independently changing contracts. Keep simple direct construction when it is
already clear. A non-HTTP application contract need not expose ResponseEntity,
servlet objects or ServerWebExchange merely because its first caller is a handler.

Separate validation of an existing input contract from a domain decision requiring
application state. Do not add constraints or move every branch into Bean Validation.
In Framework 6.1+, built-in controller method validation differs from AOP validation
through class-level @Validated. MVC argument validation can raise
MethodArgumentNotValidException, while WebFlux uses WebExchangeBindException;
method validation can instead raise HandlerMethodValidationException. Inspect the
actual signature, annotations/groups, local BindingResult/Errors handling and
advice before moving/removing validation annotations or translating these errors.

Reactive return types do not themselves prove WebFlux server use. Keep an existing
pipeline's subscription, context and materialization contracts when changing an
API; do not add block(), subscribe(), new scheduling or a reactive migration for
readability. Error-translation structure belongs to the control-flow owner.

Show a before/after boundary use and the caller knowledge removed, with any
unresolved wire-compatibility decision separate from the supported observation.

Background: [MVC mappings](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html),
[MVC validation](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html),
[WebFlux validation](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-validation.html),
[WebFlux functional endpoints](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html).
