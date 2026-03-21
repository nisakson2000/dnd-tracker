/**
 * playerDruidSubclassRankingGuide.js
 * Player Mode: Druid subclass (Circle) ranking
 * Pure JS — no React dependencies.
 */

export const DRUID_SUBCLASS_RANKING = [
  {
    subclass: 'Moon',
    source: "Player's Handbook",
    tier: 'S (early), B (mid), S (late)',
    reason: 'Combat Wild Shape: BA transform. Higher CR forms. Elemental at L10. Dominates L2-4. Falls off L7-9. Spikes at L10 and L18-20.',
    keyFeatures: ['Combat Wild Shape (BA, in combat)', 'Higher CR forms (CR 1 at L2)', 'Elemental Wild Shape (L10)', 'Primal Strike (magic attacks in WS)', 'Beast Spells (L18)', 'Archdruid (infinite WS at L20)'],
  },
  {
    subclass: 'Shepherd',
    source: "Xanathar's Guide to Everything",
    tier: 'S',
    reason: 'Spirit Totem auras: Bear (temp HP + advantage on STR), Hawk (advantage on Perception + reaction attack), Unicorn (heal on spell). Best summoner.',
    keyFeatures: ['Spirit Totem (aura effects)', 'Speech of the Woods (speak with beasts)', 'Mighty Summoner (extra HP + magic attacks for summons)', 'Guardian Spirit (heal summons)', 'Faithful Summons (auto-summon when incapacitated)'],
    note: 'Mighty Summoner: all conjured creatures get +2 HP per HD and magic attacks. Best with Conjure Animals.',
  },
  {
    subclass: 'Stars',
    source: "Tasha's Cauldron of Everything",
    tier: 'A+',
    reason: 'Starry Form (BA): Archer (ranged attack), Chalice (heal on spell cast), Dragon (min 10 on concentration saves). Dragon form is incredible.',
    keyFeatures: ['Star Map (Guidance + Guiding Bolt)', 'Starry Form (Archer/Chalice/Dragon)', 'Cosmic Omen (add/subtract d6 from rolls)', 'Full of Stars (resistance in Starry Form)', 'Star Flare'],
    note: 'Dragon Form: concentration saves always succeed (minimum 10). Best concentration caster in the game.',
  },
  {
    subclass: 'Wildfire',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Wildfire Spirit: summon + fire-themed companion. Enhanced Bond: +1d8 to fire/healing. Cauterizing Flames: heal or damage on death.',
    keyFeatures: ['Summon Wildfire Spirit', 'Enhanced Bond (+1d8 fire/healing)', 'Cauterizing Flames', 'Blazing Revival (resurrect via spirit)'],
    note: 'Fire Druid. Enhanced Bond adds to every fire spell and healing spell. Spirit is a decent combatant.',
  },
  {
    subclass: 'Land',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Circle Spells (extra prepared spells by terrain). Natural Recovery (like Arcane Recovery). Full caster focus instead of Wild Shape.',
    keyFeatures: ['Circle Spells (varies by terrain)', 'Natural Recovery (recover slots on SR)', 'Land\'s Stride (ignore DT)', 'Nature\'s Ward (immune to poison/disease + charm by fey/elemental)', 'Nature\'s Sanctuary'],
    note: 'Best pure caster Druid. Natural Recovery is great economy. Circle spells vary wildly by terrain.',
  },
  {
    subclass: 'Spores',
    source: "Guildmasters' Guide to Ravnica",
    tier: 'B',
    reason: 'Symbiotic Entity: temp HP + extra necrotic on melee. Halo of Spores: reaction 1d4 necrotic. Animate Dead variant.',
    keyFeatures: ['Halo of Spores (reaction damage)', 'Symbiotic Entity (temp HP + melee bonus)', 'Fungal Infestation (animate dead humanoid)', 'Spreading Spores (area damage)', 'Fungal Body (immunities at L14)'],
    note: 'Melee Druid. Symbiotic Entity temp HP + Shillelagh. Falls off at higher levels.',
  },
  {
    subclass: 'Dreams',
    source: "Xanathar's Guide to Everything",
    tier: 'B',
    reason: 'Balm of the Summer Court: bonus action heal pool (d6s equal to Druid level). Hidden Paths: teleport 60ft. Fey-themed support.',
    keyFeatures: ['Balm of the Summer Court (BA heal pool)', 'Hearth of Moonlight and Shadow (safe rest)', 'Hidden Paths (BA teleport 60ft)', 'Walker in Dreams (Dream/Scrying/Teleportation Circle)'],
    note: 'Good healing pool. Hidden Paths is excellent mobility. Overall solid support.',
  },
];

export function druidWildShapeCR(druidLevel, isMoon) {
  if (isMoon) {
    if (druidLevel >= 6) return { cr: Math.floor(druidLevel / 3), note: `Moon: CR ${Math.floor(druidLevel / 3)}` };
    return { cr: 1, note: 'Moon: CR 1' };
  }
  if (druidLevel >= 8) return { cr: 1, note: 'CR 1 (fly/swim)' };
  if (druidLevel >= 4) return { cr: 0.5, note: 'CR 1/2 (swim)' };
  return { cr: 0.25, note: 'CR 1/4' };
}
