import logging
import os
import socket
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    characters, overview, backstory, spells,
    inventory, features, combat, journal, npcs, quests, lore, export,
    import_data, rest, party, updates,
)
from backend.wiki.router import router as wiki_router
from backend.wiki.database import init_wiki_db
from backend import bug_reporter

logger = logging.getLogger(__name__)


def _get_lan_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
        return ip
    except Exception:
        return "unknown"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize wiki DB and bug-reporter session on startup."""
    logger.info("Initializing wiki database...")
    init_wiki_db()

    # ── Bug Reporter V3: session start ────────────────────────────
    session = bug_reporter.start_session()
    logger.info(
        "[BugReporter] Session started — Host: %s, Python: %s, PID: %s",
        session["hostname"],
        session["python"],
        session["pid"],
    )

    # Read current version
    _vfile = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "VERSION")
    try:
        with open(_vfile) as f:
            _ver = f.read().strip()
    except Exception:
        _ver = "?"
    lan_ip = _get_lan_ip()
    logger.info("=" * 50)
    logger.info("The Codex v%s is running", _ver)
    logger.info("  Your app:      http://localhost:8000")
    logger.info("  LAN (friends): http://%s:8000", lan_ip)
    logger.info("  LAN (friends): http://%s:5173 (dev)", lan_ip)
    logger.info("=" * 50)

    yield

    # ── Bug Reporter V3: session shutdown summary ─────────────────
    summary = bug_reporter.session_summary()
    logger.info(summary)


app = FastAPI(title="D&D Character Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow LAN devices to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Bug Reporter V3: HTTP error logging middleware ────────────────────

@app.middleware("http")
async def error_logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = time.time() - start

    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    path = request.url.path
    query = str(request.url.query) if request.url.query else ""

    if response.status_code >= 500:
        msg = f"HTTP {response.status_code} on {method} {path}"
        bug_reporter.log_entry(
            "error",
            msg,
            method=method,
            path=path,
            status=response.status_code,
            client_ip=client_ip,
            query=query,
            elapsed=elapsed,
        )
        logger.error(
            "[BugReporter] %s %s → %d (%.3fs) client=%s q=%s",
            method, path, response.status_code, elapsed, client_ip, query,
        )

    elif response.status_code >= 400:
        msg = f"HTTP {response.status_code} on {method} {path}"
        bug_reporter.log_entry(
            "warning",
            msg,
            method=method,
            path=path,
            status=response.status_code,
            client_ip=client_ip,
            query=query,
            elapsed=elapsed,
        )
        logger.warning(
            "[BugReporter] %s %s → %d (%.3fs) client=%s",
            method, path, response.status_code, elapsed, client_ip,
        )

    elif elapsed > 3.0:
        msg = f"Slow request: {method} {path} took {elapsed:.2f}s"
        bug_reporter.log_entry(
            "warning",
            msg,
            method=method,
            path=path,
            status=response.status_code,
            client_ip=client_ip,
            query=query,
            elapsed=elapsed,
        )
        logger.warning(
            "[BugReporter] SLOW %s %s → %d (%.3fs) client=%s",
            method, path, response.status_code, elapsed, client_ip,
        )

    return response


# ── Routers ───────────────────────────────────────────────────────────

app.include_router(characters.router)
app.include_router(overview.router)
app.include_router(backstory.router)
app.include_router(spells.router)
app.include_router(inventory.router)
app.include_router(features.router)
app.include_router(combat.router)
app.include_router(journal.router)
app.include_router(npcs.router)
app.include_router(quests.router)
app.include_router(lore.router)
app.include_router(export.router)
app.include_router(import_data.router)
app.include_router(rest.router)
app.include_router(wiki_router)
app.include_router(party.router)
app.include_router(updates.router)


# ── Health & dev status ───────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/dev/status")
def dev_status():
    """Return current Bug Reporter session state (dev/diagnostics)."""
    return bug_reporter.dev_status()
