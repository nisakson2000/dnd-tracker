/**
 * playerRogueSubclassRankingGuide.js
 * Player Mode: Rogue subclass ranking
 * Pure JS — no React dependencies.
 */

export const ROGUE_SUBCLASS_RANKING = [
  {
    subclass: 'Arcane Trickster',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Wizard spellcasting. Find Familiar (guaranteed SA), Shield, Booming Blade, Shadow Blade. Versatile Trickster at L13.',
    keyFeatures: ['Wizard Spellcasting (INT)', 'Mage Hand Legerdemain', 'Magical Ambush (disadvantage on saves from hiding)', 'Spell Thief'],
  },
  {
    subclass: 'Soulknife',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Psychic Blades: finesse, thrown 60ft, no evidence. Psi-Bolstered Knack: add Psionic die to failed checks. Soul Blades: teleport + homing strike.',
    keyFeatures: ['Psychic Blades (magic finesse weapons)', 'Psi-Bolstered Knack (add die to checks)', 'Psychic Whispers (telepathy)', 'Soul Blades (teleport + homing)'],
  },
  {
    subclass: 'Phantom',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Wails from the Grave: SA damage to second target. Tokens of the Departed: advantage on death/CON saves. Ghost Walk: fly + phase.',
    keyFeatures: ['Wails from the Grave (splash SA to 2nd target)', 'Tokens of the Departed', 'Ghost Walk (fly + phase through objects)', 'Death\'s Friend'],
  },
  {
    subclass: 'Swashbuckler',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Rakish Audacity: SA without advantage if 1v1. CHA to initiative. Free Disengage after attacking. Best duelist Rogue.',
    keyFeatures: ['Fancy Footwork (free Disengage)', 'Rakish Audacity (solo SA + CHA initiative)', 'Panache (taunt or charm)', 'Elegant Maneuver (advantage on Acrobatics/Athletics)', 'Master Duelist (miss → reroll with advantage)'],
  },
  {
    subclass: 'Scout',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Skirmisher: reaction to move half speed when enemy ends turn within 5ft (no OA). Survivalist: Nature + Survival Expertise.',
    keyFeatures: ['Skirmisher (reaction movement)', 'Survivalist (double Expertise)', 'Superior Mobility (+10ft speed)', 'Ambush Master (advantage on initiative + ally advantage)'],
  },
  {
    subclass: 'Assassin',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Assassinate: advantage + auto-crit vs surprised. Sounds amazing but surprise is hard to guarantee. Infiltration Expertise.',
    keyFeatures: ['Assassinate (advantage + auto-crit on surprised)', 'Infiltration Expertise', 'Impostor (perfect mimicry)', 'Death Strike (double damage on surprised, L17)'],
    note: 'In theory S-tier. In practice B: surprise requires DM cooperation and party stealth. Features are all-or-nothing.',
  },
  {
    subclass: 'Inquisitive',
    source: "Xanathar's Guide to Everything",
    tier: 'B',
    reason: 'Insightful Fighting: BA Insight vs Deception to get SA without advantage for 1 minute. Eye for Detail. Investigation focus.',
    keyFeatures: ['Insightful Fighting (guaranteed SA via check)', 'Eye for Detail (BA for Perception/Investigation)', 'Steady Eye (advantage while walking)', 'Unerring Eye (detect illusions)'],
  },
  {
    subclass: 'Thief',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Fast Hands: Use Object as BA (potions as BA!). Second-Story Work: climb speed. Use Magic Device: ignore class requirements.',
    keyFeatures: ['Fast Hands (BA Use Object)', 'Second-Story Work', 'Supreme Sneak', 'Use Magic Device', 'Thief\'s Reflexes (two turns round 1)'],
  },
  {
    subclass: 'Mastermind',
    source: "Xanathar's Guide to Everything",
    tier: 'C',
    reason: 'Help as BA at 30ft range. Master of Intrigue (disguise + language). Insightful Manipulator. RP-focused, weak combat.',
    keyFeatures: ['Master of Tactics (30ft Help as BA)', 'Master of Intrigue', 'Insightful Manipulator', 'Misdirection', 'Soul of Deceit'],
  },
];

export function rogueSubclassByRole(role) {
  const roles = {
    combat: ['Arcane Trickster', 'Soulknife', 'Phantom'],
    stealth: ['Scout', 'Assassin', 'Arcane Trickster'],
    social: ['Swashbuckler', 'Mastermind', 'Inquisitive'],
    utility: ['Thief', 'Arcane Trickster', 'Scout'],
  };
  return roles[role] || ['Arcane Trickster', 'Soulknife'];
}
