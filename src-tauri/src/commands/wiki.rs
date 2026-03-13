use serde::Serialize;
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Clone)]
pub struct WikiSearchResult {
    pub id: i64,
    pub slug: String,
    pub title: String,
    pub category: String,
    pub subcategory: String,
    pub ruleset: String,
    pub summary: String,
    pub tags: String,
    pub snippet: String,
    pub rank: f64,
}

#[derive(Serialize, Clone)]
pub struct WikiArticleSummary {
    pub id: i64,
    pub slug: String,
    pub title: String,
    pub category: String,
    pub subcategory: String,
    pub ruleset: String,
    pub summary: String,
    pub tags: String,
    pub sort_order: i64,
    pub source: String,
}

#[derive(Serialize, Clone)]
pub struct WikiArticleDetail {
    pub id: i64,
    pub slug: String,
    pub title: String,
    pub category: String,
    pub subcategory: String,
    pub ruleset: String,
    pub summary: String,
    pub content: String,
    pub metadata_json: String,
    pub tags: String,
    pub sort_order: i64,
    pub source: String,
    pub related_articles: Vec<WikiRelatedArticle>,
}

#[derive(Serialize, Clone)]
pub struct WikiRelatedArticle {
    pub slug: String,
    pub title: String,
    pub category: String,
    pub relationship_type: String,
}

#[derive(Serialize, Clone)]
pub struct CategoryCount {
    pub category: String,
    pub count: i64,
    pub rulesets: std::collections::HashMap<String, i64>,
}

#[derive(Serialize, Clone)]
pub struct PaginatedResponse<T: Serialize> {
    pub items: Vec<T>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
    pub total_pages: i64,
}

fn sanitize_fts_query(query: &str) -> String {
    let cleaned: String = query
        .chars()
        .map(|c| {
            if "\"*(){}[]^~".contains(c) { ' ' } else { c }
        })
        .collect();
    let fts_keywords = ["AND", "OR", "NOT", "NEAR"];
    let tokens: Vec<String> = cleaned
        .split_whitespace()
        .filter(|t| !fts_keywords.contains(&t.to_uppercase().as_str()))
        .map(|t| format!("{}*", t))
        .collect();
    tokens.join(" ")
}

#[tauri::command]
pub fn wiki_search(
    state: State<'_, AppState>,
    q: String,
    category: Option<String>,
    subcategory: Option<String>,
    ruleset: Option<String>,
    page: Option<i64>,
    per_page: Option<i64>,
) -> Result<PaginatedResponse<WikiSearchResult>, String> {
    let page = page.unwrap_or(1).max(1);
    let per_page = per_page.unwrap_or(20).max(1).min(100);
    let safe_query = sanitize_fts_query(&q);
    if safe_query.is_empty() {
        return Ok(PaginatedResponse { items: vec![], total: 0, page, per_page, total_pages: 0 });
    }

    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    // Build filters
    let mut filters = Vec::new();
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    params.push(Box::new(safe_query.clone()));

    if let Some(ref cat) = category {
        filters.push(format!("AND a.category = ?{}", params.len() + 1));
        params.push(Box::new(cat.clone()));
    }
    if let Some(ref subcat) = subcategory {
        filters.push(format!("AND a.subcategory = ?{}", params.len() + 1));
        params.push(Box::new(subcat.clone()));
    }
    if let Some(ref rs) = ruleset {
        filters.push(format!("AND (a.ruleset = ?{} OR a.ruleset = 'universal')", params.len() + 1));
        params.push(Box::new(rs.clone()));
    }

    let where_clause = filters.join(" ");

    // Count
    let count_sql = format!(
        "SELECT COUNT(*) FROM wiki_articles_fts fts JOIN wiki_articles a ON a.id = fts.rowid WHERE wiki_articles_fts MATCH ?1 {}",
        where_clause
    );
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let total: i64 = wiki.query_row(&count_sql, param_refs.as_slice(), |row| row.get(0)).map_err(|e| e.to_string())?;

    if total == 0 {
        return Ok(PaginatedResponse { items: vec![], total: 0, page, per_page, total_pages: 0 });
    }

    // Results
    let offset = (page - 1) * per_page;
    params.push(Box::new(per_page));
    params.push(Box::new(offset));

    let results_sql = format!(
        "SELECT a.id, a.slug, a.title, a.category, a.subcategory, a.ruleset, a.summary, a.tags, rank AS rank_score, snippet(wiki_articles_fts, 2, '<mark>', '</mark>', '...', 48) AS snippet FROM wiki_articles_fts fts JOIN wiki_articles a ON a.id = fts.rowid WHERE wiki_articles_fts MATCH ?1 {} ORDER BY rank LIMIT ?{} OFFSET ?{}",
        where_clause, params.len() - 1, params.len()
    );
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();

    let mut stmt = wiki.prepare(&results_sql).map_err(|e| e.to_string())?;
    let items: Vec<WikiSearchResult> = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(WikiSearchResult {
                id: row.get(0)?,
                slug: row.get(1)?,
                title: row.get(2)?,
                category: row.get(3)?,
                subcategory: row.get(4).unwrap_or_default(),
                ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                summary: row.get(6).unwrap_or_default(),
                tags: row.get(7).unwrap_or_default(),
                rank: {
                    let r: f64 = row.get(8).unwrap_or(0.0);
                    r.abs()
                },
                snippet: row.get(9).unwrap_or_default(),
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let total_pages = if total > 0 { (total + per_page - 1) / per_page } else { 0 };

    Ok(PaginatedResponse { items, total, page, per_page, total_pages })
}

#[tauri::command]
pub fn wiki_categories(
    state: State<'_, AppState>,
    ruleset: Option<String>,
) -> Result<Vec<CategoryCount>, String> {
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref rs) = ruleset {
        (
            "SELECT category, ruleset, COUNT(*) FROM wiki_articles WHERE ruleset = ?1 OR ruleset = 'universal' GROUP BY category, ruleset".to_string(),
            vec![Box::new(rs.clone()) as Box<dyn rusqlite::types::ToSql>],
        )
    } else {
        (
            "SELECT category, ruleset, COUNT(*) FROM wiki_articles GROUP BY category, ruleset".to_string(),
            vec![],
        )
    };

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = wiki.prepare(&sql).map_err(|e| e.to_string())?;
    let rows: Vec<(String, String, i64)> = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?))
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let mut cat_map: std::collections::HashMap<String, std::collections::HashMap<String, i64>> =
        std::collections::HashMap::new();
    for (cat, rs, count) in rows {
        cat_map.entry(cat).or_default().insert(rs, count);
    }

    let mut results: Vec<CategoryCount> = cat_map
        .into_iter()
        .map(|(cat, rulesets)| {
            let count = rulesets.values().sum();
            CategoryCount { category: cat, count, rulesets }
        })
        .collect();
    results.sort_by(|a, b| a.category.cmp(&b.category));

    Ok(results)
}

