/**
 * playerMonkOptGuide.js
 * Player Mode: Monk optimization — ki management, subclasses, builds
 * Pure JS — no React dependencies.
 */

export const MONK_CORE = {
  strengths: ['Many attacks per turn (Flurry of Blows).', 'High mobility (Unarmored Movement).', 'Stunning Strike (best single-target control).', 'Evasion + Diamond Soul (great saves).'],
  weaknesses: ['Ki is a limited resource. Runs out fast.', 'Low HP pool (d8 HD).', 'MAD: needs DEX + WIS + CON.', 'Lower damage than other martials late game.'],
  stats: 'DEX > WIS > CON. Always.',
  key: 'Stunning Strike is your best feature. Manage ki around it.',
};

export const KI_MANAGEMENT = {
  pool: 'Ki = Monk level. Recovers on short rest.',
  priority: [
    { use: 'Stunning Strike', priority: 1, note: 'Best use of ki. Stunned = can\'t act, auto-fail STR/DEX saves, advantage on attacks.' },
    { use: 'Flurry of Blows', priority: 2, note: '2 extra attacks as BA. Use when Stunning Strike isn\'t needed.' },
    { use: 'Patient Defense', priority: 3, note: 'Dodge as BA. Use when you\'re being focused.' },
    { use: 'Step of the Wind', priority: 4, note: 'Dash or Disengage as BA. Situational mobility.' },
  ],
  tips: [
    'Short rests = full ki recovery. Push for short rests.',
    'Don\'t spend all ki in round 1. Budget across the encounter.',
    'Stunning Strike: use on low CON enemies first.',
    'Save 1-2 ki for Patient Defense or escape.',
  ],
};

export const SUBCLASS_RANKINGS = [
  { subclass: 'Mercy', rating: 'S', why: 'Hands of Healing + Harm. Free healing + necrotic damage. No ki cost at L6+ for heal.', note: 'Best Monk subclass. Healing + damage + no ki drain.' },
  { subclass: 'Open Hand', rating: 'A+', why: 'Enhanced Flurry (prone, push, no reactions). Wholeness of Body. Quivering Palm at L17.', note: 'Classic Monk. Great at all levels.' },
  { subclass: 'Shadow', rating: 'A+', why: 'Darkness spells for 2 ki. Shadow Step: BA 60ft teleport in dim/dark. Advantage on attack.', note: 'Best in dungeons/darkness. Amazing mobility.' },
  { subclass: 'Astral Self', rating: 'A', why: 'WIS for attacks. 10ft reach. Arms are force damage.', note: 'Fixes MAD problem. WIS-based attacks.' },
  { subclass: 'Kensei', rating: 'A', why: 'Use longsword/longbow as Monk weapons. +2 AC with Agile Parry.', note: 'Best ranged Monk. Longbow Monk is viable.' },
  { subclass: 'Drunken Master', rating: 'A', why: 'Free Disengage on Flurry. Extra movement. Redirect attacks.', note: 'Hit-and-run specialist. Never get pinned down.' },
  { subclass: 'Ascendant Dragon', rating: 'B+', why: 'Elemental breath weapon. Elemental damage on attacks.', note: 'Thematic but not as mechanically strong.' },
  { subclass: 'Sun Soul', rating: 'B', why: 'Ranged radiant attacks. Radiant Sun Bolt = ranged Monk.', note: 'Worse than Kensei for ranged. But thematic.' },
  { subclass: 'Four Elements', rating: 'C', why: 'Spend ki to cast spells. Too expensive. Ki is already stretched.', note: 'Worst Monk subclass. Ki costs are brutal.' },
];

export const STUNNING_STRIKE_MATH = {
  dc: '8 + PB + WIS mod',
  save: 'CON save (enemies are often good at this)',
  effect: 'Stunned until end of your next turn. Can\'t act, auto-fail STR/DEX, advantage on attacks.',
  targets: [
    { type: 'Best targets', examples: 'Casters (low CON), DEX-based enemies, flying creatures.', note: 'Stunning a flying creature = they fall.' },
    { type: 'Avoid', examples: 'Constructs, high-CON brutes, legendary resistance.', note: 'Don\'t waste ki on +8 CON saves.' },
  ],
  optimization: [
    'Multiple attacks = multiple chances to stun. Flurry = 4 attempts.',
    'Stun one enemy, then party focuses fire.',
    'Stun the caster. They lose concentration + can\'t cast.',
    'At L14 (Diamond Soul): reroll failed save for 1 ki.',
  ],
};

export const MONK_MULTICLASS_DIPS = [
  { dip: 'Cleric 1 (Twilight/Peace)', benefit: 'Armor proficiency, Shield, WIS synergy, domain features.', note: 'Twilight: darkvision 300ft. Peace: Bond = +1d4.' },
  { dip: 'Rogue 2-3', benefit: 'Cunning Action (BA Dash/Disengage without ki), Sneak Attack (1d6 extra).', note: 'Saves ki. Expertise in skills.' },
  { dip: 'Fighter 1-2', benefit: 'Fighting Style (Unarmed), Action Surge, Second Wind.', note: 'Action Surge + Flurry = 6 attacks in one turn.' },
  { dip: 'Ranger 2 (Gloom Stalker 3)', benefit: 'Invisible in darkness, extra R1 attack, WIS to initiative.', note: 'Shadow Monk + Gloom Stalker = darkness monster.' },
];

export const MONK_BUILD_TIPS = [
  'DEX > WIS > CON. No exceptions.',
  'Stunning Strike is your best feature. Budget ki for it.',
  'Short rests recover ALL ki. Push for short rests.',
  'Mercy Monk: best subclass. Free healing + necrotic damage.',
  'Don\'t burn all ki in round 1. Budget across encounters.',
  'Patient Defense when focused. Dodge as BA = survive.',
  'Stunning Strike: target low CON enemies. Skip high CON brutes.',
  'Mobile feat: free Disengage after attacking. Ki-free hit-and-run.',
  'Crusher feat: push on hit. Extra movement control.',
  'Monk is VERY short-rest dependent. Campaign pacing matters.',
];
