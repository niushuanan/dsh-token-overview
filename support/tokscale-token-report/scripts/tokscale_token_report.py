#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import platform
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


PINNED_TOKSCALE_VERSION = "4.5.3"
MIN_TOKSCALE_VERSION = (4, 5, 3)
SUPPORTED_TOKSCALE_MAJOR = 4
TOKSCALE_TIMEOUT_SECONDS = 300
DSH_SCAN_TIMEOUT_SECONDS = 300
DEFAULT_HISTORY_LOCK_PATH = (
    Path.home() / ".codex" / "tokscale-token-report" / "locked-history.json"
)
DEFAULT_PRICING_CACHE_PATH = (
    Path.home() / ".codex" / "tokscale-token-report" / "pricing-cache.json"
)
BUILTIN_RECOVERY_PATH = (
    Path(__file__).resolve().parent.parent
    / "assets"
    / "codex-lost-history-20260623-20260711.json"
)
DSH_SCAN_HELPER = Path(__file__).resolve().parent / "dsh_session_scan.mjs"
DSH_CLIENT = "dsh"

CANONICAL_DEEPSEEK_V4_PRO = "DeepSeek-V4-Pro"
CANONICAL_DEEPSEEK_V4_FLASH = "DeepSeek-V4-Flash"

METRIC_KEYS = (
    "processedTokens",
    "nonCacheTokens",
    "inputTokens",
    "outputTokens",
    "cacheReadTokens",
    "cacheWriteTokens",
    "reasoningTokens",
    "cost",
    "calls",
)


def which(command: str) -> str | None:
    return shutil.which(command)


def run_capture(command: list[str]) -> str:
    try:
        completed = subprocess.run(
            command,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=TOKSCALE_TIMEOUT_SECONDS,
            check=False,
        )
        if completed.returncode != 0:
            rendered = " ".join(command)
            output = "\n".join(
                part.strip()
                for part in (completed.stdout, completed.stderr)
                if part and part.strip()
            )
            raise RuntimeError(f"Command failed ({rendered}): {output}")
        return completed.stdout
    except OSError as exc:
        rendered = " ".join(command)
        raise RuntimeError(f"Command could not start ({rendered}): {exc}") from exc
    except subprocess.TimeoutExpired as exc:
        rendered = " ".join(command)
        raise RuntimeError(
            f"Command timed out after {TOKSCALE_TIMEOUT_SECONDS}s: {rendered}"
        ) from exc


def parse_semver(value: str) -> tuple[int, int, int] | None:
    match = re.search(r"(?<!\d)(\d+)\.(\d+)\.(\d+)(?!\d)", value or "")
    if not match:
        return None
    return tuple(int(part) for part in match.groups())


def is_supported_tokscale_version(version: tuple[int, int, int] | None) -> bool:
    return bool(
        version
        and version[0] == SUPPORTED_TOKSCALE_MAJOR
        and version >= MIN_TOKSCALE_VERSION
    )


@dataclass(frozen=True)
class TokscaleRuntime:
    command: tuple[str, ...]
    version: str
    source: str
    warnings: tuple[str, ...] = ()

    def as_dict(self) -> dict[str, Any]:
        return {
            "command": list(self.command),
            "version": self.version,
            "source": self.source,
            "warnings": list(self.warnings),
        }


def command_version(command: list[str]) -> tuple[str, tuple[int, int, int] | None]:
    output = run_capture([*command, "--version"]).strip()
    parsed = parse_semver(output)
    return output, parsed


def resolve_tokscale_runtime() -> TokscaleRuntime:
    warnings: list[str] = []
    installed = which("tokscale")
    if installed:
        try:
            version_text, version = command_version([installed])
            if is_supported_tokscale_version(version):
                return TokscaleRuntime(
                    command=(installed,),
                    version=".".join(str(part) for part in version),
                    source="installed",
                )
            warnings.append(
                f"Ignored installed tokscale ({version_text or 'unknown version'}): "
                f"requires compatible 4.x >= {PINNED_TOKSCALE_VERSION} for Codex fork deduplication."
            )
        except Exception as exc:
            warnings.append(f"Ignored installed tokscale because version detection failed: {exc}")

    npx = which("npx")
    if not npx:
        detail = " ".join(warnings) if warnings else "No installed tokscale was found."
        raise RuntimeError(
            f"{detail} Install tokscale {PINNED_TOKSCALE_VERSION} or make npx available."
        )

    pinned_command = [npx, "--yes", f"tokscale@{PINNED_TOKSCALE_VERSION}"]
    version_text, version = command_version(pinned_command)
    if version != MIN_TOKSCALE_VERSION:
        raise RuntimeError(
            f"Pinned tokscale resolved to an unexpected version ({version_text}). "
            f"Expected {PINNED_TOKSCALE_VERSION}."
        )
    return TokscaleRuntime(
        command=tuple(pinned_command),
        version=PINNED_TOKSCALE_VERSION,
        source="npx-pinned-fallback",
        warnings=tuple(warnings),
    )


def safe_int(value: Any) -> int:
    try:
        return max(0, int(value or 0))
    except (TypeError, ValueError):
        return 0


def safe_float(value: Any) -> float:
    try:
        return max(0.0, float(value or 0.0))
    except (TypeError, ValueError):
        return 0.0


def fmt_int(value: int) -> str:
    return f"{value:,}"


def fmt_usd(value: float) -> str:
    return f"${value:,.2f}"


def fmt_percent(value: float) -> str:
    return f"{value * 100:.1f}%"


def fmt_tokens_cn(value: int) -> str:
    if value >= 100_000_000:
        return f"{value / 100_000_000:.2f}亿"
    if value >= 10_000:
        return f"{value / 10_000:.0f}万"
    return f"{value:,}"


def local_today() -> dt.date:
    return dt.datetime.now().date()


def iso_today_local() -> str:
    return local_today().isoformat()


def iso_days_inclusive(days: int) -> str:
    if days <= 0:
        raise ValueError("--days must be a positive integer.")
    return (local_today() - dt.timedelta(days=days - 1)).isoformat()


def parse_iso_date(value: str | None, *, label: str) -> str | None:
    if value is None:
        return None
    try:
        return dt.date.fromisoformat(value).isoformat()
    except ValueError as exc:
        raise ValueError(f"{label} must use YYYY-MM-DD format: {value}") from exc


def canonical_model_id(model_id: Any) -> str:
    model = str(model_id or "").strip()
    if not model:
        return "unknown"
    lowered = model.lower().replace("_", "-")
    if "deepseek-v4-pro" in lowered:
        return CANONICAL_DEEPSEEK_V4_PRO
    if "deepseek-v4-flash" in lowered:
        return CANONICAL_DEEPSEEK_V4_FLASH
    return model


@dataclass
class TokenMetrics:
    input_tokens: int = 0
    output_tokens: int = 0
    reasoning_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    calls: int = 0
    cost: float = 0.0

    @property
    def non_cache_tokens(self) -> int:
        return self.input_tokens + self.output_tokens

    @property
    def cache_tokens(self) -> int:
        return self.cache_read_tokens + self.cache_write_tokens

    @property
    def processed_tokens(self) -> int:
        return self.non_cache_tokens + self.cache_tokens

    @property
    def cache_ratio(self) -> float:
        if self.processed_tokens <= 0:
            return 0.0
        return self.cache_tokens / self.processed_tokens

    def add(self, other: "TokenMetrics") -> None:
        self.input_tokens += other.input_tokens
        self.output_tokens += other.output_tokens
        self.reasoning_tokens += other.reasoning_tokens
        self.cache_read_tokens += other.cache_read_tokens
        self.cache_write_tokens += other.cache_write_tokens
        self.calls += other.calls
        self.cost += other.cost

    def as_dict(self) -> dict[str, Any]:
        return {
            "input": self.input_tokens,
            "output": self.output_tokens,
            "reasoning": self.reasoning_tokens,
            "cacheRead": self.cache_read_tokens,
            "cacheWrite": self.cache_write_tokens,
            "nonCacheTokens": self.non_cache_tokens,
            "processedTokens": self.processed_tokens,
            "cacheRatio": self.cache_ratio,
            "calls": self.calls,
            "cost": self.cost,
        }

    def as_dashboard_metrics(self) -> dict[str, float]:
        return {
            "processedTokens": float(self.processed_tokens),
            "nonCacheTokens": float(self.non_cache_tokens),
            "inputTokens": float(self.input_tokens),
            "outputTokens": float(self.output_tokens),
            "cacheReadTokens": float(self.cache_read_tokens),
            "cacheWriteTokens": float(self.cache_write_tokens),
            "reasoningTokens": float(self.reasoning_tokens),
            "cost": float(self.cost),
            "calls": float(self.calls),
        }


def metrics_from_entry(entry: dict[str, Any]) -> TokenMetrics:
    tokens = entry.get("tokens", {}) or {}
    return TokenMetrics(
        input_tokens=safe_int(tokens.get("input")),
        output_tokens=safe_int(tokens.get("output")),
        reasoning_tokens=safe_int(tokens.get("reasoning")),
        cache_read_tokens=safe_int(tokens.get("cacheRead")),
        cache_write_tokens=safe_int(tokens.get("cacheWrite")),
        calls=safe_int(entry.get("messages")),
        cost=safe_float(entry.get("cost")),
    )


