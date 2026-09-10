# Rust evaluation suite

Pass one section of `packets/idioms.md` with the installed contract and its
assigned language/lens resources to the reviewer. Do not include `cases.json`,
peer answers or this evaluator guide in the reviewer packet. Use separate fresh
contexts for contrasts. The packets use local source identities rather than
claiming to be live PRs; no source execution is needed.

`cases.json` is for an independent evaluator: assess supported observations,
compatible remedies, valid decisions to retain code, scope and missing-context
handling. Record model/harness/settings, exact instruction revision, full raw
outputs and failures as well as successes. Count failed delivery separately from
incorrect judgment. These fixtures are not scored by substring presence in output.

The automated tests check that every expectation has one raw section and stable
resource/rule wiring. They do not run models or establish recommendation quality.
