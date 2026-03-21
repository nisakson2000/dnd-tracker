/**
 * playerGiffGuide.js
 * Player Mode: Giff race guide — the hippo gun enthusiasts
 * Pure JS — no React dependencies.
 */

export const GIFF_BASICS = {
  race: 'Giff',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Medium',
  type: 'Humanoid',
  languages: ['Common', 'one of your choice'],
  theme: 'Hippo-headed warriors. Firearms experts. Incredible physical force. Military culture.',
};

export const GIFF_TRAITS = [
  { trait: 'Astral Spark', effect: 'Force damage added to weapon hits: PB times per long rest, damage = your proficiency bonus.', rating: 'A', note: 'Free extra force damage PB times/LR. At L5: +3 force damage, 3 times. Scales with level.' },
  { trait: 'Firearms Mastery', effect: 'Ignore loading property. No disadvantage on close range firearm attacks.', rating: 'A (campaign dependent)', note: 'Only matters if firearms exist in your campaign. If they do, this is amazing. Removes both major firearm drawbacks.' },
  { trait: 'Hippo Build', effect: 'Advantage on STR checks and saves to avoid prone. Count as one size larger for carrying/push/drag/lift.', rating: 'A', note: 'Advantage on Athletics grapple/shove. Resist prone. Large carry capacity. Great for martial builds.' },
];

export const GIFF_BUILDS = [
  { build: 'Fighter (Battlemaster)', why: 'Astral Spark + Action Surge nova. Hippo Build for grapple/shove. Firearms Mastery if available.', rating: 'S' },
  { build: 'Barbarian', why: 'Advantage on STR checks (grapple) + Rage advantage = double advantage scenario (still just advantage but guaranteed). Astral Spark force damage.', rating: 'A' },
  { build: 'Paladin', why: 'Astral Spark + Divine Smite on hits. Hippo Build for battlefield control. Strong martial synergy.', rating: 'A' },
  { build: 'Ranger', why: 'If firearms available: Giff Sharpshooter Ranger with no loading/close range penalty. Astral Spark adds damage.', rating: 'A' },
];

export function astralSparkDamage(proficiencyBonus) {
  return proficiencyBonus; // PB force damage
}

export function astralSparkUses(proficiencyBonus) {
  return proficiencyBonus; // PB times per LR
}

export function giffCarryCapacity(strScore) {
  return strScore * 15 * 2; // Count as one size larger = ×2
}
