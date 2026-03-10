import { invoke } from '@tauri-apps/api/core'

export const getOverview = (id) =>
  invoke('get_overview', { characterId: id })
export const updateOverview = (id, data) =>
  invoke('update_overview', { characterId: id, payload: data })
export const updateAbilityScores = (id, data) =>
  invoke('update_ability_scores', { characterId: id, payload: data })
export const updateSavingThrows = (id, data) =>
  invoke('update_saving_throws', { characterId: id, payload: data })
export const updateSkills = (id, data) =>
  invoke('update_skills', { characterId: id, payload: data })
