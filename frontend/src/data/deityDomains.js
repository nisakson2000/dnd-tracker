/**
 * Deity Domains — Cleric divine domain data, domain spells, and deity-domain connections.
 *
 * Roadmap items covered:
 *   - Cleric domain definitions (PHB + Xanathar's + Tasha's domains)
 *   - Deity-domain alignment tendencies
 *   - Domain bonus proficiencies
 *   - Helper functions for domain lookup and filtering
 *
 * All 14 domains: Arcana, Death, Forge, Grave, Knowledge, Life, Light,
 * Nature, Order, Peace, Tempest, Trickery, Twilight, War.
 *
 * No React. Pure data and utility functions.
 */

// ---------------------------------------------------------------------------
// CLERIC_DOMAINS
// ---------------------------------------------------------------------------

/**
 * Complete domain definitions for all 14 cleric subclass options.
 *
 * Fields per domain:
 *   id                  {string}   camelCase identifier
 *   name                {string}   display name
 *   source              {string}   rulebook abbreviation
 *   description         {string}   thematic overview
 *   domainSpells        {Object}   keys are cleric levels (1,3,5,7,9); values are 2-element string arrays
 *   channelDivinity     {Object}   { name, description } — feature gained at cleric level 2
 *   level8Feature       {Object}   { name, type, description } — Divine Strike or Potent Spellcasting
 *   capstone            {Object}   { name, description } — feature gained at cleric level 17
 */