def fallback_day_metrics(contribution: dict[str, Any]) -> TokenMetrics:
    tokens = contribution.get("tokenBreakdown", {}) or {}
    totals = contribution.get("totals", {}) or {}
    return TokenMetrics(
        input_tokens=safe_int(tokens.get("input")),
        output_tokens=safe_int(tokens.get("output")),
        reasoning_tokens=safe_int(tokens.get("reasoning")),
        cache_read_tokens=safe_int(tokens.get("cacheRead")),
        cache_write_tokens=safe_int(tokens.get("cacheWrite")),
        calls=safe_int(totals.get("messages")),
        cost=safe_float(totals.get("cost")),
    )


@dataclass
class RangeSummary:
    start: str
    end: str
    metrics: TokenMetrics


def summarize_graph(graph: dict[str, Any]) -> tuple[RangeSummary, dict[str, Any]]:
    meta = graph.get("meta", {}) or {}
    date_range = meta.get("dateRange", {}) or {}
    start = str(date_range.get("start") or "unknown")
    end = str(date_range.get("end") or "unknown")

    overall = TokenMetrics()
    by_client: dict[str, TokenMetrics] = {}
    by_model: dict[tuple[str, str, str], TokenMetrics] = {}
    by_day: list[tuple[str, TokenMetrics]] = []

    for contribution in graph.get("contributions", []) or []:
        day = str(contribution.get("date") or "unknown-date")
        entries = contribution.get("clients", []) or []
        day_metrics = TokenMetrics()

        if not entries:
            day_metrics = fallback_day_metrics(contribution)
            overall.add(day_metrics)
            by_day.append((day, day_metrics))
            continue

        for entry in entries:
            metrics = metrics_from_entry(entry)
            day_metrics.add(metrics)
            overall.add(metrics)

            client = str(entry.get("client") or "unknown")
            provider = str(entry.get("providerId") or "unknown")
            model = canonical_model_id(entry.get("modelId"))

            by_client.setdefault(client, TokenMetrics()).add(metrics)
            by_model.setdefault((client, provider, model), TokenMetrics()).add(metrics)

        by_day.append((day, day_metrics))

    by_day.sort(key=lambda item: item[0])
    top_days_by_tokens = sorted(
        by_day, key=lambda item: item[1].processed_tokens, reverse=True
    )[:10]
    top_days_by_cost = sorted(by_day, key=lambda item: item[1].cost, reverse=True)[:10]
    top_models = sorted(
        (
            {
                "client": client,
                "provider": provider,
                "model": model,
                "metrics": metrics,
            }
            for (client, provider, model), metrics in by_model.items()
        ),
        key=lambda item: item["metrics"].processed_tokens,
        reverse=True,
    )[:10]

    return (
        RangeSummary(start=start, end=end, metrics=overall),
        {
            "by_client": by_client,
            "by_day": by_day,
            "top_days_by_tokens": top_days_by_tokens,
            "top_days_by_cost": top_days_by_cost,
            "top_models_by_tokens": top_models,
        },
    )


def report_graph_summary(graph: dict[str, Any]) -> dict[str, Any]:
    summary, extra = summarize_graph(graph)
    metrics = summary.metrics
    contributions = graph.get("contributions", []) or []
    active_days = sum(
        1 for _, day_metrics in extra["by_day"] if day_metrics.processed_tokens > 0
    )
    models = sorted(
        {
            canonical_model_id(entry.get("modelId"))
            for contribution in contributions
            for entry in contribution.get("clients", []) or []
        }
    )
    return {
        "totalTokens": metrics.processed_tokens,
        **metrics.as_dict(),
        "totalCost": metrics.cost,
        "modelCalls": metrics.calls,
        "totalDays": len(contributions),
        "activeDays": active_days,
        "averageTokensPerActiveDay": (
            metrics.processed_tokens / active_days if active_days else 0.0
        ),
        "clients": sorted(extra["by_client"]),
        "models": models,
        "tokenSemantics": (
            "totalTokens/processedTokens = input + output + cacheRead + cacheWrite; "
            "reasoning is non-additive detail"
        ),
    }


def build_yearly_graph_buckets(graph: dict[str, Any]) -> list[dict[str, Any]]:
    by_year: dict[str, list[dict[str, Any]]] = {}
    for contribution in graph.get("contributions", []) or []:
        day = str(contribution.get("date") or "")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", day):
            continue
        by_year.setdefault(day[:4], []).append(contribution)

    buckets: list[dict[str, Any]] = []
    for year in sorted(by_year):
        contributions = by_year[year]
        metrics = summarize_graph({"contributions": contributions})[0].metrics
        dates = sorted(str(item.get("date")) for item in contributions)
        buckets.append(
            {
                "year": year,
                "totalTokens": metrics.processed_tokens,
                "processedTokens": metrics.processed_tokens,
                "nonCacheTokens": metrics.non_cache_tokens,
                "totalCost": metrics.cost,
                "modelCalls": metrics.calls,
                "range": {"start": dates[0], "end": dates[-1]},
                "reasoningIncludedInOutput": True,
            }
        )
    return buckets


def normalize_graph_snapshot(graph: dict[str, Any]) -> dict[str, Any]:
    """Create a report-facing graph while preserving the raw snapshot separately."""
    normalized = json.loads(json.dumps(graph))
    for contribution in normalized.get("contributions", []) or []:
        entries = contribution.get("clients", []) or []
        day_metrics = TokenMetrics()
        if entries:
            for entry in entries:
                day_metrics.add(metrics_from_entry(entry))
        else:
            day_metrics = fallback_day_metrics(contribution)

        contribution["tokenBreakdown"] = {
            "input": day_metrics.input_tokens,
            "output": day_metrics.output_tokens,
            "reasoning": day_metrics.reasoning_tokens,
            "cacheRead": day_metrics.cache_read_tokens,
            "cacheWrite": day_metrics.cache_write_tokens,
        }
        totals = dict(contribution.get("totals") or {})
        totals.update(
            {
                "tokens": day_metrics.processed_tokens,
                "processedTokens": day_metrics.processed_tokens,
                "nonCacheTokens": day_metrics.non_cache_tokens,
                "cost": day_metrics.cost,
                "messages": day_metrics.calls,
                "reasoningIncludedInOutput": True,
            }
        )
        contribution["totals"] = totals

    meta = dict(normalized.get("meta") or {})
    meta["normalizedForReport"] = True
    normalized["meta"] = meta
    normalized["years"] = build_yearly_graph_buckets(normalized)
    normalized["summary"] = report_graph_summary(normalized)
    return normalized


def contribution_processed_tokens(contribution: dict[str, Any]) -> int:
    return summarize_graph({"contributions": [contribution]})[0].metrics.processed_tokens


def filter_contribution_clients(
    contribution: dict[str, Any],
    clients: list[str] | None,
) -> dict[str, Any] | None:
    copied = json.loads(json.dumps(contribution))
    if not clients:
        return copied
    allowed = set(clients)
    copied["clients"] = [
        entry
        for entry in copied.get("clients", []) or []
        if str(entry.get("client") or "unknown") in allowed
    ]
    if not copied["clients"]:
        return None
    normalized = normalize_graph_snapshot(
        {"meta": {}, "contributions": [copied]}
    )
    return normalized["contributions"][0]


