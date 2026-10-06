# dsh-token-overview

当前 master 面向 Harness **0.2.1-alpha.1**，已使用 [dsh-plugin-upgrade-skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill/) 完成原生插件适配。下载当前分支获得本次源码更新；既有 Release 保持各自原版本。

[English](README.en.md) | 中文

[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-111111)](https://github.com/niushuanan/xiaozhuang-dsh) [![Release](https://img.shields.io/badge/release-xiaozhuang--v0.4.2-2563eb)](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2) [![MIT](https://img.shields.io/badge/license-MIT-16a34a)](LICENSE)

统一查看整台电脑上多个 AI 客户端的 Token、缓存、调用、活跃时段和预估成本。

Token 总览设置页复用产品统一标题层级；安装到尚未提供该共享组件的旧版 DSH 时会使用同尺寸的内置兼容标题。

当前 master 已统一总费用与分时图的价格口径：读取共享 Skill 核验的官方价格快照，在原生逐消息统计时计费，保留原始模型名、Token 数量和历史保护。费用为 API 等值估算，不是实际账单；活跃会话可能造成先后扫描的时间差异。本次未改动旧 Release，请使用 master 获取本次修复。

<p align="center"><img src="docs/16-token-overview.webp" alt="跨客户端 Token 指标与分时趋势" width="800"></p>

当前 master 按原生插件文件夹发布，设置入口保留插件自有的原设计图标；删除对应插件文件夹即可卸载。共享兼容补丁和安装检查见 [INSTALL.md](INSTALL.md)。

## 安装

1. 点击 GitHub 的 **Code → Download ZIP** 获取当前 master；旧 Release 不包含本次修复。
2. 把 ZIP 交给能够读取并修改目标 DSH 项目的 AI。
3. 对 AI 说：**先阅读压缩包里的 AGENTS.md、INSTALL.md 和 manifest.json，只安装这个插件，并保留现有插件、数据、对话、附件和设置。**
4. 安装 AI 会按目标 DSH 的当前结构合入代码和 Cordis 行，只验证本插件直接涉及的入口。

## 运行要求

- 需要用户已授权安装的最新共享 `tokscale-token-report` Skill，见 [安装声明](support/tokscale-token-report/INSTALL.md)。全机只保留一份 canonical Skill；本仓库不再携带容易过期的重复副本，也不包含本机报告、历史锁或价格缓存。

## 内容

- <code>payload/</code>：从主仓库复制的插件代码和必要运行资源。
- <code>manifest.json</code>：插件组成、来源、主仓库 commit 和逐文件 SHA-256。
- <code>INSTALL.md</code>：直接安装、冲突适配、失败恢复和最小验证说明。
- <code>docs/</code>：当前版本的真实产品截图。

## 来源与许可

本仓库是 [Xiaozhuang DSH](https://github.com/niushuanan/xiaozhuang-dsh) 的单向发布副本，不是独立开发源。当前内容同步自主仓库 commit [`e745482d8f`](https://github.com/niushuanan/xiaozhuang-dsh/commit/e745482d8f5e33497d9ed46a2a88681456024334)，最近正式发布版本仍为 [`xiaozhuang-v0.4.2`](https://github.com/niushuanan/dsh-token-overview/releases/tag/xiaozhuang-v0.4.2)。代码采用 [MIT License](LICENSE)。
