/**
 * playerMonsterStatBlockGuide.js
 * Player Mode: Reading monster stat blocks — what players can deduce and exploit
 * Pure JS — no React dependencies.
 */

export const STAT_BLOCK_SECTIONS = [
  { section: 'AC (Armor Class)', playerUse: 'Know what you need to roll to hit. AC 18+ = tough. AC 12 = easy.', tip: 'AC type matters: "natural armor" can\'t be removed. "plate" could be targeted with Heat Metal.' },
  { section: 'HP (Hit Points)', playerUse: 'Estimate how long the fight will take. 200+ HP = long fight.', tip: 'HD notation (e.g., 18d10+36) tells you CON modifier and size.' },
  { section: 'Speed', playerUse: 'Can you outrun it? Fly speed = ranged attacks needed.', tip: '30ft = standard. 40ft+ = fast. Flying = ground melee is useless without reach.' },
  { section: 'Ability Scores', playerUse: 'High STR = grapple danger. High DEX = hard to hit. Low WIS = target with saves.', tip: 'Low mental stats = vulnerable to INT/WIS/CHA saves. Target weak saves.' },
  { section: 'Saving Throws', playerUse: 'Proficient saves are hard to target. Use spells that target non-proficient saves.', tip: '+9 or higher = very hard to fail. Use spells that target other saves.' },
  { section: 'Damage Resistances', playerUse: 'Avoid these damage types. Your attacks deal half.', tip: 'BPS resistance to nonmagical = need magic weapons. Very common.' },
  { section: 'Damage Immunities', playerUse: 'NEVER use these damage types. They deal zero.', tip: 'Fire immunity: don\'t Fireball. Switch to force, psychic, or other types.' },
  { section: 'Condition Immunities', playerUse: 'Don\'t try to apply these conditions.', tip: 'Charm immune: don\'t use Hypnotic Pattern. Poison immune: skip poison.' },
  { section: 'Senses', playerUse: 'Blindsight: can\'t hide within range. Truesight: can\'t use illusions or invisibility.', tip: 'Darkvision range tells you if darkness helps. 120ft darkvision = long range.' },
  { section: 'Languages', playerUse: 'Can you communicate? Negotiate? Intimidate?', tip: 'No languages = probably can\'t be reasoned with.' },
  { section: 'CR (Challenge Rating)', playerUse: 'Rough difficulty estimate. CR = party level for a medium fight.', tip: 'CR is unreliable. Some CR 5 monsters hit like CR 8. Use as guideline only.' },
];

export const COMMON_MONSTER_ABILITIES = [
  { ability: 'Multiattack', what: 'Makes multiple attacks per turn.', counter: 'High AC, Shield, Mirror Image. Reduce hit rate.' },
  { ability: 'Pack Tactics', what: 'Advantage when ally is adjacent.', counter: 'Kill one to break pairs. AoE to thin groups.' },
  { ability: 'Legendary Resistance', what: 'Auto-succeed a failed save (3/day usually).', counter: 'Burn through with cheap spells first. Then use your big spells.' },
  { ability: 'Legendary Actions', what: 'Extra actions at end of others\' turns.', counter: 'Can\'t prevent. Plan for extra damage/movement between your turns.' },
  { ability: 'Magic Resistance', what: 'Advantage on saves vs spells.', counter: 'Use attack roll spells instead. Or spells with no save (Magic Missile, Forcecage).' },
  { ability: 'Regeneration', what: 'Regains HP at start of its turn.', counter: 'Troll: fire or acid stops it. Read the ability for what shuts it down.' },
  { ability: 'Innate Spellcasting', what: 'Casts spells without slots. Often at will.', counter: 'Counterspell. Silence. Break line of sight.' },
  { ability: 'Frightful Presence', what: 'Fear aura. WIS save or frightened.', counter: 'Heroes\' Feast (fear immunity). High WIS characters. Calm Emotions.' },
  { ability: 'Breath Weapon (Recharge)', what: 'Recharges on 5-6 (d6 roll start of turn).', counter: 'Spread out. Absorb Elements. 33% chance each round.' },
  { ability: 'Swallow', what: 'Large creatures can swallow. Blinded, restrained, acid damage.', counter: 'Deal damage from inside to escape. Or don\'t get grappled.' },
];

export const DEDUCING_MONSTER_STATS = [
  { clue: 'It wears heavy armor', deduce: 'Likely high AC but low DEX. Target DEX saves.', note: 'Heat Metal ruins armored enemies.' },
  { clue: 'It\'s huge/large', deduce: 'High STR, high HP. Likely vulnerable to DEX/INT/WIS saves.', note: 'Large = harder to grapple. Enlarge/Reduce helps.' },
  { clue: 'It\'s a beast', deduce: 'Low INT, low CHA. Target mental saves.', note: 'INT is often 1-4 for beasts. Phantasmal Force auto-works.' },
  { clue: 'It\'s undead', deduce: 'Immune to poison, charmed, exhaustion usually.', note: 'Radiant damage often effective. Turn Undead works.' },
  { clue: 'It casts spells', deduce: 'Probably low AC, low HP. Rush it.', note: 'Counterspell ready. Silence the area. Grapple to prevent somatic.' },
  { clue: 'It flew toward you', deduce: 'Has fly speed. Grounding it = advantage.', note: 'Earthbind, Ensnare, or enough damage to make it land.' },
  { clue: 'Your weapon bounced off', deduce: 'Resistance or immunity to your damage type. Switch tactics.', note: 'Try force, psychic, radiant — rarely resisted.' },
  { clue: 'It shrugged off your spell', deduce: 'Magic Resistance or Legendary Resistance. Use saves it\'s weak in.', note: 'Burn Legendary Resistances with cheap spells before big ones.' },
];

export const STAT_BLOCK_TIPS = [
  'Target weak saves. If it has +8 WIS save, use DEX or INT spells instead.',
  'Check immunities BEFORE attacking. Don\'t waste Fireball on fire immune.',
  'Legendary Resistance: burn it with cheap spells, then use your big ones.',
  'Magic Resistance: use attack roll spells or no-save spells instead.',
  'High AC? Use save-based spells. They bypass AC entirely.',
  'Regeneration: read what stops it. Usually fire, acid, or radiant.',
  'Breath Weapon recharge: 33% per round. Spread out to reduce hits.',
  'Ask your DM for knowledge checks to learn monster abilities.',
  'Force, psychic, and radiant are rarely resisted. Default to these.',
  'Large+ creatures often have low DEX. Target DEX saves.',
];
