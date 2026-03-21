/**
 * playerTotemBarbarianGuide.js
 * Player Mode: Totem Warrior Barbarian subclass optimization
 * Pure JS — no React dependencies.
 */

export const TOTEM_BASICS = {
  class: 'Barbarian (Path of the Totem Warrior)',
  note: 'Choose a different totem at each feature level (3, 6, 14). Mix and match.',
  ritual: 'Spirit Seeker: Cast Beast Sense and Speak with Animals as rituals.',
};

export const TOTEM_CHOICES = {
  level3: [
    { totem: 'Bear', effect: 'Resistance to ALL damage except psychic while raging.', rating: 'S', note: 'Effectively doubles HP. The reason to play Totem Barbarian.' },
    { totem: 'Eagle', effect: 'Enemies have disadvantage on OA against you. Dash as bonus action (costs rage).', rating: 'B', note: 'Mobile but Bear is almost always better.' },
    { totem: 'Wolf', effect: 'Allies have advantage on melee attacks vs enemies within 5ft of you.', rating: 'A', note: 'Pack tactics for the party. Great with Rogues (Sneak Attack).' },
    { totem: 'Elk', effect: '+15ft speed while raging.', rating: 'C', note: 'SCAG. Fast Movement already exists. Overkill.' },
    { totem: 'Tiger', effect: '+10ft long jump, +3ft high jump while raging.', rating: 'C', note: 'SCAG. Very situational.' },
  ],
  level6: [
    { totem: 'Bear', effect: 'Carrying capacity doubled. Advantage on STR checks to push/pull/lift/break.', rating: 'B', note: 'Good for grapple builds.' },
    { totem: 'Eagle', effect: 'See 1 mile clearly. No disadvantage on Perception from dim light.', rating: 'B', note: 'Exploration utility.' },
    { totem: 'Wolf', effect: 'Track at fast pace. Move stealthily at normal pace.', rating: 'A', note: 'Best exploration totem. Party moves faster.' },
    { totem: 'Elk', effect: 'Travel pace doubled for up to 10 companions within 60ft.', rating: 'A', note: 'SCAG. Party moves at double speed overland.' },
    { totem: 'Tiger', effect: 'Proficiency in 2 skills from: Athletics, Acrobatics, Stealth, Survival.', rating: 'B', note: 'SCAG. Two free proficiencies.' },
  ],
  level14: [
    { totem: 'Bear', effect: 'While raging, enemies within 5ft have disadvantage attacking anyone but you.', rating: 'A', note: 'Taunt aura. Protects allies.' },
    { totem: 'Eagle', effect: 'Fly speed equal to walking speed while raging. Must end turn on ground.', rating: 'A', note: 'Limited flight. Still very useful.' },
    { totem: 'Wolf', effect: 'While raging, bonus action to knock Large or smaller creatures prone on hit.', rating: 'S', note: 'Bonus action prone = advantage on all remaining attacks. Every turn.' },
    { totem: 'Elk', effect: 'While raging, bonus action to move through Large or smaller creature. STR save or prone + 1d12+STR.', rating: 'A', note: 'SCAG. Charge through enemies.' },
    { totem: 'Tiger', effect: 'While raging, bonus action attack against creature within 5ft after moving 20ft in a line.', rating: 'B', note: 'SCAG. Pounce attack.' },
  ],
};

export const BEST_TOTEM_COMBOS = [
  { combo: 'Bear 3 / Wolf 6 / Wolf 14', name: 'Tank & Control', note: 'Tanky + party mobility + bonus action prone. Best all-around.' },
  { combo: 'Bear 3 / Any 6 / Bear 14', name: 'Pure Tank', note: 'Maximum survivability. Enemies forced to attack you.' },
  { combo: 'Wolf 3 / Wolf 6 / Wolf 14', name: 'Pack Alpha', note: 'Party-wide advantage + stealth travel + prone. Team player build.' },
  { combo: 'Bear 3 / Eagle 6 / Eagle 14', name: 'Flying Bear', note: 'Bear tanking + flight at 14. Aerial rage machine.' },
];

export function bearEffectiveHP(hp, raging) {
  if (!raging) return hp;
  // Resistance to all damage except psychic effectively doubles HP
  return hp * 2;
}

export function totemRageDamage(level, strMod, weaponDie) {
  const rageDmg = level >= 16 ? 4 : level >= 9 ? 3 : 2;
  return weaponDie / 2 + strMod + rageDmg;
}
