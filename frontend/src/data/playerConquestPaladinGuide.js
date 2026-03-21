/**
 * playerConquestPaladinGuide.js
 * Player Mode: Oath of Conquest Paladin optimization — the fear lockdown build
 * Pure JS — no React dependencies.
 */

export const CONQUEST_BASICS = {
  class: 'Paladin (Oath of Conquest)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Rule through fear. Crush opposition. Absolute dominance.',
  note: 'One of the most powerful Paladin subclasses. Aura of Conquest creates a "fear prison."',
};

export const CONQUEST_FEATURES = [
  { feature: 'Oath Spells', level: 3, spells: 'Armor of Agathys, Command (3), Hold Person, Spiritual Weapon (5), Bestow Curse, Fear (9), Dominate Beast, Stoneskin (13), Cloudkill, Dominate Person (17)', note: 'Armor of Agathys + Spiritual Weapon are amazing additions.' },
  { feature: 'Channel Divinity: Conquering Presence', level: 3, effect: '30ft: each creature WIS save or frightened for 1 minute.', note: 'AoE frighten. Sets up Aura of Conquest lockdown.' },
  { feature: 'Channel Divinity: Guided Strike', level: 3, effect: '+10 to attack roll.', note: 'Turn a miss into a hit. Especially good with GWM/SS.' },
  { feature: 'Aura of Conquest', level: 7, effect: 'Frightened creatures within 10ft have speed 0 and take psychic damage = half Paladin level each turn.', note: 'THE feature. Frightened + within 10ft = can\'t move, take damage every turn. Trapped.' },
  { feature: 'Scornful Rebuke', level: 15, effect: 'When hit, attacker takes psychic damage = CHA mod.', note: 'Passive damage to anyone who hits you.' },
  { feature: 'Invincible Conqueror', level: 20, effect: '1 minute: resistance to all damage, extra attack, crit on 19-20.', note: 'Ultimate form. 3 attacks, resistance, expanded crit range.' },
];

export const FEAR_LOCKDOWN = {
  combo: 'Frighten enemies (Conquering Presence, Fear spell, Wrathful Smite) → Aura of Conquest traps them.',
  mechanics: [
    'Frightened: disadvantage on attacks/checks while source is visible. Can\'t willingly approach.',
    'Aura of Conquest: frightened creatures within 10ft have SPEED 0.',
    'Speed 0 = can\'t move. Can\'t flee. Can\'t approach. Stuck.',
    'Also take half Paladin level psychic damage at start of each turn.',
    'They just stand there, taking damage, unable to fight back effectively.',
  ],
  result: 'Enemies are locked in place, taking passive damage, with disadvantage on everything.',
};

export const CONQUEST_SPELL_PRIORITY = [
  { spell: 'Wrathful Smite', level: 1, note: 'WIS save or frightened for 1 minute. Best 1st level smite spell. Triggers Aura lockdown.' },
  { spell: 'Armor of Agathys', level: 1, note: 'Temp HP + cold damage to melee attackers. Scales with slot level. Amazing on a Paladin.' },
  { spell: 'Fear', level: 3, note: 'Oath spell. 30ft cone, WIS save, frightened + drop weapons + dash away. Mass lockdown.' },
  { spell: 'Spiritual Weapon', level: 2, note: 'Oath spell. Bonus action 1d8+CHA. No concentration. Free damage every turn.' },
  { spell: 'Spirit Guardians', level: 3, note: 'Not an oath spell, but if you can cast it (multiclass), it\'s incredible with the fear lockdown.' },
];

export const CONQUEST_BUILDS = [
  { build: 'Conquest Paladin pure', level: 'Paladin 20', detail: 'Max CHA. Wrathful Smite + Aura at 7. GWM or PAM.', rating: 'S' },
  { build: 'Conquest 7 / Hexblade 1+', detail: 'CHA to attacks. Shield spell. Short rest smite slots. Armor of Agathys stacks.', rating: 'S' },
  { build: 'Conquest 7 / Undead Warlock 1+', detail: 'Form of Dread: bonus action frighten on hit. More fear sources for the aura.', rating: 'S' },
  { build: 'Fallen Aasimar Conquest', detail: 'Necrotic Shroud: AoE frighten at L3. Natural fear source for the aura.', rating: 'A' },
];

export function auraConquestDamage(paladinLevel) {
  return Math.floor(paladinLevel / 2);
}

export function wrathfulSmiteDC(chaMod, profBonus) {
  return 8 + chaMod + profBonus;
}

export function armorOfAgathysTempHP(spellLevel) {
  return spellLevel * 5;
}
