/**
 * playerLegendaryItemsGuide.js
 * Player Mode: Legendary magic items — the most powerful items in 5e
 * Pure JS — no React dependencies.
 */

export const LEGENDARY_WEAPONS = [
  { item: 'Holy Avenger', type: 'Weapon (any sword)', attune: 'Paladin only', effect: '+3 weapon. +2d10 radiant vs fiends/undead. Allies within 10ft: advantage on saves vs spells.', rating: 'S+', note: 'Best Paladin weapon. +3 + anti-evil + aura of resistance.' },
  { item: 'Vorpal Sword', type: 'Weapon (any sword)', attune: 'Yes', effect: '+3. On natural 20: sever the head (instant kill for most creatures).', rating: 'S', note: 'Instant kill on nat 20. Some creatures (no head) immune.' },
  { item: 'Luck Blade', type: 'Weapon (any sword)', attune: 'Yes', effect: '+1. +1 to saves. Reroll once/LR. 1d4-1 Wish charges.', rating: 'S+', note: 'WISH. Even 1 Wish charge makes this the best item in the game.' },
  { item: 'Defender', type: 'Weapon (any sword)', attune: 'Yes', effect: '+3. Transfer some or all +3 to AC instead of attack/damage.', rating: 'A+', note: 'Flexible. Full tank mode: +3 AC. Full damage mode: +3 weapon.' },
  { item: 'Sword of Kas', type: 'Weapon (longsword)', attune: 'Yes', effect: '+3. Extra 2d10 vs undead. Crit on 19-20. Sentient. Wants to destroy Vecna.', rating: 'S', note: 'Artifact. Sentient evil weapon. Incredible power at a cost.' },
];

export const LEGENDARY_ARMOR = [
  { item: 'Plate Armor of Etherealness', type: 'Armor (plate)', attune: 'Yes', effect: 'Plate. Action: become ethereal 1/LR.', rating: 'A+', note: 'Phase through walls. Scout ethereally. Incredible utility.' },
  { item: 'Armor of Invulnerability', type: 'Armor (plate)', attune: 'Yes', effect: 'Plate. Resistance to nonmagical damage. 1/LR: 10 min immunity to nonmagical damage.', rating: 'S', note: 'Immune to nonmagical damage for 10 minutes. Unkillable by most enemies.' },
  { item: 'Robe of the Archmagi', type: 'Armor (robe)', attune: 'Sorcerer/Warlock/Wizard', effect: 'AC 15+DEX. +2 spell save DC. +2 spell attack. Advantage on saves vs spells. Magic Resistance.', rating: 'S+', note: 'Best caster armor. +2 DC, +2 attacks, Magic Resistance. Incredible.' },
  { item: 'Efreeti Chain', type: 'Armor (chain mail)', attune: 'Yes', effect: 'Chain mail. Immunity to fire damage. Understand/speak Primordial. Walk on lava.', rating: 'A+', note: 'Fire immunity. Walk on lava. Niche but incredible when relevant.' },
];

export const LEGENDARY_ITEMS = [
  { item: 'Staff of the Magi', type: 'Staff', attune: 'Sorcerer/Warlock/Wizard', effect: '+2 DC/attacks. Absorb spells. 50 charges of spells. Retributive Strike (nuke).', rating: 'S+', note: 'Best caster item in the game. Absorb spells, cast dozens. Nuke on break.' },
  { item: 'Ring of Three Wishes', type: 'Ring', attune: 'No', effect: '3 charges of Wish.', rating: 'S+', note: 'Three Wishes. Most powerful item by effect. No attunement needed.' },
  { item: 'Tome of the Stilled Tongue', type: 'Wondrous', attune: 'Wizard', effect: 'Use as spellbook. BA to cast a spell from it 1/LR without components.', rating: 'S', note: 'BA spell casting without components. Tied to Vecna lore.' },
  { item: 'Iron Flask', type: 'Wondrous', attune: 'No', effect: 'Trap creature inside (WIS save). Release to serve you for 1 hour.', rating: 'S', note: 'Trap any creature. Even CR 20+. Release as ally. Campaign-defining.' },
  { item: 'Cloak of Invisibility', type: 'Wondrous', attune: 'Yes', effect: 'Pull hood: invisible. 2 hours/day in 1-min increments.', rating: 'S', note: 'At-will invisibility. 2 hours daily. Incredible for scouting and combat.' },
  { item: 'Scarab of Protection', type: 'Wondrous', attune: 'Yes', effect: 'Advantage on saves vs spells. 12 charges: negate failed save vs necromancy/harmful touch.', rating: 'S', note: 'Magic Resistance + 12 free saves. Incredible defensive item.' },
  { item: 'Instrument of the Bards (Ollamh Harp)', type: 'Wondrous', attune: 'Bard', effect: 'Cast several spells 1/day. Charm advantage on Bard spells.', rating: 'A+', note: 'Free spell casts daily. Extra charming. Best Bard item.' },
];

export const LEGENDARY_TIPS = [
  'Legendary items typically appear at T4 (L17+). Don\'t expect them before.',
  'Staff of the Magi and Robe of the Archmagi together = godlike caster.',
  'Holy Avenger is the Paladin\'s ultimate reward. +3 + anti-evil + party-wide save bonus.',
  'Vorpal Sword: instant kill on nat 20 against most creatures. Crit-fishing becomes deadly.',
  'Luck Blade: even 0 Wish charges, it\'s still +1 weapon/saves + 1 reroll/LR.',
  'Ring of Three Wishes: safe Wishes only (duplicate L8 or lower). Don\'t risk losing Wish forever.',
  'Iron Flask: capture a boss\'s lieutenant, release in the next fight as YOUR ally.',
];
