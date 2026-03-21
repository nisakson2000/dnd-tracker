/**
 * playerFighterOptGuide.js
 * Player Mode: Fighter optimization — subclasses, Action Surge, builds
 * Pure JS — no React dependencies.
 */

export const FIGHTER_CORE = {
  strengths: ['Most attacks per turn (4 at L20).', 'Action Surge: extra action once per short rest.', 'Most ASIs/feats (7 total).', 'Fighting Style + armor/weapon proficiency.'],
  weaknesses: ['Limited utility outside combat (no spells for Champion/Battlemaster).', 'Can feel repetitive without subclass features.', 'No magical healing without feats/multiclass.'],
  stats: 'STR > CON > WIS (melee) or DEX > CON > WIS (ranged).',
  key: 'Action Surge is the best martial feature. Extra action = double damage round.',
};

export const SUBCLASS_RANKINGS = [
  { subclass: 'Battle Master', rating: 'S+', why: 'Superiority dice + maneuvers. Versatile, powerful, always useful.', note: 'Trip Attack, Precision Attack, Riposte = best maneuvers. Most versatile Fighter.' },
  { subclass: 'Echo Knight', rating: 'S+', why: 'Echo: attack from 30ft away. OA from echo. Unleash Incarnation extra attacks.', note: 'EGtW. Best martial subclass in the game. Incredible action economy.' },
  { subclass: 'Rune Knight', rating: 'S', why: 'Runes: passive and active effects. Giant\'s Might: grow Large, +1d6 damage.', note: 'Great utility + damage. Fire Rune: restrain on hit. Cloud Rune: redirect attacks.' },
  { subclass: 'Eldritch Knight', rating: 'A+', why: 'Wizard spells (Abjuration + Evocation). Shield + Absorb Elements + War Magic.', note: 'Shield reaction = insane AC. Best defensive Fighter.' },
  { subclass: 'Psi Warrior', rating: 'A', why: 'Psionic dice: force damage, telekinetic movement, damage reduction.', note: 'Tasha\'s. Good but resource-limited. Fun flavor.' },
  { subclass: 'Samurai', rating: 'A', why: 'Fighting Spirit: BA advantage + temp HP (3/LR). Rapid Strike at L15.', note: 'Simple and effective. Self-sufficient advantage generation.' },
  { subclass: 'Champion', rating: 'B+', why: 'Crit on 19-20 (18-20 at L15). Remarkable Athlete. Simple.', note: 'Simplest subclass. Good for beginners. Falls behind others in power.' },
  { subclass: 'Cavalier', rating: 'A', why: 'Unwavering Mark: bonus attack on marked target. Warding Maneuver: protect allies.', note: 'Best mounted Fighter. Great tank even without mount.' },
  { subclass: 'Arcane Archer', rating: 'B', why: 'Magical arrow shots. Only 2 per short rest. Limited.', note: 'Cool concept but 2 uses is too few. Underpowered.' },
  { subclass: 'Purple Dragon Knight', rating: 'C', why: 'Weak features. Share Second Wind HP. Inspiring Surge at L10.', note: 'Worst Fighter subclass. SCAG only.' },
];

export const BATTLEMASTER_MANEUVERS = {
  sRank: [
    { maneuver: 'Precision Attack', effect: 'Add superiority die to attack roll. Turn miss into hit.', note: 'Best maneuver. Especially with GWM -5.' },
    { maneuver: 'Trip Attack', effect: 'Add die to damage + STR save or knocked prone.', note: 'Prone = advantage on all melee. Combo with Extra Attack.' },
    { maneuver: 'Riposte', effect: 'Reaction: attack when enemy misses you + add die to damage.', note: 'Extra attack on their turn. Damage + action economy.' },
  ],
  aRank: [
    { maneuver: 'Menacing Attack', effect: 'Add die to damage + WIS save or frightened.', note: 'Frightened = disadvantage on attacks + can\'t approach.' },
    { maneuver: 'Goading Attack', effect: 'Add die + WIS save or disadvantage on attacks vs others.', note: 'Force enemies to attack you. Tank maneuver.' },
    { maneuver: 'Commander\'s Strike', effect: 'Ally uses reaction to attack + add superiority die.', note: 'Give Rogue an extra Sneak Attack on your turn.' },
    { maneuver: 'Brace', effect: 'Reaction attack when creature enters your reach.', note: 'Like PAM OA without the feat.' },
    { maneuver: 'Ambush', effect: 'Add die to initiative roll.', note: 'Going first matters. Use before combat starts.' },
  ],
};

export const ACTION_SURGE_OPTIMIZATION = {
  what: 'Extra action on your turn. Once per short rest (twice at L17).',
  bestUses: [
    { use: 'Nova Round', detail: 'Attack action twice = 8 attacks at L20. 4 attacks at L5+.', note: 'Combine with GWM for devastating damage.' },
    { use: 'With Spells (EK)', detail: 'Cast a spell + Attack action on same turn.', note: 'Fireball + 4 attacks = insane burst.' },
    { use: 'Double Dash', detail: 'Dash + Dash = triple movement. Chase or flee.', note: 'Situational but saves lives.' },
    { use: 'Turn 1 Alpha Strike', detail: 'Use round 1 for maximum impact. Kill a threat before it acts.', note: 'Best when you go first. Combine with initiative boosts.' },
  ],
  tip: 'Recovers on SHORT REST. Use it every fight. Don\'t hoard it.',
};

export const FIGHTER_FEAT_PICKS = [
  { feat: 'Great Weapon Master', rating: 'S+', why: '-5/+10. Fighters get 7 ASIs — max STR then take this.' },
  { feat: 'Sharpshooter', rating: 'S+', why: '-5/+10 ranged. No disadvantage at long range. Ignore cover.' },
  { feat: 'Polearm Master', rating: 'S', why: 'BA attack + OA on approach. Amazing with Sentinel.' },
  { feat: 'Sentinel', rating: 'S', why: 'OA stops movement. Enemies can\'t escape you.' },
  { feat: 'Crossbow Expert', rating: 'S', why: 'BA hand crossbow attack. No disadvantage in melee.' },
  { feat: 'Resilient (WIS)', rating: 'A+', why: 'WIS save proficiency. Fighters are vulnerable to mind control.' },
  { feat: 'Lucky', rating: 'A', why: '3 rerolls/LR. Versatile and powerful.' },
  { feat: 'Crusher/Slasher/Piercer', rating: 'A', why: '+1 STR/DEX + weapon type bonus. Half-feats.' },
];

export const FIGHTER_BUILD_TIPS = [
  'Battle Master: best subclass. Precision Attack + Trip Attack + Riposte.',
  'Echo Knight: attack from 30ft away. Best martial subclass.',
  'Action Surge recovers on short rest. Use it EVERY fight.',
  'GWM + PAM + Sentinel: the ultimate melee Fighter combo.',
  'Sharpshooter + Crossbow Expert: best ranged build.',
  '7 ASIs = max STR/DEX then stack feats. Fighters get the most.',
  'Eldritch Knight: Shield spell = 20+ AC. Best defensive Fighter.',
  'Multiclass: Paladin 2 for Divine Smite. Or Rogue for Sneak Attack.',
  'Champion is simple but weak. Battle Master is always better.',
  'Second Wind: free healing. Use it every short rest.',
];
