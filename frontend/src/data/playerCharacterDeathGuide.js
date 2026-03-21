/**
 * playerCharacterDeathGuide.js
 * Player Mode: Character death — prevention, handling, and resurrection
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  when: 'At the start of each turn while at 0 HP.',
  check: 'd20: 10+ = success, 9 or below = failure. Not a saving throw — no modifiers (usually).',
  stabilize: '3 successes = stabilize (unconscious, 1 HP in 1d4 hours).',
  death: '3 failures = dead.',
  nat20: 'Regain 1 HP and become conscious. Reset death saves.',
  nat1: 'Counts as 2 failures.',
  damage: 'Taking damage at 0 HP = 1 automatic failure. Crit = 2 failures.',
  instantDeath: 'If remaining damage >= your max HP, instant death. No death saves.',
};

export const DEATH_PREVENTION = [
  { method: 'Death Ward (L4)', rating: 'S+', note: '8 hours. First 0 HP → 1 HP instead. Pre-fight mandatory on frontliners.' },
  { method: 'Healing Word (L1)', rating: 'S+', note: 'BA, 60ft. Pick up downed allies. Even 1 HP gets them acting.' },
  { method: 'Relentless Endurance (Half-Orc)', rating: 'S', note: '1/LR: drop to 1 HP instead of 0. Racial anti-death.' },
  { method: 'Aid (L2)', rating: 'S', note: '+5 max HP for 8 hours. More HP = harder to one-shot.' },
  { method: 'Aura of Protection (Paladin)', rating: 'S', note: '+CHA to all saves in 10ft. Saves against death-dealing spells.' },
  { method: 'Lay on Hands', rating: 'A+', note: '1 HP at a time from pool. Pick up downed allies efficiently.' },
  { method: 'Spare the Dying (cantrip)', rating: 'B+', note: 'Stabilize at 0 HP. Touch range (30ft BA for Grave Cleric).' },
  { method: 'Periapt of Wound Closure', rating: 'A', note: 'Auto-stabilize at 0 HP. Also doubles HD healing.' },
  { method: 'Heroes\' Feast (L6)', rating: 'S', note: '+2d10 max HP, immune to frightened/poison, advantage WIS saves.' },
];

export const RESURRECTION_SPELLS = [
  { spell: 'Revivify', level: 3, cost: '300gp diamond', timeLimit: '1 minute', condition: 'Body intact. No old age death.', rating: 'S+', note: 'Best resurrection. 1-minute window. Always have diamonds.' },
  { spell: 'Raise Dead', level: 5, cost: '500gp diamond', timeLimit: '10 days', condition: 'Body mostly intact. -4 penalty (reduces 1/LR). No undead.', rating: 'A+', note: '10-day window. -4 to attacks/saves/checks until 4 long rests.' },
  { spell: 'Reincarnate', level: 5, cost: '1,000gp materials', timeLimit: '10 days', condition: 'Only need a body piece. New random body/race.', rating: 'A', note: 'Random new race. Some players love it, others hate it.' },
  { spell: 'Resurrection', level: 7, cost: '1,000gp diamond', timeLimit: '100 years', condition: 'Need body part or name/description. -4 penalty.', rating: 'A+', note: 'Century-long window. Only need a piece of the body.' },
  { spell: 'True Resurrection', level: 9, cost: '25,000gp diamond', timeLimit: '200 years', condition: 'Don\'t even need the body. Provides new body if destroyed.', rating: 'S', note: 'Ultimate resurrection. New body if old one is gone.' },
  { spell: 'Clone', level: 8, cost: '1,000gp + 1 cubic inch of flesh', timeLimit: 'N/A (prepared before death)', condition: 'Clone must grow for 120 days. Soul enters on death.', rating: 'S+', note: 'Immortality insurance. Prepare in advance. Soul auto-transfers.' },
  { spell: 'Wish', level: 9, cost: 'None (but 33% lose Wish forever)', timeLimit: 'Any', condition: 'Can duplicate Resurrection for free (safe use).', rating: 'S+', note: 'Safe use: duplicate any L8 or lower resurrection spell.' },
];

export const GENTLE_REPOSE_COMBO = {
  spell: 'Gentle Repose (L2, ritual)',
  effect: 'Extends the deadline for resurrection spells by 10 days per casting.',
  combo: [
    'Ally dies → cast Gentle Repose immediately.',
    'Timer for Revivify pauses: you now have 10 days + 1 minute.',
    'Recast every 10 days to maintain indefinitely.',
    'Find a cleric with Revivify. Use the 300gp diamond. Ally lives.',
  ],
  note: 'This combo means you never need higher-level resurrection if you act fast enough.',
};

export const CHARACTER_DEATH_TIPS = [
  'Always carry 300gp of diamonds. Death is unpredictable. Be prepared.',
  'Healing Word when someone goes down. Even 1 HP is better than death saves.',
  'Gentle Repose immediately on a body. Extends Revivify window to 10+ days.',
  'Death Ward before boss fights. 8 hours, no concentration. Free insurance.',
  'Don\'t finish off player-allied NPCs at 0 HP. Enemies usually ignore downed PCs (at DM discretion).',
  'If your character dies permanently, work with the DM for a meaningful entrance of your new character.',
  'Clone is the endgame: grow a backup body. Die → wake up in clone. Immortality.',
];
