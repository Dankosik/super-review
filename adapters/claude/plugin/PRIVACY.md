# Privacy

Super Review 3 has no publisher-operated service, analytics, model connection,
MCP server or plugin-owned source/result cache. The host reads the selected source
through its native tools and configured Git/GitHub access.

Source and review prompts are processed by the model provider configured in the
host. That provider's terms and the host's session/logging settings apply. The
publisher does not receive review content through Super Review.

For working-file reviews, the orchestrator may create a selected-source copy in
a temporary directory outside the reviewed tree. Such copies and host conversation
logs can contain private source; their retention follows the host and operating
system. Do not place credentials or unrelated private files in review packets.

The skill instructs agents not to modify or execute reviewed source or publish
comments. Native shell tools are not inherently read-only; host permissions and
sandbox settings remain authoritative. Updating from 2.x does not erase historical
host logs or temporary caches created by earlier reviews.
