"""FTS5 full-text search logic for wiki articles."""

import re
from sqlalchemy import text
from sqlalchemy.orm import Session


def _sanitize_fts_query(query: str) -> str:
    """Escape FTS5 special characters and build a safe query."""
    if not query or not query.strip():
        return ""
    # Remove FTS5 operators and special chars
    cleaned = re.sub(r'["\*\(\)\{\}\[\]^~]', " ", query)
    # Split into tokens and rejoin with implicit AND
    tokens = [t.strip() for t in cleaned.split() if t.strip()]
    # Filter out FTS5 keywords
    fts_keywords = {"AND", "OR", "NOT", "NEAR"}
    tokens = [t for t in tokens if t.upper() not in fts_keywords]
    if not tokens:
        return ""
    # Use prefix matching so partial typing works (e.g. "Mys" matches "Mystra")
    # FTS5 prefix syntax: token* (no quotes, asterisk appended)
    return " ".join(f'{t}*' for t in tokens)


def search_articles(
    session: Session,
    query: str,
    category: str | None = None,
    subcategory: str | None = None,
    ruleset: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[dict], int]:
    """
    Search wiki articles using FTS5.

    Returns (results, total_count) where each result is a dict with
    article fields plus rank and snippet.
    """
    safe_query = _sanitize_fts_query(query)
    if not safe_query:
        return [], 0

    # Build WHERE clauses for filtering
    filters = []
    params = {"query": safe_query, "offset": (page - 1) * per_page, "limit": per_page}

    if category:
        filters.append("a.category = :category")
        params["category"] = category
    if subcategory:
        filters.append("a.subcategory = :subcategory")
        params["subcategory"] = subcategory
    if ruleset:
        filters.append("(a.ruleset = :ruleset OR a.ruleset = 'universal')")
        params["ruleset"] = ruleset

    where_clause = ""
    if filters:
        where_clause = "AND " + " AND ".join(filters)

    # Count query
    count_sql = text(f"""
        SELECT COUNT(*)
        FROM wiki_articles_fts fts
        JOIN wiki_articles a ON a.id = fts.rowid
        WHERE wiki_articles_fts MATCH :query {where_clause}
    """)
    total = session.execute(count_sql, params).scalar() or 0

    if total == 0:
        return [], 0

    # Results query with ranking and snippets
    results_sql = text(f"""
        SELECT
            a.id, a.slug, a.title, a.category, a.subcategory,
            a.ruleset, a.summary, a.tags,
            rank AS rank_score,
            snippet(wiki_articles_fts, 2, '<mark>', '</mark>', '...', 48) AS snippet
        FROM wiki_articles_fts fts
        JOIN wiki_articles a ON a.id = fts.rowid
        WHERE wiki_articles_fts MATCH :query {where_clause}
        ORDER BY rank
        LIMIT :limit OFFSET :offset
    """)

    rows = session.execute(results_sql, params).fetchall()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "slug": row[1],
            "title": row[2],
            "category": row[3],
            "subcategory": row[4],
            "ruleset": row[5],
            "summary": row[6],
            "tags": row[7],
            "rank": abs(row[8]) if row[8] else 0.0,
            "snippet": row[9] or "",
        })

    return results, total
