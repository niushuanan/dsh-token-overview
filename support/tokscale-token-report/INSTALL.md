# Required shared Skill

This plugin requires a separately installed, authorized current version of
`tokscale-token-report` at `~/.codex/skills/tokscale-token-report`.
Keep one canonical installation; DSH and other clients should link to it rather
than maintaining divergent copies. If it is missing, ask the user to provide the
Skill before enabling collection. Do not overwrite an existing installation.

The current pricing workflow must provide `runtime.json.pricingRows` in USD per
million tokens, official source links and fetch dates, exact model aliases, and
the fork-safe Tokscale 4.x parser at version 4.5.3 or newer. Hourly collection uses
that same snapshot through a private `TOKSCALE_CONFIG_DIR` inside the report slot.
Original logs and global pricing settings are not rewritten.

No machine reports, recovered history, history locks, credentials, or pricing
caches belong in this distribution. This declaration replaces the obsolete
embedded Skill copy; it does not remove any Skill installed on the user's machine.
