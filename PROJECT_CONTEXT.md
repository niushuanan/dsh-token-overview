# Project Context

## 这个项目是干什么的

`dsh-token-overview` 是 Xiaozhuang DSH 的 Token 总览独立分发仓库，用统一报表展示多客户端 Token、缓存、调用和预估成本。

## 代码结构是什么

- `payload/token-overview/`：可安装的 Profile Host／Client 包和资源。
- `support/tokscale-token-report/`：生成全机报告的配套 Skill。
- `manifest.json`：安装行、来源、主仓 commit 与逐文件哈希。
- `tests/`：不依赖目标 DSH 的发布包契约测试。

## 关键入口在哪里

- `payload/token-overview/profile/token-overview/lib/client.js`：设置页指标和趋势界面。
- `payload/token-overview/profile/token-overview/lib/index.js`：Host 快照与报表接口。
- `manifest.json`：安装器读取的完整性和组合入口。

## 最近改了什么

### 2026-08-29 - 统一设置页标题

- 本次任务：让 Token 总览与 Xiaozhuang DSH 其他插件设置页保持同一标题位置和字号。
- 改了哪些文件：Client 发布包、双语 README、manifest、契约测试和本文件。
- 改了什么：优先使用宿主 `SettingsSectionHeader`，旧宿主使用等尺寸内置兼容标题；删除旧独立标题 CSS 和左右偏移。
- 为什么这样改：独立插件重新安装后也必须保持产品一致，并兼容尚未提供共享组件的旧宿主。
- 影响了哪些模块：只影响 Token 总览设置页页头；统计范围、缓存、报告生成、Host 快照和数据协议不变。
- 验证：Client 语法检查、发布包契约测试、manifest 全量 4 文件大小／SHA-256 校验和 `git diff --check` 通过。
