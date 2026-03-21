/**
 * playerHelperAnimalCompanion.js
 * Player Mode: Animal companions, sidekicks, and pets in combat
 * Pure JS — no React dependencies.
 */

export const COMPANION_TYPES = [
  {
    type: 'Beast Master Ranger Companion',
    source: 'Ranger (Beast Master)',
    rules: 'Uses your bonus action to command. Acts on your initiative. Takes the Dodge action if not commanded.',
    tashaVariant: 'Tasha\'s Primal Companion: Beast of Land/Sea/Sky. Scales with proficiency. Uses your bonus action.',
    note: 'Tasha\'s version is MUCH better than PHB. Use Primal Companion.',
  },
  {
    type: 'Find Familiar',
    source: 'Wizard (ritual), Pact of the Chain (Warlock)',
    rules: 'Can\'t attack (unless Chain Warlock). Help action, deliver touch spells, scout. Acts on own initiative.',
    bestForms: 'Owl (flyby Help, 120ft darkvision), Hawk (perception), Bat (blindsight), Cat (stealth)',
    note: 'Owl is the best. Flyby = no opportunity attacks. Free Help action every round.',
  },
  {
    type: 'Pact of the Chain Familiar',
    source: 'Warlock (Pact of the Chain)',
    rules: 'Can attack using your bonus action (Investment of the Chain Master). Gets special forms.',
    bestForms: 'Imp (invisibility, shapechange, poison sting), Pseudodragon (magic resistance, blindsight), Sprite (detect alignment)',
    note: 'Imp is the best. Turns invisible, delivers touch spells, poisons enemies.',
  },
  {
    type: 'Sidekick (Tasha\'s)',
    source: 'Tasha\'s Cauldron of Everything',
    rules: 'CR 1/2 or lower creature levels up with the party. Expert, Spellcaster, or Warrior.',
    classes: ['Expert (skills + Cunning Action)', 'Spellcaster (full caster progression)', 'Warrior (Extra Attack, martial features)'],
    note: 'Great for small parties. A Warrior sidekick adds significant combat power.',
  },
  {
    type: 'Homunculus Servant (Artificer)',
    source: 'Artificer (Infusion)',
    rules: 'Uses your bonus action. Can attack (Force Strike: 1d4 + proficiency force). Has Channel Magic.',
    note: 'Force Strike scales with proficiency. Channel Magic lets it deliver your spells.',
  },
  {
    type: 'Steel Defender (Battle Smith)',
    source: 'Artificer (Battle Smith)',
    rules: 'Uses your bonus action. Has Deflect Attack reaction (+proficiency AC to ally). Very tanky.',
    note: 'Excellent tank. Deflect Attack is like a mini-Shield for your allies.',
  },
  {
    type: 'Wildfire Spirit (Wildfire Druid)',
    source: 'Druid (Circle of Wildfire)',
    rules: 'Uses your bonus action. Flame Seed (ranged attack, 1d6+proficiency). Fiery Teleportation (30ft + damage).',
    note: 'Both attacks and repositions. Fiery Teleportation gives allies temp HP.',
  },
];

export const COMPANION_TACTICS = [
  { tactic: 'Familiar Help action', detail: 'Owl flies to target, takes Help action, flies away (Flyby). Free advantage every round for your Rogue/Paladin.', rating: 'S' },
  { tactic: 'Companion as flanking buddy', detail: 'Position companion opposite an ally for flanking advantage (if table uses flanking rules).', rating: 'A' },
  { tactic: 'Scout with familiar', detail: 'Send familiar ahead. Use its senses (action to see through its eyes within 100ft). Find traps and enemies.', rating: 'S' },
  { tactic: 'Deliver touch spells', detail: 'Familiar delivers Cure Wounds, Shocking Grasp, Inflict Wounds from 30+ feet away.', rating: 'S' },
  { tactic: 'Body block', detail: 'Position companion between enemy and squishy ally. Enemy must go around or through.', rating: 'A' },
  { tactic: 'Dragon\'s Breath on familiar', detail: 'Cast Dragon\'s Breath on your familiar. It uses its action to breathe 3d6 AoE. Familiars have no action otherwise.', rating: 'S' },
  { tactic: 'Companion carries items', detail: 'Familiar carries potions, caltrops, or alchemist\'s fire. Drops them as needed.', rating: 'B' },
];

export const COMPANION_PROTECTION = [
  'Keep familiars out of AoE range — 1 HP owl dies to any stray Fireball.',
  'Imp familiar can turn invisible. It\'s much harder to kill what you can\'t see.',
  'Steel Defender and Primal Companions have scaling HP. They can take hits.',
  'If your familiar dies, you can resummon it for 10 gp (1 hour ritual).',
  'Position companions behind cover when not using them.',
  'Don\'t send companions to attack high-damage enemies alone.',
];

export function getCompanionHP(companionType, level, profBonus) {
  const hpFormulas = {
    'Beast of Land': 5 + 5 * level,
    'Beast of Sea': 5 + 5 * level,
    'Beast of Sky': 4 + 4 * level,
    'Steel Defender': 2 + 5 * level + (level >= 3 ? profBonus * 2 : 0),
    'Homunculus': 1 + level,
    'Wildfire Spirit': 5 + 5 * level,
    'Familiar (Owl)': 1,
    'Familiar (Imp)': 10,
  };
  return hpFormulas[companionType] || 1;
}

export function companionDamagePerRound(companionType, profBonus) {
  const damage = {
    'Beast of Land': (4.5 + profBonus) * (profBonus >= 3 ? 2 : 1),
    'Familiar (Help action)': 0, // Provides advantage instead
    'Steel Defender': 4.5 + profBonus,
    'Wildfire Spirit': 3.5 + profBonus,
    'Homunculus': 2.5 + profBonus,
  };
  return damage[companionType] || 0;
}
