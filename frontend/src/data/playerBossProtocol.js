/**
 * playerBossProtocol.js
 * Player Mode: Step-by-step boss fight protocol and preparation
 * Pure JS — no React dependencies.
 */

export const PRE_BOSS_CHECKLIST = [
  { step: 1, action: 'Short rest before the boss', detail: 'Recover HP, hit dice, short rest features (Channel Divinity, Action Surge, ki, warlock slots).' },
  { step: 2, action: 'Pre-buff the party', detail: 'Heroes\' Feast, Aid, Bless, Mage Armor, Death Ward, Freedom of Movement — anything non-concentration.' },
  { step: 3, action: 'Scout the arena', detail: 'Find environmental hazards, exits, cover. Knowledge is power. Use Arcane Eye, familiars, or sneaky Rogues.' },
  { step: 4, action: 'Identify the boss', detail: 'Knowledge check (Arcana, Nature, Religion, History) to learn resistances, immunities, legendary actions.' },
  { step: 5, action: 'Plan focus fire', detail: 'Agree: "We all attack the boss. Ignore minions unless they heal the boss." Focus fire wins.' },
  { step: 6, action: 'Assign roles', detail: 'Tank holds attention. DPS deals damage. Support heals/buffs. Control handles adds and CC.' },
  { step: 7, action: 'Establish retreat plan', detail: 'If it goes wrong, HOW do we escape? Teleport? Door? Fog Cloud + Dash?' },
  { step: 8, action: 'Use consumables', detail: 'This is what potions, scrolls, and magic items are FOR. Don\'t hoard — use everything.' },
];

export const LEGENDARY_CREATURE_PROTOCOL = [
  { phase: 'Opening (Round 1)', priority: 'Burn Legendary Resistances', tactics: ['Use cheap save-or-suck spells (Hold Person, Blindness)', 'Force the boss to spend LR on weak spells', 'Don\'t use your best spell until LR is gone'], note: 'LR is the boss\'s lifeline. Remove it first.' },
  { phase: 'Mid-fight (Rounds 2-4)', priority: 'Sustained DPS + Control', tactics: ['Once LR is spent, hit with your best CC (Polymorph, Banishment)', 'Focus fire — dead boss = no legendary actions', 'Protect concentration at all costs'], note: 'The boss is most dangerous here. Legendary actions between turns.' },
  { phase: 'Endgame (Low HP)', priority: 'Finish fast', tactics: ['Nova: Action Surge, Smite, all remaining slots', 'Boss may flee or have second phase', 'Don\'t get sloppy — a desperate boss is still deadly'], note: 'This is where most TPKs happen. Stay disciplined.' },
];

export const LEGENDARY_ACTIONS = {
  description: 'Most legendary creatures get 3 legendary actions per round, taken at the END of other creatures\' turns.',
  common: [
    { action: 'Attack (1 action)', frequency: 'Very common', counter: 'High AC, Shield, dodge' },
    { action: 'Move (1 action)', frequency: 'Common', counter: 'Sentinel feat, grapple, restrain' },
    { action: 'Detect (1 action)', frequency: 'Common', counter: 'Nothing — just awareness' },
    { action: 'Wing Attack (2 actions)', frequency: 'Dragons', counter: 'Spread out, STR save prep' },
    { action: 'Frightening Presence (2 actions)', frequency: 'Dragons', counter: 'Heroes\' Feast, Calm Emotions, high WIS saves' },
    { action: 'Tail Attack (1 action)', frequency: 'Dragons/large', counter: 'Don\'t stand behind the dragon' },
  ],
  note: 'Legendary actions effectively give the boss 4+ turns per round. This is why they\'re dangerous.',
};

export const LEGENDARY_RESISTANCE = {
  description: 'Usually 3/day. When the boss fails a save, it can choose to succeed instead.',
  strategy: [
    'Burn LR with cheap spells first: Blindness (2nd level), Hold Person (2nd level)',
    'Count LR uses: "That\'s 2 down, 1 left"',
    'Once LR is gone, hit with Polymorph, Banishment, or Hold Monster',
    'Multiple saves per turn (Sickening Radiance, repeated effects) drain LR faster',
    'Some effects don\'t allow LR (damage spells, attack rolls) — these always work',
  ],
  math: 'If boss has 3 LR and you burn 1 per round, by round 4 your big spell lands. Plan for this.',
};

export const BOSS_FIGHT_MISTAKES = [
  { mistake: 'Using your best spell while LR is up', fix: 'Burn LR with cheap spells first. Hold Person at 2nd level, not Feeblemind at 8th.' },
  { mistake: 'Spreading damage', fix: 'Focus fire the boss. Minions die when the boss dies (often literally).' },
  { mistake: 'Ignoring legendary actions', fix: 'The boss acts 3-4 extra times per round. Account for this in positioning.' },
  { mistake: 'Not using consumables', fix: 'Potions, scrolls, magic items — use them. This is the fight you\'ve been saving them for.' },
  { mistake: 'Fighting in the lair', fix: 'If possible, lure the boss OUT of its lair. No lair actions outside the lair.' },
  { mistake: 'Not having a retreat plan', fix: 'Establish escape routes before combat. TPK prevention is more important than boss killing.' },
  { mistake: 'Wasting actions on failed strategies', fix: 'If something isn\'t working (grappling a Huge dragon), pivot to another strategy.' },
];

export function burnLegendaryResistance(totalLR, spentLR) {
  const remaining = totalLR - spentLR;
  if (remaining <= 0) return { status: 'LR depleted! Big spells now!', remaining: 0 };
  if (remaining === 1) return { status: 'One LR left — one more cheap spell then NOVA', remaining: 1 };
  return { status: `${remaining} LR remaining. Keep burning with cheap saves.`, remaining };
}

export function suggestPhase(bossCurrentHP, bossMaxHP, lrRemaining) {
  const hpPercent = bossCurrentHP / bossMaxHP;
  if (lrRemaining > 0) return LEGENDARY_CREATURE_PROTOCOL[0];
  if (hpPercent > 0.3) return LEGENDARY_CREATURE_PROTOCOL[1];
  return LEGENDARY_CREATURE_PROTOCOL[2];
}
