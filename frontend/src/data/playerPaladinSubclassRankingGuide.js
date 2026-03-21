/**
 * playerPaladinSubclassRankingGuide.js
 * Player Mode: Paladin subclass (Sacred Oath) ranking
 * Pure JS — no React dependencies.
 */

export const PALADIN_SUBCLASS_RANKING = [
  {
    subclass: 'Conquest',
    source: "Xanathar's Guide to Everything",
    tier: 'S',
    reason: 'Aura of Conquest: frightened creatures within 10ft have speed 0 + take psychic damage. Conquering Presence: AoE frighten. Total lockdown.',
    keyFeatures: ['Conquering Presence (AoE frighten CD)', 'Guided Strike (+10 to hit CD)', 'Aura of Conquest (speed 0 + psychic to frightened)', 'Scornful Rebuke (damage on hit)', 'Invincible Conqueror (L20 capstone)'],
  },
  {
    subclass: 'Vengeance',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Vow of Enmity: advantage on one target for 1 minute (no concentration). Hunter\'s Mark + smites + advantage = devastating single-target damage.',
    keyFeatures: ['Vow of Enmity (advantage vs 1 target, no conc)', 'Relentless Avenger (move when hitting OA target)', 'Soul of Vengeance (reaction attack when vowed target attacks)', 'Avenging Angel (fly + frighten aura)'],
  },
  {
    subclass: 'Devotion',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Sacred Weapon: +CHA to attacks for 1 minute (no concentration). Aura of Devotion: immunity to charm. Solid all-around.',
    keyFeatures: ['Sacred Weapon (+CHA to hit, no conc)', 'Turn the Unholy', 'Aura of Devotion (charm immunity)', 'Purity of Spirit (Protection from Evil/Good)', 'Holy Nimbus (radiant aura)'],
  },
  {
    subclass: 'Watchers',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Watcher\'s Will: advantage on INT/WIS/CHA saves for party (CD). Abjure the Extraplanar: turn aberrations/celestials/elementals/fey/fiends.',
    keyFeatures: ['Watcher\'s Will (advantage on mental saves)', 'Abjure the Extraplanar', 'Aura of the Sentinel (+PB to initiative)', 'Vigilant Rebuke (reflect spell damage)'],
  },
  {
    subclass: 'Ancients',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Aura of Warding L7: resistance to spell damage for allies within 10ft. Nature\'s Wrath: restrain. Elder Champion at L20.',
    keyFeatures: ['Nature\'s Wrath (restrain)', 'Turn the Faithless', 'Aura of Warding (resist spell damage)', 'Undying Sentinel (drop to 1 HP instead of 0)', 'Elder Champion'],
    note: 'Resistance to ALL spell damage is incredibly powerful. Best anti-caster Paladin.',
  },
  {
    subclass: 'Glory',
    source: "Tasha's Cauldron of Everything / Mythic Odysseys of Theros",
    tier: 'B+',
    reason: 'Peerless Athlete: BA advantage on Athletics/Acrobatics + jump. Inspiring Smite: distribute temp HP on smite. Aura of Alacrity: +10ft speed.',
    keyFeatures: ['Peerless Athlete', 'Inspiring Smite (temp HP on smite)', 'Aura of Alacrity (+10ft speed)', 'Glorious Defense (add CHA to ally AC)', 'Living Legend'],
  },
  {
    subclass: 'Crown',
    source: "Sword Coast Adventurer's Guide",
    tier: 'B',
    reason: 'Champion Challenge: enemies can\'t move away (no save). Spirit Guardians on oath spell list. Turn the Tide: heal low-HP allies.',
    keyFeatures: ['Champion Challenge (can\'t move away)', 'Turn the Tide (mass heal)', 'Divine Allegiance (take damage for ally)', 'Unyielding Spirit', 'Exalted Champion'],
  },
  {
    subclass: 'Redemption',
    source: "Xanathar's Guide to Everything",
    tier: 'B',
    reason: 'Emissary of Peace: +5 Persuasion. Rebuke the Violent: reflect damage. Aura of the Guardian: take damage for allies. Pacifist Paladin.',
    keyFeatures: ['Emissary of Peace (+5 Persuasion)', 'Rebuke the Violent (reflect damage)', 'Aura of the Guardian (absorb ally damage)', 'Protective Spirit (regen)', 'Emissary of Redemption'],
    note: 'Great for RP-heavy campaigns. Rebuke the Violent can deal massive reflected damage.',
  },
  {
    subclass: 'Oathbreaker',
    source: "DMG (DM permission required)",
    tier: 'A (with undead allies)',
    reason: 'Aura of Hate: +CHA to melee damage for you AND undead/fiends nearby. Control Undead CD. Dark theme.',
    keyFeatures: ['Control Undead', 'Aura of Hate (+CHA to melee for you + undead)', 'Supernatural Resistance', 'Dread Lord (fear + damage aura)'],
    note: 'Requires DM permission. Aura of Hate buffs enemy undead too (be careful). Best with Animate Dead army.',
  },
];

export function paladinAuraRange(level) {
  return { range: level >= 18 ? 30 : 10, note: `Paladin aura: ${level >= 18 ? '30ft' : '10ft'} range${level >= 18 ? ' (expanded at L18)' : ''}` };
}
