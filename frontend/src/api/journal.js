import { invoke } from '@tauri-apps/api/core'

export const getJournalEntries = (id) =>
  invoke('get_journal_entries', { characterId: id })
export const addJournalEntry = (id, data) =>
  invoke('add_journal_entry', { characterId: id, payload: data })
export const updateJournalEntry = (id, entryId, data) =>
  invoke('update_journal_entry', { characterId: id, entryId, payload: data })
export const deleteJournalEntry = (id, entryId) =>
  invoke('delete_journal_entry', { characterId: id, entryId })
