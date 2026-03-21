/**
 * playerGithyankiGuide.js
 * Player Mode: Githyanki race guide — the astral warriors
 * Pure JS — no React dependencies.
 */

export const GITHYANKI_BASICS = {
  race: 'Githyanki',
  source: 'Mordenkainen\'s Tome of Foes / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 STR, +1 INT (original) or flexible (MotM)',
  theme: 'Militant astral warriors. Psionics, teleportation, and martial prowess.',
  note: 'One of the best races for martials. Free medium armor + weapons (original) or free spellcasting + teleportation (MotM). Incredible value.',
};

export const GITHYANKI_TRAITS_ORIGINAL = [
  { trait: 'Decadent Mastery', effect: 'One language and one skill or tool proficiency.', note: 'Free skill or tool.' },
  { trait: 'Martial Prodigy', effect: 'Light and medium armor proficiency. Shortsword, longsword, greatsword proficiency.', note: 'FREE medium armor and swords for ANY class. Wizard in half-plate. Bard with a greatsword.' },
  { trait: 'Githyanki Psionics', effect: 'Mage Hand (invisible). Lv 3: Jump once/LR. Lv 5: Misty Step once/LR. INT spellcasting.', note: 'Free Misty Step at L5. Teleport once per long rest. Always useful.' },
];

export const GITHYANKI_TRAITS_MOTM = [
  { trait: 'Astral Knowledge', effect: 'After long rest: gain proficiency in one skill using INT for 1 hour. Or until next long rest (MotM).', note: 'Any skill, using INT. Flexible. Change daily.' },
  { trait: 'Githyanki Psionics (MotM)', effect: 'Mage Hand (invisible, castable PB times/LR). Lv 3: Jump (no components, PB/LR). Lv 5: Misty Step (no components, PB/LR).', note: 'MotM: Misty Step PB times per long rest! 2-6 free teleports per day. Incredible.' },
  { trait: 'Psychic Resilience', effect: 'Resistance to psychic damage.', note: 'Psychic resistance. Nice defensive bonus.' },
];

export const GITHYANKI_BUILDS = [
  { build: 'Githyanki Wizard (original)', detail: 'Free medium armor + swords. Wizard in half-plate with a longsword. 17 AC at L1 without Mage Armor.', rating: 'S', note: 'The classic. Most durable Wizard possible without multiclassing.' },
  { build: 'Githyanki Wizard (MotM)', detail: 'PB uses of Misty Step. Psychic resistance. Any skill (INT). Still the best race for Wizard.', rating: 'S' },
  { build: 'Githyanki Fighter/Paladin', detail: '+2 STR. Free Misty Step for mobility. Medium armor is redundant but psionics are great.', rating: 'A' },
  { build: 'Githyanki Eldritch Knight', detail: 'INT synergy. Free Misty Step. Mage Hand for utility. Full martial + extra casting.', rating: 'A' },
  { build: 'Githyanki Bard (original)', detail: 'Free medium armor + weapons. Valor Bard without needing Valor. Go Lore and still have armor.', rating: 'S' },
];

export const GITHYANKI_VS_GITHZERAI = {
  githyanki: { pros: ['Medium armor + weapons (original)', 'Free Misty Step (PB/LR in MotM)', 'Better for martials/gishes', 'More offensive'], cons: ['No Shield spell', 'No mental defense'] },
  githzerai: { pros: ['Free Shield spell (PB/LR in MotM)', 'Advantage on saves vs charm/frightened', 'Better for casters', 'More defensive'], cons: ['No armor proficiency', 'No weapon proficiency'] },
  verdict: 'Githyanki for gish/martial builds. Githzerai for pure casters who want defense.',
};

export function mistyStepUses(proficiencyBonus, isMotM = true) {
  return isMotM ? proficiencyBonus : 1;
}

export function githyankiWizardAC(dexMod) {
  return 15 + Math.min(2, dexMod); // Half-plate (max DEX +2)
}
