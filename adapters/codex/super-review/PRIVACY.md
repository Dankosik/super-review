# Privacy

Super Review has no publisher-operated service, analytics, or model connection.
The installed source reader uses your GitHub CLI access to fetch the requested
PR and committed source from GitHub. It does not read credential files, check out
the repository, execute project code, or send comments.

Source and review prompts are processed by the model provider configured in your
harness. That provider's terms and your harness's session/logging settings apply.
Installing the plugin does not make private source public. The publisher does
not receive review content through Super Review.

Native readers keep issued PR metadata and patches in a private temporary
cache so child processes can use the same immutable snapshot. New readers reject
receipts older than 24 hours; new snapshots trigger bounded cache cleanup.
No credentials are stored there. See the [native integration details](https://github.com/Dankosik/super-review/blob/v2.1.0/docs/native-integrations.md).

Codex's completion tools also store assignment IDs, the source snapshot ID,
deadlines, and submitted specialist reports in a private OS temporary directory.
Each report is limited to 64 KiB. Receipts expire after 24 hours; opening a new
group removes valid expired group directories. This is local coordination state
and is never sent to a publisher service. It can contain private code excerpts.

Harness conversation logs and plugin caches follow the harness settings. Source tools expose read
operations; completion tools write only their local coordination records. Native host permissions and any separately installed tools still
apply. See the adapter documentation for each integration's verified boundary.
