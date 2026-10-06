# dsh-token-overview

Current master targets Harness **0.2.1-alpha.1** and includes the native plugin upgrade made with [dsh-plugin-upgrade-skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill/). Download the current branch for this source update; existing releases retain their original version.

English | [中文](README.md)

[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-111111)](https://github.com/niushuanan/xiaozhuang-dsh) [![Release](https://img.shields.io/badge/release-xiaozhuang--v0.4.2-2563eb)](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2) [![MIT](https://img.shields.io/badge/license-MIT-16a34a)](LICENSE)

See tokens, cache usage, calls, active periods, and estimated cost across AI clients on the whole computer.

The Token Overview Settings page reuses the product's shared title hierarchy. Older DSH builds without that primitive receive a size-matched built-in fallback.

Current master uses the shared Skill's verified price snapshot for both total and hourly costs, with native per-message pricing before aggregation. Model names, token quantities, and protected history remain intact. Costs are API-equivalent estimates, not invoices; ongoing activity can cause timing differences between scans. Existing releases are unchanged; use master for this fix.

<p align="center"><img src="docs/16-token-overview.webp" alt="Cross-client token metrics and time-of-day trend" width="800"></p>

Current master ships complete native plugin folders and preserves each Settings entry's original plugin-owned icon. Remove its folder to uninstall the capability. See [INSTALL.md](INSTALL.md) for shared compatibility patches and installation checks.

## Install

1. Choose **Code → Download ZIP** for current master; older Releases do not include this repair.
2. Give the ZIP to an AI that can read and modify the target DSH project.
3. Tell the AI: **Read AGENTS.md, INSTALL.md, and manifest.json first. Install only this plugin and preserve existing plugins, data, conversations, attachments, and settings.**
4. The installing AI merges the code and Cordis rows into the target version and validates only the entry points directly owned by this plugin.

## Requirements

- A user-authorized current installation of the shared `tokscale-token-report` Skill is required; see the [installation declaration](support/tokscale-token-report/INSTALL.md). Keep one canonical copy across clients. This repository no longer bundles a divergent Skill copy, machine reports, history locks, or pricing caches.

## Contents

- <code>payload/</code>: plugin code and required runtime assets copied from the main repository.
- <code>manifest.json</code>: composition rows, sources, main-repository commit, and per-file SHA-256.
- <code>INSTALL.md</code>: direct installation, conflict adaptation, failure recovery, and narrow verification.
- <code>docs/</code>: real product screenshots from this version.

## Source and license

This repository is a one-way distribution mirror of [Xiaozhuang DSH](https://github.com/niushuanan/xiaozhuang-dsh), not an independent development source. It is synchronized from main-repository commit [`e745482d8f`](https://github.com/niushuanan/xiaozhuang-dsh/commit/e745482d8f5e33497d9ed46a2a88681456024334); the latest tagged release remains [`xiaozhuang-v0.4.2`](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2). Licensed under the [MIT License](LICENSE).