def merge_history_lock(
    live_graph: dict[str, Any],
    history: dict[str, Any],
    *,
    today: str,
    clients: list[str] | None = None,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Use locked completed-day snapshots as a floor when live logs shrink."""
    merged = json.loads(json.dumps(live_graph))
    live_by_day: dict[str, dict[str, Any]] = {}
    for item in live_graph.get("contributions", []) or []:
        filtered = filter_contribution_clients(item, clients)
        if filtered is not None and filtered.get("date"):
            live_by_day[str(filtered["date"])] = filtered
    locked_by_day: dict[str, dict[str, Any]] = {}
    for item in history.get("contributions", []) or []:
        filtered = filter_contribution_clients(item, clients)
        if (
            filtered is not None
            and filtered.get("date")
            and str(filtered["date"]) < today
        ):
            locked_by_day[str(filtered["date"])] = filtered

    restored_dates: list[str] = []
    selected: list[dict[str, Any]] = []
    for day in sorted(set(live_by_day) | set(locked_by_day)):
        live = live_by_day.get(day)
        locked = locked_by_day.get(day)
        if locked is None or day >= today:
            chosen = live
        elif live is None or contribution_processed_tokens(locked) >= contribution_processed_tokens(live):
            chosen = locked
            if live is None or contribution_processed_tokens(locked) > contribution_processed_tokens(live):
                restored_dates.append(day)
        else:
            chosen = live
        if chosen is not None:
            selected.append(json.loads(json.dumps(chosen)))

    merged["contributions"] = selected
    merged.pop("timeMetrics", None)
    meta = dict(merged.get("meta") or {})
    dates = [str(item.get("date")) for item in selected if item.get("date")]
    if dates:
        meta["dateRange"] = {"start": min(dates), "end": max(dates)}
    meta["historyLockApplied"] = True
    merged["meta"] = meta
    merged["years"] = build_yearly_graph_buckets(merged)
    merged["summary"] = report_graph_summary(merged)
    return merged, {
        "enabled": True,
        "lockedThrough": history.get("lockedThrough"),
        "protectedDates": len(locked_by_day),
        "restoredDates": restored_dates,
        "builtinRecoveries": history.get("builtinRecoveries", []),
    }


def update_history_state(
    history: dict[str, Any],
    graph: dict[str, Any],
    *,
    today: str,
) -> dict[str, Any]:
    """Advance the persistent completed-day floor without allowing regressions."""
    updated = json.loads(json.dumps(history))
    by_day = {
        str(item.get("date") or ""): item
        for item in updated.get("contributions", []) or []
        if item.get("date") and str(item.get("date")) < today
    }
    for contribution in graph.get("contributions", []) or []:
        day = str(contribution.get("date") or "")
        if not day or day >= today:
            continue
        existing = by_day.get(day)
        if existing is None or contribution_processed_tokens(contribution) > contribution_processed_tokens(existing):
            by_day[day] = json.loads(json.dumps(contribution))

    updated["schemaVersion"] = 1
    updated["contributions"] = [by_day[day] for day in sorted(by_day)]
    updated["lockedThrough"] = max(by_day) if by_day else None
    updated["updatedAt"] = dt.datetime.now().isoformat(timespec="seconds")
    updated["semantics"] = {
        "processedTokens": "input + output + cacheRead + cacheWrite",
        "reasoningTokens": "detail included in output; never added to totals",
        "completedDayRule": "highest fork-safe snapshot by processed tokens is retained as a non-decreasing floor",
        "costBasis": "costs are not locked; they are repriced at report time from the authoritative pricing catalog",
    }
    updated.setdefault("sources", [])
    return updated


def import_history_snapshot(
    report_dir: Path,
    history: dict[str, Any],
) -> dict[str, Any]:
    """Import only completed days from a report made by a fork-safe runtime."""
    runtime_path = report_dir / "runtime.json"
    graph_path = report_dir / "graph.all.json"
    if not runtime_path.is_file() or not graph_path.is_file():
        raise ValueError(
            f"History snapshot must contain runtime.json and graph.all.json: {report_dir}"
        )

    runtime_meta = json.loads(runtime_path.read_text(encoding="utf-8"))
    runtime_version = str((runtime_meta.get("runtime") or {}).get("version") or "")
    if not is_supported_tokscale_version(parse_semver(runtime_version)):
        raise ValueError(
            f"History snapshot runtime is not fork-safe: {runtime_version or 'unknown'}"
        )
    generated_at = str(runtime_meta.get("generatedAt") or "")
    try:
        generated_date = dt.datetime.fromisoformat(generated_at).date()
    except ValueError as exc:
        raise ValueError(f"History snapshot has invalid generatedAt: {generated_at}") from exc

    graph_bytes = graph_path.read_bytes()
    graph = json.loads(graph_bytes)
    if not bool((graph.get("meta") or {}).get("normalizedForReport")):
        raise ValueError("History snapshot graph.all.json is not report-normalized.")

    updated = update_history_state(
        history,
        graph,
        today=generated_date.isoformat(),
    )
    graph_sha256 = hashlib.sha256(graph_bytes).hexdigest()
    source = {
        "path": str(report_dir.resolve()),
        "generatedAt": generated_at,
        "runtimeVersion": runtime_version,
        "lockedThrough": (generated_date - dt.timedelta(days=1)).isoformat(),
        "graphSha256": graph_sha256,
    }
    sources = updated.setdefault("sources", [])
    if not any(item.get("graphSha256") == graph_sha256 for item in sources):
        sources.append(source)
    return updated


def load_history_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {
            "schemaVersion": 1,
            "lockedThrough": None,
            "contributions": [],
            "sources": [],
        }
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("schemaVersion") != 1 or not isinstance(
        payload.get("contributions"), list
    ):
        raise ValueError(f"Unsupported or invalid history lock: {path}")
    payload.setdefault("sources", [])
    return payload


def load_builtin_recovery(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise ValueError(f"Built-in lost-history recovery is missing: {path}")
    payload = json.loads(path.read_text(encoding="utf-8"))
    if (
        payload.get("schemaVersion") != 1
        or payload.get("kind") != "builtin-lost-codex-history"
        or not payload.get("datasetId")
        or not payload.get("lossNotice")
        or not isinstance(payload.get("contributions"), list)
    ):
        raise ValueError(f"Built-in lost-history recovery is invalid: {path}")
    runtime_version = str(
        (payload.get("sourceSnapshot") or {}).get("runtimeVersion") or ""
    )
    if not is_supported_tokscale_version(parse_semver(runtime_version)):
        raise ValueError(
            f"Built-in recovery runtime is not fork-safe: {runtime_version or 'unknown'}"
        )
    affected_dates = sorted(str(day) for day in payload.get("affectedDates", []))
    contribution_dates = sorted(
        str(item.get("date"))
        for item in payload["contributions"]
        if item.get("date")
    )
    if not affected_dates or affected_dates != contribution_dates:
        raise ValueError(
            "Built-in recovery affectedDates do not match its contribution records."
        )
    estimated_dates = sorted(str(day) for day in payload.get("estimatedDates", []))
    if estimated_dates:
        if not payload.get("estimationNotice") or not isinstance(
            payload.get("estimationMethod"), dict
        ):
            raise ValueError(
                "Built-in recovery estimated dates require an estimation notice and method."
            )
        by_day = {
            str(item.get("date")): item
            for item in payload["contributions"]
            if item.get("date")
        }
        if any(day not in by_day for day in estimated_dates) or any(
            (by_day[day].get("recoveryRecord") or {}).get("type")
            != "user-directed-estimate"
            for day in estimated_dates
        ):
            raise ValueError(
                "Built-in recovery estimated dates must identify estimated contribution records."
            )
    return payload


def load_history_with_builtin_recovery(
    history_path: Path,
    *,
    recovery_path: Path = BUILTIN_RECOVERY_PATH,
) -> dict[str, Any]:
    history = load_history_state(history_path)
    recovery = load_builtin_recovery(recovery_path)
    history = update_history_state(
        history,
        {"contributions": recovery["contributions"]},
        today="9999-12-31",
    )
    source = {
        "kind": recovery["kind"],
        "datasetId": recovery["datasetId"],
        "lossNotice": recovery["lossNotice"],
        "affectedDates": recovery["affectedDates"],
        "noCurrentCodexRecordDates": recovery.get(
            "noCurrentCodexRecordDates", []
        ),
        "partialCurrentCodexRecordDates": recovery.get(
            "partialCurrentCodexRecordDates", []
        ),
        "estimatedDates": recovery.get("estimatedDates", []),
        "estimationNotice": recovery.get("estimationNotice"),
        "estimationMethod": recovery.get("estimationMethod", {}),
        "sourceSnapshot": recovery.get("sourceSnapshot", {}),
        "embeddedTotals": recovery.get("embeddedTotals", {}),
        "recoveredDelta": recovery.get("recoveredDelta", {}),
        "bundledPath": str(recovery_path.resolve()),
    }
    bundled_path = source["bundledPath"]
    sources = [
        item
        for item in history.setdefault("sources", [])
        if not (
            item.get("kind") == recovery["kind"]
            and item.get("bundledPath") == bundled_path
        )
    ]
    sources.append(source)
    history["sources"] = sources
    history["builtinRecoveries"] = [source]
    return history


def write_history_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_text(
        json.dumps(state, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    temporary.replace(path)


def filter_graph_by_date(
    graph: dict[str, Any],
    *,
    since: str,
    until: str,
) -> dict[str, Any]:
    """Derive a date-scoped graph from one immutable all-time snapshot."""
    filtered = json.loads(json.dumps(graph))
    contributions = [
        contribution
        for contribution in graph.get("contributions", []) or []
        if since <= str(contribution.get("date") or "") <= until
    ]
    filtered["contributions"] = contributions

    meta = dict(filtered.get("meta") or {})
    meta["dateRange"] = {"start": since, "end": until}
    meta["derivedFromSingleSnapshot"] = True
    filtered["meta"] = meta

    filtered.pop("timeMetrics", None)
    filtered["years"] = build_yearly_graph_buckets(filtered)
    filtered["summary"] = report_graph_summary(filtered)
    return filtered


def build_monthly_from_graph(graph: dict[str, Any]) -> dict[str, Any]:
    """Build report-facing monthly totals from the same graph snapshot."""
    monthly_totals: dict[str, TokenMetrics] = {}
    monthly_models: dict[str, set[str]] = {}

    for contribution in graph.get("contributions", []) or []:
        day = str(contribution.get("date") or "")
        month = day[:7]
        if len(month) != 7:
            continue

        bucket = monthly_totals.setdefault(month, TokenMetrics())
        model_bucket = monthly_models.setdefault(month, set())
        entries = contribution.get("clients", []) or []
        if not entries:
            bucket.add(fallback_day_metrics(contribution))
            continue

        for entry in entries:
            bucket.add(metrics_from_entry(entry))
            model_bucket.add(canonical_model_id(entry.get("modelId")))

    entries: list[dict[str, Any]] = []
    for month in sorted(monthly_totals):
        metrics = monthly_totals[month]
        entries.append(
            {
                "month": month,
                "models": sorted(monthly_models[month]),
                "input": metrics.input_tokens,
                "output": metrics.output_tokens,
                "reasoning": metrics.reasoning_tokens,
                "cacheRead": metrics.cache_read_tokens,
                "cacheWrite": metrics.cache_write_tokens,
                "nonCacheTokens": metrics.non_cache_tokens,
                "processedTokens": metrics.processed_tokens,
                "messageCount": metrics.calls,
                "cost": metrics.cost,
            }
        )

    return {
        "source": "derived-from-graph-all-single-snapshot",
        "tokenSemantics": (
            "processedTokens = input + output + cacheRead + cacheWrite; "
            "reasoning is non-additive detail"
        ),
        "entries": entries,
        "totalProcessedTokens": sum(
            entry["processedTokens"] for entry in entries
        ),
        "totalNonCacheTokens": sum(entry["nonCacheTokens"] for entry in entries),
        "totalCost": sum(entry["cost"] for entry in entries),
    }


def render_range_md(
    title: str,
    summary: RangeSummary,
    extra: dict[str, Any],
    *,
    daily_rows: int,
) -> str:
    metrics = summary.metrics
    lines = [
        f"## {title}",
        f"- Range: `{summary.start}` to `{summary.end}` (local date)",
        f"- Processed tokens: {fmt_int(metrics.processed_tokens)}",
        f"- Non-cache tokens: {fmt_int(metrics.non_cache_tokens)}",
        f"- Cache ratio: {fmt_percent(metrics.cache_ratio)}",
        f"- Model calls: {fmt_int(metrics.calls)}",
        f"- Cost (estimated): {fmt_usd(metrics.cost)}",
        "",
        "**Token breakdown**",
        f"- Uncached input: {fmt_int(metrics.input_tokens)}",
        f"- Output: {fmt_int(metrics.output_tokens)}",
        f"- Cache read: {fmt_int(metrics.cache_read_tokens)}",
        f"- Cache write: {fmt_int(metrics.cache_write_tokens)}",
        f"- Reasoning detail (already included in output; not additive): {fmt_int(metrics.reasoning_tokens)}",
        "",
        "**By client**",
    ]

    for client, client_metrics in sorted(
        extra["by_client"].items(),
        key=lambda item: item[1].processed_tokens,
        reverse=True,
    ):
        lines.append(
            f"- `{client}`: processed {fmt_int(client_metrics.processed_tokens)}, "
            f"non-cache {fmt_int(client_metrics.non_cache_tokens)}, "
            f"cache {fmt_percent(client_metrics.cache_ratio)}, "
            f"calls {fmt_int(client_metrics.calls)}, cost {fmt_usd(client_metrics.cost)}"
        )

    lines.extend(["", "**Top models (by processed tokens)**"])
    for item in extra["top_models_by_tokens"]:
        item_metrics: TokenMetrics = item["metrics"]
        lines.append(
            f"- `{item['client']}/{item['model']}` ({item['provider']}): "
            f"{fmt_tokens_cn(item_metrics.processed_tokens)}, "
            f"calls {fmt_int(item_metrics.calls)}"
        )

    lines.extend(["", "**Top days (by processed tokens)**"])
    for day, day_metrics in extra["top_days_by_tokens"]:
        lines.append(
            f"- `{day}`: {fmt_int(day_metrics.processed_tokens)}, "
            f"cache {fmt_percent(day_metrics.cache_ratio)}, "
            f"calls {fmt_int(day_metrics.calls)}, cost {fmt_usd(day_metrics.cost)}"
        )

    if extra["by_day"]:
        recent = extra["by_day"][-daily_rows:]
        lines.extend(
            [
                "",
                f"**Daily (last {len(recent)} days in this range)**",
                "",
                "| date | processed | non-cache | cache ratio | model calls | cost |",
                "|---|---:|---:|---:|---:|---:|",
            ]
        )
        for day, day_metrics in recent:
            lines.append(
                f"| `{day}` | {fmt_int(day_metrics.processed_tokens)} | "
                f"{fmt_int(day_metrics.non_cache_tokens)} | "
                f"{fmt_percent(day_metrics.cache_ratio)} | "
                f"{fmt_int(day_metrics.calls)} | {fmt_usd(day_metrics.cost)} |"
            )

    return "\n".join(lines)


def _series_from_daily(
    labels: Iterable[str],
    per_day: list[dict[str, TokenMetrics]],
) -> dict[str, dict[str, list[float]]]:
    output: dict[str, dict[str, list[float]]] = {}
    for label in labels:
        series = {key: [] for key in METRIC_KEYS}
        for day_map in per_day:
            values = day_map.get(label, TokenMetrics()).as_dashboard_metrics()
            for key in METRIC_KEYS:
                series[key].append(values[key])
        output[label] = series
    return output


def to_dashboard_dataset(
    graph: dict[str, Any],
    *,
    top_models: int,
    report_meta: dict[str, Any],
) -> dict[str, Any]:
    days: list[str] = []
    daily_total_metrics: list[TokenMetrics] = []
    daily_client_metrics: list[dict[str, TokenMetrics]] = []
    daily_model_metrics: list[dict[str, TokenMetrics]] = []
    model_totals: dict[str, TokenMetrics] = {}
    model_catalog: dict[str, dict[str, str]] = {}

    for contribution in graph.get("contributions", []) or []:
        days.append(str(contribution.get("date") or "unknown-date"))
        entries = contribution.get("clients", []) or []
        totals = TokenMetrics()
        by_client: dict[str, TokenMetrics] = {}
        by_model: dict[str, TokenMetrics] = {}

        if not entries:
            totals = fallback_day_metrics(contribution)
        else:
            for entry in entries:
                metrics = metrics_from_entry(entry)
                totals.add(metrics)
                client = str(entry.get("client") or "unknown")
                model = canonical_model_id(entry.get("modelId"))
                model_label = f"{client}/{model}"
                by_client.setdefault(client, TokenMetrics()).add(metrics)
                by_model.setdefault(model_label, TokenMetrics()).add(metrics)
                model_totals.setdefault(model_label, TokenMetrics()).add(metrics)
                model_catalog.setdefault(
                    model_label,
                    {
                        "label": model_label,
                        "client": client,
                        "provider": str(entry.get("providerId") or "unknown"),
                        "model": model,
                    },
                )

        daily_total_metrics.append(totals)
        daily_client_metrics.append(by_client)
        daily_model_metrics.append(by_model)

    sorted_models = sorted(
        model_totals,
        key=lambda label: model_totals[label].processed_tokens,
        reverse=True,
    )
    selected_models = sorted_models[: max(1, top_models)]
    daily_totals = {key: [] for key in METRIC_KEYS}
    for metrics in daily_total_metrics:
        values = metrics.as_dashboard_metrics()
        for key in METRIC_KEYS:
            daily_totals[key].append(values[key])

    client_labels = sorted(
        {label for day_map in daily_client_metrics for label in day_map}
    )
    model_labels = [*sorted_models]

    return {
        "meta": {
            **(graph.get("meta", {}) or {}),
            "report": report_meta,
        },
        "days": days,
        "clients": client_labels,
        "modelCatalog": [model_catalog[label] for label in model_labels],
        "dailyTotals": daily_totals,
        "dailyClients": _series_from_daily(client_labels, daily_client_metrics),
        "dailyModels": _series_from_daily(model_labels, daily_model_metrics),
        "topModelsByTokens": [
            {
                "model": label,
                "tokens": model_totals[label].processed_tokens,
                "calls": model_totals[label].calls,
                **model_catalog[label],
                **model_totals[label].as_dashboard_metrics(),
            }
            for label in selected_models
        ],
    }


def aggregate_values(days: list[str], values: list[float]) -> dict[str, Any]:
    by_week: dict[str, float] = {}
    by_month: dict[str, float] = {}
    for day, value in zip(days, values):
        try:
            date = dt.date.fromisoformat(day)
        except ValueError:
            continue
        iso_year, iso_week, _ = date.isocalendar()
        week_key = f"{iso_year}-W{iso_week:02d}"
        month_key = f"{date.year:04d}-{date.month:02d}"
        by_week[week_key] = by_week.get(week_key, 0.0) + float(value)
        by_month[month_key] = by_month.get(month_key, 0.0) + float(value)
    week_labels = sorted(by_week)
    month_labels = sorted(by_month)
    return {
        "weeks": {"labels": week_labels, "values": [by_week[key] for key in week_labels]},
        "months": {
            "labels": month_labels,
            "values": [by_month[key] for key in month_labels],
        },
    }


def write_dashboard_files(
    *,
    out_dir: Path,
    dataset: dict[str, Any],
    aggregates: dict[str, Any],
    monthly: dict[str, Any],
) -> None:
    skill_root = Path(__file__).resolve().parent.parent
    shutil.copy2(skill_root / "assets" / "report.template.html", out_dir / "report.html")
    chart_source = skill_root / "assets" / "chart.umd.min.js"
    if chart_source.exists():
        shutil.copy2(chart_source, out_dir / "chart.umd.min.js")

    data_js = (
        "window.__TOKSCALE_DATA__="
        + json.dumps(dataset, ensure_ascii=False)
        + ";\nwindow.__TOKSCALE_AGG__="
        + json.dumps(aggregates, ensure_ascii=False)
        + ";\nwindow.__TOKSCALE_MONTHLY__="
        + json.dumps(monthly, ensure_ascii=False)
        + ";\n"
    )
    (out_dir / "data.js").write_text(data_js, encoding="utf-8")


def schedule_delete(path: Path, *, delay_seconds: int) -> None:
    if delay_seconds <= 0:
        return
    cleanup_code = (
        "import shutil,time,sys,pathlib;"
        "time.sleep(int(sys.argv[2]));"
        "shutil.rmtree(pathlib.Path(sys.argv[1]), ignore_errors=True)"
    )
    try:
        subprocess.Popen(
            [sys.executable, "-c", cleanup_code, str(path), str(delay_seconds)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
    except Exception:
        pass


def client_flags(clients: list[str] | None) -> list[str]:
    if not clients:
        return []
    return ["-c", ",".join(clients)]


def load_tokscale_json(
    runtime: TokscaleRuntime,
    subcommand: str,
    *,
    clients: list[str] | None = None,
    flags: list[str] | None = None,
) -> Any:
    command = [*runtime.command, subcommand, *client_flags(clients), *(flags or [])]
    if subcommand != "graph":
        command.append("--json")
    if subcommand != "clients":
        command.append("--no-spinner")
    return json.loads(run_capture(command))


def forwarded_tokscale_clients(clients: list[str] | None) -> list[str] | None:
    """Client ids to pass to the tokscale CLI; ``dsh`` is scanned locally."""
    if clients is None:
        return None
    forwarded = [client for client in clients if client != DSH_CLIENT]
    return forwarded


def default_dsh_sessions_root() -> Path:
    """DSH sessions root: ``$DSH_HOME/sessions`` or ``~/.dsh/sessions``."""
    dsh_home = os.environ.get("DSH_HOME")
    base = Path(dsh_home).expanduser() if dsh_home else Path.home() / ".dsh"
    return base / "sessions"


def run_dsh_scan(sessions_root: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """
    Scan DSH session artifacts through the bundled Node helper and return its
    per-session records plus the scan metadata. Raises when the helper cannot
    run; a missing sessions root returns an empty, labeled scan instead.
    """
    node = which("node")
    if not node:
        raise RuntimeError(
            "DSH session scan requires Node.js >= 22.5 (Zstandard decoding); "
            "node was not found on PATH."
        )
    if not DSH_SCAN_HELPER.is_file():
        raise RuntimeError(f"DSH scan helper is missing: {DSH_SCAN_HELPER}")
    if not sessions_root.is_dir():
        return [], {
            "sessionsRoot": str(sessions_root),
            "missing": True,
            "files": 0,
            "sessions": 0,
            "usageRecords": 0,
            "errors": [],
        }
    try:
        completed = subprocess.run(
            [node, str(DSH_SCAN_HELPER), "--root", str(sessions_root)],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=DSH_SCAN_TIMEOUT_SECONDS,
            check=False,
        )
    except OSError as exc:
        raise RuntimeError(f"DSH scan could not start ({node}): {exc}") from exc
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"DSH scan timed out after {DSH_SCAN_TIMEOUT_SECONDS}s: {sessions_root}"
        ) from exc
    if completed.returncode != 0:
        rendered = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(f"DSH scan failed ({sessions_root}): {rendered}")

    sessions: list[dict[str, Any]] = []
    meta: dict[str, Any] = {}
    for line in completed.stdout.splitlines():
        if not line.strip():
            continue
        record = json.loads(line)
        if record.get("kind") == "session":
            sessions.append(record)
        elif record.get("kind") == "meta":
            meta = record
    return sessions, meta


def dsh_usage_boundary(session: dict[str, Any]) -> int:
    """
    First seq that belongs to THIS session (inclusive), never to a seeded
    parent lineage.

    - ``header.seedLength`` is the durable fork boundary: a forked/subagent
      session's seeded prefix [0, seedLength) is inherited parent history.
    - Root sessions (no parent linkage) count their full log: a resumed root's
      constructor seed is its own stored history, so nothing is skipped.
    - A parent-linked session without the durable field (older writers) uses
      its FIRST ``session/end-seed`` marker + 1: that marker sits at the end of
      the original constructor seed, and a later resume appends further
      markers only at the END of the log, so the first marker stays stable.
    """
    seed_length = session.get("seedLength")
    if isinstance(seed_length, int) and seed_length >= 0:
        return seed_length
    if session.get("hasParent"):
        first_end_seed = session.get("firstEndSeedSeq")
        if isinstance(first_end_seed, int) and first_end_seed >= 0:
            return first_end_seed + 1
        return 0
    return 0


def build_dsh_contributions(
    sessions: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """
    Aggregate fork-safe DSH usage records into tokscale-shaped contributions.

    DSH ``TokenUsage`` counts are disjoint: ``outputTokens`` EXCLUDES
    ``reasoningTokens``, unlike raw Codex logs. Reasoning folds into the
    billed output here (and stays a non-additive display detail), so the
    skill's processed-token standard holds across clients.
    """
    by_day: dict[str, dict[tuple[str, str], dict[str, Any]]] = {}
    stats = {
        "sessions": 0,
        "usageRecords": 0,
        "countedRecords": 0,
        "skippedSeededRecords": 0,
    }
    for session in sessions:
        stats["sessions"] += 1
        boundary = dsh_usage_boundary(session)
        for record in session.get("usage", []) or []:
            stats["usageRecords"] += 1
            seq = record.get("seq")
            time_ms = record.get("time")
            if not isinstance(seq, int) or not isinstance(time_ms, int) or seq < boundary:
                stats["skippedSeededRecords"] += 1
                continue
            stats["countedRecords"] += 1
            day = dt.datetime.fromtimestamp(time_ms / 1000).date().isoformat()
            provider = str(record.get("provider") or "unknown")
            model = str(record.get("model") or "unknown")
            bucket = by_day.setdefault(day, {}).setdefault(
                (provider, model),
                {
                    "client": DSH_CLIENT,
                    "providerId": provider,
                    "modelId": model,
                    "tokens": {
                        "input": 0,
                        "output": 0,
                        "cacheRead": 0,
                        "cacheWrite": 0,
                        "reasoning": 0,
                    },
                    "messages": 0,
                    "cost": 0.0,
                },
            )
            tokens = bucket["tokens"]
            tokens["input"] += safe_int(record.get("input"))
            tokens["output"] += safe_int(record.get("output")) + safe_int(
                record.get("reasoning")
            )
            tokens["cacheRead"] += safe_int(record.get("cacheRead"))
            tokens["cacheWrite"] += safe_int(record.get("cacheWrite"))
            tokens["reasoning"] += safe_int(record.get("reasoning"))
            bucket["messages"] += 1

    contributions: list[dict[str, Any]] = []
    for day in sorted(by_day):
        contributions.append(
            {
                "date": day,
                "totals": {"tokens": 0, "cost": 0.0, "messages": 0},
                "intensity": 1,
                "clients": list(by_day[day].values()),
            }
        )
    return contributions, stats


def merge_dsh_contributions(
    graph: dict[str, Any],
    contributions: list[dict[str, Any]],
) -> dict[str, Any]:
    """Append DSH contribution entries into the tokscale graph snapshot."""
    merged = json.loads(json.dumps(graph))
    merged.setdefault("contributions", [])
    by_date = {
        str(contribution.get("date") or ""): contribution
        for contribution in merged["contributions"]
    }
    for contribution in contributions:
        day = str(contribution.get("date") or "")
        existing = by_date.get(day)
        if existing is not None:
            existing.setdefault("clients", []).extend(contribution["clients"])
        else:
            merged["contributions"].append(contribution)
            by_date[day] = contribution
    merged["contributions"].sort(key=lambda item: str(item.get("date") or ""))
    return merged


def dsh_model_entries(contributions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Model catalog entries for every DSH model that appeared in the scan."""
    seen: set[str] = set()
    entries: list[dict[str, Any]] = []
    for contribution in contributions:
        for entry in contribution.get("clients", []) or []:
            model = str(entry.get("modelId") or "").strip()
            if not model or model in seen:
                continue
            seen.add(model)
            entries.append(
                {
                    "model": model,
                    "client": DSH_CLIENT,
                    "provider": str(entry.get("providerId") or "unknown"),
                    "source": "dsh-scan",
                }
            )
    return entries


def pricing_row_by_model(
    pricing_rows: list[dict[str, Any]],
    model: str,
) -> dict[str, Any] | None:
    for row in pricing_rows:
        if str(row.get("model") or "") == model:
            return row
    return None


def reprice_graph_costs(
    graph: dict[str, Any],
    pricing_rows: list[dict[str, Any]],
    *,
    label: str,
    warned: set[str] | None = None,
) -> tuple[list[str], dict[str, Any]]:
    """
    Recompute every entry cost as token breakdown x the authoritative pricing
    catalog (official list rates via `tokscale pricing`, USD per 1M tokens).

    Tokscale's graph engine silently mixes pricing sources (for example a
    discount-channel OpenRouter listing at half the official LiteLLM rate), so
    identical token volumes were reported at costs up to 2x apart depending on
    which source a scan happened to hit. The report therefore never adopts
    engine costs: every matched model is repriced deterministically, and the
    same recompute runs over the live scan and the persistent history floor,
    keeping day-to-day and cross-report comparisons on a single price basis.

    Fallback rules (never hide a model, never fail the report):
    - unmatched model: keep the entry's existing cost (DSH entries carry 0.0
      before pricing, so their cost stays excluded) and warn once per model;
    - a rate that is None while the corresponding token count is positive:
      keep the existing cost and warn once per model.
    """
    warnings: list[str] = []
    warned = warned if warned is not None else set()
    stats: dict[str, Any] = {
        "label": label,
        "entriesRepriced": 0,
        "entriesKept": 0,
        "unmatchedModels": [],
        "maxAbsDelta": 0.0,
        "totalAbsDelta": 0.0,
    }
    rate_fields = ("input", "cacheRead", "cacheWrite", "output")
    for contribution in graph.get("contributions", []) or []:
        for entry in contribution.get("clients", []) or []:
            model = str(entry.get("modelId") or "")
            tokens = entry.get("tokens", {}) or {}
            row = pricing_row_by_model(pricing_rows, model)
            matched = row is not None and row.get("status") == "matched"
            missing_rates = (
                [
                    name
                    for name in rate_fields
                    if row.get(name) is None and safe_int(tokens.get(name)) > 0
                ]
                if matched
                else rate_fields
            )
            if not matched or missing_rates:
                stats["entriesKept"] += 1
                if model not in warned:
                    warned.add(model)
                    stats["unmatchedModels"].append(model)
                    if not matched:
                        warnings.append(
                            f"{label}: model {model} has no matched authoritative "
                            f"pricing; its recorded cost is kept as-is."
                        )
                    else:
                        warnings.append(
                            f"{label}: model {model} is missing official "
                            f"{', '.join(missing_rates)} rate(s) while tokens "
                            f"exist; its recorded cost is kept as-is."
                        )
                continue
            old_cost = safe_float(entry.get("cost"))
            new_cost = (
                safe_int(tokens.get("input")) * float(row.get("input") or 0.0)
                + safe_int(tokens.get("cacheRead"))
                * float(row.get("cacheRead") or 0.0)
                + safe_int(tokens.get("cacheWrite"))
                * float(row.get("cacheWrite") or 0.0)
                + safe_int(tokens.get("output")) * float(row.get("output") or 0.0)
            ) / 1_000_000
            entry["cost"] = new_cost
            delta = abs(new_cost - old_cost)
            stats["entriesRepriced"] += 1
            stats["totalAbsDelta"] += delta
            if delta > stats["maxAbsDelta"]:
                stats["maxAbsDelta"] = delta
    return warnings, stats


def load_tokscale_pricing(runtime: TokscaleRuntime, model: str) -> dict[str, Any]:
    command = [*runtime.command, "pricing", model, "--json", "--no-spinner"]
    payload = json.loads(run_capture(command))
    if not isinstance(payload, dict):
        raise RuntimeError(f"Tokscale returned invalid pricing data for {model}.")
    return payload


def rate_per_million(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return max(0.0, float(value)) * 1_000_000
    except (TypeError, ValueError):
        return None


def pricing_row_from_payload(model: str, payload: dict[str, Any]) -> dict[str, Any]:
    pricing = payload.get("pricing") or {}
    rates = {
        "input": rate_per_million(pricing.get("inputCostPerToken")),
        "cacheRead": rate_per_million(
            pricing.get("cacheReadInputTokenCost")
        ),
        "cacheWrite": rate_per_million(
            pricing.get("cacheCreationInputTokenCost")
        ),
        "output": rate_per_million(pricing.get("outputCostPerToken")),
    }
    matched = any(value is not None for value in rates.values())
    source = str(payload.get("source") or "未注明来源")
    return {
        "model": model,
        "matchedKey": str(payload.get("matchedKey") or model),
        **rates,
        "source": f"Tokscale · {source}" if matched else "Tokscale 未匹配",
        "status": "matched" if matched else "unmatched",
    }


def appeared_models(models_payload: dict[str, Any]) -> list[str]:
    models: list[str] = []
    seen: set[str] = set()
    for entry in models_payload.get("entries", []) or []:
        model = str(entry.get("model") or entry.get("modelId") or "").strip()
        if model and model not in seen:
            seen.add(model)
            models.append(model)
    return models


def augment_models_payload_with_graph(
    models_payload: dict[str, Any],
    graph: dict[str, Any],
) -> dict[str, Any]:
    augmented = json.loads(json.dumps(models_payload))
    entries = list(augmented.get("entries", []) or [])
    seen = {
        str(entry.get("model") or entry.get("modelId") or "").strip()
        for entry in entries
    }
    for contribution in graph.get("contributions", []) or []:
        for entry in contribution.get("clients", []) or []:
            model = str(entry.get("modelId") or "").strip()
            if not model or model in seen:
                continue
            seen.add(model)
            entries.append(
                {
                    "model": model,
                    "client": str(entry.get("client") or "unknown"),
                    "provider": str(entry.get("providerId") or "unknown"),
                    "source": "graph-scan",
                }
            )
    augmented["entries"] = entries
    return augmented


def unmatched_pricing_row(model: str) -> dict[str, Any]:
    return {
        "model": model,
        "matchedKey": None,
        "input": None,
        "cacheRead": None,
        "cacheWrite": None,
        "output": None,
        "source": "Tokscale 未匹配",
        "status": "unmatched",
    }


def load_pricing_cache(path: Path, version: str) -> dict[str, dict[str, Any]]:
    """Matched pricing rows from a previous run, keyed by tokscale version."""
    try:
        state = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    if str(state.get("version") or "") != version:
        return {}
    rows = state.get("rows") or {}
    if not isinstance(rows, dict):
        return {}
    return {
        str(model): row
        for model, row in rows.items()
        if isinstance(row, dict) and row.get("status") == "matched"
    }


def write_pricing_cache(
    path: Path,
    version: str,
    rows: dict[str, dict[str, Any]],
) -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "version": version,
            "updatedAt": dt.datetime.now().isoformat(timespec="seconds"),
            "rows": rows,
        }
        path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except OSError:
        # The cache is an optimization only; a failed write must not fail the run.
        pass


def pricing_row_for_model(
    runtime: TokscaleRuntime,
    model: str,
) -> dict[str, Any]:
    """
    One pricing lookup with the skill's canonical-id alias fallback: query the
    model id first, then its canonical form. Only matched rows are returned
    as matched; the original model id stays the catalog key.
    """
    candidates = [model]
    alias = canonical_model_id(model)
    if alias != model:
        candidates.append(alias)
    last_row = unmatched_pricing_row(model)
    for key in candidates:
        try:
            row = pricing_row_from_payload(key, load_tokscale_pricing(runtime, key))
        except Exception:
            row = unmatched_pricing_row(key)
        if row.get("status") == "matched":
            row["model"] = model
            row["matchedKey"] = str(row.get("matchedKey") or key)
            return row
        last_row = row
    last_row["model"] = model
    return last_row


def build_pricing_catalog(
    runtime: TokscaleRuntime,
    models_payload: dict[str, Any],
    *,
    cache_path: Path | None = None,
    refresh: bool = False,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """
    Pricing rows for every appeared model. Matched rows are cached per
    tokscale runtime version so repeated runs (e.g. a periodic collector) do
    not re-issue dozens of npx pricing calls; unmatched models are re-queried
    every run because upstream catalog coverage can improve.
    """
    rows: list[dict[str, Any]] = []
    cached: dict[str, dict[str, Any]] = {}
    cache_hits = 0
    cache_misses = 0
    if cache_path is not None:
        cached = load_pricing_cache(cache_path, runtime.version)
    fresh: dict[str, dict[str, Any]] = {}
    for model in appeared_models(models_payload):
        if not refresh and model in cached:
            rows.append(cached[model])
            cache_hits += 1
            continue
        cache_misses += 1
        row = pricing_row_for_model(runtime, model)
        rows.append(row)
        if row.get("status") == "matched":
            fresh[model] = row
    if cache_path is not None and (cache_misses or refresh):
        merged_cache = dict(cached)
        merged_cache.update(fresh)
        write_pricing_cache(cache_path, runtime.version, merged_cache)
    return rows, {
        "cachePath": str(cache_path) if cache_path is not None else None,
        "runtimeVersion": runtime.version,
        "hits": cache_hits,
        "misses": cache_misses,
        "refreshed": refresh,
    }


def parse_clients(value: str | None) -> list[str] | None:
    if not value:
        return None
    clients = [item.strip() for item in value.split(",") if item.strip()]
    if not clients:
        raise ValueError("--clients must contain at least one client id.")
    return sorted(set(clients))


def report_meta(
    runtime: TokscaleRuntime,
    *,
    clients: list[str] | None,
    warnings: list[str],
    initial_range: dict[str, str],
    pricing_rows: list[dict[str, Any]],
    history: dict[str, Any] | None = None,
    dsh: dict[str, Any] | None = None,
    pricing_cache: dict[str, Any] | None = None,
    repricing: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "generatedAt": dt.datetime.now().isoformat(timespec="seconds"),
        "runtime": runtime.as_dict(),
        "clientFilter": clients or ["all-detected"],
        "initialRange": initial_range,
        "semantics": {
            "processedTokens": "input + output + cacheRead + cacheWrite",
            "nonCacheTokens": "input + output",
            "reasoningTokens": "detail included in output; never added to totals",
            "calls": "model/API calls from tokscale messageCount; not user chat messages",
        },
        "pricing": {
            "source": "Tokscale pricing <MODEL_ID> --json",
            "unit": "USD / 1M Token",
            "detectedModels": len(pricing_rows),
            "matchedModels": sum(
                1 for row in pricing_rows if row.get("status") == "matched"
            ),
            "unmatchedModels": [
                str(row.get("model"))
                for row in pricing_rows
                if row.get("status") == "unmatched"
            ],
            "costBasis": (
                "every reported cost is recomputed as token breakdown x the "
                "authoritative pricing rows above (official list rates); "
                "tokscale graph engine costs are never adopted because the "
                "engine silently mixes pricing sources"
            ),
            "repricing": repricing or {},
        },
        "pricingRows": pricing_rows,
        "history": history or {"enabled": False},
        "dsh": dsh or {"enabled": False},
        "pricingCache": pricing_cache or {},
        "warnings": warnings,
    }


def build_markdown_report(
    *,
    output_dir: Path,
    runtime: TokscaleRuntime,
    warnings: list[str],
    all_result: tuple[RangeSummary, dict[str, Any]],
    today_result: tuple[RangeSummary, dict[str, Any]],
    week_result: tuple[RangeSummary, dict[str, Any]],
    month_result: tuple[RangeSummary, dict[str, Any]],
    requested_result: tuple[RangeSummary, dict[str, Any]] | None,
    requested_label: str | None,
    monthly: dict[str, Any],
    history: dict[str, Any],
) -> str:
    lines = [
        "# Tokscale Token Usage Report",
        "",
        f"- Generated at: {dt.datetime.now().isoformat(timespec='seconds')}",
        f"- Artifacts: {output_dir}",
        f"- Dashboard: {output_dir / 'report.html'}",
        f"- Tokscale runtime: {runtime.version} ({runtime.source})",
        (
            f"- Completed-day history lock: through {history.get('lockedThrough')}; "
            f"restored {len(history.get('restoredDates', []))} shrunken day(s) from locked snapshots."
            if history.get("enabled")
            else "- Completed-day history lock: no protected history available."
        ),
        (
            "- Built-in lost Codex recovery: "
            f"{history['builtinRecoveries'][0].get('datasetId')}; "
            f"{len(history['builtinRecoveries'][0].get('affectedDates', []))} locked day records embedded because the original Codex rollout files were deleted; "
            f"{len(history['builtinRecoveries'][0].get('estimatedDates', []))} are explicitly labeled user-directed estimates."
            if history.get("builtinRecoveries")
            else "- Built-in lost Codex recovery: unavailable."
        ),
        "",
        "## Measurement standard",
        "- Processed tokens = uncached input + output + cache read + cache write.",
        "- Non-cache tokens = uncached input + output.",
        "- Reasoning tokens are shown as an output detail and are not added again.",
        "- Model calls are API/model invocations reported by tokscale, not user chat messages.",
        "- Codex fork/subagent history must be deduplicated by compatible tokscale 4.x >= 4.5.3.",
        "- DSH sessions are scanned locally with a fork/resume-safe seed boundary; DSH reasoning tokens fold into billed output and stay a non-additive detail.",
        "- Costs are recomputed from each entry's token breakdown x the authoritative pricing catalog (official list rates via `tokscale pricing`); tokscale graph engine costs are never adopted because the engine silently mixes pricing sources.",
        "- Locked history fixes token quantities as the floor; costs for locked days are repriced with the current catalog at report time, so all days share one price basis.",
        "- All costs are estimates, not billing records.",
        "",
    ]
    if warnings:
        lines.extend(["## Data-quality warnings", ""])
        lines.extend(f"- {warning}" for warning in warnings)
        lines.append("")

    for title, result, rows in (
        ("All time (this machine/user)", all_result, 14),
        ("Today", today_result, 1),
        ("Last 7 days", week_result, 7),
        ("This month", month_result, 14),
    ):
        lines.append(render_range_md(title, *result, daily_rows=rows))
        lines.append("")

    if requested_result and requested_label:
        lines.append(
            render_range_md(requested_label, *requested_result, daily_rows=14)
        )
        lines.append("")

    lines.extend(
        [
            "## Monthly distribution",
            "",
            "| month | processed | non-cache | cacheRead | cacheWrite | model calls | cost |",
            "|---|---:|---:|---:|---:|---:|---:|",
        ]
    )
    for entry in monthly.get("entries", []) or []:
        lines.append(
            f"| `{entry.get('month')}` | {fmt_int(safe_int(entry.get('processedTokens')))} | "
            f"{fmt_int(safe_int(entry.get('nonCacheTokens')))} | "
            f"{fmt_int(safe_int(entry.get('cacheRead')))} | "
            f"{fmt_int(safe_int(entry.get('cacheWrite')))} | "
            f"{fmt_int(safe_int(entry.get('messageCount')))} | "
            f"{fmt_usd(safe_float(entry.get('cost')))} |"
        )
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a fork-safe local AI token-usage report with explicit measurement semantics."
    )
    parser.add_argument("--since", help="Start date (YYYY-MM-DD).")
    parser.add_argument("--until", help="End date (YYYY-MM-DD).")
    parser.add_argument(
        "--days",
        type=int,
        help="Convenience range including today, e.g. --days 7 means today plus the previous 6 days.",
    )
    parser.add_argument(
        "--clients",
        help="Comma-separated tokscale client ids. Default: every locally detected client.",
    )
    parser.add_argument("--out-dir", help="Directory for report artifacts.")
    parser.add_argument(
        "--top-models",
        type=int,
        default=10,
        help="Number of model series to keep before grouping the rest.",
    )
    parser.add_argument(
        "--ttl-hours",
        type=float,
        default=1.0,
        help="Auto-delete an auto-created report directory after N hours. Use 0 to disable.",
    )
    parser.add_argument(
        "--cleanup-explicit-out-dir",
        action="store_true",
        help="Also schedule deletion when --out-dir is explicitly provided.",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not open report.html automatically on macOS.",
    )
    parser.add_argument(
        "--history-lock",
        default=str(DEFAULT_HISTORY_LOCK_PATH),
        help="Persistent completed-day history floor used to prevent deleted logs from shrinking old totals.",
    )
    parser.add_argument(
        "--import-history-snapshot",
        help="One-time import of a fork-safe report directory containing runtime.json and graph.all.json.",
    )
    parser.add_argument(
        "--dsh-sessions-root",
        default=str(default_dsh_sessions_root()),
        help="DSH sessions root to scan (default: $DSH_HOME/sessions or ~/.dsh/sessions).",
    )
    parser.add_argument(
        "--no-dsh",
        action="store_true",
        help="Skip the local DSH session scan entirely.",
    )
    parser.add_argument(
        "--pricing-cache",
        default=str(DEFAULT_PRICING_CACHE_PATH),
        help="Persistent per-runtime-version pricing cache. Pass an empty string to disable.",
    )
    parser.add_argument(
        "--refresh-pricing",
        action="store_true",
        help="Ignore the pricing cache and re-query tokscale pricing for every model.",
    )
    args = parser.parse_args()

    try:
        clients = parse_clients(args.clients)
        since = parse_iso_date(args.since, label="--since")
        until = parse_iso_date(args.until, label="--until")
        if args.days is not None:
            since = iso_days_inclusive(args.days)
            until = iso_today_local()
        if since and not until:
            until = iso_today_local()
        if until and not since:
            raise ValueError("--until requires --since.")
        if since and until and since > until:
            raise ValueError("--since cannot be later than --until.")
        if args.top_models <= 0:
            raise ValueError("--top-models must be positive.")
        if args.ttl_hours < 0:
            raise ValueError("--ttl-hours cannot be negative.")
        if args.import_history_snapshot and clients:
            raise ValueError(
                "--import-history-snapshot requires the default all-client scan."
            )
    except ValueError as exc:
        parser.error(str(exc))

    runtime = resolve_tokscale_runtime()
    warnings = [*runtime.warnings]

    explicit_output = args.out_dir is not None
    output_dir = (
        Path(args.out_dir).expanduser().resolve()
        if explicit_output
        else Path.cwd()
        / f"tokscale-report-{dt.datetime.now().strftime('%Y%m%d-%H%M%S')}"
    )
    output_dir.mkdir(parents=True, exist_ok=True)

    # DSH is scanned locally (its session format is not a tokscale client), so
    # it is removed from the tokscale CLI filter and merged in below.
    tokscale_clients = forwarded_tokscale_clients(clients)
    dsh_wanted = (clients is None or DSH_CLIENT in clients) and not args.no_dsh
    dsh_meta: dict[str, Any] = {"enabled": False}
    dsh_contributions: list[dict[str, Any]] = []
    if dsh_wanted:
        dsh_root = Path(args.dsh_sessions_root).expanduser().resolve()
        try:
            dsh_sessions, scan_meta = run_dsh_scan(dsh_root)
            dsh_contributions, dsh_stats = build_dsh_contributions(dsh_sessions)
            dsh_meta = {
                "enabled": True,
                "sessionsRoot": str(dsh_root),
                "boundaryRule": (
                    "usage with seq >= header.seedLength counts; parent-linked "
                    "sessions without the durable field use first "
                    "session/end-seed seq + 1; root sessions count their full log"
                ),
                **scan_meta,
                **dsh_stats,
            }
            for error in scan_meta.get("errors", []) or []:
                warnings.append(
                    f"DSH session skipped ({error.get('path')}): {error.get('message')}"
                )
            if scan_meta.get("missing"):
                warnings.append(f"DSH sessions root not found: {dsh_root}")
        except Exception as exc:
            dsh_meta = {
                "enabled": True,
                "sessionsRoot": str(dsh_root),
                "failed": str(exc),
            }
            if clients == [DSH_CLIENT]:
                raise RuntimeError(
                    f"DSH scan required for --clients dsh but failed: {exc}"
                ) from exc
            warnings.append(f"DSH scan skipped: {exc}")

    if tokscale_clients == []:
        # dsh-only run: the tokscale CLI contributes nothing.
        clients_json = {"clients": [], "note": "dsh-only scan; tokscale CLI skipped"}
        models_all_live: dict[str, Any] = {"entries": []}
        monthly_raw: dict[str, Any] = {"entries": []}
        graph_all_raw: dict[str, Any] = {
            "meta": {"version": runtime.version},
            "contributions": [],
        }
    else:
        clients_json = load_tokscale_json(runtime, "clients")
        models_all_live = load_tokscale_json(runtime, "models", clients=tokscale_clients)
        monthly_raw = load_tokscale_json(runtime, "monthly", clients=tokscale_clients)
        graph_all_raw = load_tokscale_json(runtime, "graph", clients=tokscale_clients)

    graph_all_raw = merge_dsh_contributions(graph_all_raw, dsh_contributions)

    today_date = local_today()
    today = today_date.isoformat()

    # The history floor is loaded before pricing so the catalog also covers
    # models that only survive in locked/deleted-log days.
    history_path = Path(args.history_lock).expanduser().resolve()
    history_state = load_history_with_builtin_recovery(history_path)
    if args.import_history_snapshot:
        history_state = import_history_snapshot(
            Path(args.import_history_snapshot).expanduser().resolve(),
            history_state,
        )

    # The pricing catalog must cover live, DSH, and locked-history models
    # before costs are applied, and costs must exist before normalization.
    models_for_pricing = augment_models_payload_with_graph(
        models_all_live, graph_all_raw
    )
    models_for_pricing = augment_models_payload_with_graph(
        models_for_pricing,
        {"contributions": history_state.get("contributions", [])},
    )
    pricing_cache_path = (
        Path(args.pricing_cache).expanduser().resolve()
        if args.pricing_cache
        else None
    )
    pricing_rows, pricing_cache_info = build_pricing_catalog(
        runtime,
        models_for_pricing,
        cache_path=pricing_cache_path,
        refresh=bool(args.refresh_pricing),
    )

    # Every reported cost is recomputed from token breakdown x the official
    # pricing catalog. Tokscale engine costs are never adopted: the engine
    # silently mixes pricing sources (e.g. discount-channel listings at half
    # the official rate), which made equal usage show up to 2x cost drift.
    # Fallback notices stay quiet pricing-section metadata (see Cost Rules).
    reprice_warned: set[str] = set()
    live_reprice_notices, live_reprice_stats = reprice_graph_costs(
        graph_all_raw, pricing_rows, label="live scan", warned=reprice_warned
    )
    history_view = {"contributions": history_state.get("contributions", [])}
    history_reprice_notices, history_reprice_stats = reprice_graph_costs(
        history_view, pricing_rows, label="history floor", warned=reprice_warned
    )
    # Refresh day-level totals so the persisted ledger stays internally
    # consistent with the repriced entry costs.
    for index, contribution in enumerate(history_view["contributions"]):
        refreshed = normalize_graph_snapshot(
            {"meta": {}, "contributions": [contribution]}
        )
        history_view["contributions"][index] = refreshed["contributions"][0]
    history_state["contributions"] = history_view["contributions"]
    reprice_stats = {
        "live": live_reprice_stats,
        "history": history_reprice_stats,
        "notices": live_reprice_notices + history_reprice_notices,
    }

    graph_all_live = normalize_graph_snapshot(graph_all_raw)

    if clients is None:
        history_state = update_history_state(
            history_state,
            graph_all_live,
            today=today,
        )
        write_history_state(history_path, history_state)

    graph_all, history_audit = merge_history_lock(
        graph_all_live,
        history_state,
        today=today,
        clients=clients,
    )
    history_audit.update(
        {
            "statePath": str(history_path),
            "sources": history_state.get("sources", []),
            "stateUpdated": clients is None,
            "costBasis": (
                "locked days store token quantities as the floor; every cost "
                "is repriced at report time from the authoritative pricing "
                "catalog, so price-source drift can no longer fossilize into "
                "the lock"
            ),
            "repricing": reprice_stats["history"],
        }
    )
    graph_meta = dict(graph_all.get("meta") or {})
    graph_meta["historyLock"] = history_audit
    graph_all["meta"] = graph_meta
    # Pricing was built before normalization so DSH entry costs could fold into
    # the single snapshot; this pass only adds models that survived the history
    # lock merge but are missing from the catalog.
    models_all = augment_models_payload_with_graph(models_all_live, graph_all)

    week_start = (today_date - dt.timedelta(days=6)).isoformat()
    month_start = today_date.replace(day=1).isoformat()
    graph_today = filter_graph_by_date(graph_all, since=today, until=today)
    graph_week = filter_graph_by_date(graph_all, since=week_start, until=today)
    graph_month = filter_graph_by_date(graph_all, since=month_start, until=today)
    graph_requested = None
    if since:
        graph_requested = filter_graph_by_date(
            graph_all,
            since=since,
            until=until or today,
        )

    all_result = summarize_graph(graph_all)
    today_result = summarize_graph(graph_today)
    week_result = summarize_graph(graph_week)
    month_result = summarize_graph(graph_month)
    requested_result = (
        summarize_graph(graph_requested) if graph_requested is not None else None
    )

    monthly = build_monthly_from_graph(graph_all)
    all_date_range = (graph_all.get("meta", {}) or {}).get("dateRange", {}) or {}
    metadata = report_meta(
        runtime,
        clients=clients,
        warnings=warnings,
        initial_range={
            "start": since or str(all_date_range.get("start") or today),
            "end": until or str(all_date_range.get("end") or today),
        },
        pricing_rows=pricing_rows,
        history=history_audit,
        dsh=dsh_meta,
        pricing_cache=pricing_cache_info,
        repricing=reprice_stats,
    )
    # The dashboard always receives the immutable all-time snapshot. Date, client,
    # and granularity controls then recompute locally without re-reading live logs.
    dashboard_graph = graph_all
    dashboard = to_dashboard_dataset(
        dashboard_graph,
        top_models=args.top_models,
        report_meta=metadata,
    )
    aggregates = {
        key: aggregate_values(dashboard["days"], dashboard["dailyTotals"][key])
        for key in ("processedTokens", "nonCacheTokens", "cost", "calls")
    }

    artifacts = {
        "runtime.json": metadata,
        "clients.json": clients_json,
        "models.all.json": models_all,
        "monthly.json": monthly_raw,
        "monthly.adjusted.json": monthly,
        "graph.all.raw.json": graph_all_raw,
        "graph.all.json": graph_all,
        "graph.today.json": graph_today,
        "graph.week.json": graph_week,
        "graph.month.json": graph_month,
        "dashboard.data.json": dashboard,
        "dashboard.aggregates.json": aggregates,
        "history.lock.audit.json": history_audit,
    }
    if graph_requested is not None:
        artifacts["graph.range.json"] = graph_requested

    for filename, payload in artifacts.items():
        (output_dir / filename).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    write_dashboard_files(
        out_dir=output_dir,
        dataset=dashboard,
        aggregates=aggregates,
        monthly=monthly,
    )
    requested_label = (
        f"Requested range ({since}..{until})" if requested_result else None
    )
    markdown = build_markdown_report(
        output_dir=output_dir,
        runtime=runtime,
        warnings=warnings,
        all_result=all_result,
        today_result=today_result,
        week_result=week_result,
        month_result=month_result,
        requested_result=requested_result,
        requested_label=requested_label,
        monthly=monthly,
        history=history_audit,
    )
    (output_dir / "report.md").write_text(markdown, encoding="utf-8")
    sys.stdout.write(markdown)

    should_cleanup = (not explicit_output) or bool(args.cleanup_explicit_out_dir)
    if should_cleanup:
        ttl_seconds = max(0, int(args.ttl_hours * 3600))
        schedule_delete(output_dir, delay_seconds=ttl_seconds)
        if ttl_seconds:
            sys.stdout.write(
                f"\n[cleanup] Report directory will be deleted in about "
                f"{args.ttl_hours:g} hour(s): {output_dir}\n"
            )

    if not args.no_open and platform.system() == "Darwin" and which("open"):
        try:
            subprocess.Popen(["open", str(output_dir / "report.html")])
        except Exception:
            pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
