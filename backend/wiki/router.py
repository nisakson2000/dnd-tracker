"""Wiki API endpoints — read-only D&D encyclopedia."""

import math
from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func
from backend.wiki.database import get_wiki_session
from backend.wiki.models import WikiArticle, WikiCrossReference
from backend.wiki.schemas import (
    WikiArticleDetail, WikiArticleSummary, WikiSearchResult,
    WikiRelatedArticle, CategoryCount, PaginatedResponse,
)
from backend.wiki.search import search_articles

router = APIRouter(prefix="/wiki", tags=["wiki"])


@router.get("/search", response_model=PaginatedResponse)
def wiki_search(
    q: str = Query(..., min_length=1, description="Search query"),
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
    ruleset: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    session = get_wiki_session()
    try:
        results, total = search_articles(
            session, q,
            category=category,
            subcategory=subcategory,
            ruleset=ruleset,
            page=page,
            per_page=per_page,
        )
        return PaginatedResponse(
            items=[WikiSearchResult(**r) for r in results],
            total=total,
            page=page,
            per_page=per_page,
            total_pages=math.ceil(total / per_page) if total > 0 else 0,
        )
    finally:
        session.close()


@router.get("/categories", response_model=list[CategoryCount])
def wiki_categories(
    ruleset: str | None = Query(None),
):
    session = get_wiki_session()
    try:
        query = session.query(
            WikiArticle.category,
            WikiArticle.ruleset,
            func.count(WikiArticle.id),
        ).group_by(WikiArticle.category, WikiArticle.ruleset)

        if ruleset:
            query = query.filter(
                (WikiArticle.ruleset == ruleset) | (WikiArticle.ruleset == "universal")
            )

        rows = query.all()

        # Aggregate into category -> {ruleset: count}
        cat_map: dict[str, dict[str, int]] = {}
        for cat, rs, count in rows:
            if cat not in cat_map:
                cat_map[cat] = {}
            cat_map[cat][rs] = count

        results = []
        for cat, rulesets in sorted(cat_map.items()):
            results.append(CategoryCount(
                category=cat,
                count=sum(rulesets.values()),
                rulesets=rulesets,
            ))
        return results
    finally:
        session.close()


@router.get("/articles", response_model=PaginatedResponse)
def wiki_browse(
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
    ruleset: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    sort_by: str = Query("title", regex="^(title|sort_order|category)$"),
):
    session = get_wiki_session()
    try:
        query = session.query(WikiArticle)

        if category:
            query = query.filter(WikiArticle.category == category)
        if subcategory:
            query = query.filter(WikiArticle.subcategory == subcategory)
        if ruleset:
            query = query.filter(
                (WikiArticle.ruleset == ruleset) | (WikiArticle.ruleset == "universal")
            )

        total = query.count()

        sort_col = {
            "title": WikiArticle.title,
            "sort_order": WikiArticle.sort_order,
            "category": WikiArticle.category,
        }.get(sort_by, WikiArticle.title)

        articles = (
            query.order_by(sort_col, WikiArticle.title)
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )

        return PaginatedResponse(
            items=[WikiArticleSummary.model_validate(a) for a in articles],
            total=total,
            page=page,
            per_page=per_page,
            total_pages=math.ceil(total / per_page) if total > 0 else 0,
        )
    finally:
        session.close()


@router.get("/articles/{slug}", response_model=WikiArticleDetail)
def wiki_article(slug: str):
    session = get_wiki_session()
    try:
        article = session.query(WikiArticle).filter(WikiArticle.slug == slug).first()
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        # Get related articles (both directions)
        related = []
        for ref in article.outgoing_refs:
            target = ref.target_article
            related.append(WikiRelatedArticle(
                slug=target.slug,
                title=target.title,
                category=target.category,
                relationship_type=ref.relationship_type,
            ))
        for ref in article.incoming_refs:
            source = ref.source_article
            related.append(WikiRelatedArticle(
                slug=source.slug,
                title=source.title,
                category=source.category,
                relationship_type=ref.relationship_type,
            ))

        detail = WikiArticleDetail.model_validate(article)
        detail.related_articles = related
        return detail
    finally:
        session.close()


@router.get("/articles/{slug}/related", response_model=list[WikiRelatedArticle])
def wiki_related(slug: str):
    session = get_wiki_session()
    try:
        article = session.query(WikiArticle).filter(WikiArticle.slug == slug).first()
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        related = []
        for ref in article.outgoing_refs:
            target = ref.target_article
            related.append(WikiRelatedArticle(
                slug=target.slug,
                title=target.title,
                category=target.category,
                relationship_type=ref.relationship_type,
            ))
        for ref in article.incoming_refs:
            source = ref.source_article
            related.append(WikiRelatedArticle(
                slug=source.slug,
                title=source.title,
                category=source.category,
                relationship_type=ref.relationship_type,
            ))
        return related
    finally:
        session.close()
