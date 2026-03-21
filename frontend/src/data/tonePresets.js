export const TONE_PRESETS = {
  epic: {
    label: 'Epic',
    description: 'Heroic deeds, grand stakes, sweeping battles',
    color: '#c084fc',
    adjectives: ['mighty', 'legendary', 'valiant', 'glorious', 'triumphant'],
    combatFeel: 'Blows land with thunderous force. Every clash of steel echoes through legend.',
    socialFeel: 'Words carry the weight of destiny. Alliances forged here will reshape the realm.',
    explorationFeel: 'The landscape unfolds like a painting from the gods. Wonder waits around every corner.',
  },
  gritty: {
    label: 'Gritty',
    description: 'Harsh realism, painful consequences, moral ambiguity',
    color: '#94a3b8',
    adjectives: ['brutal', 'unforgiving', 'bleak', 'raw', 'desperate'],
    combatFeel: 'Blood spatters. Bones crack. There are no clean victories here.',
    socialFeel: 'Trust is a liability. Everyone has an angle, and kindness has a price.',
    explorationFeel: 'The land is scarred and hostile. Resources are scarce. Survival is the first quest.',
  },
  whimsical: {
    label: 'Whimsical',
    description: 'Light-hearted, humorous, fairy-tale charm',
    color: '#f472b6',
    adjectives: ['delightful', 'peculiar', 'charming', 'mischievous', 'enchanting'],
    combatFeel: 'Swords clash with comedic timing. Even the monsters seem confused by the chaos.',
    socialFeel: 'NPCs are eccentric and colorful. Conversations meander into absurdity.',
    explorationFeel: 'Mushrooms grow in improbable colors. Talking animals offer cryptic directions.',
  },
  horror: {
    label: 'Horror',
    description: 'Dread, isolation, things in the dark',
    color: '#ef4444',
    adjectives: ['unsettling', 'dreadful', 'ominous', 'twisted', 'corrupted'],
    combatFeel: 'The enemy moves wrong. Too fast. Too quiet. Your weapons feel inadequate.',
    socialFeel: 'Something is off about everyone here. Smiles are too wide. Silence hangs too long.',
    explorationFeel: 'Shadows pool in corners. The architecture suggests purposes you don\'t want to understand.',
  },
  mystery: {
    label: 'Mystery',
    description: 'Clues, intrigue, hidden truths',
    color: '#60a5fa',
    adjectives: ['enigmatic', 'concealed', 'cryptic', 'shadowed', 'veiled'],
    combatFeel: 'Who sent these attackers? The real enemy is hidden behind layers of deception.',
    socialFeel: 'Every conversation holds a clue. Contradictions pile up. The truth is close.',
    explorationFeel: 'Details matter. That scratch on the doorframe, those mismatched books, the faint smell of almonds...',
  },
  melancholic: {
    label: 'Melancholic',
    description: 'Loss, nostalgia, bittersweet beauty',
    color: '#a78bfa',
    adjectives: ['sorrowful', 'fading', 'haunting', 'wistful', 'bittersweet'],
    combatFeel: 'Violence feels tragic, not triumphant. Even victory carries the weight of what was lost.',
    socialFeel: 'Old friends have changed. Promises were broken long ago. But connection still matters.',
    explorationFeel: 'Ruins of what once was beautiful. Nature reclaiming civilization. Time\'s quiet destruction.',
  },
};

export function getToneOptions() {
  return Object.entries(TONE_PRESETS).map(([key, tone]) => ({
    id: key,
    label: tone.label,
    description: tone.description,
    color: tone.color,
  }));
}

export function getTonePrompt(toneKey, sceneType = 'exploration') {
  const tone = TONE_PRESETS[toneKey];
  if (!tone) return '';
  const feelKey = sceneType + 'Feel';
  return tone[feelKey] || tone.explorationFeel;
}
