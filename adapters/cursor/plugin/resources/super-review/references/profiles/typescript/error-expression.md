# Error expression

Owner: control-flow
Rule: ts.flow.show-main-path

**Failure paths as a readable story.** Can readers see where failure is translated,
propagated, or handled without traversing wrapper chains and repeated conversions?
Inspect the changed handler and representative callers. Name a meaningful boundary
or consolidate a repeated translation when that removes duplicated understanding.

Keep an ordinary throw, rejected promise, or established result union when clear;
do not impose one error model across a project. Preserve exception identity, causes,
public error shape, retry/handling ownership, and `try`/`catch`/`finally` scope.
Narrowing an unknown caught value can express an existing translation, but a new
catch, default result, error class, or validation path may change behavior.
Do not turn this profile into a swallowed-error, security, or missing-handler audit.
