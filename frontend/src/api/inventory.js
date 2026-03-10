import { invoke } from '@tauri-apps/api/core'

export const getItems = (id) =>
  invoke('get_items', { characterId: id })
export const addItem = (id, data) =>
  invoke('add_item', { characterId: id, payload: data })
export const updateItem = (id, itemId, data) =>
  invoke('update_item', { characterId: id, itemId, payload: data })
export const deleteItem = (id, itemId) =>
  invoke('delete_item', { characterId: id, itemId })
export const getCurrency = (id) =>
  invoke('get_currency', { characterId: id })
export const updateCurrency = (id, data) =>
  invoke('update_currency', { characterId: id, payload: data })
