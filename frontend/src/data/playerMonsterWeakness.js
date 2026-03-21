/**
 * playerMonsterWeakness.js
 * Player Mode: Common monster weaknesses and vulnerabilities
 * Pure JS — no React dependencies.
 */

export const CREATURE_TYPE_WEAKNESSES = [
  { type: 'Undead', weaknesses: ['Radiant damage', 'Turn Undead (Cleric)', 'Holy Water (2d6 radiant)'], resistances: ['Necrotic (often immune)', 'Poison (often immune)', 'Exhaustion immune'], tip: 'Clerics and Paladins excel vs undead. Radiant damage is king.' },
  { type: 'Fiend', weaknesses: ['Radiant damage', 'Silvered weapons', 'Holy Water'], resistances: ['Fire (often immune)', 'Poison (often immune)', 'Cold/Lightning (often resistant)'], tip: 'Silvered weapons bypass resistance. Protection from Evil and Good is huge.' },
  { type: 'Fey', weaknesses: ['Cold iron (DM dependent)', 'Force damage'], resistances: ['Charm immunity common', 'Magic resistance common'], tip: 'Fey can be bound by their word. Use their rules against them.' },
  { type: 'Construct', weaknesses: ['Lightning can heal/empower some', 'Antimagic Field'], resistances: ['Poison immune', 'Psychic immune', 'Charm/fear/paralysis immune'], tip: 'Most conditions don\'t work. Use raw damage. Dispel Magic on magical constructs.' },
  { type: 'Dragon', weaknesses: ['Varies by color — opposite element', 'Ranged attacks vs flying'], resistances: ['One element immune (by color)', 'Legendary Resistance (3/day)'], tip: 'Burn Legendary Resistances with cheap save-or-sucks first. Then use the big spells.' },
  { type: 'Giant', weaknesses: ['DEX saves (low DEX)', 'Ranged kiting', 'Flight'], resistances: ['High HP and STR', 'Often resistant to something by subtype'], tip: 'Giants have terrible DEX. Fireball and Dex-save spells wreck them.' },
  { type: 'Ooze', weaknesses: ['Cold damage (some)', 'Range attacks'], resistances: ['Slashing often splits them into more oozes', 'Acid immune', 'Many conditions immune'], tip: 'Don\'t hit them with slashing weapons (Black Pudding splits!). Use fire or cold from range.' },
  { type: 'Aberration', weaknesses: ['Force damage (not resisted)', 'Varies widely'], resistances: ['Psychic (Mind Flayer)', 'Magic Resistance common'], tip: 'Aberrations are unpredictable. INT checks (Arcana) to recall weaknesses.' },
  { type: 'Elemental', weaknesses: ['Opposite element', 'Banishment (sends to native plane)'], resistances: ['Own element immune', 'Many physical resistances'], tip: 'Banishment is the ultimate anti-elemental spell. One save or they\'re gone.' },
  { type: 'Plant', weaknesses: ['Fire damage', 'Slashing'], resistances: ['Lightning/thunder (some)', 'Often have condition immunities'], tip: 'Fire is your best friend against plant creatures. Fireball clears the forest.' },
  { type: 'Beast', weaknesses: ['Normal weapons', 'Low mental saves'], resistances: ['None usually'], tip: 'Beasts are simple. Charm effects and fear work well. Animal Friendship trivializes them.' },
];

export const ICONIC_MONSTER_TIPS = [
  { monster: 'Beholder', tip: 'Antimagic Cone from the central eye. Melee attacks work inside it. Spread out — eye rays target individuals.', keyWeakness: 'Its own antimagic cone disables its eye rays in that area.' },
  { monster: 'Mind Flayer', tip: 'INT save or stunned (Mind Blast). Then tentacle grapple → brain extraction. Don\'t cluster.', keyWeakness: 'Low HP. If you resist the stun, they die fast. Protection from Evil and Good.' },
  { monster: 'Lich', tip: 'Destroy the phylactery or it comes back. Legendary Resistance ×3. Power Word Kill at will.', keyWeakness: 'Stay above 100 HP (Power Word Kill threshold). Find and destroy the phylactery.' },
  { monster: 'Vampire', tip: 'Sunlight = disadvantage on attacks and saves. Running water damages them. Can\'t enter without invitation.', keyWeakness: 'Sunlight. Daylight spell (3rd level) counts if DM rules it as sunlight (contested).' },
  { monster: 'Troll', tip: 'Regenerates 10 HP/round unless hit with Fire or Acid. Won\'t die without it.', keyWeakness: 'Fire or Acid damage stops regeneration. Fire Bolt cantrip is enough.' },
];

export function getCreatureTypeWeakness(type) {
  return CREATURE_TYPE_WEAKNESSES.find(c =>
    c.type.toLowerCase().includes((type || '').toLowerCase())
  ) || null;
}

export function getMonsterTip(monsterName) {
  return ICONIC_MONSTER_TIPS.find(m =>
    m.monster.toLowerCase().includes((monsterName || '').toLowerCase())
  ) || null;
}
