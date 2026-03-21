/**
 * playerSummoningGuide.js
 * Player Mode: Summon spells ranked, tactics, and speed management
 * Pure JS — no React dependencies.
 */

export const SUMMONING_BASICS = {
  concept: 'Summoned creatures add action economy (extra attacks/actions per round). They are the strongest spells in the game when managed well.',
  concentration: 'All summoning spells require concentration. Losing concentration = ALL summons disappear instantly.',
  management: 'Roll attacks in batches. Use average damage. Have stat blocks ready. Don\'t slow down the table.',
  note: 'Summoning is powerful but comes with responsibility. If you slow combat to a crawl, your DM may limit summoning.',
};

export const CONJURE_SPELLS_RANKED = [
  { spell: 'Conjure Animals', level: 3, class: 'Druid/Ranger', duration: '1 hour', options: '1 CR2, 2 CR1, 4 CR1/2, 8 CR1/4', rating: 'S', note: '8 wolves with Pack Tactics. 8 attacks per round with advantage. Best sustained DPR spell in the game at L3.' },
  { spell: 'Conjure Woodland Beings', level: 4, class: 'Druid/Ranger', duration: '1 hour', options: '1 CR2, 2 CR1, 4 CR1/2, 8 CR1/4', rating: 'S', note: '8 pixies can each cast Polymorph (1/day). 8 Giant Apes. DM may not let you choose pixies.' },
  { spell: 'Conjure Minor Elementals', level: 4, class: 'Druid/Wizard', duration: '1 hour', options: '1 CR2, 2 CR1, 4 CR1/2, 8 CR1/4', rating: 'A', note: 'Mephits and minor elementals. Less impactful than animals but elemental utilities.' },
  { spell: 'Conjure Elemental', level: 5, class: 'Druid/Wizard', duration: '1 hour', options: '1 CR5 elemental', rating: 'A', note: 'One powerful elemental. If concentration drops, it turns hostile. Risk/reward.', warning: 'HOSTILE ON CONCENTRATION LOSS' },
  { spell: 'Conjure Fey', level: 6, class: 'Druid/Warlock', duration: '1 hour', options: '1 fey creature CR ≤ spell level', rating: 'A', note: 'Powerful single fey. Also turns hostile on concentration loss.' },
  { spell: 'Conjure Celestial', level: 7, class: 'Cleric', duration: '1 hour', options: '1 celestial CR ≤ 4 (CR5 at L9)', rating: 'B', note: 'Limited options. Couatl is good. But CR4 is low for a L7 spell.' },
];

export const TASHA_SUMMONS_RANKED = [
  { spell: 'Summon Fey', level: 3, class: 'Druid/Ranger/Warlock/Wizard', rating: 'A', note: 'One fey spirit. Predictable stats. Scales with spell level. Fuming or Mirthful or Tricksy mode.' },
  { spell: 'Summon Beast', level: 2, class: 'Druid/Ranger', rating: 'A', note: 'Earliest summon (L2). Air/Land/Water forms. Scales. Great early game.' },
  { spell: 'Summon Undead', level: 3, class: 'Warlock/Wizard', rating: 'A', note: 'Ghostly/Putrid/Skeletal forms. Skeletal is best (ranged). Scales with slot level.' },
  { spell: 'Summon Shadowspawn', level: 3, class: 'Warlock/Wizard', rating: 'B', note: 'Fury/Despair/Fear forms. Despair slows enemies. Shadow-themed.' },
  { spell: 'Summon Elemental', level: 4, class: 'Druid/Ranger/Wizard', rating: 'A', note: 'Doesn\'t turn hostile! Safer than Conjure Elemental. Four element modes.' },
  { spell: 'Summon Aberration', level: 4, class: 'Warlock/Wizard', rating: 'A', note: 'Beholderkin (ranged), Slaad (melee), Star Spawn. Beholderkin is best.' },
  { spell: 'Summon Construct', level: 4, class: 'Artificer/Wizard', rating: 'A', note: 'Stone/Metal/Clay. Heated Body (Metal) deals retaliatory damage. Durable.' },
  { spell: 'Summon Celestial', level: 5, class: 'Cleric/Paladin', rating: 'A', note: 'Avenger (ranged) or Defender (heal). Defender heals PB per turn. Great support summon.' },
  { spell: 'Summon Fiend', level: 6, class: 'Warlock/Wizard', rating: 'A', note: 'Demon/Devil/Yugoloth. Demon has bonus action attack. Very strong.' },
  { spell: 'Summon Dragon', level: 5, class: 'Any (via Dragon Vessel)', rating: 'S', note: 'Fizban\'s. Flying mount. Breath weapon. Scales very well. Best Tasha\'s summon.' },
];

export const SUMMON_SPEED_TIPS = [
  { tip: 'Pre-roll attacks', detail: 'Roll all summon attacks at once. 8 wolves: roll 8d20 simultaneously. Compare each to AC.', priority: 1 },
  { tip: 'Use average damage', detail: 'Don\'t roll damage for each hit. Use average: wolf bite = 7 damage. Speeds up dramatically.', priority: 1 },
  { tip: 'Have stat blocks ready', detail: 'Print or display summon stat blocks. Don\'t look them up mid-combat. Preparation is key.', priority: 1 },
  { tip: 'Group movement', detail: 'Move all summons at once. Don\'t move each individually. "All wolves move to surround the ogre."', priority: 2 },
  { tip: 'Batch saves', detail: 'If summons make saves: roll all at once. "3 pass, 5 fail" is faster than rolling individually.', priority: 2 },
  { tip: 'Tasha\'s summons are faster', detail: 'One creature with clear stats vs 8 separate creatures. Consider Tasha\'s summons if speed is a concern.', priority: 2 },
];

export const BEST_SUMMON_FORMS = [
  { summon: 'Wolf (CR 1/4)', hp: 11, ac: 13, attack: '+4, 2d4+2 (7)', feature: 'Pack Tactics (advantage if ally within 5ft)', note: '8 wolves = 8 attacks with advantage. Best per-slot DPR.' },
  { summon: 'Giant Owl (CR 1/4)', hp: 19, ac: 13, attack: '+3, 2d6+1 (8)', feature: 'Flyby (no OA)', note: 'Flying scouts. Hit and run. 8 = 8 flying attacks.' },
  { summon: 'Velociraptor (CR 1/4)', hp: 10, ac: 13, attack: '+4, 1d6+2 (5) + 1d4+2 (4)', feature: 'Pack Tactics + multiattack', note: 'Two attacks each with Pack Tactics. 16 attacks from 8 raptors.' },
  { summon: 'Pixie (CR 1/4)', hp: 1, ac: 15, attack: 'None', feature: 'Each can cast Polymorph 1/day', note: '8 pixies = 8 Polymorphs. DM may restrict this.' },
];

export function conjureAnimalsDPR(count, attackBonus, damage, targetAC, hasPackTactics = false) {
  let hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  if (hasPackTactics) hitChance = 1 - (1 - hitChance) * (1 - hitChance); // advantage
  return count * hitChance * damage;
}

export function tashasSummonHP(spellLevel, baseHP = 30) {
  return baseHP + 10 * (spellLevel - 3); // Tasha's summons scale with spell level
}
