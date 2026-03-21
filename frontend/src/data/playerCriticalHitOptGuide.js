/**
 * playerCriticalHitOptGuide.js
 * Player Mode: Critical hit optimization — maximize crit damage
 * Pure JS — no React dependencies.
 */

export const CRIT_RULES = {
  trigger: 'Natural 20 on attack roll = critical hit.',
  effect: 'Double ALL damage dice (not modifiers). Roll the dice twice, add them together.',
  example: '2d6+5 greatsword → crit = 4d6+5. The +5 is NOT doubled.',
  note: 'Bonus damage dice (Sneak Attack, Smite, Hex) ARE doubled on crits.',
};

export const CRIT_PROBABILITY = [
  { range: '20', chance: '5%', note: 'Standard. 1 in 20.' },
  { range: '19-20', chance: '10%', source: 'Champion Fighter, Hexblade\'s Curse, Improved Critical', note: 'Doubles crit rate.' },
  { range: '18-20', chance: '15%', source: 'Champion L15 (Superior Critical)', note: 'Triple crit rate. Champion-exclusive.' },
  { range: 'Advantage', chance: '~9.75%', source: 'Any advantage source', note: 'Two rolls. Nearly doubles crit chance.' },
  { range: '19-20 + Advantage', chance: '~19%', note: 'Almost 1 in 5 attacks is a crit.' },
];

export const MAXIMIZE_CRIT_DAMAGE = [
  { method: 'Paladin Divine Smite', detail: 'Declare after seeing crit. 2d8 → 4d8 on crit. L4 smite crit = 10d8.', rating: 'S+', note: 'Best crit synergy in the game. Declare AFTER rolling.' },
  { method: 'Rogue Sneak Attack', detail: '1d6-10d6 dice doubled. L20 Rogue crit = 20d6 Sneak Attack.', rating: 'S', note: 'Massive dice pool. Crits are devastating.' },
  { method: 'Elven Accuracy', detail: 'Triple advantage on attacks using DEX/CHA/INT/WIS. 3 rolls = ~14% crit chance.', rating: 'S', note: 'Elf/Half-Elf exclusive. Best crit-fishing feat.' },
  { method: 'Hex/Hunter\'s Mark', detail: '+1d6 per hit. Doubled on crit. Small but consistent.', rating: 'A' },
  { method: 'Great Weapon Fighting', detail: 'Reroll 1s and 2s on damage dice (including doubled crit dice).', rating: 'A' },
  { method: 'Brutal Critical (Barbarian)', detail: 'Extra damage die on crits. L9: +1, L13: +2, L17: +3.', rating: 'B+', note: 'Only 1-3 extra dice. Disappointing scaling.' },
  { method: 'Half-Orc Savage Attacks', detail: '+1 weapon damage die on crit.', rating: 'A', note: 'Stacks with Brutal Critical.' },
];

export const CRIT_FISHING_BUILDS = [
  {
    build: 'Hexblade Paladin (Hexadin)',
    mechanics: 'Hexblade\'s Curse (19-20 crit) + Elven Accuracy (triple advantage) + Divine Smite',
    crit_chance: '~14% per swing with Elven Accuracy + 19-20 range',
    crit_damage: 'Weapon + 4d8+ smite + doubled. Massive burst.',
    rating: 'S+',
  },
  {
    build: 'Champion Fighter',
    mechanics: '19-20 (L3), 18-20 (L15) + many attacks + Action Surge',
    crit_chance: '15% per attack at L15',
    crit_damage: 'GWM + doubled dice. Volume of attacks = more crits.',
    rating: 'A+',
  },
  {
    build: 'Assassin Rogue',
    mechanics: 'Surprised targets = auto-crit. Full Sneak Attack doubled.',
    crit_damage: 'L20: 20d6 doubled Sneak Attack = 40d6 on assassinate crit.',
    rating: 'A+ (when surprise works)',
  },
];

export const HOLD_PERSON_CRIT_COMBO = {
  spell: 'Hold Person (L2)',
  condition: 'Paralyzed',
  effect: 'Attacks within 5ft against paralyzed target are auto-crits.',
  combo: 'Hold Person → melee ally attacks → auto-crit → Divine Smite for massive damage.',
  rating: 'S+',
  note: 'Best setup for crit damage. WIS save. Concentration. Humanoids only.',
};

export const CRIT_TIPS = [
  'Paladin: ALWAYS save at least one smite slot for crit opportunities.',
  'Declare smite AFTER seeing the crit. Don\'t waste slots on normal hits (unless needed).',
  'Elven Accuracy requires a stat-based attack (not STR). Works with CHA (Hexblade).',
  'Half-Orc + Barbarian Brutal Critical + Great Weapon = maximum crit dice.',
  'More attacks = more crits. Fighters with 4 attacks per round crit more often.',
  'Advantage is the simplest crit-rate increase. Seek advantage always.',
];
