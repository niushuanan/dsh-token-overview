# Project Context

## 这个项目是干什么的

`dsh-token-overview` 是 Xiaozhuang DSH 的 Token 总览独立分发仓库，用统一报表展示多客户端 Token、缓存、调用和预估成本。

## 代码结构是什么

- `payload/token-overview/`：可安装的完整原生插件文件夹，包含源码、构建入口、Cordis patch、Host／Client 产物和资源。
- `support/tokscale-token-report/INSTALL.md`：共享 Skill 的独立安装声明，不包含本机 Skill、报告或历史数据。
- `manifest.json`：安装行、来源、主仓 commit 与逐文件哈希。
- `tests/`：不依赖目标 DSH 的发布包契约测试。

## 关键入口在哪里

- `payload/token-overview/profile/token-overview/lib/client.js`：设置页指标和趋势界面。
- `payload/token-overview/profile/token-overview/lib/index.js`：Host 快照与报表接口。
- `manifest.json`：安装器读取的完整性和组合入口。

## 最近改了什么

### 2026-09-05 09:32 - 分时费用跟随共享官方价格

- 本次任务：同步主仓已推送的 Token 分时计费修复，保留独立原生插件的安装与显示契约。
- 改了哪些文件：插件 payload、manifest、双语 README、INSTALL、共享 Skill 安装声明和本文件。
- 改了什么：将报告价格快照传入原生小时统计器的私有配置，免费模型使用私有零价条目，旧快照启动时自动刷新；补齐源码与独立构建入口。移除重复打包的旧 Skill，改为依赖用户授权的 canonical 安装，机器已安装的 Skill 不受影响。
- 为什么这样改：总费用与分时图原先来自不同价格源；单一 Skill 和单一价格快照避免版本分叉与旧价残留。
- 影响了哪些模块：只影响 Token 总览后台计费和安装声明；前端交互、统计数量、全局 Tokscale 设置、原始会话和历史保护不变。第 1–3 节已复核并同步目录说明。

### 2026-08-29 - 统一设置页标题

- 本次任务：让 Token 总览与 Xiaozhuang DSH 其他插件设置页保持同一标题位置和字号。
- 改了哪些文件：Client 发布包、双语 README、manifest、契约测试和本文件。
- 改了什么：优先使用宿主 `SettingsSectionHeader`，旧宿主使用等尺寸内置兼容标题；删除旧独立标题 CSS 和左右偏移。
- 为什么这样改：独立插件重新安装后也必须保持产品一致，并兼容尚未提供共享组件的旧宿主。
- 影响了哪些模块：只影响 Token 总览设置页页头；统计范围、缓存、报告生成、Host 快照和数据协议不变。
- 验证：Client 语法检查、发布包契约测试、manifest 全量 4 文件大小／SHA-256 校验和 `git diff --check` 通过。
