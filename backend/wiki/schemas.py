"""Wiki Pydantic schemas for API request/response models."""

from pydantic import BaseModel
from typing import Any


class WikiArticleSummary(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    subcategory: str = ""
    ruleset: str = "universal"
    summary: str = ""
    tags: str = ""
    sort_order: int = 0
    source: str = "SRD 5.1"

    model_config = {"from_attributes": True}


class WikiRelatedArticle(BaseModel):
    slug: str
    title: str
    category: str
    relationship_type: str = "related"

    model_config = {"from_attributes": True}


class WikiArticleDetail(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    subcategory: str = ""
    ruleset: str = "universal"
    summary: str = ""
    content: str = ""
    metadata_json: str = "{}"
    tags: str = ""
    sort_order: int = 0
    source: str = "SRD 5.1"
    related_articles: list[WikiRelatedArticle] = []

    model_config = {"from_attributes": True}


class WikiSearchResult(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    subcategory: str = ""
    ruleset: str = "universal"
    summary: str = ""
    tags: str = ""
    snippet: str = ""
    rank: float = 0.0

    model_config = {"from_attributes": True}


class CategoryCount(BaseModel):
    category: str
    count: int
    rulesets: dict[str, int] = {}


class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


class CategoryArticleCount(BaseModel):
    category: str
    count: int


class WikiStats(BaseModel):
    total_articles: int
    total_categories: int
    total_cross_references: int
    top_categories: list[CategoryArticleCount] = []


class SubcategoryCount(BaseModel):
    subcategory: str
    count: int


class AdjacentArticles(BaseModel):
    prev: WikiArticleSummary | None = None
    next: WikiArticleSummary | None = None
