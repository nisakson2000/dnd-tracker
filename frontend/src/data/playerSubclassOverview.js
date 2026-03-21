/**
 * playerSubclassOverview.js
 * Player Mode: All subclass options with combat role, playstyle, and key features at a glance
 * Pure JS — no React dependencies.
 */

export const SUBCLASS_DATA = {
  Fighter: [
    { subclass: 'Champion', role: 'Sustained DPR', playstyle: 'Simple and effective. Expanded crit range. Best for new players.', keyFeature: 'Improved Critical (19-20 crit at 3)', rating: 'B' },
    { subclass: 'Battle Master', role: 'Tactical DPR', playstyle: 'Superiority Dice for special maneuvers. Most versatile Fighter.', keyFeature: 'Maneuvers (Trip, Riposte, Precision, etc.)', rating: 'S' },
    { subclass: 'Eldritch Knight', role: 'Melee + Magic', playstyle: 'Fighter with Wizard spells. Shield + Absorb Elements + attacks.', keyFeature: 'Spellcasting (abjuration/evocation focus)', rating: 'A' },
    { subclass: 'Echo Knight', role: 'Mobility DPR', playstyle: 'Create an echo to attack from two positions. Incredible reach.', keyFeature: 'Manifest Echo (attack from 30ft away)', rating: 'S' },
    { subclass: 'Rune Knight', role: 'Tank/Control', playstyle: 'Runes for buffs and debuffs. Giant\'s Might for size increase.', keyFeature: 'Runes + Giant\'s Might (Large size, +1d6 damage)', rating: 'A' },
    { subclass: 'Psi Warrior', role: 'Utility DPR', playstyle: 'Psionic abilities for defense, offense, and movement.', keyFeature: 'Psionic Energy Dice (telekinesis, shields)', rating: 'A' },
  ],
  Wizard: [
    { subclass: 'Evocation', role: 'Blaster', playstyle: 'AoE damage without hitting allies. Fireball specialist.', keyFeature: 'Sculpt Spells (allies auto-save, take 0 damage from your AoE)', rating: 'A' },
    { subclass: 'Abjuration', role: 'Tank Wizard', playstyle: 'Arcane Ward absorbs damage. Surprisingly tanky for a Wizard.', keyFeature: 'Arcane Ward (temp HP that recharges when you cast abjuration)', rating: 'A' },
    { subclass: 'Divination', role: 'Controller', playstyle: 'Portent dice let you replace any d20 roll. Absurdly powerful.', keyFeature: 'Portent (2 pre-rolled d20s, replace any roll you can see)', rating: 'S' },
    { subclass: 'Chronurgy', role: 'Controller', playstyle: 'Manipulate time. Chronal Shift is a better Portent.', keyFeature: 'Chronal Shift (force reroll after seeing result)', rating: 'S' },
    { subclass: 'War Magic', role: 'Battle Wizard', playstyle: 'Initiative bonus, power surge damage, defensive reactions.', keyFeature: 'Arcane Deflection (+2 AC or +4 save as reaction)', rating: 'A' },
    { subclass: 'Bladesinger', role: 'Melee Wizard', playstyle: 'Melee attacks + cantrips. Incredibly high AC.', keyFeature: 'Bladesong (+INT to AC, concentration, Acrobatics, speed)', rating: 'S' },
    { subclass: 'Conjuration', role: 'Summoner', playstyle: 'Summoning focus. Minor Conjuration for utility.', keyFeature: 'Focused Conjuration (can\'t lose conjuration concentration from damage)', rating: 'B' },
    { subclass: 'Necromancy', role: 'Minion Master', playstyle: 'Animate Dead horde. Extra HP and damage from undead.', keyFeature: 'Undead Thralls (extra HP and damage on animated undead)', rating: 'B' },
    { subclass: 'Illusion', role: 'Creative Controller', playstyle: 'Illusions become semi-real. Highly DM-dependent.', keyFeature: 'Illusory Reality (make one illusion object real for 1 minute)', rating: 'A (DM dependent)' },
  ],
  Cleric: [
    { subclass: 'Life', role: 'Healer', playstyle: 'Best healer in the game. Heavy armor + boosted healing.', keyFeature: 'Disciple of Life (+2+spell level to healing spells)', rating: 'A' },
    { subclass: 'Tempest', role: 'Blaster', playstyle: 'Max damage lightning/thunder. Heavy armor. Destructive Wrath.', keyFeature: 'Destructive Wrath (max damage on lightning/thunder, 1/rest)', rating: 'A' },
    { subclass: 'War', role: 'Melee DPR', playstyle: 'Bonus action attacks, Divine Strike. Front-line fighter.', keyFeature: 'War Priest (bonus action weapon attack WIS/long rest)', rating: 'B' },
    { subclass: 'Forge', role: 'Tank', playstyle: 'Highest AC in the game. +1 weapon/armor at level 1.', keyFeature: 'Blessing of the Forge (+1 weapon or armor)', rating: 'A' },
    { subclass: 'Twilight', role: 'Support', playstyle: 'Temp HP aura every round. 300ft darkvision. Incredibly strong.', keyFeature: 'Twilight Sanctuary (1d6+level temp HP to allies each round)', rating: 'S' },
    { subclass: 'Peace', role: 'Buffer', playstyle: 'Emboldening Bond = Bless without concentration. Extremely powerful.', keyFeature: 'Emboldening Bond (+1d4 to attacks/saves/checks for bonded allies)', rating: 'S' },
    { subclass: 'Light', role: 'Blaster', playstyle: 'Fireball on a Cleric. Warding Flare for defense.', keyFeature: 'Warding Flare (impose disadvantage on attack against you)', rating: 'A' },
    { subclass: 'Trickery', role: 'Utility', playstyle: 'Stealth focus, illusion domain spells. Invoke Duplicity.', keyFeature: 'Invoke Duplicity (illusory double for advantage on attacks)', rating: 'B' },
  ],
  Rogue: [
    { subclass: 'Assassin', role: 'Nova DPR', playstyle: 'Guaranteed crits on surprised targets. Devastating openers.', keyFeature: 'Assassinate (advantage + auto-crit on surprised targets)', rating: 'A' },
    { subclass: 'Arcane Trickster', role: 'Utility/DPR', playstyle: 'Rogue with Wizard spells. Mage Hand shenanigans.', keyFeature: 'Spellcasting (illusion/enchantment) + Mage Hand Legerdemain', rating: 'A' },
    { subclass: 'Swashbuckler', role: 'Duelist', playstyle: 'Free Disengage from attacked targets. CHA to initiative.', keyFeature: 'Fancy Footwork (no OA from creatures you attacked)', rating: 'A' },
    { subclass: 'Scout', role: 'Skirmisher', playstyle: 'React to move away when enemy approaches. Double expertise.', keyFeature: 'Skirmisher (reaction to move half speed when enemy ends turn near you)', rating: 'A' },
    { subclass: 'Phantom', role: 'AoE DPR', playstyle: 'Sneak Attack damage to a second target. Ghostly utility.', keyFeature: 'Wails from the Grave (half SA damage to second target)', rating: 'A' },
    { subclass: 'Soulknife', role: 'Versatile DPR', playstyle: 'Psychic blades. No weapons needed. Psi abilities for skills.', keyFeature: 'Psychic Blades (summon 1d6/1d4 psychic weapons at will)', rating: 'A' },
  ],
  Barbarian: [
    { subclass: 'Totem Warrior', role: 'Tank', playstyle: 'Bear Totem = resistance to all damage while raging. Best tank.', keyFeature: 'Bear Totem (resistance to all damage except psychic while raging)', rating: 'S' },
    { subclass: 'Zealot', role: 'DPR', playstyle: 'Extra radiant/necrotic damage. Free resurrections.', keyFeature: 'Divine Fury (+1d6+half level radiant/necrotic on first hit each turn)', rating: 'A' },
    { subclass: 'Ancestral Guardian', role: 'Defender', playstyle: 'Protect allies by imposing disadvantage on enemies attacking others.', keyFeature: 'Ancestral Protectors (attacked target has disadvantage vs allies)', rating: 'S' },
    { subclass: 'Wild Magic', role: 'Chaotic DPR', playstyle: 'Random magical effects when raging. Fun and unpredictable.', keyFeature: 'Wild Surge (random magical effect on rage)', rating: 'B' },
    { subclass: 'Beast', role: 'Versatile DPR', playstyle: 'Natural weapons while raging. Tail for AC, claws for attacks.', keyFeature: 'Form of the Beast (choose claws/tail/bite each rage)', rating: 'A' },
  ],
};

export function getSubclasses(className) {
  return SUBCLASS_DATA[className] || [];
}

export function getSubclassByRole(role) {
  const results = [];
  for (const [className, subs] of Object.entries(SUBCLASS_DATA)) {
    for (const sub of subs) {
      if (sub.role.toLowerCase().includes(role.toLowerCase())) {
        results.push({ class: className, ...sub });
      }
    }
  }
  return results;
}

export function getTopSubclasses() {
  const results = [];
  for (const [className, subs] of Object.entries(SUBCLASS_DATA)) {
    for (const sub of subs) {
      if (sub.rating === 'S') results.push({ class: className, ...sub });
    }
  }
  return results;
}
