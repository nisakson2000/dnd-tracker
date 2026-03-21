/**
 * playerFamiliarUsesOptGuide.js
 * Player Mode: Creative familiar uses beyond Help action
 * Pure JS — no React dependencies.
 */

export const FAMILIAR_CREATIVE_USES = [
  {
    use: 'Deliver touch spells at range',
    detail: 'Familiar can deliver touch spells you cast. Inflict Wounds (3d10), Shocking Grasp, Cure Wounds — all at familiar\'s position.',
    rating: 'S',
    note: 'Familiar uses its reaction to deliver the spell. Range limited to 100ft (familiar telepathy range).',
  },
  {
    use: 'Dragon\'s Breath carrier',
    detail: 'Cast Dragon\'s Breath (L2) on familiar. It uses its action to breathe 15ft cone, 3d6 damage. Repeatable each turn.',
    rating: 'S',
    note: 'Your concentration, familiar\'s action. You can still cast cantrips/attack on your turn.',
  },
  {
    use: 'Invisible Imp scout (Chain Pact)',
    detail: 'Imp turns invisible at will. Fly through enemy camp, building, dungeon. Report back via telepathy.',
    rating: 'S',
    note: 'No range limit with Voice of the Chain Master. Send Imp anywhere.',
  },
  {
    use: 'Pocket dimension storage',
    detail: 'Dismiss familiar to pocket dimension (action). Resummon within 30ft (action). Protects from AoE/death.',
    rating: 'A',
    note: 'Before Fireball hits your side: dismiss familiar. After blast: resummon. No damage taken.',
  },
  {
    use: 'Trap triggerer',
    detail: 'Send familiar to open chests, step on plates, pull levers. If it dies: 10gp + 1hr to resummon.',
    rating: 'A',
    note: 'Cheaper than healing party members. Familiar death is a minor inconvenience.',
  },
  {
    use: 'Flanking partner',
    detail: 'If using flanking rules: familiar in melee provides flanking advantage to your melee ally.',
    rating: 'A',
    note: 'Owl with Flyby is perfect — fly in, provide flanking, fly out without OA.',
  },
  {
    use: 'Potion delivery',
    detail: 'Familiar can carry and administer potions to unconscious allies. Fly to downed ally, pour potion.',
    rating: 'A',
    note: 'Object interaction to pour + familiar\'s action. Check with DM on exact ruling.',
  },
  {
    use: 'Concentration checker',
    detail: 'Use your action to perceive through familiar\'s senses. See around corners, through keyholes, over walls.',
    rating: 'A',
    note: 'You are blind and deaf to your own surroundings while using familiar senses.',
  },
  {
    use: 'Message relay',
    detail: 'Send familiar with written note or verbal message. Raven can mimic speech. Any familiar can carry paper.',
    rating: 'B',
    note: 'Low-tech Sending spell. Slower but free and doesn\'t require a spell slot.',
  },
  {
    use: 'Distraction',
    detail: 'Familiar creates noise/movement to draw enemy attention. DM may allow Deception/Performance checks.',
    rating: 'B',
    note: 'A cat meowing, a rat scurrying, a raven cawing. Natural distractions.',
  },
  {
    use: 'Light carrier',
    detail: 'Cast Light or Dancing Lights on/near familiar. It flies ahead to illuminate dark areas.',
    rating: 'B',
    note: 'Hands-free lighting. Familiar stays 30ft ahead in dark corridors.',
  },
  {
    use: 'Detect Magic radar',
    detail: 'Cast Detect Magic (ritual). Perceive through familiar senses. Fly familiar around to scan for magic.',
    rating: 'B',
    note: 'Mobile magic detection. Familiar covers much more ground than walking.',
  },
];

export const FAMILIAR_COMBAT_OPTIMIZATION = {
  helpAction: {
    best: 'Owl (Flyby — no OA)',
    sequence: 'Familiar flies to enemy → uses Help action → ally gets advantage → familiar flies away safely.',
    note: 'No opportunity attack on exit (Flyby). Repeatable every round. Essentially permanent advantage for one ally.',
  },
  positioning: [
    'Keep familiar at least 5ft from enemies not being Helped (avoid AoE splash).',
    'Dismiss before big AoE fights (friendly Fireball kills familiars instantly).',
    'Spider familiar can sit on your shoulder — hard for enemies to target specifically.',
  ],
  death: {
    cost: '10gp + 1 hour to resummon (ritual casting).',
    tip: 'Familiars will die. Budget the gold. Keep incense/charcoal in your component pouch.',
  },
};

export function familiarDeliverSpell(spellName, spellDamage, familiarForm) {
  const hasFlyby = familiarForm === 'Owl';
  return {
    spell: spellName,
    damage: spellDamage,
    deliveryForm: familiarForm,
    safeDelivery: hasFlyby,
    note: hasFlyby
      ? `${familiarForm} delivers ${spellName} and flies away without OA (Flyby).`
      : `${familiarForm} delivers ${spellName} but may provoke OA when retreating.`,
  };
}
