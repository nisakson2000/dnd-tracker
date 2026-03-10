"""Wiki database — single shared SQLite DB for all reference content."""

import os
import logging
from sqlalchemy import create_engine, event, text, inspect
from sqlalchemy.orm import sessionmaker, DeclarativeBase

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
WIKI_DB_PATH = os.path.join(PROJECT_ROOT, "wiki.db")

_wiki_engine = None
_wiki_session_factory = None


class WikiBase(DeclarativeBase):
    pass


def get_wiki_engine():
    global _wiki_engine
    if _wiki_engine is not None:
        return _wiki_engine

    _wiki_engine = create_engine(f"sqlite:///{WIKI_DB_PATH}", echo=False)

    @event.listens_for(_wiki_engine, "connect")
    def set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    return _wiki_engine


def get_wiki_session():
    global _wiki_session_factory
    if _wiki_session_factory is None:
        engine = get_wiki_engine()
        _wiki_session_factory = sessionmaker(bind=engine)
    return _wiki_session_factory()


def _create_fts_tables(engine):
    """Create FTS5 virtual table and sync triggers."""
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE VIRTUAL TABLE IF NOT EXISTS wiki_articles_fts
            USING fts5(title, summary, content, tags, content=wiki_articles, content_rowid=id)
        """))

        conn.execute(text("""
            CREATE TRIGGER IF NOT EXISTS wiki_fts_ai AFTER INSERT ON wiki_articles BEGIN
                INSERT INTO wiki_articles_fts(rowid, title, summary, content, tags)
                VALUES (new.id, new.title, new.summary, new.content, new.tags);
            END
        """))

        conn.execute(text("""
            CREATE TRIGGER IF NOT EXISTS wiki_fts_ad AFTER DELETE ON wiki_articles BEGIN
                INSERT INTO wiki_articles_fts(wiki_articles_fts, rowid, title, summary, content, tags)
                VALUES ('delete', old.id, old.title, old.summary, old.content, old.tags);
            END
        """))

        conn.execute(text("""
            CREATE TRIGGER IF NOT EXISTS wiki_fts_au AFTER UPDATE ON wiki_articles BEGIN
                INSERT INTO wiki_articles_fts(wiki_articles_fts, rowid, title, summary, content, tags)
                VALUES ('delete', old.id, old.title, old.summary, old.content, old.tags);
                INSERT INTO wiki_articles_fts(rowid, title, summary, content, tags)
                VALUES (new.id, new.title, new.summary, new.content, new.tags);
            END
        """))


def init_wiki_db():
    """Create wiki tables, FTS index, and auto-seed if empty."""
    from backend.wiki.models import WikiArticle, WikiCrossReference  # noqa: F401

    engine = get_wiki_engine()
    WikiBase.metadata.create_all(engine)
    _create_fts_tables(engine)

    # Auto-seed if empty
    session = get_wiki_session()
    try:
        count = session.query(WikiArticle).count()
        if count == 0:
            logger.info("Wiki database is empty — seeding with SRD content...")
            from backend.wiki.seed import seed_wiki_db
            seed_wiki_db()
            logger.info("Wiki seeding complete.")
    finally:
        session.close()
