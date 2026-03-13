import { invoke } from '@tauri-apps/api/core'

export const searchArticles = (q, params = {}) =>
  invoke('wiki_search', { q, ...params })

export const getCategories = (ruleset) =>
  invoke('wiki_categories', { ruleset: ruleset || null })

export const listArticles = (params = {}) =>
  invoke('wiki_list_articles', params)

export const getArticle = (slug) =>
  invoke('wiki_get_article', { slug })

export const getRelatedArticles = (slug) =>
  invoke('wiki_get_related', { slug })

export const getWikiStats = () =>
  invoke('wiki_stats')

export const getSubcategories = (category) =>
  invoke('wiki_subcategories', { category })

export const getRandomArticles = (count = 5, category = null) =>
  invoke('wiki_random_articles', { count, category })

export const getAdjacentArticles = (category, slug) =>
  invoke('wiki_adjacent_articles', { category, slug })
