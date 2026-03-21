/**
 * playerLichEncounters.js
 * Player Mode: Fighting liches — phylactery hunting and combat tactics
 * Pure JS — no React dependencies.
 */

export const LICH_STATS = {
  cr: 21,
  ac: 17,
  hp: 135,
  speed: '30ft',
  saves: 'CON +10, INT +12, WIS +9',
  legendaryResistance: '3/day',
  legendaryActions: 3,
  turnResistance: 'Advantage on saves vs Turn Undead.',
  damageImmunity: 'Poison, necrotic. Bludgeoning/piercing/slashing from nonmagical attacks.',
  conditionImmunity: 'Charmed, exhaustion, frightened, paralyzed, poisoned.',
  rejuvenation: 'If phylactery exists: reforms with full HP in 1d10 days after being destroyed.',
};

export const LICH_SPELLCASTING = {
  level: '18th level spellcaster',
  dangerousSpells: [
    { spell: 'Power Word Kill', level: 9, effect: 'If you have ≤100 HP: you die. No save.', counter: 'Keep HP above 100. Aid spell. Temp HP.' },
    { spell: 'Globe of Invulnerability', level: 6, effect: 'No spells 5th or lower affect the lich.', counter: '6th+ level spells only. Dispel Magic at 6th level.' },
    { spell: 'Counterspell', level: 3, effect: 'Blocks your spells.', counter: 'Multiple casters. Bait with lower spells first.' },
    { spell: 'Wall of Force', level: 5, effect: 'Traps party members in dome.', counter: 'Disintegrate destroys it. Or Dispel Magic.' },
    { spell: 'Finger of Death', level: 7, effect: '7d8+30 necrotic. Killed target rises as zombie.', counter: 'High HP pool. Death Ward.' },
    { spell: 'Disintegrate', level: 6, effect: '10d6+40 force. If reduced to 0: disintegrated.', counter: 'Shield spell. High DEX save.' },
    { spell: 'Cloudkill', level: 5, effect: '5d8 poison in 20ft sphere. Moves 10ft/round.', counter: 'Immune to poisoned. Gust of Wind to disperse.' },
  ],
};

export const PHYLACTERY_RULES = {
  what: 'Object storing the lich\'s soul. Often hidden in the most secure location imaginable.',
  destruction: 'Destroying the phylactery is the ONLY way to permanently kill a lich.',
  difficulty: 'Phylacteries are often protected by: traps, guardians, dimensional pockets, other planes.',
  finding: 'Legend Lore, Divination, Commune — divine spells can reveal location.',
  hp: 'Phylacteries are typically very durable. Immune to most damage. May need specific conditions.',
};

export const ANTI_LICH_STRATEGY = [
  { phase: 'Preparation', actions: ['Find phylactery location (Divination magic, research)', 'Death Ward on 2+ party members (vs Power Word Kill)', 'Heroes\' Feast (immune to frightened)', 'Memorize Counterspell on multiple casters'] },
  { phase: 'Opening', actions: ['Dispel Magic on Globe of Invulnerability if up', 'Burn Legendary Resistances with save spells (Hold Monster, etc.)', 'Focus fire — lich has only 135 HP despite CR 21', 'Silence area if possible (blocks lich spells)'] },
  { phase: 'Mid-fight', actions: ['Counterspell Power Word Kill and Disintegrate at all costs', 'Keep HP above 100 (PWK threshold)', 'Don\'t cluster (Cloudkill, Chain Lightning)', 'Heal downed allies IMMEDIATELY (Finger of Death = zombie)'] },
  { phase: 'Finish', actions: ['Kill lich body', 'Destroy phylactery (separate mission if not done before)', 'If phylactery not destroyed: lich returns in 1d10 days', 'Leave the lair quickly — traps may activate on death'] },
];

export const LAIR_ACTIONS = [
  { action: 'Tether soul', effect: 'Target DC 18 CHA save or tethered. Can\'t move more than 10ft from that point.', counter: 'CHA save boosters. Paladin aura.' },
  { action: 'Raise dead', effect: 'Up to 4 dead creatures (CR 1 or lower) rise as skeletons within 60ft.', counter: 'Not a major threat. AoE clears them.' },
  { action: 'Antilife Shell (part)', effect: 'Magical cold fills 30ft. All creatures must CON save or can\'t use reactions.', counter: 'CON save. Ranged attacks don\'t require reactions.' },
];

export function powerWordKillSafe(currentHP) {
  return currentHP > 100;
}

export function turnsToKillLich(dpr, lichHP) {
  return Math.ceil(lichHP / dpr);
}

export function lichReturnsIn() {
  return { minDays: 1, maxDays: 10, note: 'Lich reforms in 1d10 days if phylactery exists.' };
}
