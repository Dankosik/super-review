# Cursor model-selection probes

Status: NOT RUN in native Cursor. These are controlled stage inputs and grader
expectations, not transcripts or proof of runtime model selection. The changed
decision is specialist inheritance versus an explicit user override; preserve
current-chat orchestration, independent read-only lenses and other adapters'
existing profiles. Baseline: main at 8b581b8d835adfafa825f3a0e58527d49fc2eeff,
which has no Cursor adapter. This addition makes no quality or speed claim.

Follow the parent evaluation protocol. Give a fresh evaluator only one object
from `inputs.json`, the Cursor entrypoint/harness instructions and the installed
specialist role. Ask for the next model/delegation decision at this controlled
stage; do not ask it to invent source inspection or completed worker results.
The `fixture-*` IDs are synthetic host identifiers, not real Cursor model names.
Do not provide `cases.json`, this guide or other probe outputs to the agent.
A separate grader checks the response and actual trace against that case's checks.

Contrast C01/C02 (inherit/override), C02/C03 (English/Russian), C02/C04/C05
(supported/unsupported selection), C02/C06 (user/source authority), C07/C08
(continuation/new review), C02/C11 (reset), and C10/C12 (observed fallback/unknown
runtime identity). C09 must remain help-only.

Then repeat default, explicit choice, reset and failure handling in a real Cursor
Agent session with a harmless authorized source fixture and available models.
Record exact instruction revision, Cursor version, account/admin limitations,
chat model, requested/accepted/effective task model, raw Task parameters and full
results, including failures and unknown values. Verify the actual launch schema
before claiming support for a named per-call override. Neither these stage probes
nor `bun test tests/cursor-adapter.test.ts` proves discovery, model routing,
permission enforcement, recommendation quality or behavioral improvement.

Never inject these grader expectations into a production review or install tree.
