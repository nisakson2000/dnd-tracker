"""Wiki SQLAlchemy models."""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Index,
)
from sqlalchemy.orm import relationship
from backend.wiki.database import WikiBase


class WikiArticle(WikiBase):
    __tablename__ = "wiki_articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(30), nullable=False)
    subcategory = Column(String(50), default="")
    ruleset = Column(String(20), nullable=False, default="universal")
    summary = Column(Text, default="")
    content = Column(Text, nullable=False)
    metadata_json = Column(Text, default="{}")
    tags = Column(Text, default="")
    source = Column(String(50), default="SRD 5.1")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Relationships for cross-references
    outgoing_refs = relationship(
        "WikiCrossReference",
        foreign_keys="WikiCrossReference.source_article_id",
        back_populates="source_article",
        cascade="all, delete-orphan",
    )
    incoming_refs = relationship(
        "WikiCrossReference",
        foreign_keys="WikiCrossReference.target_article_id",
        back_populates="target_article",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_wiki_category_ruleset", "category", "ruleset"),
    )


class WikiCrossReference(WikiBase):
    __tablename__ = "wiki_cross_references"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_article_id = Column(Integer, ForeignKey("wiki_articles.id", ondelete="CASCADE"), nullable=False)
    target_article_id = Column(Integer, ForeignKey("wiki_articles.id", ondelete="CASCADE"), nullable=False)
    relationship_type = Column(String(30), default="related")

    source_article = relationship("WikiArticle", foreign_keys=[source_article_id], back_populates="outgoing_refs")
    target_article = relationship("WikiArticle", foreign_keys=[target_article_id], back_populates="incoming_refs")
