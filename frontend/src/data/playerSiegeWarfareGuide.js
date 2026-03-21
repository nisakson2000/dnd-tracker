/**
 * playerSiegeWarfareGuide.js
 * Player Mode: Siege warfare — attacking and defending fortifications
 * Pure JS — no React dependencies.
 */

export const SIEGE_BASICS = {
  concept: 'Attacking or defending fortified positions — castles, walls, keeps, towers.',
  playerRole: 'Players might lead an assault, defend a stronghold, or infiltrate during a siege.',
  note: 'Siege encounters blend combat, strategy, and problem-solving.',
};

export const WALL_AND_STRUCTURE_HP = [
  { material: 'Wood (thin)', ac: 15, hpPerInch: 10, note: 'Doors, barricades, wooden walls.' },
  { material: 'Wood (thick)', ac: 15, hpPerInch: 10, note: 'Palisades, reinforced doors. 6-12 inches = 60-120 HP.' },
  { material: 'Stone (thin)', ac: 17, hpPerInch: 15, note: 'Stone walls, pillars.' },
  { material: 'Stone (thick)', ac: 17, hpPerInch: 15, note: 'Castle walls (3+ feet = 540+ HP). Damage threshold 10.' },
  { material: 'Iron', ac: 19, hpPerInch: 30, note: 'Iron doors, portcullis.' },
  { material: 'Adamantine', ac: 23, hpPerInch: 30, note: 'Nearly indestructible. Magical barriers.' },
];

export const SPELLS_FOR_SIEGE = {
  breaching: [
    { spell: 'Disintegrate', level: 6, effect: 'Destroy up to 10ft cube of nonmagical object. Instant breach.', rating: 'S' },
    { spell: 'Passwall', level: 5, effect: 'Create a 5×8×20ft passage through any nonmagical wall. 1 hour.', rating: 'S' },
    { spell: 'Shatter', level: 2, effect: '3d8 thunder in 10ft sphere. Extra damage to nonmagical objects.', rating: 'A' },
    { spell: 'Stone Shape', level: 4, effect: 'Reshape stone: create doors, block passages, weaken walls.', rating: 'A+' },
    { spell: 'Earthquake', level: 8, effect: 'Collapses structures. Massive area destruction.', rating: 'S' },
    { spell: 'Move Earth', level: 6, effect: 'Reshape terrain: fill moats, create ramps, undermine walls.', rating: 'A' },
    { spell: 'Fabricate', level: 4, effect: 'Create siege equipment from raw materials. Instant battering rams.', rating: 'A' },
  ],
  defense: [
    { spell: 'Wall of Force', level: 5, effect: 'Invincible barrier. Block breaches. Shield defenders.', rating: 'S+' },
    { spell: 'Wall of Fire', level: 4, effect: 'Burning wall at breach points. 5d8 fire to crossers.', rating: 'S' },
    { spell: 'Spirit Guardians', level: 3, effect: 'AoE damage around you at chokepoints. 3d8 per enemy.', rating: 'S' },
    { spell: 'Cloudkill', level: 5, effect: 'Poison cloud that moves. Area denial.', rating: 'A+' },
    { spell: 'Guards and Wards', level: 6, effect: 'Booby-trap an entire building. Fog, webs, locked doors.', rating: 'A' },
    { spell: 'Glyph of Warding', level: 3, effect: 'Explosive or spell traps. Set before siege begins.', rating: 'A+' },
  ],
};

export const SIEGE_TACTICS_OFFENSE = [
  { tactic: 'Infiltration', detail: 'Invisibility, Dimension Door, Passwall, Disguise Self to get inside. Open gates from within.', rating: 'S' },
  { tactic: 'Flying assault', detail: 'Fly over walls. Bypass fortifications entirely.', rating: 'S' },
  { tactic: 'Summons as shock troops', detail: 'Conjure Animals, Animate Dead — expendable soldiers for the breach.', rating: 'A+' },
  { tactic: 'Undermining', detail: 'Tunnel under walls with Move Earth, Mold Earth, Passwall.', rating: 'A' },
  { tactic: 'Suppress defenders', detail: 'Hypnotic Pattern, Fear, Fog Cloud on the battlements. Disable archers.', rating: 'A+' },
  { tactic: 'Destroy the gate', detail: 'Focus fire on the gate. Usually weakest point. Disintegrate = instant.', rating: 'A' },
];

export const SIEGE_TACTICS_DEFENSE = [
  { tactic: 'Chokepoint control', detail: 'Funnel attackers through gates/breaches. AoE and tanks at chokepoints.', rating: 'S' },
  { tactic: 'Height advantage', detail: 'Ranged attacks from walls. Three-quarters cover (+5 AC) from battlements.', rating: 'S' },
  { tactic: 'Prepared traps', detail: 'Glyph of Warding at gates, oil + fire at breaches, caltrops in courtyards.', rating: 'A+' },
  { tactic: 'Counter-spell support', detail: 'Counterspell enemy casters trying to breach walls.', rating: 'A+' },
  { tactic: 'Healing station', detail: 'Dedicated healer behind cover. Healing Word at 60ft range.', rating: 'A' },
  { tactic: 'Sortie', detail: 'Counter-attack through a hidden exit. Flank the attackers.', rating: 'A' },
];

export const SIEGE_EQUIPMENT = [
  { equipment: 'Battering Ram', hp: 50, damage: '4d10 bludgeoning', note: 'Requires crew. Slow but effective against doors/gates.' },
  { equipment: 'Siege Tower', hp: 100, effect: 'Mobile cover that reaches wall height. Troops inside protected.', note: 'Bypasses wall height advantage.' },
  { equipment: 'Catapult/Trebuchet', hp: 75, damage: '5d10/8d10 bludgeoning', range: '500/600ft', note: 'Long-range structure damage.' },
  { equipment: 'Ballista', hp: 50, damage: '3d10 piercing', range: '400ft', note: 'Anti-personnel and anti-structure.' },
  { equipment: 'Boiling Oil', damage: '3d6 fire (10ft area)', note: 'Defensive. Pour from murder holes above gates.' },
];
