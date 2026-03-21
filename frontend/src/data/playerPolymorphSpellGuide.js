/**
 * playerPolymorphSpellGuide.js
 * Player Mode: Polymorph — turn anything into a beast
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_BASICS = {
  spell: 'Polymorph',
  level: 4,
  school: 'Transmutation',
  castTime: '1 action',
  duration: '1 hour (concentration)',
  range: '60 feet',
  save: 'WIS save (unwilling targets)',
  classes: ['Wizard', 'Druid', 'Sorcerer', 'Bard'],
  rules: [
    'Target becomes a beast with CR ≤ target\'s level (or CR for creatures).',
    'Target gains the beast\'s HP, AC, attacks, and physical stats.',
    'Target loses all class features, spellcasting, and special abilities.',
    'When beast HP reaches 0, target reverts with original HP.',
    'Excess damage carries over to original form.',
  ],
  note: 'One of the most versatile spells in the game. Emergency heal, scout, disable enemy, or become a combat monster.',
};

export const BEST_BEAST_FORMS = [
  { beast: 'Giant Ape', cr: 7, hp: 157, ac: 12, attacks: '2x Fist +9, 3d10+6 each', rating: 'S', note: 'Best combat form. 157 HP shield + 22 avg DPR.' },
  { beast: 'T-Rex', cr: 8, hp: 136, ac: 13, attacks: 'Bite +10, 4d12+7 (33 avg)', rating: 'S', note: 'Highest single-attack damage. Grapple on bite. Needs L8+ target.' },
  { beast: 'Giant Elk', cr: 2, hp: 42, ac: 14, attacks: 'Ram +6, 2d6+4 + Hooves', rating: 'A', note: 'Best form for L2-3 allies. 60ft speed. Charge attack.' },
  { beast: 'Giant Scorpion', cr: 3, hp: 52, ac: 15, attacks: '3 attacks + grapple + poison', rating: 'A', note: 'Three attacks, grapple, and poison. Good for L3-4.' },
  { beast: 'Giant Eagle', cr: 1, hp: 26, ac: 13, attacks: 'Beak + Talons', rating: 'A', note: 'Fly 80ft. Emergency flight for ally. L1+ target.' },
  { beast: 'Killer Whale', cr: 3, hp: 90, ac: 12, attacks: 'Bite +6, 5d6+4', rating: 'B', note: 'Aquatic only. 90 HP is great for a CR 3 form.' },
  { beast: 'Giant Owl', cr: 1/4, hp: 19, ac: 12, attacks: 'Talons', rating: 'B', note: 'Flyby + 60ft fly. Scout form for any level target.' },
];

export const POLYMORPH_USES = [
  { use: 'Emergency HP', detail: 'Ally at 1 HP? Polymorph into Giant Ape = 157 temp HP shield. They fight at full power.', rating: 'S' },
  { use: 'Disable enemy', detail: 'Polymorph enemy into snail/turtle. WIS save. Remove them from combat for 1 hour.', rating: 'S' },
  { use: 'Buff martial ally', detail: 'Polymorph the Fighter into a T-Rex. They keep their tactical mind + get beast stats.', rating: 'A' },
  { use: 'Scout', detail: 'Polymorph into Giant Eagle/Giant Owl. Fly over terrain. 1 hour duration.', rating: 'A' },
  { use: 'Cross terrain', detail: 'Giant Eagle (fly), Killer Whale (swim), Giant Elk (60ft land). Travel solution.', rating: 'B' },
  { use: 'Capture enemy', detail: 'Polymorph into tiny beast → put in cage → dispel later when ready.', rating: 'A' },
];

export const POLYMORPH_TIPS = [
  'Concentration: losing concentration ends the spell. Protect it (War Caster, CON save proficiency).',
  'You lose spellcasting in beast form. Can\'t concentrate on spells cast before transforming.',
  'Polymorphed ally keeps their INT/WIS/CHA for decision-making but uses beast physical stats.',
  'Damage carries over: if T-Rex (136 HP) takes 150 damage, ally reverts with 14 damage on them.',
  'Willing target = no save. Unwilling = WIS save. Shapechangers auto-succeed.',
  'Twin Spell Polymorph (Sorcerer): Two Giant Apes = 314 HP of beast power from one spell.',
];

export const POLYMORPH_VS_ALTERNATIVES = {
  vsWildShape: 'Wild Shape is free (no slot) but limited to Druid level/CR. Polymorph works on anyone and can do higher CR.',
  vsTruePolymorph: 'True Polymorph (L9) can turn into ANY creature, not just beasts. Can be permanent. Polymorph is the budget version.',
  vsAnimalShapes: 'Animal Shapes (L8 Druid) transforms multiple allies at once but max CR 4. Polymorph does one ally at higher CR.',
};

export function polymorphHPShield(beastCR) {
  const hpByBeast = { 7: 157, 8: 136, 5: 95, 3: 52, 2: 42, 1: 26 };
  const hp = hpByBeast[beastCR] || 0;
  return { hp, note: `CR ${beastCR} beast form: ~${hp} HP shield on top of original HP.` };
}
