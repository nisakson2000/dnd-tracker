import { invoke } from '@tauri-apps/api/core'

export const getLoreNotes = (id) =>
  invoke('get_lore_notes', { characterId: id })
export const addLoreNote = (id, data) =>
  invoke('add_lore_note', { characterId: id, payload: data })
export const updateLoreNote = (id, noteId, data) =>
  invoke('update_lore_note', { characterId: id, noteId, payload: data })
export const deleteLoreNote = (id, noteId) =>
  invoke('delete_lore_note', { characterId: id, noteId })
