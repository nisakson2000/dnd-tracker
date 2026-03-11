"""
Bug Reporter V3 — session tracking, error deduplication, and dev status.

Provides:
  - Session metadata capture at startup
  - In-memory error/warning log with duplicate suppression
  - Session summary on shutdown
  - /dev/status endpoint data
"""

import hashlib
import os
import platform
import re
import sys
import time
from datetime import datetime, timezone
from typing import Any

# ── App version constant ──────────────────────────────────────────────
APP_VERSION: str = "0.2.3"

# ── Session state (module-level singletons) ───────────────────────────

_session: dict[str, Any] = {}
_entries: list[dict[str, Any]] = []
_fingerprints: dict[str, dict[str, Any]] = {}  # fp -> {first_entry, count, last_seen}
_counts: dict[str, int] = {"errors": 0, "warnings": 0, "issues": 0}

# Dedup window in seconds
DEDUP_WINDOW = 60


# ── Helpers ───────────────────────────────────────────────────────────

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _fingerprint(text: str) -> str:
    """Normalise an error string into a stable fingerprint.

    Strips things that change between occurrences:
      - UUIDs, hex IDs, numeric IDs
      - ISO timestamps
      - Line numbers
    """
    t = re.sub(r"[0-9a-f]{8,}", "X", text, flags=re.I)
    t = re.sub(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[.\dZ]*", "T", t)
    t = re.sub(r"\b\d+\b", "N", t)
    return hashlib.md5(t.encode()).hexdigest()[:12]


# ── Public API ────────────────────────────────────────────────────────

def start_session() -> dict[str, Any]:
    """Capture session metadata.  Call once at startup."""
    global _session
    _session = {
        "start_time": _now_iso(),
        "start_mono": time.monotonic(),
        "hostname": platform.node(),
        "os": f"{platform.system()} {platform.version()}",
        "python": sys.version.split()[0],
        "pid": os.getpid(),
        "app_version": APP_VERSION,
    }
    _entries.clear()
    _fingerprints.clear()
    _counts.update({"errors": 0, "warnings": 0, "issues": 0})
    return _session


def session_info() -> dict[str, Any]:
    """Return a copy of the current session metadata."""
    return dict(_session)


def log_entry(
    level: str,
    message: str,
    *,
    method: str = "",
    path: str = "",
    status: int = 0,
    client_ip: str = "",
    query: str = "",
    elapsed: float = 0.0,
    extra: dict[str, Any] | None = None,
) -> bool:
    """Record an error/warning/issue entry with deduplication.

    Returns True if a *new* entry was created, False if it was a duplicate.
    """
    now = time.time()
    fp = _fingerprint(message)

    # ── Dedup check ───────────────────────────────────────────────
    existing = _fingerprints.get(fp)
    if existing and (now - existing["last_seen"]) < DEDUP_WINDOW:
        existing["count"] += 1
        existing["last_seen"] = now
        return False

    # ── New entry ─────────────────────────────────────────────────
    entry: dict[str, Any] = {
        "ts": _now_iso(),
        "level": level,
        "message": message,
        "fingerprint": fp,
        "method": method,
        "path": path,
        "status": status,
        "client_ip": client_ip,
        "query": query,
        "elapsed_s": round(elapsed, 4),
    }
    if extra:
        entry["extra"] = extra

    _entries.append(entry)
    _fingerprints[fp] = {"first_entry": entry, "count": 1, "last_seen": now}

    # Bump counters
    if level == "error":
        _counts["errors"] += 1
    elif level == "warning":
        _counts["warnings"] += 1
    _counts["issues"] += 1

    return True


def dev_status() -> dict[str, Any]:
    """Build the /dev/status payload."""
    elapsed = time.monotonic() - _session.get("start_mono", time.monotonic())
    return {
        "session_start": _session.get("start_time", ""),
        "session_duration_s": round(elapsed),
        "app_version": _session.get("app_version", APP_VERSION),
        "counts": dict(_counts),
        "recent": _entries[-10:],
    }


def session_summary() -> str:
    """Return a human-readable session summary string."""
    elapsed = time.monotonic() - _session.get("start_mono", time.monotonic())
    mins, secs = divmod(int(elapsed), 60)
    hours, mins = divmod(mins, 60)

    lines = [
        "",
        "=" * 54,
        "[BugReporter] Session Summary",
        f"  Duration  : {hours}h {mins}m {secs}s",
        f"  Errors    : {_counts['errors']}",
        f"  Warnings  : {_counts['warnings']}",
        f"  Issues    : {_counts['issues']}",
    ]

    # Top errors by count
    top = sorted(_fingerprints.values(), key=lambda v: v["count"], reverse=True)[:5]
    if top:
        lines.append("  Top errors:")
        for item in top:
            e = item["first_entry"]
            lines.append(f"    [{item['count']}x] {e.get('method', '')} {e.get('path', '')} — {e['message'][:80]}")

    lines.append("=" * 54)
    return "\n".join(lines)


# ── Bug-report counter (for party WebSocket) ─────────────────────────

_report_counter: int = 0


def next_report_id() -> str:
    """Generate the next bug-report ID: USR-YYYYMMDD-NNN."""
    global _report_counter
    _report_counter += 1
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"USR-{today}-{_report_counter:03d}"
