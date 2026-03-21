/**
 * playerMinionManagementGuide.js
 * Player Mode: Managing summoned creatures, companions, and controlled minions
 * Pure JS — no React dependencies.
 */

export const SUMMON_SPELL_COMPARISON = [
  { spell: 'Conjure Animals (L3)', creatures: '8 CR1/4 or 4 CR1/2 or 2 CR1 or 1 CR2', duration: '1 hr (conc)', rating: 'S+', note: '8 wolves = 8 attacks with Pack Tactics. Best summon. DM chooses creatures RAW.' },
  { spell: 'Summon Beast (L2)', creatures: '1 bestial spirit (Land/Sea/Air)', duration: '1 hr (conc)', rating: 'A+', note: 'Tasha\'s. YOU choose form. Scales with slot level. Reliable.' },
  { spell: 'Summon Fey (L3)', creatures: '1 fey spirit (Fuming/Mirthful/Tricksy)', duration: '1 hr (conc)', rating: 'A+', note: 'Good damage + BA teleport. Scales well.' },
  { spell: 'Summon Undead (L3)', creatures: '1 undead spirit (Ghostly/Putrid/Skeletal)', duration: '1 hr (conc)', rating: 'A+', note: 'Putrid poisons on hit. Ghostly frightens. Solid options.' },
  { spell: 'Conjure Woodland Beings (L4)', creatures: '8 CR1/4 fey (Pixies!)', duration: '1 hr (conc)', rating: 'S+ (if Pixies)', note: '8 Pixies = 8 free Polymorphs/Fly spells. Broken if DM allows.' },
  { spell: 'Summon Elemental (L4)', creatures: '1 elemental spirit (Air/Earth/Fire/Water)', duration: '1 hr (conc)', rating: 'A', note: 'Decent damage and utility. Earth has damage resistance.' },
  { spell: 'Conjure Minor Elementals (L4)', creatures: '8 CR1/4 or 4 CR1/2 etc.', duration: '1 hr (conc)', rating: 'A', note: 'Less impactful than Conjure Animals usually. DM chooses.' },
  { spell: 'Animate Dead (L3)', creatures: '1 skeleton or zombie (permanent)', duration: '24 hrs (no conc)', rating: 'S', note: 'No concentration! Lasts 24 hrs. Recast to maintain. Build an army.' },
  { spell: 'Summon Greater Demon (L4)', creatures: '1 demon (CR = spell level)', duration: '1 hr (conc)', rating: 'A', note: 'Powerful but risky. Demon gets CHA save each round at high HP to break free.' },
  { spell: 'Conjure Elemental (L5)', creatures: '1 elemental (CR5 or lower)', duration: '1 hr (conc)', rating: 'A', note: 'Earth Elemental (CR5) is great tank. Goes hostile if concentration breaks.' },
  { spell: 'Animate Objects (L5)', creatures: '10 tiny objects', duration: '1 min (conc)', rating: 'S', note: '10 tiny objects = 10 attacks at +8 for 1d4+4 each. Insane DPR.' },
  { spell: 'Summon Celestial (L5)', creatures: '1 celestial spirit (Avenger/Defender)', duration: '1 hr (conc)', rating: 'A+', note: 'Defender heals, Avenger damages. Both fly. Reliable.' },
  { spell: 'Find Familiar (L1)', creatures: '1 familiar (owl, cat, etc.)', duration: 'Permanent', rating: 'S', note: 'Not a combat summon. Help action, scouting, deliver touch spells.' },
  { spell: 'Find Steed (L2)', creatures: '1 intelligent mount', duration: 'Permanent', rating: 'S', note: 'Paladin exclusive. Mount + share self-target spells.' },
  { spell: 'Find Greater Steed (L4)', creatures: '1 flying intelligent mount', duration: 'Permanent', rating: 'S+', note: 'Pegasus/Griffon. Permanent flight. Share Haste/Death Ward.' },
];

export const MINION_MANAGEMENT_TIPS = [
  'Roll all minion attacks at once. Group identical summons. Use average damage to speed up.',
  'Pre-roll attacks: roll 8d20 at once for 8 wolves. Mark hits, roll damage for hits only.',
  'Know your minions\' stats beforehand. Have stat blocks ready. Don\'t look them up mid-combat.',
  'Give minions simple standing orders: "Attack the nearest enemy" or "Stay within 30ft of me."',
  'Stack minions\' turns together. Don\'t take 8 separate turns — resolve all at once.',
  'Use a digital roller for many dice. Physical dice for 10+ attacks slows the game.',
  'Be considerate of table time. Summoning 8 creatures is powerful but takes time. Be efficient.',
];

export const COMPANION_COMPARISON = [
  { source: 'Find Familiar', type: 'Wizard/Pact', combat: 'Help action only. Can\'t attack.', utility: 'S+ (scouting, touch spell delivery)', note: 'Best utility companion.' },
  { source: 'Beast Master (Tasha\'s)', type: 'Ranger', combat: 'Attacks via BA command. Decent damage.', utility: 'A (extra body)', note: 'Only viable with Tasha\'s beasts.' },
  { source: 'Steel Defender', type: 'Artificer', combat: 'Attacks via BA. Deflect Attack reaction.', utility: 'A+ (Deflect Attack is great)', note: 'Solid tank companion.' },
  { source: 'Drake Companion', type: 'Ranger', combat: 'Attacks via BA. Elemental damage.', utility: 'A (mount at L7, fly at L15)', note: 'Scales into a mount.' },
  { source: 'Homunculus Servant', type: 'Artificer', combat: 'Force Strike (ranged). Touch spell delivery.', utility: 'A (infusion slot cost)', note: 'Ranged attack + spell delivery.' },
  { source: 'Wildfire Spirit', type: 'Druid', combat: 'Flame Seed attack. Teleport allies.', utility: 'S (teleportation is incredible)', note: 'Wildfire Druid only. Best mobility companion.' },
];
