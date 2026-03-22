// D&D 5e 2014 PHB Class Features by Level
// Base class features only — subclass-specific features shown as generic prompts

export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 12, 16, 19],
};

export const CLASS_FEATURES = {
  Barbarian: {
    1: [
      { name: 'Rage', description: 'Bonus action to rage: advantage on STR checks/saves, bonus rage damage (+2), resistance to bludgeoning/piercing/slashing. Uses: 2/long rest at level 1, scaling to unlimited at level 20. Duration: 1 minute.' },
      { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + CON mod when not wearing armor.' },
    ],
    2: [
      { name: 'Reckless Attack', description: 'Advantage on melee STR attack rolls this turn; attacks against you have advantage until next turn.' },
      { name: 'Danger Sense', description: 'Advantage on DEX saving throws against effects you can see.' },
    ],
    3: [
      { name: 'Primal Path', description: 'Choose your subclass archetype.' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Fast Movement', description: '+10 ft speed while not wearing heavy armor.' },
    ],
    7: [
      { name: 'Feral Instinct', description: 'Advantage on initiative. Act normally on first turn if surprised and you rage.' },
    ],
    9: [
      { name: 'Brutal Critical', description: 'Roll one additional damage die on a critical hit with a melee attack.' },
    ],
    11: [
      { name: 'Relentless Rage', description: 'If you drop to 0 HP while raging, DC 10 CON save to drop to 1 HP instead. DC increases by 5 each time.' },
    ],
    13: [
      { name: 'Brutal Critical (2)', description: 'Roll two additional damage dice on a critical hit.' },
    ],
    15: [
      { name: 'Persistent Rage', description: 'Rage only ends early if you fall unconscious or choose to end it.' },
    ],
    17: [
      { name: 'Brutal Critical (3)', description: 'Roll three additional damage dice on a critical hit.' },
    ],
    18: [
      { name: 'Indomitable Might', description: 'If your STR check total is less than your STR score, use your STR score instead.' },
    ],
    20: [
      { name: 'Primal Champion', description: '+4 STR and +4 CON (maximum 24 for both).' },
    ],
  },

  Bard: {
    1: [
      { name: 'Spellcasting', description: 'Cast bard spells using CHA as your spellcasting ability.' },
      { name: 'Bardic Inspiration (d6)', description: 'Bonus action to give an ally an inspiration die to add to one ability check, attack roll, or saving throw.' },
    ],
    2: [
      { name: 'Jack of All Trades', description: 'Add half your proficiency bonus to any ability check that doesn\'t already include your proficiency bonus.' },
      { name: 'Song of Rest (d6)', description: 'Allies who hear your song during a short rest regain an extra 1d6 HP when spending hit dice.' },
    ],
    3: [
      { name: 'Bard College', description: 'Choose your subclass archetype.' },
      { name: 'Expertise', description: 'Double proficiency bonus for two skill proficiencies.' },
    ],
    5: [
      { name: 'Bardic Inspiration (d8)', description: 'Inspiration die increases to d8.' },
      { name: 'Font of Inspiration', description: 'Regain all Bardic Inspiration uses on a short or long rest.' },
    ],
    6: [
      { name: 'Countercharm', description: 'Action to give advantage on saves against being frightened or charmed to allies within 30 ft.' },
    ],
    9: [
      { name: 'Song of Rest (d8)', description: 'Song of Rest die increases to d8.' },
    ],
    10: [
      { name: 'Bardic Inspiration (d10)', description: 'Inspiration die increases to d10.' },
      { name: 'Expertise', description: 'Double proficiency bonus for two more skill proficiencies.' },
      { name: 'Magical Secrets', description: 'Learn two spells from any class\'s spell list.' },
    ],
    13: [
      { name: 'Song of Rest (d10)', description: 'Song of Rest die increases to d10.' },
    ],
    14: [
      { name: 'Magical Secrets', description: 'Learn two more spells from any class\'s spell list.' },
    ],
    15: [
      { name: 'Bardic Inspiration (d12)', description: 'Inspiration die increases to d12.' },
    ],
    17: [
      { name: 'Song of Rest (d12)', description: 'Song of Rest die increases to d12.' },
    ],
    18: [
      { name: 'Magical Secrets', description: 'Learn two more spells from any class\'s spell list.' },
    ],
    20: [
      { name: 'Superior Inspiration', description: 'Regain one Bardic Inspiration use when you roll initiative and have none remaining.' },
    ],
  },

  Cleric: {
    1: [
      { name: 'Spellcasting', description: 'Cast cleric spells using WIS as your spellcasting ability.' },
      { name: 'Divine Domain', description: 'Choose your subclass domain, gaining domain spells and features.' },
    ],
    2: [
      { name: 'Channel Divinity (1/rest)', description: 'Use Channel Divinity: Turn Undead, plus your domain option. Once per short/long rest.' },
    ],
    5: [
      { name: 'Destroy Undead (CR 1/2)', description: 'Undead of CR 1/2 or lower are instantly destroyed by Turn Undead.' },
    ],
    6: [
      { name: 'Channel Divinity (2/rest)', description: 'Use Channel Divinity twice between rests.' },
    ],
    8: [
      { name: 'Destroy Undead (CR 1)', description: 'Destroy Undead affects CR 1 or lower.' },
    ],
    10: [
      { name: 'Divine Intervention', description: 'Call on your deity for aid. Roll percentile dice; if ≤ your cleric level, the deity intervenes.' },
    ],
    11: [
      { name: 'Destroy Undead (CR 2)', description: 'Destroy Undead affects CR 2 or lower.' },
    ],
    14: [
      { name: 'Destroy Undead (CR 3)', description: 'Destroy Undead affects CR 3 or lower.' },
    ],
    17: [
      { name: 'Destroy Undead (CR 4)', description: 'Destroy Undead affects CR 4 or lower.' },
    ],
    18: [
      { name: 'Channel Divinity (3/rest)', description: 'Use Channel Divinity three times between rests.' },
    ],
    20: [
      { name: 'Divine Intervention Improved', description: 'Divine Intervention automatically succeeds.' },
    ],
  },

  Druid: {
    1: [
      { name: 'Spellcasting', description: 'Cast druid spells using WIS as your spellcasting ability.' },
      { name: 'Druidic', description: 'You know Druidic, the secret language of druids.' },
    ],
    2: [
      { name: 'Wild Shape', description: 'Magically transform into a beast you have seen. Twice per short/long rest.' },
      { name: 'Druid Circle', description: 'Choose your subclass archetype.' },
    ],
    4: [
      { name: 'Wild Shape Improvement', description: 'Transform into beasts up to CR 1/2 (no flying speed).' },
    ],
    8: [
      { name: 'Wild Shape Improvement', description: 'Transform into beasts up to CR 1 (with flying speed).' },
    ],
    18: [
      { name: 'Timeless Body', description: 'Age 10x slower. No frailty from old age.' },
      { name: 'Beast Spells', description: 'Cast spells while in Wild Shape (no material components with a cost).' },
    ],
    20: [
      { name: 'Archdruid', description: 'Use Wild Shape unlimited times. Ignore V and S components of druid spells.' },
    ],
  },

  Fighter: {
    1: [
      { name: 'Fighting Style', description: 'Choose a fighting style: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.' },
      { name: 'Second Wind', description: 'Bonus action to regain 1d10 + fighter level HP. Once per short/long rest.' },
    ],
    2: [
      { name: 'Action Surge', description: 'Take one additional action on your turn. Once per short/long rest.' },
    ],
    3: [
      { name: 'Martial Archetype', description: 'Choose your subclass archetype.' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
    ],
    9: [
      { name: 'Indomitable (1 use)', description: 'Reroll a failed saving throw. Once per long rest.' },
    ],
    11: [
      { name: 'Extra Attack (2)', description: 'Attack three times when you take the Attack action.' },
    ],
    13: [
      { name: 'Indomitable (2 uses)', description: 'Reroll a failed saving throw twice per long rest.' },
    ],
    17: [
      { name: 'Action Surge (2 uses)', description: 'Use Action Surge twice per short/long rest (not on the same turn).' },
      { name: 'Indomitable (3 uses)', description: 'Reroll a failed saving throw three times per long rest.' },
    ],
    20: [
      { name: 'Extra Attack (3)', description: 'Attack four times when you take the Attack action.' },
    ],
  },

  Monk: {
    1: [
      { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + WIS mod when not wearing armor or wielding a shield.' },
      { name: 'Martial Arts', description: 'Use DEX for unarmed/monk weapon attacks. Unarmed strike deals 1d4. Bonus action unarmed strike after attacking.' },
    ],
    2: [
      { name: 'Ki', description: 'Gain ki points equal to your monk level. Spend to fuel Flurry of Blows, Patient Defense, and Step of the Wind.', uses_total: 2, recharge: 'short_rest', scales_with_level: true },
      { name: 'Unarmored Movement', description: '+10 ft speed while not wearing armor or wielding a shield.' },
    ],
    3: [
      { name: 'Monastic Tradition', description: 'Choose your subclass archetype.' },
      { name: 'Deflect Missiles', description: 'Use reaction to reduce ranged weapon attack damage by 1d10 + DEX mod + monk level.' },
    ],
    4: [
      { name: 'Slow Fall', description: 'Use reaction to reduce falling damage by 5x your monk level.' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Stunning Strike', description: 'Spend 1 ki when you hit to force a CON save or be stunned until end of your next turn.' },
      { name: 'Martial Arts (d6)', description: 'Martial Arts die increases to d6.' },
    ],
    6: [
      { name: 'Ki-Empowered Strikes', description: 'Unarmed strikes count as magical for overcoming resistance and immunity.' },
      { name: 'Unarmored Movement (+15 ft)', description: 'Speed bonus increases to +15 ft.' },
    ],
    7: [
      { name: 'Evasion', description: 'DEX save for half damage: take no damage on success, half on failure.' },
      { name: 'Stillness of Mind', description: 'Action to end one charmed or frightened effect on yourself.' },
    ],
    9: [
      { name: 'Unarmored Movement Improvement', description: 'You can move along vertical surfaces and across liquids without falling.' },
    ],
    10: [
      { name: 'Purity of Body', description: 'Immune to disease and poison.' },
      { name: 'Unarmored Movement (+20 ft)', description: 'Speed bonus increases to +20 ft.' },
    ],
    11: [
      { name: 'Martial Arts (d8)', description: 'Martial Arts die increases to d8.' },
    ],
    13: [
      { name: 'Tongue of the Sun and Moon', description: 'You can understand all spoken languages and be understood by any creature that speaks a language.' },
    ],
    14: [
      { name: 'Diamond Soul', description: 'Proficiency in all saving throws. Spend 1 ki to reroll a failed save.' },
      { name: 'Unarmored Movement (+25 ft)', description: 'Speed bonus increases to +25 ft.' },
    ],
    15: [
      { name: 'Timeless Body', description: 'No frailty from old age. Cannot be aged magically. No need for food or water.' },
    ],
    17: [
      { name: 'Martial Arts (d10)', description: 'Martial Arts die increases to d10.' },
    ],
    18: [
      { name: 'Empty Body', description: 'Spend 4 ki to become invisible for 1 minute (advantage on attacks, attacks against you have disadvantage). Spend 8 ki to cast Astral Projection.' },
      { name: 'Unarmored Movement (+30 ft)', description: 'Speed bonus increases to +30 ft.' },
    ],
    20: [
      { name: 'Perfect Self', description: 'Regain 4 ki points when you roll initiative and have none remaining.' },
    ],
  },

  Paladin: {
    1: [
      { name: 'Divine Sense', description: 'Detect celestials, fiends, and undead within 60 ft. Uses: 1 + CHA mod per long rest.' },
      { name: 'Lay on Hands', description: 'Pool of healing equal to paladin level x 5. Touch to restore HP or cure disease/poison (5 HP per effect).' },
    ],
    2: [
      { name: 'Fighting Style', description: 'Choose a fighting style: Defense, Dueling, Great Weapon Fighting, or Protection.' },
      { name: 'Spellcasting', description: 'Cast paladin spells using CHA as your spellcasting ability.' },
      { name: 'Divine Smite', description: 'Expend a spell slot on a hit to deal 2d8 extra radiant damage (+1d8 per slot level above 1st, +1d8 vs undead/fiend).' },
    ],
    3: [
      { name: 'Sacred Oath', description: 'Choose your subclass oath, gaining oath spells and Channel Divinity options.' },
      { name: 'Divine Health', description: 'Immune to disease.' },
      { name: 'Channel Divinity (1/rest)', description: 'Use your oath\'s Channel Divinity option once per short or long rest.' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
    ],
    6: [
      { name: 'Aura of Protection', description: 'You and friendly creatures within 10 ft add your CHA mod to saving throws.' },
    ],
    10: [
      { name: 'Aura of Courage', description: 'You and friendly creatures within 10 ft cannot be frightened while you are conscious.' },
    ],
    11: [
      { name: 'Improved Divine Smite', description: 'All melee weapon attacks deal an extra 1d8 radiant damage.' },
    ],
    14: [
      { name: 'Cleansing Touch', description: 'Action to end one spell on yourself or a willing creature. Uses: CHA mod per long rest.' },
    ],
    18: [
      { name: 'Aura Improvements', description: 'Aura of Protection and Aura of Courage range increases to 30 ft.' },
    ],
    20: [
      { name: 'Sacred Oath Capstone', description: 'Your oath grants its ultimate feature.' },
    ],
  },

  Ranger: {
    1: [
      { name: 'Favored Enemy', description: 'Choose a favored enemy type. Advantage on Survival checks to track them and INT checks to recall info about them.' },
      { name: 'Natural Explorer', description: 'Choose a favored terrain. Gain exploration benefits in that terrain.' },
    ],
    2: [
      { name: 'Fighting Style', description: 'Choose a fighting style: Archery, Defense, Dueling, or Two-Weapon Fighting.' },
      { name: 'Spellcasting', description: 'Cast ranger spells using WIS as your spellcasting ability.' },
    ],
    3: [
      { name: 'Ranger Archetype', description: 'Choose your subclass archetype.' },
      { name: 'Primeval Awareness', description: 'Spend a spell slot to sense aberrations, celestials, dragons, elementals, fey, fiends, and undead within 1 mile (6 miles in favored terrain).' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
    ],
    6: [
      { name: 'Favored Enemy Improvement', description: 'Choose an additional favored enemy type.' },
      { name: 'Natural Explorer Improvement', description: 'Choose an additional favored terrain.' },
    ],
    8: [
      { name: 'Land\'s Stride', description: 'Moving through nonmagical difficult terrain costs no extra movement. Pass through nonmagical plants without being slowed or damaged.' },
    ],
    10: [
      { name: 'Hide in Plain Sight', description: 'Spend 1 minute to camouflage yourself. Gain +10 to Stealth checks while motionless against a solid surface.' },
      { name: 'Natural Explorer Improvement', description: 'Choose an additional favored terrain.' },
    ],
    14: [
      { name: 'Vanish', description: 'Hide as a bonus action. Cannot be tracked by nonmagical means unless you choose to leave a trail.' },
      { name: 'Favored Enemy Improvement', description: 'Choose an additional favored enemy type.' },
    ],
    18: [
      { name: 'Feral Senses', description: 'No disadvantage on attacks against creatures you can\'t see. Know location of invisible creatures within 30 ft.' },
    ],
    20: [
      { name: 'Foe Slayer', description: 'Once per turn, add WIS mod to attack or damage roll against a favored enemy.' },
    ],
  },

  Rogue: {
    1: [
      { name: 'Expertise', description: 'Double proficiency bonus for two skill proficiencies or one skill and thieves\' tools.' },
      { name: 'Sneak Attack (1d6)', description: 'Once per turn, deal extra damage when you have advantage or an ally is within 5 ft of the target.' },
      { name: 'Thieves\' Cant', description: 'You know thieves\' cant, a secret mix of dialect, jargon, and code.' },
    ],
    2: [
      { name: 'Cunning Action', description: 'Bonus action to Dash, Disengage, or Hide.' },
    ],
    3: [
      { name: 'Roguish Archetype', description: 'Choose your subclass archetype.' },
      { name: 'Sneak Attack (2d6)', description: 'Sneak Attack damage increases to 2d6.' },
    ],
    5: [
      { name: 'Uncanny Dodge', description: 'Use reaction to halve damage from an attack you can see.' },
      { name: 'Sneak Attack (3d6)', description: 'Sneak Attack damage increases to 3d6.' },
    ],
    6: [
      { name: 'Expertise', description: 'Double proficiency bonus for two more skill proficiencies.' },
    ],
    7: [
      { name: 'Evasion', description: 'DEX save for half damage: take no damage on success, half on failure.' },
      { name: 'Sneak Attack (4d6)', description: 'Sneak Attack damage increases to 4d6.' },
    ],
    9: [
      { name: 'Sneak Attack (5d6)', description: 'Sneak Attack damage increases to 5d6.' },
    ],
    11: [
      { name: 'Reliable Talent', description: 'Treat any d20 roll of 9 or lower as a 10 on ability checks using proficient skills.' },
      { name: 'Sneak Attack (6d6)', description: 'Sneak Attack damage increases to 6d6.' },
    ],
    13: [
      { name: 'Sneak Attack (7d6)', description: 'Sneak Attack damage increases to 7d6.' },
    ],
    14: [
      { name: 'Blindsense', description: 'If you can hear, you know the location of hidden or invisible creatures within 10 ft.' },
    ],
    15: [
      { name: 'Slippery Mind', description: 'Proficiency in WIS saving throws.' },
      { name: 'Sneak Attack (8d6)', description: 'Sneak Attack damage increases to 8d6.' },
    ],
    17: [
      { name: 'Sneak Attack (9d6)', description: 'Sneak Attack damage increases to 9d6.' },
    ],
    18: [
      { name: 'Elusive', description: 'No attack roll has advantage against you while you aren\'t incapacitated.' },
    ],
    19: [
      { name: 'Sneak Attack (10d6)', description: 'Sneak Attack damage increases to 10d6.' },
    ],
    20: [
      { name: 'Stroke of Luck', description: 'If you miss with an attack, treat the roll as a 20. Or turn a failed ability check into a 20. Once per short/long rest.' },
    ],
  },

  Sorcerer: {
    1: [
      { name: 'Spellcasting', description: 'Cast sorcerer spells using CHA as your spellcasting ability.' },
      { name: 'Sorcerous Origin', description: 'Choose your subclass origin, gaining origin features.' },
    ],
    2: [
      { name: 'Font of Magic', description: 'Gain sorcery points equal to your sorcerer level. Flexible Casting: spend 1 SP to create a 1st-level slot (2 SP for 2nd, 3 SP for 3rd, 5 SP for 4th, 7 SP for 5th). Or convert a spell slot to SP equal to its level.', uses_total: 2, recharge: 'long_rest', scales_with_level: true },
    ],
    3: [
      { name: 'Metamagic', description: 'Choose two Metamagic options to modify your spells (e.g., Twinned Spell, Quickened Spell).' },
    ],
    10: [
      { name: 'Metamagic', description: 'Choose one additional Metamagic option.' },
    ],
    17: [
      { name: 'Metamagic', description: 'Choose one additional Metamagic option.' },
    ],
    20: [
      { name: 'Sorcerous Restoration', description: 'Regain 4 sorcery points on a short rest.' },
    ],
  },

  Warlock: {
    1: [
      { name: 'Otherworldly Patron', description: 'Choose your subclass patron, gaining patron features and an expanded spell list.' },
      { name: 'Pact Magic', description: 'Cast warlock spells using CHA. Spell slots recover on a short rest.' },
    ],
    2: [
      { name: 'Eldritch Invocations', description: 'Choose two eldritch invocations to customize your abilities.' },
    ],
    3: [
      { name: 'Pact Boon', description: 'Choose Pact of the Chain (familiar), Pact of the Blade (weapon), or Pact of the Tome (cantrips).' },
    ],
    5: [
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 3).' },
    ],
    7: [
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 4).' },
    ],
    9: [
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 5).' },
    ],
    11: [
      { name: 'Mystic Arcanum (6th)', description: 'Choose a 6th-level warlock spell. Cast it once per long rest without a spell slot.' },
    ],
    12: [
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 6).' },
    ],
    13: [
      { name: 'Mystic Arcanum (7th)', description: 'Choose a 7th-level warlock spell. Cast it once per long rest without a spell slot.' },
    ],
    15: [
      { name: 'Mystic Arcanum (8th)', description: 'Choose an 8th-level warlock spell. Cast it once per long rest without a spell slot.' },
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 7).' },
    ],
    17: [
      { name: 'Mystic Arcanum (9th)', description: 'Choose a 9th-level warlock spell. Cast it once per long rest without a spell slot.' },
    ],
    18: [
      { name: 'Eldritch Invocations', description: 'Choose one additional invocation (total 8).' },
    ],
    20: [
      { name: 'Eldritch Master', description: 'Spend 1 minute entreating your patron to regain all Pact Magic spell slots. Once per long rest.' },
    ],
  },

  Wizard: {
    1: [
      { name: 'Spellcasting', description: 'Cast wizard spells using INT as your spellcasting ability. You have a spellbook.' },
      { name: 'Arcane Recovery', description: 'Once per day during a short rest, recover spell slots with a combined level ≤ half your wizard level (rounded up).' },
    ],
    2: [
      { name: 'Arcane Tradition', description: 'Choose your subclass school of magic.' },
    ],
    18: [
      { name: 'Spell Mastery', description: 'Choose a 1st-level and a 2nd-level wizard spell. Cast them at their lowest level without expending a spell slot.' },
    ],
    20: [
      { name: 'Signature Spells', description: 'Choose two 3rd-level wizard spells. Always have them prepared and cast each once at 3rd level without a spell slot. Regain expended uses on a short or long rest.' },
    ],
  },
};
