/**
 * playerBestL2SpellsByClassGuide.js
 * Player Mode: Best level 2 spells by class — must-haves and traps
 * Pure JS — no React dependencies.
 */

export const BARD_L2 = [
  { spell: 'Hold Person', rating: 'S', why: 'Paralyzed = auto-crit in melee. WIS save. Humanoids only.', trap: false },
  { spell: 'Suggestion', rating: 'S', why: 'Force reasonable action. WIS save. 8 hour duration.', trap: false },
  { spell: 'Enhance Ability', rating: 'A+', why: 'Advantage on one ability. Great for social/exploration.', trap: false },
  { spell: 'Heat Metal', rating: 'S+', why: 'No save for damage (2d8/round). BA to repeat. Can\'t remove armor.', trap: false },
  { spell: 'Lesser Restoration', rating: 'A', why: 'Remove disease, blind, deaf, paralyzed, poisoned. Essential.', trap: false },
  { spell: 'Invisibility', rating: 'A', why: 'Invisible until attacking/casting. Scout, escape, surprise.', trap: false },
];

export const CLERIC_L2 = [
  { spell: 'Spiritual Weapon', rating: 'S+', why: 'BA: 1d8+WIS force damage/round. No concentration. 1 minute.', trap: false },
  { spell: 'Hold Person', rating: 'S', why: 'Paralyzed = auto-crit. WIS save. Concentration.', trap: false },
  { spell: 'Aid', rating: 'A+', why: '+5 max HP to 3 creatures. 8 hours. Stacks with other buffs. Upcasts well.', trap: false },
  { spell: 'Lesser Restoration', rating: 'A', why: 'Remove conditions. Always prepare one copy.', trap: false },
  { spell: 'Silence', rating: 'A+', why: '20ft sphere of silence. Shuts down casters. Ritual-proof.', trap: false },
  { spell: 'Prayer of Healing', rating: 'B', why: '2d8+WIS to 6 creatures. 10 min cast. Short rest healing.', trap: false },
  { spell: 'Augury', rating: 'B', why: 'Ask DM if action has good/bad result. Ritual. DM-dependent.', trap: false },
];

export const DRUID_L2 = [
  { spell: 'Pass Without Trace', rating: 'S+', why: '+10 stealth to entire party. Guaranteed surprise rounds. Best L2 spell.', trap: false },
  { spell: 'Spike Growth', rating: 'S', why: '2d4 per 5ft moved through. Forced movement = massive damage.', trap: false },
  { spell: 'Heat Metal', rating: 'S+', why: 'No save for damage. Can\'t remove armor. BA repeat. Ruins armored enemies.', trap: false },
  { spell: 'Moonbeam', rating: 'A', why: '2d10 radiant/round. Move it with action. Good vs shapeshifters.', trap: false },
  { spell: 'Lesser Restoration', rating: 'A', why: 'Remove conditions. Always have it prepared.', trap: false },
  { spell: 'Summon Beast', rating: 'A+', why: 'Tasha\'s summon. Reliable beast companion. Scales well.', trap: false },
];

export const PALADIN_L2 = [
  { spell: 'Find Steed', rating: 'S+', why: 'Intelligent mount. Shares self-targeting spells. Permanent.', trap: false },
  { spell: 'Aid', rating: 'A+', why: '+5 max HP to 3 allies. 8 hours. Great upcasting.', trap: false },
  { spell: 'Lesser Restoration', rating: 'A', why: 'Remove conditions. Paladin is often the party healer.', trap: false },
  { spell: 'Magic Weapon', rating: 'B+', why: '+1 magic weapon. Only if party lacks magic weapons.', trap: false },
  { spell: 'Branding Smite', rating: 'B', why: '2d6 radiant + reveals invisible. Niche.', trap: false },
  { spell: 'Zone of Truth', rating: 'A', why: 'CHA save or can\'t lie. Great for interrogation. Ritual not needed.', trap: false },
];

export const RANGER_L2 = [
  { spell: 'Pass Without Trace', rating: 'S+', why: '+10 stealth. Best Ranger spell. Always prepare.', trap: false },
  { spell: 'Spike Growth', rating: 'S', why: '2d4/5ft. Pair with forced movement for massive damage.', trap: false },
  { spell: 'Silence', rating: 'A+', why: 'Shut down casters. Stealth operations. Combo with melee.', trap: false },
  { spell: 'Summon Beast', rating: 'A+', why: 'Reliable companion. Better than old Conjure spells.', trap: false },
  { spell: 'Lesser Restoration', rating: 'A', why: 'Remove conditions. Standard pick.', trap: false },
  { spell: 'Cordon of Arrows', rating: 'B', why: '4 arrows as traps. 1d6 each. Set and forget.', trap: false },
];

