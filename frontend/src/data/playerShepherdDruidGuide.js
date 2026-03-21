/**
 * playerShepherdDruidGuide.js
 * Player Mode: Circle of the Shepherd Druid — the ultimate summoner
 * Pure JS — no React dependencies.
 */

export const SHEPHERD_BASICS = {
  class: 'Druid (Circle of the Shepherd)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Spirit summoner and beast guardian. Best summoning Druid.',
  note: 'If you want to summon armies of creatures, this is the subclass. Incredibly powerful but slow to play.',
};

export const SHEPHERD_FEATURES = [
  { feature: 'Spirit Totem', level: 2, effect: 'Bonus action: summon spirit in 60ft, 30ft aura for 1 minute. Choose Bear, Hawk, or Unicorn. Short rest recovery.', note: 'Three spirits, each with powerful aura effects.' },
  { feature: 'Mighty Summoner', level: 6, effect: 'Summoned creatures get +2 HP per hit die and their attacks count as magical.', note: 'Your summons are beefier and bypass nonmagical resistance. Huge buff.' },
  { feature: 'Guardian Spirit', level: 10, effect: 'Summoned creatures regain half your Druid level HP at end of each turn in Spirit Totem aura.', note: 'Your summons heal every turn. They\'re nearly unkillable in the aura.' },
  { feature: 'Faithful Summons', level: 14, effect: 'When you drop to 0 HP, 4 beasts of CR 2 or lower appear and protect you.', note: 'Automatic bodyguards when downed. Four CR 2 beasts is significant.' },
];

export const SPIRIT_TOTEMS = [
  { spirit: 'Bear', effect: 'Each creature in aura gains temp HP = 5 + your Druid level. Allies in aura have advantage on STR checks/saves.', note: 'Party-wide temp HP + STR advantage. Best defensive option.' },
  { spirit: 'Hawk', effect: 'Reaction: grant advantage on an attack roll to creature in aura. Allies in aura have advantage on Perception.', note: 'Advantage granting as reaction. Good offensive support.' },
  { spirit: 'Unicorn', effect: 'You and allies in aura have advantage on detecting creatures. When you heal in aura, each creature in aura regains HP = your Druid level.', note: 'Mass healing amplifier. Cast Healing Word: everyone in aura heals for your level HP.' },
];

export const CONJURE_SPELLS_RANKED = [
  { spell: 'Conjure Animals (3rd)', detail: '8 wolves (CR 1/4) or 4 elk (CR 1/4) or 2 giant constrictors (CR 2). 8 wolves = 8 attacks at +4, advantage from Pack Tactics.', rating: 'S', note: 'The bread and butter. 8 wolves with Pack Tactics and magical attacks (Mighty Summoner) is devastating.' },
  { spell: 'Conjure Woodland Beings (4th)', detail: '8 pixies (CR 1/4). Each pixie can cast Polymorph, Fly, etc.', rating: 'S (if DM allows)', note: '8 pixies casting Polymorph = 8 Giant Apes. Notoriously powerful. Many DMs restrict.' },
  { spell: 'Conjure Minor Elementals (4th)', detail: '8 mephits or similar. Less impactful than Conjure Animals usually.', rating: 'B' },
  { spell: 'Conjure Elemental (5th)', detail: '1 elemental (CR 5 or lower). Water Elemental is often best (grapple, water form).', rating: 'A' },
  { spell: 'Conjure Fey (6th)', detail: '1 fey creature CR 6 or lower. Powerful single summon.', rating: 'A' },
];

export const SUMMONING_TIPS = [
  'Know your summon stats by heart. Write them on cards. Don\'t slow down the table.',
  'Roll all attacks at once using different colored dice. Speed is key.',
  'Use the average damage instead of rolling damage. Saves massive time.',
  'Don\'t summon in tight spaces. 8 wolves need 8 squares of space.',
  'Concentration! If you lose concentration, ALL summons disappear.',
  'DM chooses the specific creatures in many summoning spells. Discuss beforehand.',
  'Tasha\'s summoning spells (Summon Beast, etc.) are faster — single creature, less bookkeeping.',
];

export function conjureAnimalsDPR(creatureCount, attackBonus, damagePerHit, targetAC) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  return creatureCount * hitChance * damagePerHit;
}

export function mightySummonerHP(creatureHitDice) {
  return creatureHitDice * 2; // +2 HP per hit die
}

export function bearTotemTempHP(druidLevel) {
  return 5 + druidLevel;
}
