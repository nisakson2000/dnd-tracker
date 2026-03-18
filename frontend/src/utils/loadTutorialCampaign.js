import { invoke } from '@tauri-apps/api/core';
import { createCharacter } from '../api/characters';
import { addNPC } from '../api/npcs';
import { addQuest } from '../api/quests';
import { addLoreNote } from '../api/lore';
import { addJournalEntry } from '../api/journal';
import tutorialData from '../data/campaigns/tutorial-first-adventure.json';

/**
 * Creates the tutorial campaign in the database and returns its character ID.
 * Follows the same import flow as Dashboard's premade campaign loader.
 */
export async function loadTutorialCampaign() {
  const char = await createCharacter({
    name: tutorialData.name,
    ruleset: 'dnd5e-2024',
    primaryClass: 'Fighter',
    race: 'Human',
  });

  // Import NPCs
  for (const npc of tutorialData.npcs || []) {
    try {
      await addNPC(char.id, {
        name: npc.name, role: npc.role || '', race: npc.race || '',
        npc_class: npc.npc_class || '', location: npc.location || '',
        description: npc.description || '', notes: npc.notes || '',
        status: npc.status || 'alive',
      });
    } catch { /* skip */ }
  }

  // Import quests
  for (const quest of tutorialData.quests || []) {
    try {
      await addQuest(char.id, {
        title: quest.title, giver: quest.giver || '',
        description: quest.description || '', status: quest.status || 'active',
        notes: quest.notes || '',
        objectives: (quest.objectives || []).map(o => ({ text: o.text, completed: o.completed || false })),
      });
    } catch { /* skip */ }
  }

  // Import lore
  for (const note of tutorialData.lore || []) {
    try {
      await addLoreNote(char.id, {
        title: note.title, category: note.category || 'Custom',
        body: note.body || '', related_to: note.related_to || '',
      });
    } catch { /* skip */ }
  }

  // Import journal
  const journalEntries = tutorialData.journals || (tutorialData.journal ? [tutorialData.journal] : []);
  for (const entry of journalEntries) {
    try {
      await addJournalEntry(char.id, {
        title: entry.title, session_number: entry.session_number ?? 0,
        real_date: entry.real_date || new Date().toISOString().split('T')[0],
        ingame_date: entry.ingame_date || '', body: entry.body || '',
        tags: entry.tags || '', npcs_mentioned: entry.npcs_mentioned || '',
        pinned: entry.pinned || 0,
      });
    } catch { /* skip */ }
  }

  // Create campaign entry
  await invoke('create_campaign', {
    name: char.name || tutorialData.name,
    description: tutorialData.summary || tutorialData.description || '',
    ruleset: 'dnd5e-2024',
    campaignType: 'premade',
    campaignId: char.id,
  }).catch(() => {});

  await invoke('set_active_campaign_id', { campaignId: char.id });

  // Create scenes from lore locations
  const locationLore = (tutorialData.lore || []).filter(l => (l.category || '').toLowerCase() === 'location');
  const sceneNames = new Set();
  for (const loc of locationLore) {
    if (sceneNames.has(loc.title)) continue;
    sceneNames.add(loc.title);
    await invoke('create_scene', {
      name: loc.title,
      description: loc.body || '',
      location: loc.related_to || '',
    }).catch(() => {});
  }

  // NPC locations not covered by lore scenes
  const npcLocations = [...new Set((tutorialData.npcs || []).map(n => n.location).filter(Boolean))];
  for (const loc of npcLocations) {
    if (sceneNames.has(loc)) continue;
    const alreadyCovered = [...sceneNames].some(s => loc.includes(s) || s.includes(loc));
    if (alreadyCovered) continue;
    sceneNames.add(loc);
    const npcsHere = (tutorialData.npcs || []).filter(n => n.location === loc).map(n => n.name).join(', ');
    await invoke('create_scene', {
      name: loc,
      description: npcsHere ? `NPCs here: ${npcsHere}` : '',
      location: loc,
    }).catch(() => {});
  }

  return char.id;
}
