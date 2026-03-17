/**
 * campaignTemplates.js — Template definitions and starter content generation
 * for the campaign creation wizard.
 *
 * Uses quickGenerators.js to produce content, then maps output
 * to Tauri command parameter shapes.
 */

import { generateNPC, generateQuest, generateLocation, generateRumor, generateLoreEntry } from './quickGenerators';

// ─── Template Definitions ────────────────────────────────────────────────────

export const TEMPLATES = {
  oneshot: {
    label: 'One-Shot',
    subtitle: '1 session',
    description: 'A self-contained adventure for a single session.',
    scenes: 1,
    quests: 1,
    npcs: 2,
    rumors: 1,
    lore: 0,
  },
  short: {
    label: 'Short Campaign',
    subtitle: '3–8 sessions',
    description: 'A focused arc with a clear beginning, middle, and end.',
    scenes: 2,
    quests: 2,
    npcs: 3,
    rumors: 2,
    lore: 0,
  },
  full: {
    label: 'Full Campaign',
    subtitle: '9+ sessions',
    description: 'An epic saga with multiple arcs, factions, and storylines.',
    scenes: 3,
    quests: 3,
    npcs: 4,
    rumors: 3,
    lore: 1,
  },
  blank: {
    label: 'Blank',
    subtitle: 'Start empty',
    description: 'An empty campaign — build everything from scratch.',
    scenes: 0,
    quests: 0,
    npcs: 0,
    rumors: 0,
    lore: 0,
  },
};

// ─── Tone → Generator Options ────────────────────────────────────────────────

const TONE_SETTINGS = {
  'High Fantasy':  { setting: 'wilderness', theme: 'exploration' },
  'Dark Fantasy':  { setting: 'dungeon',    theme: 'mystery' },
  'Grimdark':      { setting: 'dungeon',    theme: 'combat' },
  'Lighthearted':  { setting: 'tavern',     theme: 'social' },
  'Horror':        { setting: 'dungeon',    theme: 'mystery' },
  'Intrigue':      { setting: 'city',       theme: 'social' },
  'Exploration':   { setting: 'wilderness', theme: 'exploration' },
};

// ─── Content Generation ──────────────────────────────────────────────────────

/**
 * Generate starter content for a campaign template.
 * Returns arrays of preview items mapped to Tauri command param shapes.
 */
export function generateStarterContent(templateKey, { partyLevel = 3, tone = 'High Fantasy' } = {}) {
  const template = TEMPLATES[templateKey];
  if (!template || templateKey === 'blank') {
    return { scenes: [], npcs: [], quests: [], rumors: [], lore: [] };
  }

  const toneOpts = TONE_SETTINGS[tone] || {};
  const genOpts = { party_level: partyLevel, ...toneOpts };

  // Generate NPCs
  const npcs = Array.from({ length: template.npcs }, () => {
    const npc = generateNPC({ setting: toneOpts.setting });
    return {
      _preview: npc, // keep full object for display
      name: npc.name,
      role: npc.class || 'Commoner',
      race: npc.race,
      location: '',
      description: `${npc.personality}. ${npc.personalityDescription}. Appearance: ${(npc.appearance || []).join(', ')}.`,
      dmNotes: `Secret: ${npc.secret}\nQuirk: ${npc.quirk}\nMotivation: ${npc.motivation}\nQuest Hook: ${npc.questHook}`,
      visibility: 'dm_only',
    };
  });

  // Generate Quests
  const quests = Array.from({ length: template.quests }, () => {
    const quest = generateQuest({ ...genOpts });
    return {
      _preview: quest,
      title: quest.title,
      giver: quest.keyNPC,
      description: quest.description,
      objectivesJson: JSON.stringify(quest.objectives.map(o => ({ text: o, done: false }))),
      rewardXp: quest.rewards.xp,
      rewardGold: quest.rewards.gold,
    };
  });

  // Generate Scenes (from locations)
  const scenes = Array.from({ length: template.scenes }, () => {
    const loc = generateLocation({ setting: toneOpts.setting });
    return {
      _preview: loc,
      name: loc.name,
      description: `${loc.description}\n\nFeatures:\n${loc.features.map(f => `• ${f}`).join('\n')}`,
      location: loc.type,
    };
  });

  // Generate Rumors
  const rumors = Array.from({ length: template.rumors }, () => {
    const rumor = generateRumor();
    return { _preview: rumor };
  });

  // Generate Lore
  const lore = Array.from({ length: template.lore }, () => {
    const entry = generateLoreEntry();
    return { _preview: entry };
  });

  return { scenes, npcs, quests, rumors, lore };
}
