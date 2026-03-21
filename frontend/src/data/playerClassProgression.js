/**
 * playerClassProgression.js
 * Player Mode: Level-by-level class progression highlights
 * Pure JS — no React dependencies.
 */

export const CLASS_POWER_SPIKES = {
  Barbarian: [
    { level: 1, feature: 'Rage + Unarmored Defense', impact: 'High', note: 'Resistance to physical damage. Decent AC without armor.' },
    { level: 2, feature: 'Reckless Attack + Danger Sense', impact: 'High', note: 'At-will advantage on attacks (with risk). Advantage on DEX saves.' },
    { level: 3, feature: 'Primal Path', impact: 'High', note: 'Subclass. Bear Totem = resist ALL damage while raging.' },
    { level: 5, feature: 'Extra Attack + Fast Movement', impact: 'Very High', note: '2 attacks per turn + 10ft speed. Huge power spike.' },
    { level: 7, feature: 'Feral Instinct', impact: 'Medium', note: 'Advantage on initiative. Can act in surprise rounds if raging.' },
    { level: 20, feature: 'Primal Champion', impact: 'High', note: '+4 STR and CON (beyond 20 cap). Unlimited rages.' },
  ],
  Fighter: [
    { level: 1, feature: 'Fighting Style + Second Wind', impact: 'Medium', note: 'Bonus to fighting + self-heal. Solid start.' },
    { level: 2, feature: 'Action Surge', impact: 'Very High', note: 'Extra action per short rest. 4 attacks at level 5. Iconic ability.' },
    { level: 3, feature: 'Martial Archetype', impact: 'High', note: 'Subclass. Battle Master maneuvers are incredibly versatile.' },
    { level: 5, feature: 'Extra Attack', impact: 'Very High', note: '2 attacks per action. With Action Surge = 4 attacks.' },
    { level: 11, feature: 'Extra Attack (2)', impact: 'Very High', note: '3 attacks per action. 6 with Action Surge. Unmatched damage consistency.' },
    { level: 20, feature: 'Extra Attack (3)', impact: 'High', note: '4 attacks per action. 8 with Action Surge. The attack machine.' },
  ],
  Wizard: [
    { level: 1, feature: 'Spellcasting + Arcane Recovery', impact: 'High', note: 'Full spellcaster from level 1. Recover slots on short rest.' },
    { level: 2, feature: 'Arcane Tradition', impact: 'High', note: 'Subclass. Divination (Portent) or Chronurgy are incredibly powerful.' },
    { level: 3, feature: '2nd-Level Spells', impact: 'High', note: 'Web, Misty Step, Invisibility. Game-changing spells.' },
    { level: 5, feature: '3rd-Level Spells', impact: 'Very High', note: 'Fireball, Counterspell, Hypnotic Pattern. THE power spike for casters.' },
    { level: 9, feature: '5th-Level Spells', impact: 'Very High', note: 'Wall of Force, Animate Objects. Encounter-ending spells.' },
    { level: 17, feature: '9th-Level Spells', impact: 'Legendary', note: 'Wish. Reality-warping power. Campaign-defining.' },
  ],
  Rogue: [
    { level: 1, feature: 'Sneak Attack + Expertise', impact: 'High', note: 'Extra d6 damage when you have advantage or an ally adjacent. Double proficiency on 2 skills.' },
    { level: 2, feature: 'Cunning Action', impact: 'Very High', note: 'Dash, Disengage, or Hide as bonus action. Defines Rogue combat.' },
    { level: 3, feature: 'Roguish Archetype', impact: 'High', note: 'Subclass. Assassin (auto-crit surprise), Arcane Trickster (spells).' },
    { level: 5, feature: 'Uncanny Dodge', impact: 'High', note: 'Halve damage from one attack as reaction. Incredible survivability.' },
    { level: 7, feature: 'Evasion', impact: 'Very High', note: 'DEX saves: success = 0 damage, fail = half. Fireball? What Fireball?' },
    { level: 11, feature: 'Reliable Talent', impact: 'Very High', note: 'Minimum 10 on any proficient check. Can\'t roll below 10 + modifiers. Insane.' },
  ],
  Cleric: [
    { level: 1, feature: 'Spellcasting + Domain', impact: 'High', note: 'Full caster with heavy armor (some domains). Domain shapes your role.' },
    { level: 2, feature: 'Channel Divinity', impact: 'Medium', note: 'Turn Undead + domain channel. Short rest recovery.' },
    { level: 5, feature: '3rd-Level Spells + Destroy Undead', impact: 'Very High', note: 'Spirit Guardians. THE cleric spell. AoE damage aura while you tank.' },
    { level: 9, feature: '5th-Level Spells', impact: 'High', note: 'Greater Restoration, Raise Dead. Life-saving magic.' },
    { level: 10, feature: 'Divine Intervention', impact: 'Medium', note: 'Ask your god for help. Level % chance of success. Auto at 20.' },
    { level: 17, feature: '9th-Level Spells', impact: 'Legendary', note: 'Mass Heal, True Resurrection. God-tier support.' },
  ],
  Paladin: [
    { level: 2, feature: 'Divine Smite + Spellcasting', impact: 'Very High', note: 'Choose to smite AFTER hitting. 2d8+ radiant. The burst damage king.' },
    { level: 3, feature: 'Sacred Oath', impact: 'High', note: 'Subclass. Devotion (charm immunity), Vengeance (Vow of Enmity advantage).' },
    { level: 5, feature: 'Extra Attack', impact: 'Very High', note: '2 attacks = 2 chances to smite. Damage doubles.' },
    { level: 6, feature: 'Aura of Protection', impact: 'Legendary', note: '+CHA mod to ALL saves for you and allies within 10ft. Best feature in the game.' },
    { level: 11, feature: 'Improved Divine Smite', impact: 'High', note: '+1d8 radiant on EVERY hit. Passive damage boost.' },
    { level: 18, feature: 'Aura improvements (30ft)', impact: 'Very High', note: 'Aura of Protection now 30ft. Covers the entire party in most situations.' },
  ],
};

export function getClassSpikes(className) {
  return CLASS_POWER_SPIKES[className] || [];
}

export function getNextPowerSpike(className, currentLevel) {
  const spikes = CLASS_POWER_SPIKES[className] || [];
  return spikes.find(s => s.level > currentLevel) || null;
}

export function getPowerSpikesAtLevel(className, level) {
  const spikes = CLASS_POWER_SPIKES[className] || [];
  return spikes.filter(s => s.level === level);
}
