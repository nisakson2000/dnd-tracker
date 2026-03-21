/**
 * playerStatusEffectPriority.js
 * Player Mode: Prioritizing which status effects to inflict and which to cure first
 * Pure JS — no React dependencies.
 */

export const INFLICT_PRIORITY = {
  description: 'Which conditions are most impactful to inflict on enemies, ranked by combat value.',
  rankings: [
    { condition: 'Stunned', priority: 'S', reason: 'Can\'t act, auto-fail STR/DEX saves, advantage on attacks. Best single-target disable.', spells: ['Stunning Strike (Monk)', 'Power Word Stun', 'Divine Word'] },
    { condition: 'Paralyzed', priority: 'S', reason: 'Like stunned + auto-crit in melee. Hold Person/Monster is devastating.', spells: ['Hold Person', 'Hold Monster', 'Ghoul touch'] },
    { condition: 'Incapacitated', priority: 'S', reason: 'Can\'t take actions or reactions. Hypnotic Pattern hits many targets.', spells: ['Hypnotic Pattern', 'Sleep', 'Banishment'] },
    { condition: 'Restrained', priority: 'A', reason: 'Speed 0, advantage on attacks, disadvantage on DEX saves. Web is excellent.', spells: ['Web', 'Entangle', 'Ensnaring Strike'] },
    { condition: 'Frightened', priority: 'A', reason: 'Disadvantage on attacks + can\'t approach. Keeps enemies at range.', spells: ['Fear', 'Wrathful Smite', 'Cause Fear'] },
    { condition: 'Blinded', priority: 'A', reason: 'Advantage on attacks vs them, their attacks at disadvantage. Affects sight-based abilities.', spells: ['Blindness/Deafness', 'Fog Cloud (area)', 'Darkness'] },
    { condition: 'Prone', priority: 'B', reason: 'Advantage on melee vs them. But they can stand up easily (half speed).', spells: ['Shove', 'Grease', 'Tasha\'s Hideous Laughter'] },
    { condition: 'Poisoned', priority: 'B', reason: 'Disadvantage on attacks and checks. Many creatures are immune.', spells: ['Poison Spray', 'Ray of Sickness', 'Stinking Cloud'] },
    { condition: 'Grappled', priority: 'B', reason: 'Speed 0 only. Keeps them in place but doesn\'t debuff attacks.', spells: ['Athletics check', 'Entangle', 'Maximize'] },
  ],
};

export const CURE_PRIORITY = {
  description: 'Which conditions to cure first on your allies, ranked by danger.',
  rankings: [
    { condition: 'Paralyzed', priority: 'S', urgency: 'IMMEDIATE', reason: 'Auto-crit in melee = potential instant death. Remove NOW.', cures: ['Greater Restoration', 'Dispel Magic on spell'] },
    { condition: 'Stunned', priority: 'S', urgency: 'IMMEDIATE', reason: 'Can\'t act, auto-fail saves. Extremely vulnerable.', cures: ['Usually ends next turn', 'Remove cause'] },
    { condition: 'Petrified', priority: 'S', urgency: 'After combat', reason: 'Permanently removed from play. Greater Restoration.', cures: ['Greater Restoration'] },
    { condition: 'Dominated/Charmed (hostile)', priority: 'S', urgency: 'IMMEDIATE', reason: 'Ally is now fighting for the enemy. Can turn the fight.', cures: ['Damage (some spells)', 'Dispel Magic', 'Calm Emotions'] },
    { condition: 'Blinded', priority: 'A', urgency: 'Soon', reason: 'Major combat penalty. Can\'t target many spells.', cures: ['Lesser Restoration', 'Greater Restoration'] },
    { condition: 'Frightened', priority: 'A', urgency: 'Soon', reason: 'Can\'t approach enemy + disadvantage. Breaks positioning.', cures: ['Calm Emotions', 'Break line of sight', 'Heroes\' Feast (prevent)'] },
    { condition: 'Restrained', priority: 'A', urgency: 'Soon', reason: 'Sitting duck. Advantage against, disadvantage on DEX saves.', cures: ['STR check', 'Freedom of Movement', 'Cut restraints'] },
    { condition: 'Poisoned', priority: 'B', urgency: 'When convenient', reason: 'Disadvantage on attacks. Bad but not lethal.', cures: ['Lesser Restoration', 'Lay on Hands (5 HP)', 'Protection from Poison'] },
    { condition: 'Prone', priority: 'C', urgency: 'Ally stands on their turn', reason: 'Costs half speed to stand. Not urgent to cure — they handle it.', cures: ['Stand up (costs half speed)'] },
    { condition: 'Exhaustion', priority: 'A-S', urgency: 'Before it stacks', reason: 'Level 1 is manageable. Level 3+ is crippling. Level 6 = death.', cures: ['Greater Restoration (1 level)', 'Long rest (1 level)', 'Potion of Vitality'] },
  ],
};

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks', severity: 'Low' },
  { level: 2, effect: 'Speed halved', severity: 'Medium' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws', severity: 'High' },
  { level: 4, effect: 'HP maximum halved', severity: 'Critical' },
  { level: 5, effect: 'Speed reduced to 0', severity: 'Critical' },
  { level: 6, effect: 'Death', severity: 'Fatal' },
];

export const CONDITION_COMBOS = [
  { combo: 'Restrained + Prone', effect: 'Can\'t stand up (restrained = speed 0 = can\'t spend half speed). Melee advantage. Nearly helpless.' },
  { combo: 'Grappled + Prone', effect: 'Can\'t stand (speed 0). Melee advantage. Classic grappler combo.' },
  { combo: 'Blinded + Frightened', effect: 'Can\'t see the source but can\'t approach either. Lost and terrified.' },
  { combo: 'Paralyzed + Melee focus fire', effect: 'Auto-crits. Entire party attacks at advantage with auto-crits. Devastating.' },
  { combo: 'Stunned + Called Shot', effect: 'Advantage + auto-fail DEX saves. Follow up with DEX-save spells for guaranteed damage.' },
];

export function getInflictPriority(condition) {
  return INFLICT_PRIORITY.rankings.find(r => r.condition === condition) || { priority: 'Unknown', reason: 'Check condition rules.' };
}

export function getCurePriority(condition) {
  return CURE_PRIORITY.rankings.find(r => r.condition === condition) || { priority: 'Unknown', urgency: 'Check', reason: 'Unknown condition.' };
}

export function exhaustionSeverity(level) {
  return EXHAUSTION_LEVELS[level - 1] || { level: 0, effect: 'No exhaustion', severity: 'None' };
}
