/**
 * playerClassSynergyGuide.js
 * Player Mode: How different classes synergize in a party — combo attacks, buff stacking, and team tactics
 * Pure JS — no React dependencies.
 */

export const PARTY_COMBOS = [
  { combo: 'Hold Person + Melee Attacker', classes: ['Caster', 'Fighter/Paladin/Rogue'], effect: 'Paralyzed = auto-crit in melee. Rogue/Paladin crits are devastating.', rating: 'S' },
  { combo: 'Faerie Fire + Multi-Attacker', classes: ['Bard/Druid', 'Fighter/Monk/Ranger'], effect: 'Advantage on all attacks. More attacks = more benefit.', rating: 'S' },
  { combo: 'Spike Growth + Forced Movement', classes: ['Ranger/Druid', 'Warlock/Fighter'], effect: 'Each 5ft of forced movement through Spike Growth = 2d4 damage. Repelling Blast moves 10ft per beam.', rating: 'S' },
  { combo: 'Paladin Aura + Everyone', classes: ['Paladin', 'Any'], effect: '+CHA mod to all saves for allies within 10ft. Best passive buff in the game.', rating: 'S' },
  { combo: 'Bless + Attackers/Savers', classes: ['Cleric/Paladin', 'Any'], effect: '+1d4 to attacks AND saves. Stacks with everything. Party-wide.', rating: 'A' },
  { combo: 'Web + Fire Spell', classes: ['Wizard', 'Any fire caster'], effect: 'Web restrains (advantage on attacks, disadvantage on DEX saves). Web is flammable = extra fire damage.', rating: 'A' },
  { combo: 'Darkness + Devil\'s Sight', classes: ['Warlock', 'Warlock'], effect: 'You see in magical darkness. Enemies can\'t see you. Advantage on attacks, disadvantage against you.', rating: 'A' },
  { combo: 'Haste + High-Attack Fighter', classes: ['Wizard/Sorcerer', 'Fighter'], effect: 'Extra action = extra attack. Fighter with 3 attacks + 1 Haste + Action Surge = 7 attacks in one turn.', rating: 'S' },
  { combo: 'Silence + Melee', classes: ['Cleric/Ranger', 'Fighter/Barbarian'], effect: '20ft radius of no spells with verbal components. Casters are helpless.', rating: 'A' },
  { combo: 'Grease + Prone Exploiter', classes: ['Wizard', 'Melee fighter'], effect: 'Grease knocks prone. Prone = advantage on melee. Disadvantage on ranged.', rating: 'B' },
  { combo: 'Guardian of Nature + Rogue', classes: ['Ranger/Druid', 'Rogue'], effect: 'Great Tree form gives advantage on attacks. Rogue gets Sneak Attack guaranteed.', rating: 'A' },
  { combo: 'Pass Without Trace + Party', classes: ['Ranger/Druid', 'Any'], effect: '+10 to Stealth for ENTIRE party. Even heavy armor wearers can sneak.', rating: 'S' },
];

export const ROLE_COVERAGE = {
  description: 'Every party needs these roles covered. One character can fill multiple.',
  roles: [
    { role: 'Damage (sustained)', bestClasses: ['Fighter', 'Ranger', 'Warlock', 'Monk'], detail: 'Reliable damage every round without resource expenditure.' },
    { role: 'Damage (nova)', bestClasses: ['Paladin', 'Rogue', 'Sorcerer', 'Wizard'], detail: 'Huge burst damage on key targets. Resource-intensive.' },
    { role: 'Tank/Frontline', bestClasses: ['Fighter', 'Barbarian', 'Paladin', 'Cleric'], detail: 'Absorb hits, control enemy movement, protect backline.' },
    { role: 'Healing', bestClasses: ['Cleric', 'Druid', 'Bard', 'Paladin'], detail: 'Pick up 0 HP allies, out-of-combat recovery.' },
    { role: 'Control', bestClasses: ['Wizard', 'Druid', 'Bard', 'Sorcerer'], detail: 'Remove enemies from the fight. Hypnotic Pattern, Web, Entangle.' },
    { role: 'Support/Buff', bestClasses: ['Bard', 'Cleric', 'Paladin', 'Artificer'], detail: 'Bless, Haste, Bardic Inspiration, Aura of Protection.' },
    { role: 'Utility/Skills', bestClasses: ['Bard', 'Rogue', 'Ranger', 'Artificer'], detail: 'Out-of-combat problem solving, exploration, social.' },
    { role: 'Scout', bestClasses: ['Rogue', 'Ranger', 'Monk', 'Druid'], detail: 'Stealth, perception, find traps, explore ahead.' },
  ],
};

