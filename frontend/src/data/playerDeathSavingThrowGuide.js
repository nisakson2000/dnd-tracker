/**
 * playerDeathSavingThrowGuide.js
 * Player Mode: Death saving throws — the rules and how to survive
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_BASICS = {
  when: 'Start of each turn while at 0 HP and not stabilized.',
  roll: 'D20. 10+ = success. 9 or below = failure.',
  successes: '3 successes = stabilized (unconscious but not dying).',
  failures: '3 failures = dead.',
  nat20: 'Regain 1 HP. Conscious. All death saves reset.',
  nat1: 'Counts as 2 failures.',
  damage: 'Taking damage while at 0 HP = 1 automatic failure. Critical hit = 2 failures.',
  healing: 'Any healing (even 1 HP) = conscious. Death saves reset.',
  massiveDamage: 'If remaining damage after 0 HP equals or exceeds max HP = instant death.',
  note: 'Death saves persist until healed or stabilized. They don\'t reset between turns.',
};

export const DEATH_SAVE_MATH = {
  survivalChance: '59.5% chance to survive all 5 rounds without intervention.',
  deathChance: '40.5% chance of dying without intervention.',
  nat20Chance: '5% per roll. With 5 rolls: ~22.6% chance of nat 20 somewhere.',
  expectedRounds: 'On average: stabilize or die within 3-5 rounds.',
  note: 'Don\'t rely on death saves. Get healing to the downed ally ASAP.',
};

export const DEATH_SAVE_MODIFIERS = [
  { source: 'Paladin Aura of Protection', effect: '+CHA to death saves.', note: 'With CHA +5: death save DC becomes 5+ instead of 10+. Massive improvement.' },
  { source: 'Bless spell', effect: '+1d4 to death saves.', note: 'If Bless is still active when you drop to 0, it applies to death saves.' },
  { source: 'Lucky feat', effect: 'Reroll death saves.', note: 'Use Lucky on failed death saves. Could save your life.' },
  { source: 'Diamond Soul (Monk)', effect: 'Proficiency in all saves + ki reroll.', note: 'Proficiency in death saves. +PB to the roll.' },
  { source: 'Halfling Lucky', effect: 'Reroll natural 1s.', note: 'Natural 1 on death save = 2 failures. Halfling: reroll it.' },
  { source: 'Death Ward (L4)', effect: 'Drop to 1 HP instead of 0. Once.', note: 'Prevents death saves entirely (for one hit). Cast pre-combat.' },
];

export const STABILIZATION_METHODS = [
  { method: 'Healing Word', action: 'Bonus Action', range: '60ft', note: 'Best option. BA from range. Ally conscious and acts on their turn.' },
  { method: 'Cure Wounds', action: 'Action', range: 'Touch', note: 'Requires touching the unconscious ally. Costs action.' },
  { method: 'Lay on Hands (1 HP)', action: 'Action', range: 'Touch', note: 'Paladin: spend just 1 HP from pool. Most efficient stabilization.' },
  { method: 'Spare the Dying (cantrip)', action: 'Action', range: 'Touch', note: 'Stabilize without healing. Ally stays unconscious. No spell slot.' },
  { method: 'Medicine check DC 10', action: 'Action', range: 'Touch', note: 'Anyone can try. DC 10 Medicine. Stabilizes on success.' },
  { method: 'Healing Potion', action: 'Action', range: 'Touch', note: 'Pour potion on unconscious ally. They regain HP.' },
  { method: 'Goodberry', action: 'Action?', range: 'Touch', note: 'Can you feed a berry to an unconscious creature? DM ruling. Many allow it.' },
];

export const DEATH_SAVE_TACTICS = [
  { tactic: 'Healing Word immediately', detail: 'Ally drops → your turn → BA Healing Word from 60ft. They\'re up before enemies finish them off.', rating: 'S' },
  { tactic: 'Pre-cast Death Ward', detail: 'Before boss fights: Death Ward on frontliners. They drop to 1 HP instead of 0. No death saves.', rating: 'S' },
  { tactic: 'Protect unconscious allies', detail: 'Melee attacks on unconscious creatures auto-crit (within 5ft) = 2 failures. Keep enemies away from downed allies.', rating: 'S' },
  { tactic: 'Paladin aura positioning', detail: 'Stay within 10ft of Paladin. Aura adds +CHA to death saves. DC 5 instead of 10 with CHA +5.', rating: 'S' },
  { tactic: 'Don\'t move the dying', detail: 'Moving an unconscious ally doesn\'t trigger death saves, but it takes your action (grapple + drag). Usually better to heal them.', rating: 'B' },
];

export function deathSaveWithAura(charismaModPaladin) {
  const dc = 10;
  const effectiveDC = dc - charismaModPaladin;
  const passChance = Math.min(0.95, (21 - effectiveDC) / 20);
  return { effectiveDC, passChance: `${(passChance * 100).toFixed(0)}%`, note: `With Paladin aura +${charismaModPaladin}: need ${effectiveDC}+ to pass` };
}
