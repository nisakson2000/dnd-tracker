/**
 * playerRulesClarifications.js
 * Player Mode: Official rules clarifications and Sage Advice rulings
 * Pure JS — no React dependencies.
 */

export const RULES_CLARIFICATIONS = [
  { topic: 'Sneak Attack + Opportunity Attack', ruling: 'YES. Sneak Attack is once per TURN, not per round. OA is a different turn.', source: 'PHB / Sage Advice', surprise: 'High' },
  { topic: 'Shield + Two-Handed Weapon', ruling: 'Two-handed only requires two hands to ATTACK. You can hold it one-handed and cast spells between attacks.', source: 'Sage Advice', surprise: 'High' },
  { topic: 'Monk + Shield', ruling: 'Monks can use shields but lose ALL Monk features (Martial Arts, Unarmored Defense, Unarmored Movement).', source: 'PHB', surprise: 'Medium' },
  { topic: 'Twinned Spell + Dragon\'s Breath', ruling: 'Can\'t twin Dragon\'s Breath — it enables targeting multiple creatures.', source: 'Sage Advice', surprise: 'Medium' },
  { topic: 'Goodberry + Life Cleric', ruling: 'Each berry heals 2+spell level HP with Disciple of Life. 10 berries × 4 HP = 40 HP from a 1st-level slot.', source: 'Sage Advice (later clarified as "works")', surprise: 'High' },
  { topic: 'Counterspell vs Counterspell', ruling: 'YES. If an enemy Counterspells you, an ally CAN Counterspell their Counterspell.', source: 'Sage Advice', surprise: 'Medium' },
  { topic: 'Surprise Round', ruling: 'There is NO "surprise round." Surprised creatures simply can\'t take actions/reactions on their first turn.', source: 'PHB p.189', surprise: 'High' },
  { topic: 'Falling Damage', ruling: 'Falling happens INSTANTLY, even mid-turn. 1d6 per 10ft, max 20d6 (200ft).', source: 'PHB / Xanathar\'s', surprise: 'Medium' },
  { topic: 'Natural 20 on Skill Checks', ruling: 'RAW: Natural 20 is NOT an automatic success on ability checks. Only on attack rolls.', source: 'PHB p.7 (changed in 5.5e)', surprise: 'High' },
  { topic: 'Paladin Smite + Unarmed', ruling: 'Divine Smite requires a MELEE WEAPON attack. Unarmed strikes are NOT weapon attacks RAW.', source: 'Sage Advice', surprise: 'High' },
  { topic: 'Hex + Eldritch Blast', ruling: 'Each beam of Eldritch Blast triggers Hex damage separately. 4 beams = 4d6 extra Hex damage.', source: 'PHB / Sage Advice', surprise: 'Low' },
  { topic: 'Can you move between Extra Attacks?', ruling: 'YES. You can move between attacks when you have Extra Attack.', source: 'PHB p.190', surprise: 'Medium' },
  { topic: 'Temporary HP Stacking', ruling: 'Temp HP does NOT stack. You choose to keep existing or replace with new.', source: 'PHB p.198', surprise: 'Medium' },
  { topic: 'Darkness + Devil\'s Sight', ruling: 'You see normally. Enemies in darkness are effectively blinded against you (advantage to you, disadvantage to them).', source: 'PHB / Sage Advice', surprise: 'Low' },
  { topic: 'Polymorph + Concentrating', ruling: 'You maintain concentration while polymorphed. The beast\'s CON is used for concentration saves.', source: 'Sage Advice', surprise: 'Medium' },
];

export function getRuling(topic) {
  return RULES_CLARIFICATIONS.find(r =>
    r.topic.toLowerCase().includes((topic || '').toLowerCase())
  ) || null;
}

export function getHighSurpriseRulings() {
  return RULES_CLARIFICATIONS.filter(r => r.surprise === 'High');
}

export function searchRulings(query) {
  return RULES_CLARIFICATIONS.filter(r =>
    r.topic.toLowerCase().includes((query || '').toLowerCase()) ||
    r.ruling.toLowerCase().includes((query || '').toLowerCase())
  );
}
