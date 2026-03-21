/**
 * playerDeathSaveMechanicsGuide.js
 * Player Mode: Death saves — rules, optimization, and stabilization
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  when: 'Start of each of your turns while at 0 HP.',
  roll: 'd20. 10+ = success. 9- = failure. 3 successes = stabilize. 3 failures = death.',
  nat20: 'Regain 1 HP and become conscious. All saves reset.',
  nat1: 'Counts as TWO failures.',
  damage: 'Taking damage at 0 HP = 1 automatic failure. Critical hit = 2 failures.',
  healing: 'ANY healing at 0 HP = conscious at that HP amount. Saves reset.',
  stabilize: '3 successes: stabilized (stop rolling). Still unconscious. Regain 1 HP after 1d4 hours.',
};

export const DEATH_SAVE_MATH = {
  chanceToStabilize: '59.5% chance to stabilize from fresh (no successes/failures)',
  chanceWithOneFail: '~44% chance to stabilize',
  chanceWithTwoFails: '~28% chance to stabilize',
  nat20Chance: '5% per roll — small but meaningful',
  nat1Chance: '5% per roll — devastating, instantly 2 failures',
  averageTurns: '~3-4 turns to resolve (stabilize or die)',
  note: 'Death saves are surprisingly lethal. Don\'t assume allies will stabilize on their own.',
};

export const DEATH_SAVE_MODIFIERS = [
  { source: 'Paladin Aura of Protection', effect: '+CHA to death saves (you\'re making a saving throw).', rating: 'S', note: 'Paladin within 10ft: +3 to +5 on death saves. Huge.' },
  { source: 'Bless', effect: '+1d4 to death saves (it\'s a saving throw).', rating: 'A+', note: 'If Bless is active when you drop, it still applies.' },
  { source: 'Ring/Cloak of Protection', effect: '+1 to death saves.', rating: 'A', note: 'Small but helps. 10+ threshold means every point counts.' },
  { source: 'Diamond Soul (Monk L14)', effect: 'Proficiency on ALL saves including death saves.', rating: 'S', note: 'PB on death saves is massive.' },
  { source: 'Lucky feat', effect: 'Use a luck point to reroll a death save.', rating: 'S', note: 'Reroll a nat 1 death save. Life-saving.' },
  { source: 'Halfling Lucky', effect: 'Reroll nat 1s. Negates the worst death save outcome.', rating: 'S', note: 'Halflings can\'t roll nat 1 on death saves. Incredible.' },
];

export const PREVENTING_DEATH = [
  { method: 'Healing Word (BA, 60ft)', detail: 'Pick up ally from 0 HP instantly. Best method.', rating: 'S' },
  { method: 'Spare the Dying (cantrip)', detail: 'Stabilize at 0 HP. Touch range. No HP restored.', rating: 'B+', note: 'Free but touch range and doesn\'t restore HP.' },
  { method: 'Death Ward (L4)', detail: 'Next time target drops to 0 HP, they go to 1 HP instead.', rating: 'S', note: 'Cast before combat. Prevents the drop entirely.' },
  { method: 'Medicine check (DC 10)', detail: 'Stabilize without magic. Anyone can try.', rating: 'B', note: 'No spell slot cost. DC 10 is easy with proficiency.' },
  { method: 'Healer feat', detail: 'Use healer\'s kit to stabilize AND restore 1d6+4+level HP. Once per rest per creature.', rating: 'A', note: 'Non-magical healing. Any class can take this.' },
  { method: 'Periapt of Wound Closure', detail: 'Attunement item: auto-stabilize at 0 HP. Double healing dice.', rating: 'A+', note: 'Passive auto-stabilize. Never worry about death saves.' },
  { method: 'Twilight Sanctuary', detail: 'Temp HP every round prevents going to 0 in the first place.', rating: 'S' },
];

export const DEATH_SAVE_STRATEGY = [
  'Healing Word > Cure Wounds at 0 HP. BA + range > slightly more healing.',
  'Don\'t heal proactively — heal at 0 HP. Going from 0→1 HP restores full action economy.',
  'Body blocking: stand next to downed ally so enemies attack you instead.',
  'If stable, leave them. They\'ll wake up in 1d4 hours. Focus on winning the fight.',
  'Melee enemies near a downed ally: PRIORITY TARGET. They can auto-crit the downed PC.',
  'Death saves persist across turns. A DM shouldn\'t roll death saves publicly (metagaming).',
  'Nat 20 death save = they\'re up at 1 HP. Don\'t waste a Healing Word if they nat 20\'d.',
];

export const INSTANT_DEATH_RULES = {
  rule: 'If damage reduces you to 0 HP and the REMAINING damage equals or exceeds your max HP, you die instantly.',
  example: 'Wizard with 30 max HP at 10 current HP takes 40 damage. 0 HP reached, 30 damage remaining = max HP. Instant death.',
  note: 'Massive damage can bypass death saves entirely. Low-HP characters beware.',
  prevention: [
    'Keep HP above half max when possible.',
    'Death Ward prevents the drop to 0.',
    'Absorb Elements halves elemental damage (reaction).',
    'Shield reduces the hit that would down you.',
  ],
};
