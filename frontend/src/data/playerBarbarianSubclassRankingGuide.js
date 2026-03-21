/**
 * playerBarbarianSubclassRankingGuide.js
 * Player Mode: Barbarian subclass (Primal Path) ranking
 * Pure JS — no React dependencies.
 */

export const BARBARIAN_SUBCLASS_RANKING = [
  {
    subclass: 'Totem Warrior (Bear)',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Bear Totem L3: resistance to ALL damage except psychic while raging. Effectively doubles your HP pool.',
    keyFeatures: ['Bear L3: resist all damage (except psychic)', 'Eagle/Wolf L3 alternatives', 'Totem choices at L6, L14', 'Mix and match totems'],
    note: 'Bear Totem is the gold standard. Wolf Totem gives allies advantage on melee near you (great for party).',
  },
  {
    subclass: 'Zealot',
    source: "Xanathar's Guide to Everything",
    tier: 'S',
    reason: 'Divine Fury: +1d6+half level radiant/necrotic per turn (no cost). Rage Beyond Death: can\'t die while raging. Free resurrections.',
    keyFeatures: ['Divine Fury (free extra damage)', 'Warrior of the Gods (free resurrections)', 'Fanatical Focus (reroll failed save)', 'Rage Beyond Death (can\'t die while raging)'],
    note: 'Best sustained damage Barbarian. Rage Beyond Death at L14 makes you literally unkillable while raging.',
  },
  {
    subclass: 'Ancestral Guardian',
    source: "Xanathar's Guide to Everything",
    tier: 'A+',
    reason: 'Ancestral Protectors: first creature you hit has disadvantage attacking anyone except you AND allies have resistance to its damage.',
    keyFeatures: ['Ancestral Protectors (taunt + ally resistance)', 'Spirit Shield (reduce damage to ally)', 'Consult the Spirits (Clairvoyance)', 'Vengeful Ancestors (reflect damage)'],
    note: 'Best tank Barbarian. Forces enemy to attack you or deal effectively 25% damage to others.',
  },
  {
    subclass: 'Wild Magic',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Wild Surge: random beneficial effect on rage. All 8 effects are good. Bolstering Magic: +1d3 to attacks or regain spell slot.',
    keyFeatures: ['Wild Surge (8 random effects, all good)', 'Magic Awareness (detect magic at will)', 'Bolstering Magic (buff attacks or restore slots)', 'Unstable Backlash', 'Controlled Surge'],
    note: 'Every Wild Surge effect is useful (unlike Wild Magic Sorcerer). Bolstering Magic supports casters.',
  },
  {
    subclass: 'Beast',
    source: "Tasha's Cauldron of Everything",
    tier: 'B+',
    reason: 'Form of the Beast: choose Bite (heal), Claws (extra attack), or Tail (reaction AC). Natural weapon attacks.',
    keyFeatures: ['Form of the Beast (3 weapon options)', 'Bestial Soul (climb/swim/jump)', 'Infectious Fury (force attack ally or take damage)', 'Call the Hunt (temp HP + d6 to ally)'],
    note: 'Claws: extra 1d6 attack (effectively TWF without the downsides). Bite: self-healing in combat.',
  },
  {
    subclass: 'Storm Herald',
    source: "Xanathar's Guide to Everything",
    tier: 'C+',
    reason: 'Aura effects: Desert (fire damage), Sea (lightning), Tundra (temp HP). All are weak. Poorly scaling.',
    keyFeatures: ['Storm Aura (choose environment)', 'Storm Soul (resistance + minor effect)', 'Shielding Storm (share resistance)', 'Raging Storm'],
    note: 'Tundra is best (temp HP aura). Desert and Sea are too weak. Overall underwhelming.',
  },
  {
    subclass: 'Berserker',
    source: "Player's Handbook",
    tier: 'C',
    reason: 'Frenzy: BA attack while raging BUT gain exhaustion when rage ends. Exhaustion is devastating. Trap option.',
    keyFeatures: ['Frenzy (BA attack, causes exhaustion)', 'Mindless Rage (immune to charm/frighten)', 'Intimidating Presence (frighten one creature)', 'Retaliation (reaction attack when hit)'],
    note: 'Frenzy sounds great but exhaustion kills it. One frenzy = disadvantage on ability checks. Two = speed halved. Never frenzy more than once per day.',
  },
];

export function barbarianRageUses(level) {
  if (level >= 20) return { rages: 'Unlimited', note: 'Unlimited rage at L20.' };
  if (level >= 17) return { rages: 6, note: '6 rages per LR.' };
  if (level >= 12) return { rages: 5, note: '5 rages per LR.' };
  if (level >= 6) return { rages: 4, note: '4 rages per LR.' };
  if (level >= 3) return { rages: 3, note: '3 rages per LR.' };
  return { rages: 2, note: '2 rages per LR.' };
}
