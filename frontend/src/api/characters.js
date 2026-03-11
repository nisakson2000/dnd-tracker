import { invoke } from '@tauri-apps/api/core'

export const listCharacters = () => invoke('list_characters')
export const createCharacter = ({ name, ruleset = '5e-2014', race = '', primaryClass = '', primarySubclass = '' }) =>
  invoke('create_character', { payload: { name, ruleset, race, primary_class: primaryClass, primary_subclass: primarySubclass } })
export const deleteCharacter = (id) =>
  invoke('delete_character', { characterId: id })
