/**
 * playerSummonerClassGuide.js
 * Player Mode: Summoner builds — best classes and action economy
 * Pure JS — no React dependencies.
 */

export const SUMMONER_CLASSES = [
  { class: 'Shepherd Druid', rating: 'S+', key: '+2 HP per HD for summons. Bear Totem temp HP.', best: 'Conjure Animals (8 wolves).' },
  { class: 'Necromancer Wizard', rating: 'S', key: '+level HP, +PB damage on undead.', best: 'Animate Dead army.' },
  { class: 'Conjuration Wizard', rating: 'A+', key: 'Can\'t lose concentration from damage at L10.', best: 'Tasha\'s summons.' },
  { class: 'Wildfire Druid', rating: 'A+', key: 'Wildfire Spirit (free via Wild Shape).', best: 'Spirit + summon spells.' },
  { class: 'Battle Smith Artificer', rating: 'A+', key: 'Steel Defender always active.', best: 'Free pet companion.' },
  { class: 'Beastmaster Ranger (Tasha\'s)', rating: 'A', key: 'Primal Companion scales with PB.', best: 'Tasha\'s fixed Beastmaster.' },
];

export const ACTION_ECONOMY = {
  concept: 'More creatures = more actions/round.',
  topSpells: [
    { spell: 'Conjure Animals (8 wolves)', attacks: 8, dpr: '~32 avg', note: 'Pack Tactics advantage.' },
    { spell: 'Animate Objects (10 tiny)', attacks: 10, dpr: '~50 avg', note: 'Best sustained DPR spell.' },
    { spell: 'Summon Undead (Tasha\'s)', attacks: '1-2', dpr: '~15 avg', note: 'Single summon. Fast turns.' },
  ],
  warning: '8+ summons = slow turns. Pre-roll attacks.',
};

export const SUMMONER_TIPS = [
  'Shepherd Druid: best summoner class.',
  'Conjure Animals: 8 wolves = highest DPR spell.',
  'Animate Objects: 10 tiny = best sustained DPR.',
  'Concentration: lose it = ALL summons gone.',
  'Pre-roll attacks. Don\'t slow the table.',
  'Tasha\'s summons: single creature = faster turns.',
  'Position summons to body-block and flank.',
  'Don\'t summon if fight ends in 1-2 rounds.',
];
