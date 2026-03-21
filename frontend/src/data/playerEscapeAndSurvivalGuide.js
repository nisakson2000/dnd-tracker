/**
 * playerEscapeAndSurvivalGuide.js
 * Player Mode: Escape tactics — how to disengage, retreat, and survive
 * Pure JS — no React dependencies.
 */

export const ESCAPE_METHODS = [
  { method: 'Disengage Action', how: 'Your movement doesn\'t provoke OA for the rest of the turn.', note: 'Rogues get this as BA (Cunning Action).' },
  { method: 'Dash Action', how: 'Double movement. Outrun enemies. Still provokes OA.', note: 'Rogues/Monks get this as BA.' },
  { method: 'Misty Step', how: 'BA teleport 30ft. No OA. Escapes grapples.', note: 'Best escape spell. L2. Verbal only.' },
  { method: 'Dimension Door', how: 'Teleport 500ft. Bring one ally.', note: 'L4. Line of sight not needed.' },
  { method: 'Thunder Step', how: 'Teleport 90ft + 3d10 thunder damage to adjacent creatures.', note: 'L3. Bring one ally. Damage on escape.' },
  { method: 'Scatter', how: 'Teleport up to 5 creatures 120ft each.', note: 'L6. Entire party escape.' },
  { method: 'Word of Recall', how: 'Teleport up to 5 to a prepared sanctuary.', note: 'L6 Cleric. Prepare the location in advance.' },
  { method: 'Fog Cloud / Darkness', how: 'Block line of sight. Heavily obscured = can\'t target with most spells.', note: 'L1-2. Area denial for retreat.' },
  { method: 'Wall of Force', how: 'Impassable barrier between you and enemies.', note: 'L5. 10-minute concentration. No save.' },
  { method: 'Plant Growth', how: '4x movement cost in 100ft radius. Enemies crawl.', note: 'L3. No concentration. Great for retreats.' },
];

export const GRAPPLE_ESCAPES = [
  { method: 'Action: Athletics or Acrobatics vs grappler\'s Athletics', note: 'Standard escape. Use your better skill.' },
  { method: 'Misty Step / any teleport', note: 'Teleportation automatically breaks grapples.' },
  { method: 'Thunderwave', note: 'Pushes grappler away. Breaks grapple.' },
  { method: 'Shapechange (Druid Wild Shape)', note: 'If new form can break free or is too large.' },
  { method: 'Ally shoves grappler away', note: 'Athletics vs Athletics. Breaks grapple.' },
  { method: 'Freedom of Movement', note: 'Auto-escape any grapple/restraint. No action needed.' },
];

export const RESTRAINT_ESCAPES = [
  { condition: 'Restrained', escape: 'STR check vs DC or destroy source. Misty Step works.' },
  { condition: 'Web', escape: 'STR check DC 12. Or fire (5 fire damage burns 5ft section).' },
  { condition: 'Entangle', escape: 'STR check DC = caster\'s save DC. Action to attempt.' },
  { condition: 'Net', escape: 'STR DC 10 or deal 5 slashing damage to net (AC 10).' },
  { condition: 'Paralyzed', escape: 'Wait for save at end of turn. Allies can help but can\'t break it directly.' },
  { condition: 'Petrified', escape: 'Greater Restoration or specific spell. Party must rescue you.' },
];

export const PARTY_RETREAT_PLAN = [
  'Step 1: Signal retreat (predetermined code word).',
  'Step 2: Casters drop Fog Cloud / Wall of Force / Darkness as cover.',
  'Step 3: Fastest characters Dash. Carry downed allies if possible.',
  'Step 4: Rear guard Dodges while retreating (disadvantage on attacks against them).',
  'Step 5: Use chokepoints — Plant Growth, Web, Spike Growth to slow pursuers.',
  'Step 6: Dimension Door / Scatter / Word of Recall if available.',
];

export const ESCAPE_TIPS = [
  'Misty Step: best escape spell. BA, verbal only, breaks grapples.',
  'Always have an exit plan before entering combat.',
  'Fog Cloud: L1, blocks line of sight. Cover your retreat.',
  'Plant Growth: no concentration, 4x movement cost. Enemies can\'t follow.',
  'Disengage: prevents OA. Rogues get it as BA.',
  'Dimension Door: 500ft teleport, bring one ally. Emergency exit.',
  'Freedom of Movement: auto-escape grapples and restraints.',
  'Dodge action while retreating: disadvantage on attacks against you.',
  'Predetermined retreat signal: don\'t argue mid-combat.',
  'Wall of Force: impassable. 10 minutes. No save. Ultimate barrier.',
];