export const CLERIC_DOMAINS = {
  arcana: {
    id: 'arcana',
    name: 'Arcana',
    source: "Sword Coast Adventurer's Guide",
    description:
      'Magic is an energy that suffuses the multiverse and that fuels both destruction and creation. Gods of the Arcana domain know the secrets and potential of magic intimately. Clerics of these deities excel in arcane spells and can manipulate the flow of magic itself.',
    domainSpells: {
      1: ['Detect Magic', 'Magic Missile'],
      3: ['Magic Weapon', 'Nystul\'s Magic Aura'],
      5: ['Dispel Magic', 'Magic Circle'],
      7: ['Arcane Eye', 'Leomund\'s Secret Chest'],
      9: ['Planar Binding', 'Teleportation Circle'],
    },
    channelDivinity: {
      name: 'Arcane Abjuration',
      description:
        'As an action, present your holy symbol and speak a prayer censuring celestials, elementals, fey, or fiends. Each such creature within 30 feet must make a Wisdom saving throw. On a failed save, a creature is turned for 1 minute or until it takes damage. At 5th level, you can also banish a turned creature of CR 1/2 or lower (CR 1 or lower at 8th level, CR 2 or lower at 11th level, CR 3 or lower at 14th level, CR 4 or lower at 17th level).',
    },
    level8Feature: {
      name: 'Potent Spellcasting',
      type: 'potentSpellcasting',
      description:
        'Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.',
    },
    capstone: {
      name: 'Arcane Mastery',
      description:
        'At 17th level, you choose four spells from the wizard spell list, one from each of the 6th, 7th, 8th, and 9th level categories. You add them to your list of domain spells. Like your other domain spells, they are always prepared and count as cleric spells for you.',
    },
  },

  death: {
    id: 'death',
    name: 'Death',
    source: 'Player\'s Handbook',
    description:
      'The Death domain is concerned with the forces that cause death, as well as the negative energy that gives rise to undead creatures. Deities such as Chemosh, Myrkul, and WeeJas are patrons of necromancers, death knights, liches, and vampires. Gods of the Death domain also embody murder, pain, disease or poison, and the underworld.',
    domainSpells: {
      1: ['False Life', 'Ray of Sickness'],
      3: ['Blindness/Deafness', 'Ray of Enfeeblement'],
      5: ['Animate Dead', 'Vampiric Touch'],
      7: ['Blight', 'Death Ward'],
      9: ['Antilife Shell', 'Cloudkill'],
    },
    channelDivinity: {
      name: 'Touch of Death',
      description:
        'When you hit a creature with a melee attack, you can use your Channel Divinity to deal extra necrotic damage to the target. The damage equals 5 + twice your cleric level.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with necrotic energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 necrotic damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Improved Reaper',
      description:
        'Starting at 17th level, when you cast a necromancy spell of 1st through 5th level that targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other. If the spell consumes its material components, you must provide them for each target.',
    },
  },

  forge: {
    id: 'forge',
    name: 'Forge',
    source: "Xanathar's Guide to Everything",
    description:
      'The gods of the forge are patrons of artisans who work with metal, from a humble blacksmith who keeps a village in horseshoes and plowshares to the mighty elf artisan who crafts heirloom blades. Priests of these deities search out lost mines and ancient forges, and they spellcast with a hammer and anvil nearby.',
    domainSpells: {
      1: ['Identify', 'Searing Smite'],
      3: ['Heat Metal', 'Magic Weapon'],
      5: ['Elemental Weapon', 'Protection from Energy'],
      7: ['Fabricate', 'Wall of Fire'],
      9: ['Animate Objects', 'Creation'],
    },
    channelDivinity: {
      name: 'Artisan\'s Blessing',
      description:
        'You conduct a 1-hour ritual that crafts a non-magical item that must include some metal: a simple or martial weapon, a suit of armor, ten pieces of ammunition, a set of tools, or another metal object. The creation can be worth no more than 100 gp. As part of this ritual, you must lay out metal, which can include coins, with a value equal to the creation. The metal irretrievably coalesces and transforms into the creation at the ritual\'s end, magically forming even non-metal parts of the creation.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with the fiery power of the forge. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Saint of Forge and Fire',
      description:
        'Starting at 17th level, your blessed affinity with fire and metal becomes more powerful. You gain immunity to fire damage. While wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.',
    },
  },

  grave: {
    id: 'grave',
    name: 'Grave',
    source: "Xanathar's Guide to Everything",
    description:
      'Gods of the grave watch over the line between life and death. To these deities, death and the afterlife are a foundational part of the multiverse\'s workings. Followers of these deities seek to put restless spirits to rest, destroy the undead, and ease the suffering of the dying.',
    domainSpells: {
      1: ['Bane', 'False Life'],
      3: ['Gentle Repose', 'Ray of Enfeeblement'],
      5: ['Revivify', 'Vampiric Touch'],
      7: ['Blight', 'Death Ward'],
      9: ['Antilife Shell', 'Raise Dead'],
    },
    channelDivinity: {
      name: 'Path to the Grave',
      description:
        'As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack\'s damage, and then the curse ends.',
    },
    level8Feature: {
      name: 'Potent Spellcasting',
      type: 'potentSpellcasting',
      description:
        'Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.',
    },
    capstone: {
      name: 'Keeper of Souls',
      description:
        'Starting at 17th level, you can seize a trace of vitality from a parting soul and use it to heal the living. When an enemy you can see dies within 60 feet of you, you or one creature of your choice that is within 60 feet of you regains hit points equal to the enemy\'s number of Hit Dice. You can use this feature only if you aren\'t incapacitated. Once you use it, you can\'t do so again until the start of your next turn.',
    },
  },

  knowledge: {
    id: 'knowledge',
    name: 'Knowledge',
    source: 'Player\'s Handbook',
    description:
      'The gods of knowledge — including Oghma, Boccob, Gilean, Aureon, and Thoth — value learning and understanding above all. Some teach that knowledge is to be gathered and shared in libraries and universities, or promote the practical knowledge of craft and invention. Some deities hoard knowledge and keep its secrets to themselves.',
    domainSpells: {
      1: ['Command', 'Identify'],
      3: ['Augury', 'Suggestion'],
      5: ['Nondetection', 'Speak with Dead'],
      7: ['Arcane Eye', 'Confusion'],
      9: ['Legend Lore', 'Scrying'],
    },
    channelDivinity: {
      name: 'Knowledge of the Ages',
      description:
        'As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.',
    },
    level8Feature: {
      name: 'Potent Spellcasting',
      type: 'potentSpellcasting',
      description:
        'Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.',
    },
    capstone: {
      name: 'Visions of the Past',
      description:
        'Starting at 17th level, you can call up visions of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell.',
    },
  },

  life: {
    id: 'life',
    name: 'Life',
    source: 'Player\'s Handbook',
    description:
      'The Life domain focuses on the vibrant positive energy — one of the fundamental forces of the universe — that sustains all life. The gods of life promote vitality and health through healing the sick and wounded, caring for those in need, and driving away the forces of death and undeath.',
    domainSpells: {
      1: ['Bless', 'Cure Wounds'],
      3: ['Lesser Restoration', 'Spiritual Weapon'],
      5: ['Beacon of Hope', 'Revivify'],
      7: ['Death Ward', 'Guardian of Faith'],
      9: ['Mass Cure Wounds', 'Raise Dead'],
    },
    channelDivinity: {
      name: 'Preserve Life',
      description:
        'As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can\'t use this feature on an undead or a construct.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Supreme Healing',
      description:
        'Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.',
    },
  },

  light: {
    id: 'light',
    name: 'Light',
    source: 'Player\'s Handbook',
    description:
      'Gods of light — including Helm, Lathander, Pholtus, Branchala, the Silver Flame, Belenus, Apollo, and Re-Horakhty — promote the ideals of rebirth and renewal, truth, vigilance, and beauty, often using the metaphor of light. Some of these deities are patrons of the sun or the moon, or are deities of prophecy and revelation.',
    domainSpells: {
      1: ['Burning Hands', 'Faerie Fire'],
      3: ['Flaming Sphere', 'Scorching Ray'],
      5: ['Daylight', 'Fireball'],
      7: ['Guardian of Faith', 'Wall of Fire'],
      9: ['Flame Strike', 'Scrying'],
    },
    channelDivinity: {
      name: 'Radiance of the Dawn',
      description:
        'As an action, you present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected.',
    },
    level8Feature: {
      name: 'Potent Spellcasting',
      type: 'potentSpellcasting',
      description:
        'Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.',
    },
    capstone: {
      name: 'Corona of Light',
      description:
        'Starting at 17th level, you can use your action to activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage.',
    },
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    source: 'Player\'s Handbook',
    description:
      'Gods of nature are as varied as the natural world itself, from inscrutable gods of the deep forests to friendly deities associated with particular springs and groves. Druids revere nature as a whole and might serve one of these deities, practicing mysterious rites and reciting all-but-forgotten sacral poetry in their own secret tongue.',
    domainSpells: {
      1: ['Animal Friendship', 'Speak with Animals'],
      3: ['Barkskin', 'Spike Growth'],
      5: ['Plant Growth', 'Wind Wall'],
      7: ['Dominate Beast', 'Grasping Vine'],
      9: ['Insect Plague', 'Tree Stride'],
    },
    channelDivinity: {
      name: 'Charm Animals and Plants',
      description:
        'As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice). When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Master of Nature',
      description:
        'Starting at 17th level, you gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.',
    },
  },

  order: {
    id: 'order',
    name: 'Order',
    source: "Tasha's Cauldron of Everything",
    description:
      'The Order domain represents discipline, obedience, and society. On many worlds, these ideals are associated with the rule of law, the justice of courts, and the power of organized religion. Gods of order hold sway over judges, monarchs, merchants, and anyone who relies on a system of established precedent.',
    domainSpells: {
      1: ['Command', 'Heroism'],
      3: ['Hold Person', 'Zone of Truth'],
      5: ['Mass Healing Word', 'Slow'],
      7: ['Compulsion', 'Locate Creature'],
      9: ['Commune', 'Dominate Person'],
    },
    channelDivinity: {
      name: 'Order\'s Demand',
      description:
        'As an action, you present your holy symbol, and each creature of your choice that can see or hear you within 30 feet of you must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn or until the charmed creature takes any damage. You can also cause any of the charmed creatures to drop what they are holding when they fail the saving throw.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 psychic damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Order\'s Wrath',
      description:
        'Starting at 17th level, enemies you designate for destruction wilt under the combined efforts of you and your allies. If you deal your Divine Strike damage to a creature on your turn, you can curse that creature until the start of your next turn. The next time one of your allies hits the cursed creature with an attack, the target also takes 2d8 psychic damage, and the curse ends. You can curse a creature in this way only once per turn.',
    },
  },

  peace: {
    id: 'peace',
    name: 'Peace',
    source: "Tasha's Cauldron of Everything",
    description:
      'The balm of peace thrives at the heart of healthy communities, between friendly nations, and in the souls of the kindhearted. The gods of peace inspire people of all sorts to resolve conflict and to stand up against those forces that try to prevent peace from flourishing.',
    domainSpells: {
      1: ['Heroism', 'Sanctuary'],
      3: ['Aid', 'Warding Bond'],
      5: ['Beacon of Hope', 'Sending'],
      7: ['Aura of Purity', 'Otiluke\'s Resilient Sphere'],
      9: ['Greater Restoration', 'Rary\'s Telepathic Bond'],
    },
    channelDivinity: {
      name: 'Balm of Peace',
      description:
        'As an action, you move up to your speed, without provoking opportunity attacks, and when you move within 5 feet of any other creature during this action, you can restore a number of hit points to that creature equal to 2d6 + your Wisdom modifier (minimum of 1 hit point). A creature can receive this healing only once whenever you take this action.',
    },
    level8Feature: {
      name: 'Potent Spellcasting',
      type: 'potentSpellcasting',
      description:
        'Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.',
    },
    capstone: {
      name: 'Expansive Bond',
      description:
        'Starting at 17th level, the protection of your Emboldening Bond and Protective Bond features now works when the two bonded creatures are up to 60 feet apart (from the 30-foot range established at level 6). Moreover, when a creature uses Protective Bond to take someone else\'s damage, the creature has resistance to that damage.',
    },
  },

  tempest: {
    id: 'tempest',
    name: 'Tempest',
    source: 'Player\'s Handbook',
    description:
      'Gods whose portfolios include the Tempest domain — including Talos, Umberlee, Kord, Zeboim, the Devourer, Zeus, and Thor — govern storms, sea, and sky. They include gods of lightning and thunder, gods of earthquakes, some fire gods, and gods of violence, physical strength, and courage.',
    domainSpells: {
      1: ['Fog Cloud', 'Thunderwave'],
      3: ['Gust of Wind', 'Shatter'],
      5: ['Call Lightning', 'Sleet Storm'],
      7: ['Control Water', 'Ice Storm'],
      9: ['Destructive Wave', 'Insect Plague'],
    },
    channelDivinity: {
      name: 'Destructive Wrath',
      description:
        'When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 thunder damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Stormborn',
      description:
        'At 17th level, you have a flying speed equal to your current walking speed whenever you are not underground or indoors.',
    },
  },

  trickery: {
    id: 'trickery',
    name: 'Trickery',
    source: 'Player\'s Handbook',
    description:
      'Gods of trickery — such as Tymora, Beshaba, Olidammara, the Traveler, Garl Glittergold, and Loki — are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals. They\'re patrons of thieves, scoundrels, gamblers, rebels, and liberators.',
    domainSpells: {
      1: ['Charm Person', 'Disguise Self'],
      3: ['Mirror Image', 'Pass without Trace'],
      5: ['Blink', 'Dispel Magic'],
      7: ['Dimension Door', 'Polymorph'],
      9: ['Dominate Person', 'Modify Memory'],
    },
    channelDivinity: {
      name: 'Invoke Duplicity',
      description:
        'As an action, you create a perfect illusory duplicate of yourself in a space you can see within 30 feet of you. The illusion lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you. For the duration, you can cast spells as though you were in the illusion\'s space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with poison — a gift from your deity. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 poison damage. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Improved Duplicity',
      description:
        'At 17th level, you can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.',
    },
  },

  twilight: {
    id: 'twilight',
    name: 'Twilight',
    source: "Tasha's Cauldron of Everything",
    description:
      'The twilight domain governs the transition and liminal space between light and darkness. The gods of twilight are guardians of those who must pass through dangerous times and places. They stand watch at the boundary of day and night, the boundary of the mortal world and the afterlife.',
    domainSpells: {
      1: ['Faerie Fire', 'Sleep'],
      3: ['Moonbeam', 'See Invisibility'],
      5: ['Aura of Vitality', 'Leomund\'s Tiny Hut'],
      7: ['Aura of Life', 'Greater Invisibility'],
      9: ['Circle of Power', 'Mislead'],
    },
    channelDivinity: {
      name: 'Twilight Sanctuary',
      description:
        'As an action, you present your holy symbol, and a sphere of twilight emanates from you. The sphere is centered on you, has a 30-foot radius, and is filled with dim light. The sphere moves with you, and the dim light within it overcomes magical darkness. As a bonus action when a creature (including you) ends its turn in the sphere, you can grant that creature one of these benefits: grant temporary hit points equal to 1d6 plus your cleric level, or end one effect on it causing it to be charmed or frightened.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant or necrotic damage (your choice). When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Twilight Shroud',
      description:
        'At 17th level, the twilight that you summon offers a protective embrace: you and your allies have half cover while in the sphere created by your Twilight Sanctuary.',
    },
  },

  war: {
    id: 'war',
    name: 'War',
    source: 'Player\'s Handbook',
    description:
      'War has many manifestations. It can make heroes of ordinary people. It can be desperate and horrific, with acts of cruelty and cowardice eclipsing instances of excellence and courage. In either case, the gods of war watch over warriors and reward them for their great deeds. The clerics of such gods excel in battle, inspiring others to fight the good fight or offering acts of violence as prayers.',
    domainSpells: {
      1: ['Divine Favor', 'Shield of Faith'],
      3: ['Magic Weapon', 'Spiritual Weapon'],
      5: ['Crusader\'s Mantle', 'Spirit Guardians'],
      7: ['Freedom of Movement', 'Stoneskin'],
      9: ['Flame Strike', 'Hold Monster'],
    },
    channelDivinity: {
      name: 'Guided Strike',
      description:
        'When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
    },
    level8Feature: {
      name: 'Divine Strike',
      type: 'divineStrike',
      description:
        'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon. When you reach 14th level, the extra damage increases to 2d8.',
    },
    capstone: {
      name: 'Avatar of Battle',
      description:
        'At 17th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.',
    },
  },
};

