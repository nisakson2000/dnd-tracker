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
