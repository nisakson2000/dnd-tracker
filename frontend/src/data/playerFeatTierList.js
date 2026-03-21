/**
 * playerFeatTierList.js
 * Player Mode: All major feats ranked with analysis for different builds
 * Pure JS — no React dependencies.
 */

export const S_TIER_FEATS = [
  { name: 'Great Weapon Master', type: 'Offensive', effect: '-5 to hit / +10 damage with heavy weapons. BA attack on crit/kill.', best: 'Barbarian, Fighter (Greatsword)', note: 'Best melee damage feat. Reckless Attack offsets the -5.' },
  { name: 'Sharpshooter', type: 'Offensive', effect: '-5 to hit / +10 damage with ranged. Ignore cover. No long range disadvantage.', best: 'Fighter (Archer), Ranger', note: 'Best ranged damage feat. Archery style offsets the -5.' },
  { name: 'Polearm Master', type: 'Offensive', effect: 'BA 1d4 attack with polearms. OA when enemy enters reach.', best: 'Fighter, Paladin', note: 'BA attack + reactive OA. Combos with Sentinel and GWM.' },
  { name: 'Sentinel', type: 'Defensive', effect: 'OA → speed 0. OA on Disengage. Reaction attack when ally targeted.', best: 'Fighter, Paladin, Barbarian', note: 'Best melee control feat. PAM + Sentinel is legendary.' },
  { name: 'Lucky', type: 'Universal', effect: '3 luck points per day. Reroll any d20 (attack, save, check).', best: 'Everyone', note: 'Universal insurance. Works on everything. Best feat in the game by some metrics.' },
  { name: 'War Caster', type: 'Caster', effect: 'Advantage on concentration saves. Somatic with hands full. OA → spell.', best: 'Cleric, Paladin, melee casters', note: 'Core for any caster who goes near melee.' },
  { name: 'Resilient (CON)', type: 'Caster', effect: '+1 CON + proficiency in CON saves.', best: 'All casters', note: 'Scales with level. +6 to concentration saves at L17.' },
  { name: 'Crossbow Expert', type: 'Offensive', effect: 'Ignore loading. No disadvantage at 5ft. BA attack with hand crossbow.', best: 'Fighter, Ranger', note: 'BA hand crossbow attack. Best sustained ranged DPR.' },
];

export const A_TIER_FEATS = [
  { name: 'Alert', effect: '+5 initiative. Can\'t be surprised. Hidden creatures don\'t get advantage.', best: 'Casters, Assassin Rogue' },
  { name: 'Elven Accuracy', effect: 'Reroll one die when you have advantage (triple advantage). +1 DEX/INT/WIS/CHA.', best: 'Elf Rogue, Elf casters, Samurai' },
  { name: 'Fey Touched', effect: 'Misty Step + one 1st-level divination/enchantment. +1 CHA/WIS/INT.', best: 'Any caster, half-feat value' },
  { name: 'Shadow Touched', effect: 'Invisibility + one 1st-level illusion/necromancy. +1 CHA/WIS/INT.', best: 'Any caster' },
  { name: 'Skill Expert', effect: '+1 any ability. One skill proficiency. One expertise.', best: 'Grapplers (Athletics expertise), skill monkeys' },
  { name: 'Mounted Combatant', effect: 'Advantage vs unmounted. Redirect attacks from mount. Mount Evasion.', best: 'Paladin (Find Steed)' },
  { name: 'Telepathic', effect: 'Telepathy 60ft. Detect Thoughts 1/day. +1 CHA/WIS/INT.', best: 'Social characters, half-feat value' },
  { name: 'Mobile', effect: '+10 speed. No OA from creatures you attack. Ignore difficult terrain when Dashing.', best: 'Monk, melee skirmishers' },
  { name: 'Tough', effect: '+2 HP per level.', best: 'Frontliners, d6 casters who need bulk' },
  { name: 'Ritual Caster', effect: 'Cast rituals from a chosen class list. Collect more.', best: 'Non-casters who want utility' },
];

export const B_TIER_FEATS = [
  { name: 'Dual Wielder', effect: '+1 AC, dual wield non-light, draw 2.', best: 'TWF builds' },
  { name: 'Tavern Brawler', effect: 'BA grapple after unarmed hit. +1 STR/CON.', best: 'Grapplers' },
  { name: 'Crusher/Slasher/Piercer', effect: 'Weapon type bonuses. +1 STR/DEX.', best: 'Half-feat for martial builds' },
  { name: 'Heavily Armored', effect: 'Heavy armor proficiency. +1 STR.', best: 'Clerics without heavy armor' },
  { name: 'Magic Initiate', effect: '2 cantrips + 1 first-level spell from another class.', best: 'Non-casters wanting utility' },
  { name: 'Dungeon Delver', effect: 'Adv on Perception/Investigation for traps. Adv on saves vs traps.', best: 'Dungeon-focused campaigns' },
  { name: 'Observant', effect: '+5 passive Perception and Investigation. +1 WIS/INT.', best: 'Scout builds, trap detection' },
  { name: 'Healer', effect: 'Healer\'s kit: heal 1d6+4+level HP. Once per creature per rest.', best: 'Non-caster party healer' },
];

export const TRAP_FEATS = [
  { name: 'Weapon Master', reason: 'Just play a class that has weapon proficiency.' },
  { name: 'Grappler', reason: 'Gives almost nothing useful. Pin is bad. Advantage not worth it.' },
  { name: 'Savage Attacker', reason: 'Reroll weapon damage once/turn. Avg +1-2 damage. Terrible for a feat.' },
  { name: 'Keen Mind', reason: 'Remembering things is what players do. Not worth a feat.' },
];

export function featPriority(playerClass, level) {
  const priorities = {
    'Fighter (GWM)': ['Great Weapon Master', 'Polearm Master', 'Sentinel'],
    'Fighter (Archer)': ['Sharpshooter', 'Crossbow Expert', 'Alert'],
    'Rogue': ['Alert', 'Lucky', 'Elven Accuracy', 'Sentinel'],
    'Wizard': ['War Caster', 'Resilient (CON)', 'Lucky', 'Alert'],
    'Cleric': ['War Caster', 'Resilient (CON)', 'Lucky'],
    'Paladin': ['Polearm Master', 'Sentinel', 'Great Weapon Master'],
    'Barbarian': ['Great Weapon Master', 'Polearm Master', 'Sentinel'],
    'Ranger': ['Sharpshooter', 'Crossbow Expert', 'Fey Touched'],
  };
  return priorities[playerClass] || ['Lucky', 'Alert', 'Resilient (CON)'];
}
