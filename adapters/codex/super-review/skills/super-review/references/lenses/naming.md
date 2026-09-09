# Naming

## go.naming.intent

Names should distinguish the concepts a reader must track. Identify a concrete
ambiguity at a declaration and its uses before proposing a rename. Consider the
package qualifier and scope: `invoice.Total` is clearer than
`invoice.InvoiceTotal`; a short loop index rarely needs a domain name.

Useful: in a function handling both a stored order and an incoming request,
rename two indistinguishable `data` values by their roles.
Insufficient: expand every `ctx`, `err`, receiver, or loop variable.

Check exported callers before proposing public renames. Do not turn naming into
an API migration without a proportional reason. Follow an explicit team vocabulary
even if another spelling is equally readable. Comments that explain *why* can
remain; comments merely repeating a misleading name do not repair it.

Return only naming candidates; leave flow and responsibility changes to their lenses.
