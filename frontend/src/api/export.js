import { invoke } from '@tauri-apps/api/core'

export const exportCharacter = (id) =>
  invoke('export_character', { characterId: id })