// ---------------------------------------------------------------------------
// DOMAIN_ALIGNMENT_TENDENCY
// ---------------------------------------------------------------------------

/**
 * Alignment tendencies for each domain.
 *
 * Fields:
 *   alignments   {string[]}  alignments most associated with this domain
 *   notes        {string}    brief rationale
 */
export const DOMAIN_ALIGNMENT_TENDENCY = {
  arcana: {
    alignments: ['Lawful Neutral', 'True Neutral', 'Lawful Good'],
    notes: 'Knowledge and arcane study are morally neutral pursuits; most arcana clerics skew toward law or neutrality.',
  },
  death: {
    alignments: ['Neutral Evil', 'Chaotic Evil', 'True Neutral'],
    notes: 'Death domain is almost exclusively the purview of evil or morally ambiguous deities; only available to villains in most settings.',
  },
  forge: {
    alignments: ['Lawful Good', 'Lawful Neutral', 'Neutral Good'],
    notes: 'Forge gods value craft, community, and diligent labor — virtues associated with law and good.',
  },
  grave: {
    alignments: ['Lawful Neutral', 'Neutral Good', 'True Neutral'],
    notes: 'Grave clerics honor the natural cycle of death without seeking to pervert it; typically neutral or good.',
  },
  knowledge: {
    alignments: ['Lawful Neutral', 'True Neutral', 'Neutral Good'],
    notes: 'Pursuit of knowledge transcends morality; gods of knowledge span the ethical spectrum but tend toward order.',
  },
  life: {
    alignments: ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
    notes: 'Life domain is strongly tied to good-aligned deities dedicated to healing, growth, and protection.',
  },
  light: {
    alignments: ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
    notes: 'Light is a near-universal symbol of good; light clerics are almost always good-aligned.',
  },
  nature: {
    alignments: ['True Neutral', 'Neutral Good', 'Chaotic Neutral'],
    notes: 'Nature is indifferent to morality; nature gods span the spectrum but rarely lean lawful or evil.',
  },
  order: {
    alignments: ['Lawful Good', 'Lawful Neutral', 'Lawful Evil'],
    notes: 'Order values structure and hierarchy above personal morality; deities of order range from benevolent rulers to tyrannical despots.',
  },
  peace: {
    alignments: ['Neutral Good', 'Lawful Good', 'Chaotic Good'],
    notes: 'Peace is an inherently good-aspiring ideal; peace domain clerics are almost universally good-aligned.',
  },
  tempest: {
    alignments: ['Chaotic Neutral', 'Chaotic Good', 'Chaotic Evil'],
    notes: 'Tempest gods embody raw, unpredictable power; they skew chaotic across the moral spectrum.',
  },
  trickery: {
    alignments: ['Chaotic Neutral', 'Chaotic Good', 'Neutral Evil'],
    notes: 'Trickery gods prize freedom, cleverness, and disruption of the status quo; almost universally chaotic.',
  },
  twilight: {
    alignments: ['Neutral Good', 'Chaotic Good', 'True Neutral'],
    notes: 'Twilight gods stand between extremes and protect the vulnerable; typically good or neutral.',
  },
  war: {
    alignments: ['Lawful Good', 'Chaotic Good', 'Lawful Evil', 'Chaotic Evil'],
    notes: 'War is fought on every side of the moral divide; war gods span all alignments.',
  },
};