export const TWINNED_SPELL_COMBOS = [
  { spell: 'Twinned Haste', effect: 'Two allies get Haste. Two Fighters with extra attacks = devastating.', risk: 'Losing concentration stuns BOTH targets for a round.', rating: 'S' },
  { spell: 'Twinned Polymorph', effect: 'Two T-Rexes. 136 HP each. 4d12+7 bite. Your party just got two dinosaurs.', risk: 'Concentration. If broken, both revert.', rating: 'S' },
  { spell: 'Twinned Greater Invisibility', effect: 'Two invisible attackers. Advantage on all attacks, disadvantage against them.', risk: 'Concentration. 4 sorcery points.', rating: 'A' },
  { spell: 'Twinned Heal', effect: 'Two allies healed for 70 HP each. 140 HP total in one action.', risk: 'None. No concentration. 12 sorcery points though.', rating: 'A' },
];

export const PARTY_WEAKNESS_COVERAGE = {
  noHealer: 'Potions, Healer feat, short rests. Celestial Warlock or Divine Soul Sorcerer can sub.',
  noTank: 'Summoned creatures, Spiritual Weapon, kiting tactics. Avoid close-quarters fights.',
  noCaster: 'Magic items, scrolls, potions. Eldritch Knight and Arcane Trickster provide light casting.',
  noSkillMonkey: 'Backgrounds give skills. Bard\'s Jack of All Trades helps everything.',
  noRangedDamage: 'Javelins, light crossbows. Every class has a ranged option. It just won\'t be optimal.',
};

export function analyzePartyRoles(partyClasses) {
  const covered = new Set();
  const roleMappings = {
    Fighter: ['damage_sustained', 'tank'],
    Barbarian: ['damage_sustained', 'tank'],
    Paladin: ['damage_nova', 'tank', 'healing', 'support'],
    Cleric: ['healing', 'support', 'tank'],
    Wizard: ['control', 'damage_nova', 'utility'],
    Sorcerer: ['damage_nova', 'control', 'support'],
    Warlock: ['damage_sustained', 'control'],
    Bard: ['support', 'healing', 'utility', 'control'],
    Rogue: ['damage_nova', 'utility', 'scout'],
    Ranger: ['damage_sustained', 'scout', 'utility'],
    Monk: ['damage_sustained', 'scout', 'control'],
    Druid: ['healing', 'control', 'utility'],
    Artificer: ['support', 'utility', 'damage_sustained'],
  };

  for (const cls of partyClasses) {
    const roles = roleMappings[cls] || [];
    roles.forEach(r => covered.add(r));
  }

  const allRoles = ['damage_sustained', 'damage_nova', 'tank', 'healing', 'control', 'support', 'utility', 'scout'];
  const missing = allRoles.filter(r => !covered.has(r));
  return { covered: [...covered], missing, partySize: partyClasses.length };
}

export function suggestCombo(partyClasses) {
  const combos = [];
  if (partyClasses.includes('Paladin') && (partyClasses.includes('Wizard') || partyClasses.includes('Bard'))) {
    combos.push('Hold Person + Paladin Smite Crit — devastating combo');
  }
  if (partyClasses.includes('Warlock') && (partyClasses.includes('Ranger') || partyClasses.includes('Druid'))) {
    combos.push('Spike Growth + Repelling Blast — massive forced movement damage');
  }
  if (partyClasses.includes('Cleric') || partyClasses.includes('Paladin')) {
    combos.push('Bless on the party — +1d4 to attacks and saves for everyone');
  }
  if (combos.length === 0) combos.push('Focus fire on one target at a time — basic but effective');
  return combos;
}
