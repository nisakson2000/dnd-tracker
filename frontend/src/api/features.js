import { invoke } from '@tauri-apps/api/core'

export const getFeatures = (id) =>
  invoke('get_features', { characterId: id })
export const addFeature = (id, data) =>
  invoke('add_feature', { characterId: id, payload: data })
export const updateFeature = (id, featureId, data) =>
  invoke('update_feature', { characterId: id, featureId, payload: data })
export const deleteFeature = (id, featureId) =>
  invoke('delete_feature', { characterId: id, featureId })
