/**
 * playerWarlockPatronRankingGuide.js
 * Player Mode: Warlock patron (Otherworldly Patron) ranking
 * Pure JS — no React dependencies.
 */

export const WARLOCK_PATRON_RANKING = [
  {
    patron: 'Hexblade',
    source: "Xanathar's Guide to Everything",
    tier: 'S',
    reason: 'CHA for weapon attacks. Medium armor + shields. Hexblade\'s Curse (+PB damage, 19-20 crit). Best for melee and multiclass.',
    keyFeatures: ['Hex Warrior (CHA attacks, armor, shield)', 'Hexblade\'s Curse (damage + crit expansion)', 'Accursed Specter', 'Armor of Hexes (50% miss chance)', 'Master of Hexes'],
    note: 'Best patron by a wide margin. #1 multiclass dip. Makes Warlock SAD.',
  },
  {
    patron: 'Genie',
    source: "Tasha's Cauldron of Everything",
    tier: 'A+',
    reason: 'Genie\'s Wrath: +PB to one damage roll. Bottled Respite: rest inside vessel. Elemental Gift: fly + resistance. Wish at L17.',
    keyFeatures: ['Genie\'s Vessel (storage + rest inside)', 'Genie\'s Wrath (+PB damage)', 'Elemental Gift (fly 30ft + resistance)', 'Sanctuary Vessel (party short rest in vessel)', 'Limited Wish (L14)'],
    note: 'Great expanded spell list. Elemental Gift flight at L6. Limited Wish is very strong.',
  },
  {
    patron: 'Fiend',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Dark One\'s Blessing: temp HP on killing blow. Fireball + Wall of Fire on expanded list. Hurl Through Hell at L14.',
    keyFeatures: ['Dark One\'s Blessing (temp HP on kill)', 'Dark One\'s Own Luck (+d10 to check/save)', 'Fiendish Resilience (choose resistance)', 'Hurl Through Hell (10d10 psychic, stunned)'],
    note: 'Best blaster patron. Fireball access. Temp HP sustain. Straightforward and powerful.',
  },
  {
    patron: 'Fathomless',
    source: "Tasha's Cauldron of Everything",
    tier: 'B+',
    reason: 'Tentacle of the Deeps: BA summon tentacle, BA attack each turn. Cold resistance + swim + breathe underwater.',
    keyFeatures: ['Tentacle of the Deeps (BA tentacle attack)', 'Gift of the Sea (swim + water breathing)', 'Oceanic Soul (cold resistance)', 'Guardian Coil (tentacle reduces damage)', 'Grasping Tentacles (Evard\'s Black Tentacles 1/LR)'],
    note: 'Tentacle is a consistent BA damage source. Great in aquatic campaigns. Decent elsewhere.',
  },
  {
    patron: 'Celestial',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Healing Light: BA pool of d6s for healing. Sacred Flame + Light cantrips. Radiant damage. Support Warlock.',
    keyFeatures: ['Healing Light (BA healing pool)', 'Radiant Soul (+CHA to radiant/fire damage)', 'Celestial Resilience (temp HP on rest)', 'Searing Vengeance (revive yourself with radiant burst)'],
    note: 'Only Warlock with real healing. Radiant Soul + EB Fire damage = good sustained DPR.',
  },
  {
    patron: 'Great Old One',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Awakened Mind: telepathy 30ft. Thought Shield: psychic resistance + reflect psychic. Entropic Ward: disadvantage on attack + advantage on next.',
    keyFeatures: ['Awakened Mind (telepathy)', 'Entropic Ward (miss → advantage)', 'Thought Shield (psychic resist + reflect)', 'Create Thrall (charm permanently)'],
    note: 'Telepathy is great RP. Entropic Ward is situational. Dissonant Whispers + Hunger of Hadar on expanded list.',
  },
  {
    patron: 'Archfey',
    source: "Player's Handbook",
    tier: 'C+',
    reason: 'Fey Presence: AoE charm/frighten. Misty Escape: BA turn invisible + teleport 60ft when damaged. Flavor-heavy, mechanically weak.',
    keyFeatures: ['Fey Presence (AoE charm/frighten)', 'Misty Escape (reaction teleport + invisible)', 'Beguiling Defenses (charm immunity)', 'Dark Delirium (charm/frighten one creature)'],
    note: 'Good expanded spells but weak subclass features. Outclassed by most other patrons.',
  },
  {
    patron: 'Undead',
    source: "Van Richten's Guide to Ravenloft",
    tier: 'A',
    reason: 'Form of Dread: BA transform, frighten on hit, temp HP. Spirit Projection at L14: astral projection combat form.',
    keyFeatures: ['Form of Dread (frighten + temp HP)', 'Grave Touched (necrotic damage conversion + no eating/drinking)', 'Necrotic Husk (explode on death)', 'Spirit Projection (astral combat form)'],
    note: 'Form of Dread is excellent sustained combat. Frighten on every hit. Strong for EB builds.',
  },
];

export function warlockSlotLevel(warlockLevel) {
  if (warlockLevel >= 9) return { level: 5, slots: warlockLevel >= 17 ? 4 : warlockLevel >= 11 ? 3 : 2 };
  if (warlockLevel >= 7) return { level: 4, slots: 2 };
  if (warlockLevel >= 5) return { level: 3, slots: 2 };
  if (warlockLevel >= 3) return { level: 2, slots: 2 };
  return { level: 1, slots: warlockLevel >= 2 ? 2 : 1 };
}
