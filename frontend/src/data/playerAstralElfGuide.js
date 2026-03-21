/**
 * playerAstralElfGuide.js
 * Player Mode: Astral Elf race guide — the star-touched elves
 * Pure JS — no React dependencies.
 */

export const ASTRAL_ELF_BASICS = {
  race: 'Astral Elf',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Medium',
  type: 'Humanoid (Elf)',
  languages: ['Common', 'Elvish', 'one of your choice'],
  theme: 'Elves who lived in the Astral Plane so long they gained starlight powers. Sacred Flame or cantrip choice.',
};

export const ASTRAL_ELF_TRAITS = [
  { trait: 'Astral Fire', effect: 'Know one cantrip: Sacred Flame, Dancing Lights, or Light. INT, WIS, or CHA as spellcasting ability (your choice).', rating: 'A', note: 'Sacred Flame is the best pick. Choose WIS or CHA as casting stat. Free damage cantrip for non-casters.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', rating: 'B', note: 'Standard elf darkvision.' },
  { trait: 'Fey Ancestry', effect: 'Advantage on saves vs charmed. Magic can\'t put you to sleep.', rating: 'A', note: 'Standard elf trait. Charm resistance is great.' },
  { trait: 'Keen Senses', effect: 'Proficiency in Perception.', rating: 'A', note: 'Free Perception proficiency. The most important skill in the game.' },
  { trait: 'Starlight Step', effect: 'Bonus action: teleport 30ft to visible unoccupied space. PB times per long rest.', rating: 'S', note: 'Free Misty Step as bonus action, PB times per day. No spell slot. No concentration. Incredible mobility.' },
  { trait: 'Trance', effect: '4-hour trance instead of 8-hour sleep. Gain 2 weapon/tool proficiencies that last until next trance.', rating: 'A', note: 'Flexible proficiencies each day. Need thieves\' tools today? Done. Need a longsword tomorrow? Done.' },
];

export const ASTRAL_ELF_BUILDS = [
  { build: 'Wizard', why: 'Starlight Step is a free Misty Step. Sacred Flame for backup. Trance for daily tool swaps. Incredible utility.', rating: 'S' },
  { build: 'Cleric', why: 'Starlight Step for positioning. Sacred Flame scales with Cleric. Trance for daily weapon proficiency.', rating: 'S' },
  { build: 'Fighter/Paladin', why: 'Starlight Step for closing distance. Trance for daily proficiency swaps. Sacred Flame for ranged option.', rating: 'A' },
  { build: 'Rogue', why: 'Starlight Step as bonus action = disengage + teleport. Better than Cunning Action. Free Perception.', rating: 'S' },
];

export function starlightStepUses(proficiencyBonus) {
  return proficiencyBonus;
}

export function tranceProficiencySwap() {
  return 2; // 2 weapon or tool proficiencies per trance
}
