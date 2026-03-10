// Plain-English help text for every mechanical element in the app.
// No assumed D&D knowledge. Written for someone who has never played before.

export const HELP = {
  // === ABILITY SCORES ===
  str: "How physically powerful your character is. Affects melee attack rolls, damage, and how much you can carry. High Strength is key for fighters and barbarians.",
  dex: "How nimble and precise your character is. Affects ranged attacks, AC when unarmored, Stealth, and Sleight of Hand. Crucial for rogues and rangers.",
  con: "Your character's toughness and endurance. Affects your hit points and your ability to maintain concentration on spells. Everyone benefits from high Constitution.",
  int: "How smart and learned your character is. Powers Wizard spells and skills like Arcana, History, and Investigation.",
  wis: "Your character's perceptiveness and common sense. Powers Cleric and Druid spells, and skills like Perception, Insight, and Survival.",
  cha: "How magnetic and persuasive your character is. Powers Bard, Paladin, Sorcerer, and Warlock spells, and social skills like Persuasion and Deception.",

  // === DERIVED STATS ===
  modifier: "A bonus or penalty derived from your ability score. This is the number actually added to dice rolls — not the score itself. Score 10–11 = +0, 12–13 = +1, 14–15 = +2, and so on.",
  proficiencyBonus: "A bonus added to rolls you are trained in. It scales with your level: +2 at levels 1–4, +3 at 5–8, +4 at 9–12, +5 at 13–16, +6 at 17–20. Added to attack rolls, saving throws, and skill checks you're proficient in.",
  ac: "How hard your character is to hit. When an enemy attacks, they roll a d20 and add their attack bonus — if the result equals or exceeds your AC, the attack hits. Higher is better. Unarmored: 10 + DEX modifier.",
  initiative: "Determines turn order in combat. At the start of a fight, everyone rolls a d20 and adds their Initiative bonus (DEX modifier). Highest goes first.",
  passivePerception: "How alert your character is without actively looking. The DM uses this number secretly to determine if you notice hidden things like traps or ambushes, even when you're not paying attention. Equals 10 + Perception modifier.",
  speed: "How far your character can move on their turn during combat, in feet. Most races have 30 feet of movement per turn. Each square on a battle map is usually 5 feet.",

  // === HIT POINTS ===
  hp: "Your character's health. When you take damage, it reduces your current HP. Reaching 0 HP means you start making death saving throws. Your maximum HP is determined by your class's hit die and Constitution modifier.",
  tempHp: "A separate buffer of hit points that absorbs damage before your real HP. They don't stack — if you receive temp HP again while you still have some, take whichever value is higher. They disappear after a long rest.",
  hitDice: "Dice used to recover HP during a short rest. You have one hit die per character level, sized by your class (d6 for Wizards, d12 for Barbarians). Spend one or more during a short rest, roll each die and add your CON modifier to recover that much HP.",

  // === SAVES & SKILLS ===
  savingThrows: "A roll you make to resist or avoid something harmful — like dodging a fireball (DEX save) or resisting a charm spell (WIS save). Roll a d20, add the relevant modifier, and try to meet or beat the difficulty. If you're proficient, add your proficiency bonus too.",
  proficiency: "Means your character is trained in that skill or save. When making a check using it, you add your proficiency bonus to the roll.",
  expertise: "Double proficiency. If you have expertise in a skill, you add your proficiency bonus twice to rolls with that skill. Rogues and Bards get this ability.",

  // === DEATH SAVES ===
  deathSaves: "When you reach 0 HP, you're dying. Each turn, roll a d20: 10+ is a success, 9 or lower is a failure. Three successes = you stabilize. Three failures = your character dies. Natural 20 = regain 1 HP. Natural 1 = two failures.",

  // === INSPIRATION & EXHAUSTION ===
  inspiration: "A reward from the DM for great roleplaying. When you have it, spend it to gain advantage on one attack roll, saving throw, or ability check of your choice. You either have it or you don't — it doesn't stack.",
  exhaustion: "A debilitating condition with 6 cumulative levels. Each level adds penalties on top of the previous ones. Gained from harsh conditions, some spells, or going without food/water. One level is removed after a long rest with food and water.",

  // === SPELLCASTING ===
  spellSlots: "Think of these as fuel for your spells. Each time you cast a spell of 1st level or higher, you use one slot of that level or higher. You recover all slots after a long rest (except Warlocks, who recover on a short rest).",
  spellSaveDC: "The difficulty number enemies must beat to resist your spells. When you cast a spell that forces a save, the target rolls a d20 plus their relevant modifier and tries to equal or beat this number. Formula: 8 + proficiency bonus + spellcasting ability modifier.",
  spellAttack: "Added to your d20 roll when a spell requires an attack roll (like Fire Bolt). If the total equals or exceeds the target's AC, the spell hits. Formula: proficiency bonus + spellcasting ability modifier.",
  concentration: "Some spells require you to maintain focus to keep them active. You can only concentrate on one spell at a time. Taking damage forces a Constitution saving throw (DC = 10 or half the damage, whichever is higher) — fail and the spell ends.",
  ritual: "Some spells can be cast as a ritual — it takes 10 extra minutes but costs no spell slot. Wizards can ritual-cast any ritual spell in their spellbook, even if it isn't prepared.",
  cantrip: "A spell you can cast infinitely without using spell slots. Always available, always free. Many cantrips deal damage and scale in power as you level up.",
  prepared: "Some classes (Wizards, Clerics, Druids, Paladins) must choose which spells to have ready each day. You can only cast spells you've prepared. Choose after a long rest.",
  pactMagic: "Warlocks use Pact Magic instead of normal spell slots. They have fewer slots, but all slots are the same level and they recover on a short rest instead of a long rest.",

  // === COMBAT ===
  actions: "The main thing you do on your turn — attack, cast a spell, dash, dodge, help, hide, or use an item. You get one action per turn.",
  bonusActions: "An optional extra action some abilities or spells grant. You can only take one bonus action per turn, and only if something specifically gives you one (like two-weapon fighting or certain spells).",
  reactions: "An instant response to a trigger — like casting Shield when hit, or making an opportunity attack. You get one reaction per round, and it recharges at the start of your next turn.",
  conditions: "Status effects that alter what a creature can do. Being Prone means you're on the ground — melee attacks have advantage against you. Each condition has specific mechanical effects.",

  // === RESTING ===
  longRest: "At least 8 hours of rest. Fully restores your HP, spell slots, and most class resources. Reduces one level of exhaustion. The most complete recovery option.",
  shortRest: "At least 1 hour of downtime. You can spend hit dice to recover HP (roll each + CON modifier). Some class abilities also recover: Warlock spell slots, Fighter's Action Surge, Monk's Ki points, and more.",

  // === CHARACTER BUILDING ===
  asi: "At certain levels (4, 8, 12, 16, 19 for most classes), you can increase one ability score by 2, or two ability scores by 1 each — or take a feat instead. Fighters and Rogues get extra ASI levels.",
  feat: "An optional special ability you can take instead of an Ability Score Improvement. Examples: Lucky (reroll dice 3 times per day), War Caster (better concentration saves), Great Weapon Master (+10 damage at -5 to hit).",
  background: "Your character's life before adventuring. Grants two skill proficiencies, tool proficiencies or languages, starting equipment, and a roleplaying feature. Examples: Acolyte, Criminal, Noble, Soldier.",
  alignment: "A description of your character's moral outlook. Two axes: Lawful/Neutral/Chaotic (how much you respect rules) and Good/Neutral/Evil (how much you care about others). Mostly flavor — doesn't directly affect mechanics.",

  // === INVENTORY ===
  encumbrance: "How much gear you can carry. Your carrying capacity is Strength score × 15 lbs. Carrying more than STR × 5 lbs makes you Encumbered (speed -10 ft). More than STR × 10 lbs is Heavily Encumbered (speed -20 ft, disadvantage on physical checks).",
  attunement: "Some magical items require attunement — a special bond formed during a short rest. You can only be attuned to 3 items at once. If you try to attune a 4th, you must break attunement with one first.",
  currency: "D&D uses five coin types. From least to most valuable: Copper (CP), Silver (SP), Electrum (EP), Gold (GP), Platinum (PP). Conversion: 10 CP = 1 SP \u00b7 2 SP = 1 EP (Electrum is rarely used) \u00b7 10 SP = 1 GP \u00b7 10 GP = 1 PP. Most adventurers deal in GP and SP.",

  // === DICE ===
  diceBasics: "D&D uses polyhedral dice. The number after 'd' is how many sides: d4 (pyramid), d6 (cube), d8, d10, d12, d20 (the main one), d100 (percentile). '2d6+3' means roll two six-sided dice and add 3 to the total.",
};

