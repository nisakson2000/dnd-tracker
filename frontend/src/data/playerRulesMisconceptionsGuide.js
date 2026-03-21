/**
 * playerRulesMisconceptionsGuide.js
 * Player Mode: Common D&D 5e rules mistakes and misconceptions
 * Pure JS — no React dependencies.
 */

export const COMMON_MISCONCEPTIONS = [
  {
    misconception: 'Natural 20 on skill checks means automatic success',
    truth: 'RAW: Nat 20 only auto-succeeds on ATTACK ROLLS and DEATH SAVES. Skill checks can still fail on nat 20 if DC is higher than your total.',
    note: 'Many DMs house-rule nat 20 skill success. Check with your DM.',
  },
  {
    misconception: 'You can cast two leveled spells per turn with Action + Bonus Action',
    truth: 'If you cast a spell as a BONUS ACTION, the only spell you can cast with your action is a CANTRIP. This applies even with Action Surge.',
    note: 'Action Surge exception: some argue Fighter\'s extra action allows two leveled spells. RAW is debatable. Ask your DM.',
  },
  {
    misconception: 'Sneak Attack requires hiding or surprise',
    truth: 'Sneak Attack requires: (1) advantage on the attack, OR (2) an ally within 5ft of the target and you don\'t have disadvantage. No hiding needed.',
    note: 'As long as an ally is next to the target, you can Sneak Attack openly.',
  },
  {
    misconception: 'You can move between Extra Attack strikes',
    truth: 'You CAN move between attacks on your turn. This is correct and RAW. You can attack, move, then attack again.',
    note: 'This is actually correct but many players don\'t realize they can do it.',
  },
  {
    misconception: 'Opportunity Attacks trigger when an enemy moves WITHIN your reach',
    truth: 'OAs only trigger when a creature leaves your reach using its movement, action, or reaction. Moving within your reach does NOT trigger an OA.',
    note: 'Exception: Polearm Master triggers OA when a creature ENTERS your reach.',
  },
  {
    misconception: 'Disengage prevents all opportunity attacks for the round',
    truth: 'Disengage prevents OAs for the rest of YOUR TURN. If something forces you to move on someone else\'s turn, you can still provoke OAs.',
    note: 'Disengage is turn-specific, not round-specific.',
  },
  {
    misconception: 'Healing Word can target yourself',
    truth: 'YES, Healing Word CAN target yourself. "A creature of your choice that you can see within range." You can see yourself.',
    note: 'This is actually correct. You can Healing Word yourself.',
  },
  {
    misconception: 'Prone gives disadvantage on all attacks against them',
    truth: 'Prone gives ADVANTAGE on attacks from within 5ft and DISADVANTAGE from further than 5ft. It\'s beneficial for melee, detrimental for ranged.',
    note: 'Don\'t shove enemies prone if your party is all ranged.',
  },
  {
    misconception: 'Shield Master lets you shove BEFORE your attacks',
    truth: 'Crawford ruled: "After you take the Attack action" means after ALL attacks, not between them. Some DMs allow before.',
    note: 'Contentious ruling. Ask your DM. Many allow shove between attacks.',
  },
  {
    misconception: 'Counterspell requires knowing what spell is being cast',
    truth: 'RAW: You see someone casting a spell and choose to Counterspell. You may NOT know what the spell is unless you use your reaction for Arcana check (XGtE).',
    note: 'Identifying a spell takes your reaction. Counterspelling also takes your reaction. Can\'t do both.',
  },
  {
    misconception: 'Death saves reset after being stabilized and going down again',
    truth: 'Death saves DO reset when you regain any HP. Going to 0 again starts fresh.',
    note: 'This is correct. Each time you drop to 0, death saves reset.',
  },
  {
    misconception: 'You lose all spell effects when you go to 0 HP',
    truth: 'Going to 0 HP does NOT end concentration automatically. You are incapacitated, which DOES end concentration. So yes, concentration spells end.',
    note: 'Non-concentration spells persist. Mage Armor stays. Mirror Image stays.',
  },
  {
    misconception: 'Familiars can attack',
    truth: 'Find Familiar familiars cannot take the Attack action. They can take other actions (Help, Search, Dash, Dodge, Use Object).',
    note: 'Pact of the Chain familiars CAN attack with Investment of the Chain Master.',
  },
  {
    misconception: 'Two-Weapon Fighting: you add your modifier to the off-hand attack',
    truth: 'WITHOUT the Two-Weapon Fighting style, you do NOT add your ability modifier to the off-hand attack\'s damage.',
    note: 'Two-Weapon Fighting style lets you add the modifier. It\'s a meaningful choice.',
  },
  {
    misconception: 'Darkvision means you can see perfectly in the dark',
    truth: 'Darkvision lets you see in darkness as if it were DIM LIGHT (disadvantage on Perception). Complete darkness → dim light, not bright.',
    note: 'You still have disadvantage on Perception in darkness with darkvision.',
  },
  {
    misconception: 'Inspiration can stack',
    truth: 'You either have Inspiration or you don\'t. It\'s binary. You can\'t have 2+ Inspiration.',
    note: 'Use it or lose it. Don\'t hoard Inspiration.',
  },
];

export const RULES_TIPS = [
  'Read your features carefully. Many arguments stem from misreading abilities.',
  'When in doubt, the DM decides. Don\'t argue during the game — discuss after.',
  'Jeremy Crawford\'s rulings are official errata (Sage Advice Compendium).',
  'Many "rules" are actually house rules. PHB is the authority.',
  'If something seems too good to be true, re-read the ability. You probably missed a limitation.',
  'Check the errata for your books. Some rules have been officially changed.',
  'Concentration: check if your spell requires it. Many players forget.',
  'Component pouches replace most material components EXCEPT those with a gold cost.',
  'Reactions reset at the START of your turn, not the end.',
  'You get ONE reaction per ROUND, not per turn. Used reactions come back on your turn.',
];
