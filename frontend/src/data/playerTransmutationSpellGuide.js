/**
 * playerTransmutationSpellGuide.js
 * Player Mode: Transmutation spells — transformation, enhancement, and manipulation
 * Pure JS — no React dependencies.
 */

export const TRANSMUTATION_SPELLS_RANKED = [
  { spell: 'Polymorph', level: 4, rating: 'S+', note: 'Transform creature into beast up to their level CR. T-Rex (CR8) = 136 HP buffer. Best L4 spell.' },
  { spell: 'Haste', level: 3, rating: 'S+', note: '+2 AC, double speed, extra action (1 attack/Dash/Disengage/Hide). Best martial buff.' },
  { spell: 'Slow', level: 3, rating: 'S', note: '-2 AC, half speed, no reactions, can\'t use BA, 50% chance to lose spellcasting. Devastating debuff.' },
  { spell: 'Enhance Ability', level: 2, rating: 'A+', note: 'Advantage on one ability\'s checks for 1 hour. Bull\'s Strength for grappling, Owl\'s Wisdom for Perception.' },
  { spell: 'Enlarge/Reduce', level: 2, rating: 'A', note: 'Enlarge: +1d4 damage, advantage on STR checks. Reduce: -1d4, disadvantage on STR. Grapple combo.' },
  { spell: 'Spider Climb', level: 2, rating: 'A', note: 'Walk on walls and ceilings. No concentration issues. Great exploration.' },
  { spell: 'Fly', level: 3, rating: 'S', note: '60ft fly speed. Concentration. Game-changing mobility. Cast on martials.' },
  { spell: 'Longstrider', level: 1, rating: 'A', note: '+10ft speed for 1 hour. No concentration. Cast before combat.' },
  { spell: 'Jump', level: 1, rating: 'B', note: 'Triple jump distance. Niche but can solve obstacles.' },
  { spell: 'Feather Fall', level: 1, rating: 'S', note: 'Reaction: 5 creatures fall safely. Prevents all fall damage. Always prepare.' },
  { spell: 'True Polymorph', level: 9, rating: 'S+', note: 'Permanent transformation. Creature → creature, creature → object, object → creature. Game-breaking.' },
  { spell: 'Shapechange', level: 9, rating: 'S+', note: 'Become any creature. Keep mental stats, class features, and can change forms. Best L9 transmutation.' },
  { spell: 'Time Stop', level: 9, rating: 'A', note: '1d4+1 free turns. Can\'t affect others directly. Set up buffs and area spells.' },
  { spell: 'Reverse Gravity', level: 7, rating: 'S', note: 'Creatures "fall" upward 100ft. CON save or restrained. No concentration needed for the fall damage.' },
  { spell: 'Stone Shape', level: 4, rating: 'A', note: 'Reshape stone (5ft cube). Create doorways, seal passages, create furniture.' },
  { spell: 'Fabricate', level: 4, rating: 'A', note: 'Transform raw materials into finished products. Instant crafting.' },
  { spell: 'Move Earth', level: 6, rating: 'B+', note: 'Reshape terrain over 40ft square. Slow but powerful terraforming.' },
  { spell: 'Flesh to Stone', level: 6, rating: 'A', note: 'Petrify on 3 failed CON saves. Permanent if all 3 fail. Effectively kills target.' },
];

export const POLYMORPH_BEST_FORMS = [
  { form: 'T-Rex', cr: 8, hp: 136, damage: '4d12+7 bite / 3d8+7 tail', rating: 'S+', note: 'Best combat form. 136 HP buffer + huge damage. Multiattack.' },
  { form: 'Giant Ape', cr: 7, hp: 157, damage: '3d10+6 ×2 (Multiattack)', rating: 'S', note: 'Highest HP beast form. Can throw rocks (range 50/100).' },
  { form: 'Mammoth', cr: 6, hp: 126, damage: '4d8+7 gore / 4d6+7 stomp', rating: 'A+', note: 'Trampling Charge is devastating. High HP.' },
  { form: 'Giant Elk', cr: 2, hp: 42, damage: '2d6+4 ram / 4d8+4 hooves', rating: 'A (low level)', note: 'Best low-level form. Charge attack for extra damage.' },
  { form: 'Giant Owl', cr: '1/4', hp: 19, damage: '2d6+1 talons', rating: 'A (utility)', note: '60ft fly + Flyby. Best aerial form for rescue.' },
];

export const TRANSMUTATION_TIPS = [
  'Polymorph is the best L4 spell. Turn ally into T-Rex for 136 temp HP + massive damage.',
  'Haste: if concentration drops, target loses a turn (can\'t move or act). Protect concentration.',
  'Slow is Haste\'s evil twin. Debuffs up to 6 creatures. Often better than Haste.',
  'Feather Fall: reaction, no concentration, 5 targets. Always have it ready.',
  'True Polymorph: permanent after 1 hour concentration. Turn a rock into a dragon permanently.',
  'Reverse Gravity: creatures "fall" 100ft up. If ceiling, 10d6 bludgeoning. If open sky, they keep falling up.',
  'Enlarge + Grapple: advantage on STR checks + size increase = grapple anything.',
];
