/**
 * playerRogueOptGuide.js
 * Player Mode: Rogue optimization — Sneak Attack, subclasses, skill mastery
 * Pure JS — no React dependencies.
 */

export const ROGUE_CORE = {
  strengths: ['Sneak Attack: massive single-hit damage.', 'Expertise: double proficiency in skills.', 'Cunning Action: BA Dash/Disengage/Hide.', 'Evasion: half/no damage on DEX saves.', 'Reliable Talent: minimum 10+mod on proficient skills.'],
  weaknesses: ['One attack per turn (usually).', 'Low HP (d8 HD).', 'Needs advantage or ally adjacent for Sneak Attack.', 'No spellcasting (except AT).'],
  stats: 'DEX > CON > WIS (or INT/CHA depending on subclass).',
  key: 'Sneak Attack EVERY turn is your priority. Never miss a round.',
};

export const SNEAK_ATTACK_RULES = {
  damage: '1d6 at L1, scaling to 10d6 at L19. Once per TURN (not round).',
  requirements: [
    'Finesse or ranged weapon.',
    'Advantage on the attack roll, OR',
    'An ally within 5ft of the target (and you don\'t have disadvantage).',
  ],
  perTurn: 'Once per TURN, not per round. Can Sneak Attack on OA (enemy turn) AND on your turn.',
  optimization: [
    'Flanking (if used) = free advantage = free Sneak Attack.',
    'Ally adjacent: most reliable method. Stand near your Fighter.',
    'Owl familiar: flyby Help = free advantage every turn.',
    'Steady Aim (Tasha\'s): BA to gain advantage. Can\'t move this turn.',
    'Booming Blade + Sneak Attack: extra damage if they move.',
  ],
};

export const SUBCLASS_RANKINGS = [
  { subclass: 'Soulknife', rating: 'S', why: 'Psychic Blades: no ammo, no evidence. Psi die for skills + stealth.', note: 'Tasha\'s. Best overall Rogue. Psychic damage is rarely resisted.' },
  { subclass: 'Arcane Trickster', rating: 'S', why: 'Wizard spells: Shield, Find Familiar, Booming Blade. Mage Hand Legerdemain.', note: 'Shield reaction + Sneak Attack. Best defensive Rogue.' },
  { subclass: 'Swashbuckler', rating: 'S', why: 'CHA to initiative. Free Disengage after attacking. Sneak Attack in 1v1.', note: 'Best melee Rogue. No ally needed for Sneak Attack if alone with target.' },
  { subclass: 'Phantom', rating: 'A+', why: 'Wails from the Grave: extra damage to second target. Tokens of the Departed.', note: 'Multi-target Sneak Attack. Scales well.' },
  { subclass: 'Scout', rating: 'A+', why: 'Skirmisher: reaction move. Nature/Survival expertise. Free Advantage at L13.', note: 'Best ranged Rogue. Mobile and skill-heavy.' },
  { subclass: 'Assassin', rating: 'A (table-dependent)', why: 'Auto-crit on surprised creatures. Advantage on creatures that haven\'t acted.', note: 'Amazing IF you get surprise. Often you don\'t. DM-dependent.' },
  { subclass: 'Thief', rating: 'A', why: 'Fast Hands: BA Use Object. Climb speed. Use magic items at L13.', note: 'Classic Rogue. Fast Hands = BA caltrops, healer\'s kit, etc.' },
  { subclass: 'Mastermind', rating: 'B+', why: 'BA Help at 30ft range. Great support but limited personal power.', note: 'Support Rogue. Help your allies more than yourself.' },
  { subclass: 'Inquisitive', rating: 'B+', why: 'Insightful Fighting: use Insight to gain Sneak Attack. Eye for Detail.', note: 'Investigation Rogue. Good for mystery campaigns.' },
];

export const CUNNING_ACTION_USAGE = {
  dash: { when: 'Close distance or escape. 60ft+ of movement per turn.', priority: 'Medium', note: 'Disengage is usually better than Dash for escape.' },
  disengage: { when: 'After melee attack. Hit and run. No opportunity attacks.', priority: 'High', note: 'Core melee Rogue tactic. Attack → Disengage → move away.' },
  hide: { when: 'After ranged attack from cover. Gain advantage next turn.', priority: 'High', note: 'Shoot → BA Hide → advantage next turn. Ranged Rogue core loop.' },
  steadyAim: { when: 'Can\'t move this turn anyway. Gain advantage.', priority: 'Medium', note: 'Tasha\'s optional. Great when you\'re already in position.' },
};

export const RELIABLE_TALENT_MATH = {
  level: 10,
  what: 'Any proficient ability check: treat rolls of 1-9 as 10.',
  examples: [
    { skill: 'Stealth (+13)', minimum: '23', note: 'Can\'t roll below 23 on Stealth. Invisible to most guards.' },
    { skill: 'Thieves\' Tools (+11)', minimum: '21', note: 'Auto-unlock most locks (DC 15-20).' },
    { skill: 'Perception (+9)', minimum: '19', note: 'Spot almost everything. Passive 19+ minimum.' },
    { skill: 'Deception (+10)', minimum: '20', note: 'Lie convincingly to almost anyone.' },
  ],
  note: 'Reliable Talent makes Rogues the best skill users in the game.',
};

export const ROGUE_FEAT_PICKS = [
  { feat: 'Alert', rating: 'S', why: '+5 initiative. Can\'t be surprised. Rogues want to go first.' },
  { feat: 'Sentinel', rating: 'A+ (melee)', why: 'OA on enemy turn = extra Sneak Attack (per-turn rule).' },
  { feat: 'Crossbow Expert', rating: 'A+ (ranged)', why: 'No disadvantage in melee. BA hand crossbow shot.' },
  { feat: 'Sharpshooter', rating: 'A (ranged)', why: '-5/+10 with Steady Aim advantage. Ignore cover.' },
  { feat: 'Elven Accuracy', rating: 'S (elf/half-elf)', why: 'Triple advantage with Steady Aim. Almost never miss.' },
  { feat: 'Lucky', rating: 'A+', why: '3 rerolls. Turn misses into Sneak Attack hits.' },
  { feat: 'Resilient (WIS)', rating: 'A', why: 'WIS save proficiency. Protect against Hold Person, dominate.' },
  { feat: 'Fey Touched', rating: 'A', why: 'Misty Step + a L1 spell. +1 WIS or CHA. Escape tool.' },
];

export const ROGUE_BUILD_TIPS = [
  'Sneak Attack every turn. If you miss, your turn was wasted.',
  'Ally within 5ft of target = Sneak Attack. Easiest method.',
  'Hit and run: attack → Cunning Action Disengage → move away.',
  'Ranged: shoot → BA Hide → advantage next turn. Core loop.',
  'Reliable Talent (L10): can\'t roll below 10 on skills. Game-changing.',
  'Sentinel: OA = extra Sneak Attack on enemy turn. Per-turn rule.',
  'Arcane Trickster: Shield reaction = survive. Find Familiar = advantage.',
  'Swashbuckler: melee without allies. CHA to initiative.',
  'Soulknife: psychic blades. No ammo, no evidence. Best subclass.',
  'Multiclass: Fighter 2 (Action Surge), or Battlemaster 3 for maneuvers.',
];
