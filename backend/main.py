import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    characters, overview, backstory, spells,
    inventory, features, combat, journal, npcs, quests, lore, export,
    import_data, rest, party,
)
from backend.wiki.router import router as wiki_router
from backend.wiki.database import init_wiki_db

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize wiki DB on startup."""
    logger.info("Initializing wiki database...")
    init_wiki_db()
    yield


app = FastAPI(title="D&D Character Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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


@app.get("/health")
def health():
    return {"status": "ok"}
