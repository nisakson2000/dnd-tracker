import { invoke } from '@tauri-apps/api/core'

export const getBackstory = (id) =>
  invoke('get_backstory', { characterId: id })
export const updateBackstory = (id, data) =>
  invoke('update_backstory', { characterId: id, payload: data })
