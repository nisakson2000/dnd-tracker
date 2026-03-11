import logging
import os
import socket
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    characters, overview, backstory, spells,
    inventory, features, combat, journal, npcs, quests, lore, export,
    import_data, rest, party, updates,
)
from backend.wiki.router import router as wiki_router
from backend.wiki.database import init_wiki_db

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
    """Initialize wiki DB on startup."""
    logger.info("Initializing wiki database...")
    init_wiki_db()

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


app = FastAPI(title="D&D Character Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow LAN devices to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.get("/health")
def health():
    return {"status": "ok"}
