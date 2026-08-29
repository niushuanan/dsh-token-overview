# dsh-token-overview

English | [中文](README.md)

[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-111111)](https://github.com/niushuanan/xiaozhuang-dsh) [![Release](https://img.shields.io/badge/release-xiaozhuang--v0.4.2-2563eb)](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2) [![MIT](https://img.shields.io/badge/license-MIT-16a34a)](LICENSE)

See tokens, cache usage, calls, active periods, and estimated cost across AI clients on the whole computer.

The Token Overview Settings page reuses the product's shared title hierarchy. Older DSH builds without that primitive receive a size-matched built-in fallback.

<p align="center"><img src="docs/16-token-overview.webp" alt="Cross-client token metrics and time-of-day trend" width="800"></p>

## Install

1. Open [Releases](https://github.com/niushuanan/dsh-token-overview/releases/latest) and download the attached ZIP.
2. Give the ZIP to an AI that can read and modify the target DSH project.
3. Tell the AI: **Read AGENTS.md, INSTALL.md, and manifest.json first. Install only this plugin and preserve existing plugins, data, conversations, attachments, and settings.**
4. The installing AI merges the code and Cordis rows into the target version and validates only the entry points directly owned by this plugin.

## Requirements

- The installing AI must copy `support/tokscale-token-report` to `~/.codex/skills/tokscale-token-report`. Machine reports, history locks, and pricing caches are not included.

## Contents

- <code>payload/</code>: plugin code and required runtime assets copied from the main repository.
- <code>manifest.json</code>: composition rows, sources, main-repository commit, and per-file SHA-256.
- <code>INSTALL.md</code>: direct installation, conflict adaptation, failure recovery, and narrow verification.
- <code>docs/</code>: real product screenshots from this version.

## Source and license

This repository is a one-way distribution mirror of [Xiaozhuang DSH](https://github.com/niushuanan/xiaozhuang-dsh), not an independent development source. It is synchronized from main-repository commit [`e4845a8168`](https://github.com/niushuanan/xiaozhuang-dsh/commit/e4845a81688efec24ecff6d9c61dfbe1b8194776); the latest tagged release remains [`xiaozhuang-v0.4.2`](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2). Licensed under the [MIT License](LICENSE).
