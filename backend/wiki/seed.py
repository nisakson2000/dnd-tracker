"""Seed the wiki database with SRD 5.1 content."""

import json
import os
import logging
from sqlalchemy import text
from backend.wiki.database import get_wiki_engine, get_wiki_session, WikiBase, init_wiki_db
from backend.wiki.models import WikiArticle, WikiCrossReference

logger = logging.getLogger(__name__)

SEED_DATA_DIR = os.path.join(os.path.dirname(__file__), "seed_data")

# All seed files to load, in order
SEED_FILES = [
    # Core rules and mechanics
    "conditions.json",
    "rules.json",
    "ability_scores.json",
    "skills.json",
    "alignments.json",
    "schools_of_magic.json",
    "creature_types.json",
    # Character options
    "classes.json",
    "subclasses.json",
    "races.json",
    "backgrounds.json",
    "feats.json",
    "character_options.json",
    # Equipment and items
    "equipment.json",
    "magic_items.json",
    "tools_detailed.json",
    # Spells (by level)
    "spells_cantrips.json",
    "spells_1st.json",
    "spells_2nd.json",
    "spells_3rd.json",
    "spells_4th.json",
    "spells_5th.json",
    "spells_6th.json",
    "spells_7th.json",
    "spells_8th.json",
    "spells_9th.json",
    # Creatures
    "monsters_low.json",
    "monsters_high.json",
    # World and lore
    "gods.json",
    "planes.json",
    "languages.json",
    "settings.json",
    # Hazards
    "poisons.json",
    "diseases.json",
    # Adventuring and DM tools
    "adventuring.json",
    "adventuring_combat.json",
    "dm_tools.json",
    # Cross-references (must be last)
    "cross_references.json",
]


def _load_json(filename: str) -> list[dict]:
    filepath = os.path.join(SEED_DATA_DIR, filename)
    if not os.path.exists(filepath):
        logger.warning(f"Seed file not found: {filepath}")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_wiki_db(force: bool = False):
    """Load all seed data into wiki.db. Idempotent via slug upsert."""
    session = get_wiki_session()

    try:
        if force:
            logger.info("Force mode — clearing all wiki data...")
            session.query(WikiCrossReference).delete()
            session.query(WikiArticle).delete()
            session.commit()
            # Rebuild FTS index
            engine = get_wiki_engine()
            with engine.begin() as conn:
                conn.execute(text("INSERT INTO wiki_articles_fts(wiki_articles_fts) VALUES('rebuild')"))

        total_added = 0
        total_updated = 0

        for filename in SEED_FILES:
            if filename == "cross_references.json":
                continue  # Handle separately

            entries = _load_json(filename)
            if not entries:
                continue

            for entry in entries:
                slug = entry.get("slug")
                if not slug:
                    logger.warning(f"Skipping entry without slug in {filename}")
                    continue

                existing = session.query(WikiArticle).filter(WikiArticle.slug == slug).first()

                # Convert metadata dict to JSON string if present
                metadata = entry.get("metadata_json", {})
                if isinstance(metadata, dict):
                    metadata = json.dumps(metadata)

                article_data = {
                    "slug": slug,
                    "title": entry.get("title", slug.replace("-", " ").title()),
                    "category": entry.get("category", ""),
                    "subcategory": entry.get("subcategory", ""),
                    "ruleset": entry.get("ruleset", "universal"),
                    "summary": entry.get("summary", ""),
                    "content": entry.get("content", ""),
                    "metadata_json": metadata,
                    "tags": entry.get("tags", ""),
                    "source": entry.get("source", "SRD 5.1"),
                    "sort_order": entry.get("sort_order", 0),
                }

                if existing:
                    for key, value in article_data.items():
                        setattr(existing, key, value)
                    total_updated += 1
                else:
                    session.add(WikiArticle(**article_data))
                    total_added += 1

            session.commit()
            logger.info(f"Loaded {filename}: {len(entries)} entries")

        # Load cross-references
        refs = _load_json("cross_references.json")
        if refs:
            refs_added = 0
            for ref in refs:
                source = session.query(WikiArticle).filter(
                    WikiArticle.slug == ref.get("source_slug")
                ).first()
                target = session.query(WikiArticle).filter(
                    WikiArticle.slug == ref.get("target_slug")
                ).first()

                if source and target:
                    # Check for existing ref
                    existing_ref = session.query(WikiCrossReference).filter(
                        WikiCrossReference.source_article_id == source.id,
                        WikiCrossReference.target_article_id == target.id,
                    ).first()

                    if not existing_ref:
                        session.add(WikiCrossReference(
                            source_article_id=source.id,
                            target_article_id=target.id,
                            relationship_type=ref.get("relationship_type", "related"),
                        ))
                        refs_added += 1

            session.commit()
            logger.info(f"Loaded cross_references.json: {refs_added} new references")

        logger.info(f"Wiki seed complete: {total_added} added, {total_updated} updated")

    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO)
    force = "--force" in sys.argv
    init_wiki_db()
    seed_wiki_db(force=force)
    print("Done.")
