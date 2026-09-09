completed

Task: change-locality (go.change.localize-existing-variation)
Scope: synthetic PR https://github.com/example/model-fixture/pull/1 (B: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, D: cccccccccccccccccccccccccccccccccccccccc); all supplied declarations at H (new in D-to-H). Reviewed exactly:
- internal/queue/policy.go (Settings, queueName, retryLimit, burstSize, ForTier)
- internal/access/roles.go (CanView)
- internal/loyalty/labels.go (Label)
Go 1.22, no team overrides.

The single queue-tier responsibility (tier → {queue name, retry limit, burst size}) is already localized to one file and one package. The three switches live together inside internal/queue/policy.go; adding or changing a tier touches only that file. The "priority"/"standard" literals in access/roles.go and loyalty/labels.go belong to independent authorization and loyalty concepts; they do not own or duplicate the queue mapping and do not participate in the same decision.

No existing axis of variation or responsibility is scattered across files that must repeatedly change together. No boundary recommendation arises under this lens.

Limitations: review uses only the three declarations supplied in the query; no additional callers, consumers, or files were available.
