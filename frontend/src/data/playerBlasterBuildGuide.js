/**
 * playerBlasterBuildGuide.js
 * Player Mode: Blaster/DPS caster builds — maximum spell damage output
 * Pure JS — no React dependencies.
 */

export const BLASTER_SUBCLASSES = [
  { subclass: 'Evocation Wizard', rating: 'S', keyFeature: 'Sculpt Spells (allies auto-succeed + 0 damage). Overchannel (max damage 1/LR free).', note: 'Fireball allies safely. 48 damage Overchannel Fireball at L14.' },
  { subclass: 'Light Cleric', rating: 'A+', keyFeature: 'Fireball on spell list. Warding Flare. Corona of Light at L17.', note: 'Cleric with Fireball. Spirit Guardians + Fireball = massive AoE.' },
  { subclass: 'Draconic Sorcerer', rating: 'A+', keyFeature: '+CHA damage to one element. Elemental Affinity at L6.', note: 'Fire Draconic: +CHA to Fireball damage (one target per roll RAW).' },
  { subclass: 'Tempest Cleric', rating: 'A+', keyFeature: 'Destructive Wrath: maximize thunder/lightning damage.', note: 'Max damage Call Lightning or Shatter. Devastating burst.' },
  { subclass: 'Artillerist Artificer', rating: 'A', keyFeature: 'Arcane Firearm: +1d8 to damage spells.', note: 'Every damage spell gets +1d8. Consistent boost.' },
  { subclass: 'Hexblade Warlock', rating: 'A+', keyFeature: 'Hexblade\'s Curse: +PB damage per hit. Eldritch Blast beams.', note: 'Hex + Curse + Agonizing Blast = 1d10+CHA+PB+1d6 per beam.' },
  { subclass: 'Wildfire Druid', rating: 'A', keyFeature: 'Enhanced Bond: +1d8 to fire/healing spells.', note: 'Druid blaster. +1d8 to fire spells + Wildfire Spirit.' },
];

export const BLASTER_SPELL_PROGRESSION = {
  cantrips: [
    { spell: 'Eldritch Blast', damage: '1d10-4d10+CHA per beam', rating: 'S+ (Warlock)', note: 'Best cantrip. With invocations: +CHA per beam, push 10ft.' },
    { spell: 'Fire Bolt', damage: '1d10-4d10', rating: 'A', note: 'Default blaster cantrip. 120ft range.' },
    { spell: 'Toll the Dead', damage: '1d8/1d12', rating: 'A+', note: 'WIS save. d12 on damaged targets. Best save-cantrip.' },
  ],
  level1to2: [
    { spell: 'Magic Missile', damage: '3d4+3 auto-hit', rating: 'A+', note: 'Never misses. Force concentration checks.' },
    { spell: 'Scorching Ray (L2)', damage: '3×2d6', rating: 'A+', note: 'Attack rolls. Multi-target. Hex synergy.' },
    { spell: 'Shatter (L2)', damage: '3d8 AoE', rating: 'A', note: 'Early AoE. Thunder damage.' },
  ],
  level3: [
    { spell: 'Fireball', damage: '8d6 AoE', rating: 'S', note: 'THE blasting spell. 20ft radius. 150ft range.' },
    { spell: 'Lightning Bolt', damage: '8d6 line', rating: 'A+', note: 'Same damage, 100ft line. Harder to optimize.' },
    { spell: 'Spirit Guardians', damage: '3d8/enemy/round', rating: 'S+', note: 'Sustained > burst. 3+ enemies × 3+ rounds = more than Fireball.' },
  ],
  level5plus: [
    { spell: 'Synaptic Static (L5)', damage: '8d6 psychic + -1d6 debuff', rating: 'S', note: 'Best L5 AoE. Psychic = rarely resisted.' },
    { spell: 'Animate Objects (L5)', damage: '10×(1d4+4) = ~47 DPR', rating: 'S', note: 'Best sustained damage spell. 10 tiny objects attack.' },
    { spell: 'Disintegrate (L6)', damage: '10d6+40 force', rating: 'A+', note: 'Average 75 force damage. DEX save = 0 on success.' },
    { spell: 'Meteor Swarm (L9)', damage: '40d6', rating: 'S', note: 'Average 140 damage. Ultimate blaster spell.' },
  ],
};

export const BLASTER_TIPS = [
  'Control is usually better than blasting. Hypnotic Pattern removes enemies; Fireball just hurts them.',
  'Blast when enemies are grouped, low HP, or when control has already been applied.',
  'Sculpt Spells (Evocation Wizard) makes Fireball safe to use with melee allies.',
  'Synaptic Static > Fireball at L5. Same AoE, psychic damage, + lingering debuff.',
  'Spirit Guardians outdamages Fireball over 2+ rounds vs 3+ enemies.',
  'Animate Objects is the highest sustained DPR spell in the game.',
  'Overchannel (Evocation Wizard L14): 48 damage Fireball. Use on the first big AoE of the day.',
  'Force and psychic are the best damage types. Almost nothing resists them.',
  'Hex + Eldritch Blast: +1d6 per beam = +2d6 at L5, +3d6 at L11, +4d6 at L17.',
];
