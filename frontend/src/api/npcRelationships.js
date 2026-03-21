import { invoke } from '@tauri-apps/api/core';

// ── NPC Relationship Web API ──

export const createNpcRelationship = (data) =>
  invoke('create_npc_relationship', {
    npcIdA: data.npcIdA,
    npcIdB: data.npcIdB,
    relationshipType: data.relationshipType,
    label: data.label || null,
    description: data.description || null,
    strength: data.strength ?? null,
    isSecret: data.isSecret ?? null,
    dmNotes: data.dmNotes || null,
  });

export const listNpcRelationships = () =>
  invoke('list_npc_relationships');

export const getNpcRelationships = (npcId) =>
  invoke('get_npc_relationships', { npcId });

export const updateNpcRelationship = (relationshipId, updates) =>
  invoke('update_npc_relationship', {
    relationshipId,
    relationshipType: updates.relationshipType ?? null,
    label: updates.label ?? null,
    description: updates.description ?? null,
    strength: updates.strength ?? null,
    isSecret: updates.isSecret ?? null,
    dmNotes: updates.dmNotes ?? null,
  });

export const deleteNpcRelationship = (relationshipId) =>
  invoke('delete_npc_relationship', { relationshipId });

export const addRelationshipEvent = (relationshipId, data) =>
  invoke('add_relationship_event', {
    relationshipId,
    eventDescription: data.eventDescription,
    impact: data.impact ?? null,
    sessionNumber: data.sessionNumber ?? null,
  });

export const listRelationshipEvents = (relationshipId) =>
  invoke('list_relationship_events', { relationshipId });

export const getDeathCascade = (npcId) =>
  invoke('get_death_cascade', { npcId });

// ── Relationship type constants ──
export const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Family', color: '#c9a84c' },
  { value: 'romance', label: 'Romance', color: '#e74c7a' },
  { value: 'friend', label: 'Friend', color: '#4caf50' },
  { value: 'alliance', label: 'Alliance', color: '#2196f3' },
  { value: 'mentor', label: 'Mentor/Student', color: '#9c27b0' },
  { value: 'employer', label: 'Employer/Employee', color: '#ff9800' },
  { value: 'rival', label: 'Rival', color: '#ff5722' },
  { value: 'enemy', label: 'Enemy', color: '#f44336' },
  { value: 'secret', label: 'Secret', color: '#607d8b' },
  { value: 'neutral', label: 'Neutral', color: '#9e9e9e' },
];
