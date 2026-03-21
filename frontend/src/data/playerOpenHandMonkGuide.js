/**
 * playerOpenHandMonkGuide.js
 * Player Mode: Way of the Open Hand Monk optimization
 * Pure JS — no React dependencies.
 */

export const OPEN_HAND_BASICS = {
  class: 'Monk (Way of the Open Hand)',
  theme: 'Master martial artist. Best at using Flurry of Blows offensively.',
  note: 'Considered the strongest PHB Monk subclass. Pure combat enhancement.',
};

export const OPEN_HAND_FEATURES = [
  {
    feature: 'Open Hand Technique',
    level: 3,
    effect: 'When you hit with Flurry of Blows, impose one: (1) DEX save or prone, (2) STR save or pushed 15ft, (3) Can\'t take reactions until end of your next turn.',
    note: 'Free rider on every Flurry. Prone = advantage for remaining attacks.',
  },
  {
    feature: 'Wholeness of Body',
    level: 6,
    effect: 'Action: heal yourself 3× Monk level HP. Once per long rest.',
    note: 'L6 = 18 HP. L20 = 60 HP. Decent self-heal.',
  },
  {
    feature: 'Tranquility',
    level: 11,
    effect: 'At end of long rest, gain Sanctuary effect (WIS save DC to target you). Lasts until you attack.',
    note: 'Free Sanctuary. Enemies waste actions trying to target you.',
  },
  {
    feature: 'Quivering Palm',
    level: 17,
    effect: '3 ki points. Set a vibration. Later, as action: target makes CON save or drops to 0 HP. On save: 10d10 necrotic.',
    note: 'Instant kill or 55 avg damage. Best capstone in the game. Can set multiple.',
  },
];

export const MONK_COMBAT_FLOW = [
  { turn: 'Turn 1', actions: 'Attack (2 hits). Bonus action: Flurry of Blows (2 more hits, Open Hand Technique on each). 4 attacks total.', ki: 1 },
  { turn: 'Turn 2+', actions: 'Same if ki permits. Otherwise: Attack (2 hits) + Martial Arts bonus action (1 hit). 3 attacks.', ki: '0-1' },
  { turn: 'Stunning Strike turn', actions: 'Attack. First hit: Stunning Strike (1 ki). If stunned: remaining attacks auto-advantage + auto-crit in melee.', ki: '1-3' },
  { turn: 'Defensive turn', actions: 'Attack (2 hits). Bonus action: Patient Defense (Dodge). Or Step of the Wind (Disengage + Dash).', ki: 1 },
];

export const STUNNING_STRIKE_MATH = {
  dc: '8 + proficiency + WIS modifier',
  example: 'L5 Monk, 16 WIS: DC 14. Average monster CON save +3 = 45% stun chance per attempt.',
  strategy: [
    'Use on first hit. If it lands, remaining attacks have advantage.',
    'Target LOW CON enemies: casters, rogues, archers.',
    'Don\'t spam on high CON enemies (dragons, giants). Waste of ki.',
    'At higher levels, DC scales well. L11 WIS 20: DC 16.',
  ],
  perAttemptChance: 'Roughly 40-55% against average enemies. Higher vs casters, lower vs brutes.',
};

export const MONK_OPTIMIZATION = [
  { tip: 'Ki management', detail: 'You have limited ki (= Monk level). Don\'t Flurry every turn. Save ki for Stunning Strike.' },
  { tip: 'Target selection', detail: 'Monks are skirmishers. Hit casters and archers, not the armored tank.' },
  { tip: 'Mobility', detail: '40-60ft speed. Step of the Wind for Dash (80-120ft). Hit and run.' },
  { tip: 'Deflect Missiles', detail: 'Catch and return ranged attacks. Free attack if you reduce damage to 0. Use it!' },
  { tip: 'Slow Fall', detail: 'Reduce fall damage by 5× Monk level. L10 = ignore 50ft falls.' },
  { tip: 'Evasion', detail: 'DEX save for half damage → 0 damage on success. Fireball does nothing to you.' },
  { tip: 'Feat: Crusher', detail: '+1 CON/STR. On hit: push 5ft. On crit: advantage for all attacks until your next turn.' },
];

export function stunDC(profBonus, wisMod) {
  return 8 + profBonus + wisMod;
}

export function flurryDPR(martialArtsDie, dexMod, level) {
  const attacks = 4; // 2 attack action + 2 flurry
  const dmgPerHit = martialArtsDie / 2 + dexMod;
  return attacks * dmgPerHit;
}

export function kiPerDay(monkLevel) {
  return monkLevel;
}