// ---------------------------------------------------------------------------
// DOMAIN_WEAPON_PROFICIENCIES
// ---------------------------------------------------------------------------

/**
 * Bonus proficiencies granted to clerics of each domain at 1st level.
 *
 * All clerics already have: light armor, medium armor, shields, simple weapons.
 * These entries list what is ADDITIONALLY granted.
 *
 * Fields:
 *   armor        {string[]}  additional armor categories or specific armors
 *   weapons      {string[]}  additional weapon categories or specific weapons
 *   tools        {string[]}  tool proficiencies
 *   skills       {string[]}  bonus skill proficiencies (if any)
 *   notes        {string}    any clarifying details
 */
export const DOMAIN_WEAPON_PROFICIENCIES = {
  arcana: {
    armor: [],
    weapons: [],
    tools: [],
    skills: ['Arcana'],
    notes: 'At 1st level you gain proficiency in the Arcana skill if you don\'t already have it.',
  },
  death: {
    armor: [],
    weapons: ['Martial weapons'],
    tools: [],
    skills: [],
    notes: 'Proficiency with all martial weapons.',
  },
  forge: {
    armor: ['Heavy armor'],
    weapons: [],
    tools: ['Smith\'s tools'],
    skills: [],
    notes: 'Proficiency with heavy armor and smith\'s tools.',
  },
  grave: {
    armor: [],
    weapons: [],
    tools: [],
    skills: [],
    notes: 'No additional proficiencies beyond standard cleric proficiencies.',
  },
  knowledge: {
    armor: [],
    weapons: [],
    tools: [],
    skills: ['Two skills from: Arcana, History, Nature, Religion'],
    notes: 'Choose two skills from Arcana, History, Nature, and Religion. Your proficiency bonus is doubled for ability checks using those skills (Blessed Strikes).',
  },
  life: {
    armor: ['Heavy armor'],
    weapons: [],
    tools: [],
    skills: [],
    notes: 'Proficiency with heavy armor.',
  },
  light: {
    armor: [],
    weapons: [],
    tools: [],
    skills: [],
    notes: 'No additional proficiencies beyond standard cleric proficiencies.',
  },
  nature: {
    armor: ['Heavy armor'],
    weapons: [],
    tools: [],
    skills: ['One skill from: Animal Handling, Nature, Survival'],
    notes: 'Proficiency with heavy armor and one skill from Animal Handling, Nature, or Survival. You also learn one druid cantrip of your choice.',
  },
  order: {
    armor: ['Heavy armor'],
    weapons: [],
    tools: [],
    skills: ['Persuasion'],
    notes: 'Proficiency with heavy armor and the Persuasion skill.',
  },
  peace: {
    armor: [],
    weapons: [],
    tools: [],
    skills: ['One skill from: Insight, Performance, or Persuasion'],
    notes: 'Choose one skill from Insight, Performance, or Persuasion.',
  },
  tempest: {
    armor: ['Heavy armor'],
    weapons: ['Martial weapons'],
    tools: [],
    skills: [],
    notes: 'Proficiency with heavy armor and all martial weapons.',
  },
  trickery: {
    armor: [],
    weapons: [],
    tools: [],
    skills: [],
    notes: 'No additional proficiencies beyond standard cleric proficiencies.',
  },
  twilight: {
    armor: ['Heavy armor'],
    weapons: ['Martial weapons'],
    tools: [],
    skills: [],
    notes: 'Proficiency with heavy armor and all martial weapons.',
  },
  war: {
    armor: ['Heavy armor'],
    weapons: ['Martial weapons'],
    tools: [],
    skills: [],
    notes: 'Proficiency with heavy armor and all martial weapons.',
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns a single domain object by its camelCase id.
 *
 * @param {string} domainId - e.g. 'life', 'war', 'trickery'
 * @returns {Object|null} The domain object, or null if not found.
 */
export function getDomain(domainId) {
  if (!domainId) return null;
  return CLERIC_DOMAINS[domainId.toLowerCase()] ?? null;
}

/**
 * Returns the domain spells available to a cleric of the given level.
 * Includes all spell pairs from levels 1, 3, 5, 7, and 9 up to the
 * cleric's current level.
 *
 * @param {string} domainId    - e.g. 'life'
 * @param {number} clericLevel - the cleric's current class level (1–20)
 * @returns {Object} Keys are domain spell levels (1, 3, 5, 7, 9) that
 *                   have been unlocked; values are string arrays of spell names.
 *                   Returns empty object if domain not found.
 */
export function getDomainSpells(domainId, clericLevel) {
  const domain = getDomain(domainId);
  if (!domain) return {};

  const spellLevelThresholds = [1, 3, 5, 7, 9];
  const result = {};

  for (const threshold of spellLevelThresholds) {
    if (clericLevel >= threshold) {
      result[threshold] = domain.domainSpells[threshold];
    }
  }

  return result;
}

/**
 * Returns an array of all domain objects, sorted alphabetically by name.
 *
 * @returns {Object[]} All 14 domain objects.
 */
export function getAllDomains() {
  return Object.values(CLERIC_DOMAINS).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Returns domains whose alignment tendency includes the given alignment string.
 * Matching is case-insensitive and partial (e.g. 'good' matches 'Neutral Good').
 *
 * @param {string} alignment - e.g. 'good', 'Lawful Neutral', 'evil'
 * @returns {Object[]} Array of matching domain objects from CLERIC_DOMAINS.
 */
export function getDomainsByAlignment(alignment) {
  if (!alignment) return [];
  const needle = alignment.toLowerCase();

  return Object.entries(DOMAIN_ALIGNMENT_TENDENCY)
    .filter(([, tendency]) =>
      tendency.alignments.some((a) => a.toLowerCase().includes(needle))
    )
    .map(([domainId]) => CLERIC_DOMAINS[domainId])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns the Channel Divinity feature object for a given domain.
 *
 * @param {string} domainId - e.g. 'tempest'
 * @returns {{ name: string, description: string }|null}
 */
export function getChannelDivinity(domainId) {
  const domain = getDomain(domainId);
  if (!domain) return null;
  return domain.channelDivinity;
}
