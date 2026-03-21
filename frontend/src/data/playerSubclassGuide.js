/**
 * playerSubclassGuide.js
 * Player Mode: Subclass selection guide with ratings and playstyle info
 * Pure JS — no React dependencies.
 */

export const SUBCLASS_RATINGS = {
  Barbarian: [
    { subclass: 'Totem Warrior (Bear)', tier: 'S', playstyle: 'Unkillable Tank', keyFeature: 'Resistance to ALL damage while raging (except psychic).', level: 3 },
    { subclass: 'Zealot', tier: 'A', playstyle: 'Aggressive DPS', keyFeature: 'Extra radiant/necrotic damage. Free resurrection while raging.', level: 3 },
    { subclass: 'Ancestral Guardian', tier: 'A', playstyle: 'Protector Tank', keyFeature: 'Attacked enemy has disadvantage vs allies. Damage reduction for allies.', level: 3 },
    { subclass: 'Storm Herald', tier: 'C', playstyle: 'Elemental Aura', keyFeature: 'Desert/Sea/Tundra aura effects. Underwhelming damage.', level: 3 },
    { subclass: 'Berserker', tier: 'C', playstyle: 'Frenzy DPS', keyFeature: 'Bonus attack while frenzied, but causes EXHAUSTION. Rough.', level: 3 },
  ],
  Fighter: [
    { subclass: 'Battle Master', tier: 'S', playstyle: 'Tactical DPS', keyFeature: 'Superiority Dice for combat maneuvers. Incredibly versatile.', level: 3 },
    { subclass: 'Echo Knight', tier: 'S', playstyle: 'Positioning Master', keyFeature: 'Create an echo you can attack from. Teleport to it.', level: 3 },
    { subclass: 'Eldritch Knight', tier: 'A', playstyle: 'Gish', keyFeature: 'Wizard spells + Fighter chassis. Shield + Absorb Elements.', level: 3 },
    { subclass: 'Samurai', tier: 'A', playstyle: 'Nova DPS', keyFeature: 'Fighting Spirit: advantage on all attacks for a turn (3/LR).', level: 3 },
    { subclass: 'Champion', tier: 'B', playstyle: 'Simple Crit Fisher', keyFeature: 'Crit on 19-20 (18-20 at 15). Simple but effective.', level: 3 },
  ],
  Wizard: [
    { subclass: 'Chronurgy', tier: 'S', playstyle: 'Time Manipulation', keyFeature: 'Chronal Shift (force reroll). Arcane Abeyance (store spells).', level: 2 },
    { subclass: 'Divination', tier: 'S', playstyle: 'Fate Controller', keyFeature: 'Portent: replace ANY d20 roll with pre-rolled dice. Broken.', level: 2 },
    { subclass: 'Evocation', tier: 'A', playstyle: 'Blaster', keyFeature: 'Sculpt Spells: allies auto-succeed and take 0 damage from your AoEs.', level: 2 },
    { subclass: 'Abjuration', tier: 'A', playstyle: 'Defensive Mage', keyFeature: 'Arcane Ward absorbs damage. Refills when casting abjuration.', level: 2 },
    { subclass: 'War Magic', tier: 'A', playstyle: 'Combat Mage', keyFeature: 'Arcane Deflection: +2 AC or +4 save as reaction.', level: 2 },
    { subclass: 'Bladesinger', tier: 'A', playstyle: 'Melee Wizard', keyFeature: 'Bladesong: +INT to AC, concentration, and more. Extra Attack.', level: 2 },
  ],
  Cleric: [
    { subclass: 'Twilight', tier: 'S', playstyle: 'Support Tank', keyFeature: 'Temp HP aura every round. 300ft darkvision. Flight at 17.', level: 1 },
    { subclass: 'Peace', tier: 'S', playstyle: 'Ultimate Support', keyFeature: 'Emboldening Bond: +1d4 to everything for the party.', level: 1 },
    { subclass: 'Life', tier: 'A', playstyle: 'Dedicated Healer', keyFeature: 'Extra healing on all healing spells. Heavy armor.', level: 1 },
    { subclass: 'Forge', tier: 'A', playstyle: 'Armored Tank', keyFeature: '+1 weapon/armor. Fire immunity at 17. High AC.', level: 1 },
    { subclass: 'Light', tier: 'A', playstyle: 'Blaster Cleric', keyFeature: 'Fireball + Warding Flare (impose disadvantage).', level: 1 },
  ],
  Rogue: [
    { subclass: 'Arcane Trickster', tier: 'S', playstyle: 'Magical Rogue', keyFeature: 'Wizard spells. Invisible Mage Hand. Shield + Find Familiar.', level: 3 },
    { subclass: 'Swashbuckler', tier: 'A', playstyle: 'Melee Duelist', keyFeature: 'Free disengage from attacked target. CHA to initiative.', level: 3 },
    { subclass: 'Assassin', tier: 'B', playstyle: 'First-Round Nova', keyFeature: 'Auto-crit on surprised targets. Advantage on enemies that haven\'t acted.', level: 3 },
    { subclass: 'Scout', tier: 'A', playstyle: 'Exploration Expert', keyFeature: 'Free Expertise in Nature + Survival. Free disengage as reaction.', level: 3 },
  ],
};

export function getSubclassesForClass(className) {
  return SUBCLASS_RATINGS[className] || [];
}

export function getTopSubclasses(className) {
  return getSubclassesForClass(className).filter(s => s.tier === 'S' || s.tier === 'A');
}

export function getSubclassInfo(className, subclassName) {
  return getSubclassesForClass(className).find(s =>
    s.subclass.toLowerCase().includes((subclassName || '').toLowerCase())
  ) || null;
}