#[tauri::command]
pub fn wiki_list_articles(
    state: State<'_, AppState>,
    category: Option<String>,
    subcategory: Option<String>,
    ruleset: Option<String>,
    page: Option<i64>,
    per_page: Option<i64>,
    sort_by: Option<String>,
) -> Result<PaginatedResponse<WikiArticleSummary>, String> {
    let page = page.unwrap_or(1).max(1);
    let per_page = per_page.unwrap_or(50).max(1).min(200);
    let sort_by = sort_by.unwrap_or_else(|| "title".to_string());

    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let mut filters = Vec::new();
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

    if let Some(ref cat) = category {
        params.push(Box::new(cat.clone()));
        filters.push(format!("category = ?{}", params.len()));
    }
    if let Some(ref subcat) = subcategory {
        params.push(Box::new(subcat.clone()));
        filters.push(format!("subcategory = ?{}", params.len()));
    }
    if let Some(ref rs) = ruleset {
        params.push(Box::new(rs.clone()));
        filters.push(format!("(ruleset = ?{} OR ruleset = 'universal')", params.len()));
    }

    let where_clause = if filters.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", filters.join(" AND "))
    };

    let sort_col = match sort_by.as_str() {
        "sort_order" => "sort_order, title",
        "category" => "category, title",
        _ => "title",
    };

    // Count
    let count_sql = format!("SELECT COUNT(*) FROM wiki_articles {}", where_clause);
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let total: i64 = wiki.query_row(&count_sql, param_refs.as_slice(), |row| row.get(0)).map_err(|e| e.to_string())?;

    let offset = (page - 1) * per_page;
    params.push(Box::new(per_page));
    params.push(Box::new(offset));

    let results_sql = format!(
        "SELECT id, slug, title, category, subcategory, ruleset, summary, tags, sort_order, source FROM wiki_articles {} ORDER BY {} LIMIT ?{} OFFSET ?{}",
        where_clause, sort_col, params.len() - 1, params.len()
    );
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();

    let mut stmt = wiki.prepare(&results_sql).map_err(|e| e.to_string())?;
    let items: Vec<WikiArticleSummary> = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(WikiArticleSummary {
                id: row.get(0)?,
                slug: row.get(1)?,
                title: row.get(2)?,
                category: row.get(3)?,
                subcategory: row.get(4).unwrap_or_default(),
                ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                summary: row.get(6).unwrap_or_default(),
                tags: row.get(7).unwrap_or_default(),
                sort_order: row.get(8).unwrap_or(0),
                source: row.get(9).unwrap_or_else(|_| "SRD 5.1".to_string()),
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let total_pages = if total > 0 { (total + per_page - 1) / per_page } else { 0 };

    Ok(PaginatedResponse { items, total, page, per_page, total_pages })
}

#[tauri::command]
pub fn wiki_get_article(
    state: State<'_, AppState>,
    slug: String,
) -> Result<WikiArticleDetail, String> {
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let article_id: i64;
    let mut detail = wiki
        .query_row(
            "SELECT id, slug, title, category, subcategory, ruleset, summary, content, metadata_json, tags, sort_order, source FROM wiki_articles WHERE slug=?1",
            [&slug],
            |row| {
                Ok(WikiArticleDetail {
                    id: row.get(0)?,
                    slug: row.get(1)?,
                    title: row.get(2)?,
                    category: row.get(3)?,
                    subcategory: row.get(4).unwrap_or_default(),
                    ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                    summary: row.get(6).unwrap_or_default(),
                    content: row.get(7).unwrap_or_default(),
                    metadata_json: row.get(8).unwrap_or_else(|_| "{}".to_string()),
                    tags: row.get(9).unwrap_or_default(),
                    sort_order: row.get(10).unwrap_or(0),
                    source: row.get(11).unwrap_or_else(|_| "SRD 5.1".to_string()),
                    related_articles: Vec::new(),
                })
            },
        )
        .map_err(|_| "Article not found".to_string())?;

    article_id = detail.id;

    // Get related articles (both directions)
    let mut related = Vec::new();

    // Outgoing refs
    {
        let mut stmt = wiki.prepare(
            "SELECT a.slug, a.title, a.category, r.relationship_type FROM wiki_cross_references r JOIN wiki_articles a ON a.id = r.target_article_id WHERE r.source_article_id=?1"
        ).map_err(|e| e.to_string())?;
        let outgoing: Vec<WikiRelatedArticle> = stmt.query_map([article_id], |row| {
            Ok(WikiRelatedArticle {
                slug: row.get(0)?,
                title: row.get(1)?,
                category: row.get(2)?,
                relationship_type: row.get(3).unwrap_or_else(|_| "related".to_string()),
            })
        }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();
        related.extend(outgoing);
    }

    // Incoming refs
    {
        let mut stmt = wiki.prepare(
            "SELECT a.slug, a.title, a.category, r.relationship_type FROM wiki_cross_references r JOIN wiki_articles a ON a.id = r.source_article_id WHERE r.target_article_id=?1"
        ).map_err(|e| e.to_string())?;
        let incoming: Vec<WikiRelatedArticle> = stmt.query_map([article_id], |row| {
            Ok(WikiRelatedArticle {
                slug: row.get(0)?,
                title: row.get(1)?,
                category: row.get(2)?,
                relationship_type: row.get(3).unwrap_or_else(|_| "related".to_string()),
            })
        }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();
        related.extend(incoming);
    }

    detail.related_articles = related;
    Ok(detail)
}

#[tauri::command]
pub fn wiki_get_related(
    state: State<'_, AppState>,
    slug: String,
) -> Result<Vec<WikiRelatedArticle>, String> {
    let detail = wiki_get_article(state, slug)?;
    Ok(detail.related_articles)
}

#[derive(Serialize, Clone)]
pub struct WikiStats {
    pub total_articles: i64,
    pub total_categories: i64,
    pub total_cross_references: i64,
    pub top_categories: Vec<CategoryArticleCount>,
}

#[derive(Serialize, Clone)]
pub struct CategoryArticleCount {
    pub category: String,
    pub count: i64,
}

#[tauri::command]
pub fn wiki_stats(
    state: State<'_, AppState>,
) -> Result<WikiStats, String> {
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let total_articles: i64 = wiki
        .query_row("SELECT COUNT(*) FROM wiki_articles", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let total_categories: i64 = wiki
        .query_row("SELECT COUNT(DISTINCT category) FROM wiki_articles", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let total_cross_references: i64 = wiki
        .query_row("SELECT COUNT(*) FROM wiki_cross_references", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let mut stmt = wiki
        .prepare("SELECT category, COUNT(*) AS cnt FROM wiki_articles GROUP BY category ORDER BY cnt DESC LIMIT 6")
        .map_err(|e| e.to_string())?;
    let top_categories: Vec<CategoryArticleCount> = stmt
        .query_map([], |row| {
            Ok(CategoryArticleCount {
                category: row.get(0)?,
                count: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(WikiStats { total_articles, total_categories, total_cross_references, top_categories })
}

#[derive(Serialize, Clone)]
pub struct SubcategoryCount {
    pub subcategory: String,
    pub count: i64,
}

#[tauri::command]
pub fn wiki_subcategories(
    state: State<'_, AppState>,
    category: String,
) -> Result<Vec<SubcategoryCount>, String> {
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = wiki
        .prepare("SELECT subcategory, COUNT(*) AS cnt FROM wiki_articles WHERE category = ?1 AND subcategory != '' GROUP BY subcategory ORDER BY subcategory")
        .map_err(|e| e.to_string())?;

    let items: Vec<SubcategoryCount> = stmt
        .query_map([&category], |row| {
            Ok(SubcategoryCount {
                subcategory: row.get(0)?,
                count: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(items)
}

#[tauri::command]
pub fn wiki_random_articles(
    state: State<'_, AppState>,
    count: Option<i64>,
    category: Option<String>,
) -> Result<Vec<WikiArticleSummary>, String> {
    let count = count.unwrap_or(5).max(1).min(20);
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref cat) = category {
        (
            "SELECT id, slug, title, category, subcategory, ruleset, summary, tags, sort_order, source FROM wiki_articles WHERE category = ?1 ORDER BY RANDOM() LIMIT ?2".to_string(),
            vec![Box::new(cat.clone()) as Box<dyn rusqlite::types::ToSql>, Box::new(count)],
        )
    } else {
        (
            "SELECT id, slug, title, category, subcategory, ruleset, summary, tags, sort_order, source FROM wiki_articles ORDER BY RANDOM() LIMIT ?1".to_string(),
            vec![Box::new(count) as Box<dyn rusqlite::types::ToSql>],
        )
    };

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = wiki.prepare(&sql).map_err(|e| e.to_string())?;
    let items: Vec<WikiArticleSummary> = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(WikiArticleSummary {
                id: row.get(0)?,
                slug: row.get(1)?,
                title: row.get(2)?,
                category: row.get(3)?,
                subcategory: row.get(4).unwrap_or_default(),
                ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                summary: row.get(6).unwrap_or_default(),
                tags: row.get(7).unwrap_or_default(),
                sort_order: row.get(8).unwrap_or(0),
                source: row.get(9).unwrap_or_else(|_| "SRD 5.1".to_string()),
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(items)
}

#[derive(Serialize, Clone)]
pub struct AdjacentArticles {
    pub prev: Option<WikiArticleSummary>,
    pub next: Option<WikiArticleSummary>,
}

#[tauri::command]
pub fn wiki_adjacent_articles(
    state: State<'_, AppState>,
    category: String,
    slug: String,
) -> Result<AdjacentArticles, String> {
    let wiki = state.wiki_conn.lock().map_err(|e| e.to_string())?;

    let prev = wiki
        .query_row(
            "SELECT id, slug, title, category, subcategory, ruleset, summary, tags, sort_order, source \
             FROM wiki_articles WHERE category = ?1 AND title < (SELECT title FROM wiki_articles WHERE slug = ?2) \
             ORDER BY title DESC LIMIT 1",
            [&category, &slug],
            |row| {
                Ok(WikiArticleSummary {
                    id: row.get(0)?,
                    slug: row.get(1)?,
                    title: row.get(2)?,
                    category: row.get(3)?,
                    subcategory: row.get(4).unwrap_or_default(),
                    ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                    summary: row.get(6).unwrap_or_default(),
                    tags: row.get(7).unwrap_or_default(),
                    sort_order: row.get(8).unwrap_or(0),
                    source: row.get(9).unwrap_or_else(|_| "SRD 5.1".to_string()),
                })
            },
        )
        .ok();

    let next = wiki
        .query_row(
            "SELECT id, slug, title, category, subcategory, ruleset, summary, tags, sort_order, source \
             FROM wiki_articles WHERE category = ?1 AND title > (SELECT title FROM wiki_articles WHERE slug = ?2) \
             ORDER BY title ASC LIMIT 1",
            [&category, &slug],
            |row| {
                Ok(WikiArticleSummary {
                    id: row.get(0)?,
                    slug: row.get(1)?,
                    title: row.get(2)?,
                    category: row.get(3)?,
                    subcategory: row.get(4).unwrap_or_default(),
                    ruleset: row.get(5).unwrap_or_else(|_| "universal".to_string()),
                    summary: row.get(6).unwrap_or_default(),
                    tags: row.get(7).unwrap_or_default(),
                    sort_order: row.get(8).unwrap_or(0),
                    source: row.get(9).unwrap_or_else(|_| "SRD 5.1".to_string()),
                })
            },
        )
        .ok();

    Ok(AdjacentArticles { prev, next })
}
