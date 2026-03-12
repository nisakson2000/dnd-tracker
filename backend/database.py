import os
import logging
from sqlalchemy import create_engine, event, text, inspect
from sqlalchemy.orm import sessionmaker, DeclarativeBase

logger = logging.getLogger(__name__)

CHARACTERS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "characters")
os.makedirs(CHARACTERS_DIR, exist_ok=True)

# Cache engines to avoid creating a new engine per request
# Note: These module-level dicts are safe with uvicorn's async model (single-threaded event loop)
# but would need threading.Lock if used with multi-threaded WSGI servers
_engine_cache: dict[str, object] = {}
_session_factories: dict[str, object] = {}


class Base(DeclarativeBase):
    pass


def get_db_path(character_id: str) -> str:
    safe_id = os.path.basename(character_id)
    return os.path.join(CHARACTERS_DIR, f"{safe_id}.db")


def _migrate_schema(engine):
    """Add columns that may be missing in older character databases."""
    insp = inspect(engine)
    if insp.has_table("character_overview"):
        columns = {c["name"] for c in insp.get_columns("character_overview")}
        with engine.begin() as conn:
            if "ruleset" not in columns:
                conn.execute(text(
                    "ALTER TABLE character_overview ADD COLUMN ruleset VARCHAR(20) DEFAULT '5e-2014'"
                ))


def get_engine(character_id: str):
    safe_id = os.path.basename(character_id)
    if safe_id in _engine_cache:
        return _engine_cache[safe_id]

    db_path = get_db_path(character_id)
    engine = create_engine(f"sqlite:///{db_path}", echo=False)

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    _engine_cache[safe_id] = engine
    _migrate_schema(engine)
    return engine


def get_session(character_id: str):
    safe_id = os.path.basename(character_id)
    if safe_id not in _session_factories:
        engine = get_engine(character_id)
        _session_factories[safe_id] = sessionmaker(bind=engine)
    return _session_factories[safe_id]()


def init_character_db(character_id: str):
    from backend.models.all_models import (  # noqa: F401
        CharacterOverview, AbilityScore, SavingThrow, Skill,
        Backstory, Spell, SpellSlot, Item, Currency,
        Feature, Attack, Condition, JournalEntry,
        NPC, Quest, QuestObjective, LoreNote,
    )
    engine = get_engine(character_id)
    Base.metadata.create_all(engine)
    return engine


def list_character_files():
    results = []
    if not os.path.exists(CHARACTERS_DIR):
        return results
    for f in os.listdir(CHARACTERS_DIR):
        if f.endswith(".db"):
            char_id = f[:-3]
            results.append({
                "id": char_id,
                "path": os.path.join(CHARACTERS_DIR, f),
            })
    return results


def delete_character_db(character_id: str):
    safe_id = os.path.basename(character_id)

    # Dispose cached engine before removing files
    if safe_id in _engine_cache:
        _engine_cache[safe_id].dispose()
        del _engine_cache[safe_id]
    _session_factories.pop(safe_id, None)

    db_path = get_db_path(character_id)
    for suffix in ["", "-wal", "-shm"]:
        p = db_path + suffix
        if os.path.exists(p):
            os.remove(p)
