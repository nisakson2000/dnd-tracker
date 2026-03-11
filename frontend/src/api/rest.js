import { invoke } from '@tauri-apps/api/core'

export const longRest = (id) =>
  invoke('long_rest', { characterId: id })
export const shortRest = (id, hitDiceToSpend = 0) =>
  invoke('short_rest', { characterId: id, hitDiceToSpend: hitDiceToSpend || 0 })
