/**
 * playerWildShapeMasterGuide.js
 * Player Mode: Wild Shape optimization — Moon Druid focus
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2 uses per short rest.',
  action: 'BA to transform (Moon Druid). Action for other Druids.',
  duration: 'Hours = half your Druid level (rounded down). Min 1 hour.',
  crLimit: [
    { level: 2, maxCR: '1/4', fly: false, swim: false },
    { level: 4, maxCR: '1/2', fly: false, swim: true },
    { level: 8, maxCR: 1, fly: true, swim: true },
  ],
  moonDruid: [
    { level: 2, maxCR: 1 },
    { level: 6, maxCR: '= Druid level / 3 (rounded down)' },
  ],
  rules: [
    'You gain the beast\'s HP. When beast HP = 0, revert to normal with original HP.',
    'You retain your INT, WIS, CHA and proficiencies.',
    'You can\'t cast spells (but can concentrate on active spells).',
    'You can\'t talk (unless beast can).',
    'Equipment merges into beast form (can\'t use it).',
  ],
};

export const BEST_WILD_SHAPE_FORMS = {
  combat: [
    { form: 'Brown Bear', cr: 1, hp: 34, attacks: 'Bite + Claws (multiattack)', level: 2, rating: 'S', note: 'Best combat form at L2 (Moon). 34 HP + multiattack.' },
    { form: 'Dire Wolf', cr: 1, hp: 37, attacks: 'Bite (pack tactics, prone on hit)', level: 2, rating: 'A', note: 'Pack Tactics = advantage with allies. Knocks prone.' },
    { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite + Constrict (grapple + restrain)', level: 6, rating: 'S', note: 'Moon L6. 60 HP. Restrain on constrict.' },
    { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: '3 attacks + poison + grapple', level: 9, rating: 'A', note: 'Moon L9. Three attacks. Grapple on claws.' },
    { form: 'Giant Elk', cr: 2, hp: 42, attacks: 'Ram + Hooves (charge)', level: 6, rating: 'A', note: 'Moon L6. 60ft speed. Charge attack.' },
    { form: 'Earth Elemental', cr: 5, hp: 126, attacks: '2 Slams + Earth Glide', level: 10, rating: 'S', note: 'Moon L10. Elemental Wild Shape. 126 HP + burrow through stone.' },
    { form: 'Fire Elemental', cr: 5, hp: 102, attacks: '2 Touches + Fire Form (ignite on touch)', level: 10, rating: 'A', note: 'Moon L10. Sets enemies on fire. Immune to fire.' },
  ],
  utility: [
    { form: 'Giant Spider', cr: 1/4, hp: 26, utility: 'Spider Climb + Web', note: 'Climb any surface. Web for restraining.' },
    { form: 'Cat', cr: 0, hp: 2, utility: 'Tiny, Keen Smell, 30ft climb', note: 'Best infiltration form. Unnoticed as a stray cat.' },
    { form: 'Giant Eagle', cr: 1, hp: 26, utility: '80ft fly, Keen Sight', note: 'Best flying form. Carry an ally.' },
    { form: 'Giant Owl', cr: 1/4, hp: 19, utility: '60ft fly, Flyby, darkvision', note: 'Flyby = no OA. Great for scouting.' },
    { form: 'Rat', cr: 0, hp: 1, utility: 'Tiny, Keen Smell, 20ft speed', note: 'Fit through small holes. Scouting.' },
  ],
};

export const WILD_SHAPE_CONCENTRATION = {
  rule: 'You CAN maintain concentration on spells cast before Wild Shape.',
  combos: [
    { spell: 'Call Lightning', detail: 'Cast Call Lightning → Wild Shape → use beast action to call bolts each turn.', rating: 'S' },
    { spell: 'Heat Metal', detail: 'Cast Heat Metal → Wild Shape → BA to deal damage each turn. No action needed.', rating: 'A' },
    { spell: 'Barkskin', detail: 'Cast Barkskin → Wild Shape → AC minimum 16. Good for high-HP/low-AC beasts.', rating: 'B' },
    { spell: 'Guardian of Nature', detail: 'L4: Great Tree form → advantage on CON/STR. Then Wild Shape for huge HP + advantage.', rating: 'A' },
  ],
  note: 'Pre-buffing before Wild Shape is one of the strongest Druid tactics. Beast HP + spell effects.',
};

export const MOON_DRUID_POWER_CURVE = [
  { level: '2-4', power: 'S+', note: 'Brown Bear (34 HP) as BA. Strongest class in the game at these levels.' },
  { level: '5-6', power: 'A', note: 'Beast CR caps start to lag behind party damage. Still tanky.' },
  { level: '7-9', power: 'B', note: 'Beasts fall behind significantly. HP is good but damage is low.' },
  { level: '10', power: 'S', note: 'Elemental Wild Shape. 126 HP Earth Elemental. Massive power spike.' },
  { level: '11-17', power: 'B', note: 'Elementals are good but party outscales. Focus shifts to spellcasting.' },
  { level: '18-20', power: 'S+', note: 'Beast Spells (L18): cast while Wild Shaped. Infinite Wild Shape (L20).' },
];

export function wildShapeDuration(druidLevel) {
  const hours = Math.max(1, Math.floor(druidLevel / 2));
  return { hours, note: `Wild Shape duration: ${hours} hour(s)` };
}

export function wildShapeMaxCR(druidLevel, isMoonDruid) {
  if (isMoonDruid) {
    if (druidLevel >= 6) return { cr: Math.floor(druidLevel / 3), note: `Moon Druid L${druidLevel}: max CR ${Math.floor(druidLevel / 3)}` };
    return { cr: 1, note: `Moon Druid L${druidLevel}: max CR 1` };
  }
  if (druidLevel >= 8) return { cr: 1, note: `Druid L${druidLevel}: max CR 1 (with fly/swim)` };
  if (druidLevel >= 4) return { cr: 0.5, note: `Druid L${druidLevel}: max CR 1/2 (with swim)` };
  return { cr: 0.25, note: `Druid L${druidLevel}: max CR 1/4 (no fly/swim)` };
}
