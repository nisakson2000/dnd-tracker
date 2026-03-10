import { invoke } from '@tauri-apps/api/core'

export const getSpells = (id) =>
  invoke('get_spells', { characterId: id })
export const addSpell = (id, data) =>
  invoke('add_spell', { characterId: id, payload: data })
export const updateSpell = (id, spellId, data) =>
  invoke('update_spell', { characterId: id, spellId, payload: data })
export const deleteSpell = (id, spellId) =>
  invoke('delete_spell', { characterId: id, spellId })
export const getSpellSlots = (id) =>
  invoke('get_spell_slots', { characterId: id })
export const updateSpellSlots = (id, data) =>
  invoke('update_spell_slots', { characterId: id, payload: data })
export const resetSpellSlots = (id) =>
  invoke('reset_spell_slots', { characterId: id })
