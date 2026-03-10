import { invoke } from '@tauri-apps/api/core'

export const listCharacters = () => invoke('list_characters')
export const createCharacter = (name, ruleset = '5e-2014') =>
  invoke('create_character', { payload: { name, ruleset } })
export const deleteCharacter = (id) =>
  invoke('delete_character', { characterId: id })