export const SORCERER_L2 = [
  { spell: 'Web', rating: 'S+', why: 'Restrained in 20ft cube. DEX save. Flammable. Best L2 control.', trap: false },
  { spell: 'Misty Step', rating: 'S', why: 'BA teleport 30ft. Escape grapples, pits, restraints.', trap: false },
  { spell: 'Hold Person', rating: 'S', why: 'Paralyzed. Auto-crit in melee. WIS save. Concentration.', trap: false },
  { spell: 'Suggestion', rating: 'S', why: 'Force reasonable action. 8 hours. WIS save. Social nuke.', trap: false },
  { spell: 'Mirror Image', rating: 'A+', why: '3 duplicates. No concentration. Free defense.', trap: false },
  { spell: 'Scorching Ray', rating: 'A', why: '3 rays × 2d6 fire. Good with Twinned Spell (one ray).', trap: false },
  { spell: 'Dragon\'s Breath', rating: 'A', why: 'Give familiar a breath weapon (3d6). BA to breathe. Concentration.', trap: false },
];

export const WARLOCK_L2 = [
  { spell: 'Misty Step', rating: 'S', why: 'BA 30ft teleport. Escape, reposition, reach targets.', trap: false },
  { spell: 'Hold Person', rating: 'S', why: 'Paralyzed = auto-crit. Eldritch Blast follow-up.', trap: false },
  { spell: 'Suggestion', rating: 'S', why: 'Reasonable action for 8 hours. WIS save. Social pillar king.', trap: false },
  { spell: 'Mirror Image', rating: 'A+', why: 'No concentration. 3 images absorb hits. Great defense.', trap: false },
  { spell: 'Invisibility', rating: 'A', why: 'Invisible until you attack/cast. At-will with invocation later.', trap: false },
  { spell: 'Darkness', rating: 'A (build-dependent)', why: 'Devil\'s Sight: you see, they don\'t. Advantage + disadvantage.', trap: false },
  { spell: 'Spider Climb', rating: 'B', why: 'Walk on walls/ceiling. No concentration needed? Wait — it needs concentration.', trap: false },
  { spell: 'Cloud of Daggers', rating: 'B', why: '4d4 auto-damage if they enter/start in 5ft. Grapple combo.', trap: false },
];

export const WIZARD_L2 = [
  { spell: 'Web', rating: 'S+', why: 'Best L2 control spell. Restrained in 20ft cube. DEX save.', trap: false },
  { spell: 'Misty Step', rating: 'S', why: 'BA teleport. Escape anything. Always prepared.', trap: false },
  { spell: 'Hold Person', rating: 'S', why: 'Paralyzed = auto-crit. Win condition vs humanoids.', trap: false },
  { spell: 'Mirror Image', rating: 'A+', why: 'No concentration. 3 images. Free defense layer.', trap: false },
  { spell: 'Suggestion', rating: 'S', why: 'Force action. 8 hours. WIS save. Social and combat.', trap: false },
  { spell: 'Invisibility', rating: 'A', why: 'Scout, escape, surprise. Upcasts for more targets.', trap: false },
  { spell: 'Flaming Sphere', rating: 'A', why: 'BA: ram for 2d6. Zone control. Concentration.', trap: false },
  { spell: 'Levitate', rating: 'A', why: 'Remove melee enemies from combat. CON save. Or fly.', trap: false },
  { spell: 'Rope Trick', rating: 'A', why: 'Safe short rest in a pocket space. 1 hour. Ritual-less.', trap: false },
];

export const L2_SPELL_TIPS = [
  'Pass Without Trace: +10 stealth for party. Best L2 spell overall.',
  'Web: best L2 control. Restrained, DEX save, flammable for combos.',
  'Spiritual Weapon: BA damage, no concentration. Cleric bread and butter.',
  'Heat Metal: no save for damage. Can\'t remove armor. Ruins knights.',
  'Hold Person: paralyzed = auto-crit melee hits. WIS save.',
  'Misty Step: BA teleport 30ft. Always prepared on any caster.',
  'Mirror Image: no concentration. Free defense. Take it.',
  'Find Steed: permanent intelligent mount. Shares your buffs.',
  'Spike Growth: 2d4/5ft forced movement damage. Druid/Ranger core.',
  'Suggestion: 8-hour duration. "Walk away" ends encounters.',
];