// Glossary entries for the Rules Reference section
export const GLOSSARY = [
  // Ability Scores
  { term: "Ability Score", definition: "The six core stats (STR, DEX, CON, INT, WIS, CHA) that define your character's basic capabilities. Each ranges from 1 to 30, with 10 being average for a commoner.", category: "Abilities" },
  { term: "Modifier", definition: "The number derived from an ability score that's actually added to dice rolls. Formula: (score - 10) ÷ 2, rounded down. A score of 14 gives a +2 modifier.", category: "Abilities" },
  { term: "Proficiency Bonus", definition: "A bonus that increases as you level up (+2 at level 1, up to +6 at level 17). Added to attacks, saves, and skills you're proficient in.", category: "Abilities" },

  // Combat
  { term: "Armor Class (AC)", definition: "How hard you are to hit. An attacker rolls d20 + their attack bonus. If it meets or exceeds your AC, they hit. Unarmored AC = 10 + DEX modifier.", category: "Combat" },
  { term: "Initiative", definition: "Determines turn order at the start of combat. Roll d20 + DEX modifier. Highest result goes first.", category: "Combat" },
  { term: "Attack Roll", definition: "Roll d20 + attack bonus (ability modifier + proficiency if proficient). Must meet or exceed the target's AC to hit.", category: "Combat" },
  { term: "Damage Roll", definition: "After hitting, roll the weapon's or spell's damage dice and add the relevant modifier. For melee weapons, add STR modifier. For finesse weapons, use STR or DEX.", category: "Combat" },
  { term: "Advantage", definition: "Roll two d20s and take the higher result. Gained from favorable circumstances, certain abilities, or allies using the Help action.", category: "Combat" },
  { term: "Disadvantage", definition: "Roll two d20s and take the lower result. Caused by unfavorable conditions like being blinded, restrained, or attacking at long range.", category: "Combat" },
  { term: "Opportunity Attack", definition: "When an enemy moves out of your melee reach without using the Disengage action, you can use your reaction to make one melee attack against them.", category: "Combat" },
  { term: "Critical Hit", definition: "Rolling a natural 20 on an attack roll. Always hits regardless of AC, and you roll all damage dice twice.", category: "Combat" },
  { term: "Action", definition: "Your main activity each turn: Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, or Use an Object.", category: "Combat" },
  { term: "Bonus Action", definition: "A quick extra action available only if a feature or spell grants one. One per turn. Examples: offhand attack, some spells like Healing Word.", category: "Combat" },
  { term: "Reaction", definition: "An instant response triggered by a specific event. One per round. Examples: opportunity attacks, Shield spell, Counterspell.", category: "Combat" },

  // Spellcasting
  { term: "Spell Slot", definition: "A limited resource used to cast spells of 1st level or higher. When you cast a spell, you expend a slot of that level or higher. Recovered on a long rest (or short rest for Warlocks).", category: "Spellcasting" },
  { term: "Cantrip", definition: "A spell you can cast at will, without using a spell slot. Cantrips are always available and scale in power as you level up.", category: "Spellcasting" },
  { term: "Spell Save DC", definition: "The difficulty target enemies must beat to resist your spells. Formula: 8 + proficiency bonus + spellcasting ability modifier.", category: "Spellcasting" },
  { term: "Spell Attack Bonus", definition: "Added to d20 when casting a spell that requires an attack roll. Formula: proficiency bonus + spellcasting ability modifier.", category: "Spellcasting" },
  { term: "Concentration", definition: "Some spells require ongoing focus. Only one concentration spell at a time. Taking damage forces a CON save (DC 10 or half damage, whichever is higher) to maintain it.", category: "Spellcasting" },
  { term: "Prepared Spells", definition: "Wizards, Clerics, Druids, and Paladins choose which spells to have ready after a long rest. You can only cast spells you've prepared (plus cantrips).", category: "Spellcasting" },
  { term: "Ritual Casting", definition: "Casting a spell with the ritual tag takes 10 extra minutes but costs no spell slot. Not all classes can ritual cast.", category: "Spellcasting" },
  { term: "Pact Magic", definition: "Warlock-specific spellcasting. Fewer slots but all the same level, and they recover on a short rest instead of a long rest.", category: "Spellcasting" },

  // Conditions
  { term: "Blinded", definition: "Cannot see. Automatically fails checks requiring sight. Attacks against you have advantage, your attacks have disadvantage.", category: "Conditions" },
  { term: "Charmed", definition: "Cannot attack or harm the charmer. The charmer has advantage on social checks against you.", category: "Conditions" },
  { term: "Frightened", definition: "Disadvantage on ability checks and attacks while the source of fear is visible. Cannot willingly move closer to the source.", category: "Conditions" },
  { term: "Grappled", definition: "Your speed becomes 0. Ends if the grappler is incapacitated or you're moved out of reach.", category: "Conditions" },
  { term: "Incapacitated", definition: "Cannot take actions or reactions. Severe — many other conditions include incapacitation.", category: "Conditions" },
  { term: "Invisible", definition: "Can't be seen without magic. Attacks against you have disadvantage, your attacks have advantage.", category: "Conditions" },
  { term: "Paralyzed", definition: "Incapacitated, can't move or speak. Auto-fail STR/DEX saves. Attacks have advantage, melee hits are auto-crits.", category: "Conditions" },
  { term: "Petrified", definition: "Turned to stone. Incapacitated, resistance to all damage, immune to poison and disease.", category: "Conditions" },
  { term: "Poisoned", definition: "Disadvantage on attack rolls and ability checks.", category: "Conditions" },
  { term: "Prone", definition: "On the ground. Melee attacks against you have advantage, ranged have disadvantage. Standing costs half your movement.", category: "Conditions" },
  { term: "Restrained", definition: "Speed 0. Attacks against you have advantage. Your attacks and DEX saves have disadvantage.", category: "Conditions" },
  { term: "Stunned", definition: "Incapacitated, can't move, can barely speak. Auto-fail STR/DEX saves. Attacks against you have advantage.", category: "Conditions" },
  { term: "Unconscious", definition: "Incapacitated, can't move or speak. Drop held items, fall prone. Auto-fail STR/DEX saves. Melee hits are auto-crits.", category: "Conditions" },
  { term: "Exhaustion", definition: "Six cumulative levels. Level 1: disadvantage on checks. Level 2: speed halved. Level 3: disadvantage on attacks/saves. Level 4: HP max halved. Level 5: speed 0. Level 6: death. One level removed per long rest.", category: "Conditions" },

  // Resting
  { term: "Long Rest", definition: "8 hours of rest. Restores all HP, spell slots, most class resources, and reduces exhaustion by 1 level. You recover half your total hit dice (rounded up).", category: "Resting" },
  { term: "Short Rest", definition: "1 hour of downtime. Spend hit dice to heal (roll + CON modifier per die). Warlock slots, Fighter's Action Surge/Second Wind, Monk's Ki, and some other features also recover.", category: "Resting" },
  { term: "Hit Dice", definition: "Dice used to heal during short rests. One per level, sized by class (d6–d12). Roll + CON modifier to recover HP. Half are restored on a long rest.", category: "Resting" },

  // Equipment
  { term: "Attunement", definition: "Some magic items require a short rest to bond with. You can attune to at most 3 items simultaneously.", category: "Equipment" },
  { term: "Encumbrance", definition: "Carrying capacity = STR × 15 lbs. Over STR × 5: encumbered (speed -10). Over STR × 10: heavily encumbered (speed -20, disadvantage on physical checks).", category: "Equipment" },
  { term: "Currency", definition: "Five coin types. 10 CP = 1 SP. 10 SP = 1 GP. 10 GP = 1 PP. Electrum (EP) = 5 SP = \u00bd GP (rarely used in practice). Standard prices are in GP. A commoner earns about 2 SP/day. A skilled artisan earns about 1 GP/day.", category: "Equipment" },

  // Character Building
  { term: "Ability Score Improvement (ASI)", definition: "At levels 4, 8, 12, 16, and 19 (most classes), increase one ability by 2 or two abilities by 1. Alternatively, take a feat instead.", category: "Character" },
  { term: "Feat", definition: "A special ability chosen instead of an ASI. Feats grant unique combat options, stat bonuses, or other benefits. Examples: Lucky, Sharpshooter, War Caster.", category: "Character" },
  { term: "Background", definition: "Your character's pre-adventure life. Grants 2 skill proficiencies, tool/language proficiencies, equipment, and a feature.", category: "Character" },
  { term: "Alignment", definition: "Moral compass on two axes: Law vs Chaos and Good vs Evil. Nine options from Lawful Good to Chaotic Evil. Mostly roleplay flavor.", category: "Character" },
  { term: "Multiclassing", definition: "Taking levels in more than one class. Requires meeting ability score prerequisites. Spell slots combine using a special table.", category: "Character" },
  { term: "Death Saving Throws", definition: "When at 0 HP, roll d20 each turn. 10+ = success, 9- = failure. 3 successes = stable, 3 failures = death. Nat 20 = regain 1 HP. Nat 1 = 2 failures.", category: "Character" },
  { term: "Inspiration", definition: "A reward from the DM for roleplaying well. Spend to gain advantage on one roll. You either have it or you don't.", category: "Character" },
];

// Action Economy quick reference for Combat section
export const ACTION_ECONOMY = {
  title: "What Can I Do On My Turn?",
  sections: [
    {
      label: "On Your Turn",
      items: [
        "1 Action — Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object",
        "1 Bonus Action — Only if a feature or spell grants one (e.g., offhand attack, Healing Word)",
        "Movement — Up to your speed in feet. Can split before and after your action",
        "1 Free Object Interaction — Draw/sheathe a weapon, open a door, pick up an item",
      ],
    },
    {
      label: "Off Your Turn",
      items: [
        "1 Reaction — Triggered by specific events (opportunity attack, Shield spell, Counterspell). Recharges at the start of your next turn",
      ],
    },
  ],
};
