/**
 * playerPolymorphGuide.js
 * Player Mode: Polymorph spell rules, best forms, and tactical usage
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_RULES = {
  level: 4,
  range: '60ft',
  duration: '1 hour (concentration)',
  target: 'One creature you can see',
  save: 'WIS save (unwilling targets)',
  targetRule: 'Target transforms into a beast with CR equal to or less than the target\'s level/CR.',
  hpRule: 'Target gains the beast\'s HP. When beast HP drops to 0, reverts with original HP (excess damage carries over).',
  restrictions: [
    'New form must be a BEAST (not monstrosity, dragon, etc.)',
    'Target\'s game statistics are replaced by the beast\'s',
    'Target retains alignment and personality',
    'Target can\'t cast spells or use most class features',
    'Target\'s gear merges into the new form',
  ],
};

export const OFFENSIVE_POLYMORPH = {
  description: 'Cast on an enemy to turn them into a harmless beast. Effective removal.',
  bestForms: ['Slug (CR 0)', 'Snail (CR 0)', 'Frog (CR 0)', 'Sea Horse (CR 0, on land = suffocating)'],
  strategy: [
    'Turn the boss into a slug. Ignore it. Fight minions. 1 hour of peace.',
    'DO NOT damage the polymorphed creature — it reverts to original form.',
    'If you MUST kill it, deal enough damage in one hit to exceed beast HP + remaining boss HP.',
    'Sea horse on land suffocates (CON mod + 1 minutes). Cruel but effective.',
    'Remember: they keep their personality. The slug WANTS to escape.',
  ],
  counters: ['High WIS save', 'Legendary Resistance', 'Dispel Magic', 'Any damage to the form'],
};

export const DEFENSIVE_POLYMORPH = {
  description: 'Cast on an ally (or yourself) to gain a powerful beast form. Emergency HP tank.',
  bestForms: [
    { form: 'Giant Ape', cr: 7, hp: 157, attacks: 'Multiattack: 2 fists (3d10+6)', speed: '40ft, 40ft climb', note: 'The best combat form. 157 HP + great damage. Available at level 7+.' },
    { form: 'T-Rex', cr: 8, hp: 136, attacks: 'Multiattack: bite (4d12+7) + tail (3d8+7)', speed: '50ft', note: 'Huge. Highest damage. But Huge size limits indoor use. Level 8+.' },
    { form: 'Giant Elk', cr: 2, hp: 42, attacks: 'Ram (2d6+5) + Hooves (4d8+5)', speed: '60ft', note: 'Great speed. Charge for extra damage. Available at level 2.' },
    { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: 'Multiattack: 2 claws + sting (poison)', speed: '40ft', note: 'Poison + grapple. Three attacks. Available at level 3.' },
    { form: 'Mammoth', cr: 6, hp: 126, attacks: 'Gore (4d8+7) + Stomp on prone (4d10+7)', speed: '40ft', note: 'Trampling Charge: knock prone, then stomp. 126 HP wall. Level 6+.' },
    { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite (2d6+4) + Constrict (2d8+4 + grapple + restrain)', speed: '30ft, 30ft swim', note: '60 HP at CR 2 is incredible value. Auto-grapple + restrain.' },
  ],
  strategy: [
    'Polymorph a downed ally into a Giant Ape = 157 HP buffer. They\'re back in the fight.',
    'Self-polymorph as emergency HP when you\'re low. 100+ HP of buffer.',
    'Beast HP is essentially temp HP. When it breaks, your real HP is underneath.',
    'Giant Ape can throw rocks for ranged damage. Versatile combat form.',
    'Polymorph a non-combat NPC into a T-Rex for a surprise boss fight ally.',
  ],
};

export const TRUE_POLYMORPH = {
  level: 9,
  differences: [
    'Can turn into ANY creature (not just beasts)',
    'Can turn objects into creatures and vice versa',
    'Becomes PERMANENT if you concentrate for the full duration',
    'Permanent form can be dispelled with Dispel Magic',
  ],
  bestUses: [
    'Turn ally into an Adult Dragon (CR 17) permanently',
    'Turn enemy into a chair (object) — no save if dropped to 0 first',
    'Turn a rock into a loyal servant (creature from object)',
    'Create powerful magic items (creature/object to object)',
  ],
};

export function getBestForm(targetLevel, purpose) {
  const forms = purpose === 'offense' ? OFFENSIVE_POLYMORPH.bestForms :
    DEFENSIVE_POLYMORPH.bestForms.filter(f => f.cr <= targetLevel);
  return forms;
}

export function polymorphHP(formCR) {
  const hpByCR = {
    0: 1, 0.25: 10, 0.5: 20, 1: 30, 2: 50, 3: 52, 4: 60, 5: 80,
    6: 126, 7: 157, 8: 136,
  };
  return hpByCR[formCR] || 0;
}

export function shouldPolymorph(targetCurrentHP, targetMaxHP, formHP) {
  const hpPercent = targetCurrentHP / targetMaxHP;
  if (hpPercent < 0.25 && formHP > targetMaxHP * 0.5) return { polymorph: true, reason: 'Emergency HP buffer. Ally is nearly dead.' };
  if (hpPercent > 0.75) return { polymorph: false, reason: 'Ally is healthy. Polymorph isn\'t needed.' };
  return { polymorph: true, reason: 'Moderate HP. Polymorph adds significant buffer.' };
}
