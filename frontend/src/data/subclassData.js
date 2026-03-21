/**
 * Subclass Data — Subclass information and selection guidance for all 13 core classes.
 *
 * Roadmap items covered:
 *   - Subclass listings per class (PHB, XGE, TCE sources)
 *   - Subclass level unlock per class
 *   - Flavor descriptions and playstyle tags
 *   - Key features summaries (3-4 bullets each)
 *   - Beginner/experienced recommendations
 *   - Helper functions for lookup and filtering
 *
 * Sources: PHB = Player's Handbook, XGE = Xanathar\'s Guide to Everything,
 *          TCE = Tasha\'s Cauldron of Everything, GGR = Guildmaster\'s Guide to Ravnica,
 *          EGW = Explorer\'s Guide to Wildemount, SCAG = Sword Coast Adventurer\'s Guide,
 *          VRGR = Van Richten\'s Guide to Ravenloft
 *
 * Cleric domain details (domain spells, Channel Divinity, capstones) live in deityDomains.js.
 * This file provides the subclass-level metadata that matches the pattern of other classes.
 *
 * No React. Pure data and utility functions.
 */

// ---------------------------------------------------------------------------
// SUBCLASS_LEVELS — which level each class gains its subclass
// ---------------------------------------------------------------------------

/**
 * Maps each class name to the level at which it gains its subclass choice.
 * @type {Object.<string, number>}
 */
export const SUBCLASS_LEVELS = {
  Cleric:    1,
  Sorcerer:  1,
  Warlock:   1,
  Druid:     2,
  Wizard:    2,
  Barbarian: 3,
  Bard:      3,
  Fighter:   3,
  Monk:      3,
  Paladin:   3,
  Ranger:    3,
  Rogue:     3,
  Artificer: 3,
  'Blood Hunter': 3,
};

// ---------------------------------------------------------------------------
// SUBCLASSES — full subclass data keyed by class name
// ---------------------------------------------------------------------------

/**
 * Complete subclass definitions for all 13 PHB core classes.
 *
 * Fields per subclass:
 *   name          {string}    Display name
 *   source        {string}    Source book abbreviation
 *   subclassLevel {number}    Level at which the subclass is chosen
 *   flavor        {string}    Thematic description (1-2 sentences)
 *   playstyle     {string[]}  Tags from: "damage dealer", "support", "tank",
 *                             "utility", "controller", "stealth", "striker"
 *   keyFeatures   {string[]}  3-4 bullet-point summaries of defining features
 *   recommendedFor {string}   "beginner", "experienced", or "either"
 *
 * @type {Object.<string, Array>}
 */
export const SUBCLASSES = {

  // -------------------------------------------------------------------------
  // BARBARIAN — subclass at level 3
  // -------------------------------------------------------------------------
  Barbarian: [
    {
      name: 'Path of the Berserker',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Pure, unbridled fury. The Berserker throws caution aside and descends into a manic frenzy, attacking again and again until the battlefield falls silent.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Frenzy: Make a bonus action attack every turn while raging, at the cost of exhaustion afterward.',
        'Mindless Rage: Immune to the charmed and frightened conditions while raging.',
        'Intimidating Presence: Frighten a creature with your sheer ferocity as an action.',
        'Retaliation: When damaged in melee, use your reaction to immediately attack back.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Path of the Totem Warrior',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Drawing power from sacred animal spirits — bear, eagle, wolf, elk, or tiger — the Totem Warrior channels primal forces that extend far beyond brute strength.',
      playstyle: ['tank', 'support', 'utility'],
      keyFeatures: [
        'Totem Spirit (level 3): Choose bear (resistance to all damage while raging), eagle (disengage + dash as bonus action), or wolf (allies have advantage on melee attacks against your targets).',
        'Aspect of the Beast (level 6): Gain a passive benefit tied to your chosen animal spirit.',
        'Spirit Walker (level 10): Cast commune with nature as a ritual.',
        'Totemic Attunement (level 14): Gain a powerful combat benefit matching your totem animal.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Path of the Ancestral Guardian',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'The spirits of fallen ancestors flock to this barbarian\'s rage, harassing enemies and protecting allies. A protector who uses fury as a shield for others.',
      playstyle: ['tank', 'support'],
      keyFeatures: [
        'Ancestral Protectors: The first creature you hit each rage has disadvantage on attacks against anyone but you.',
        'Spirit Shield: Use your reaction to reduce damage a nearby ally takes by 2d6/3d6/4d6.',
        'Consult the Spirits: Cast augury or clairvoyance once per short rest.',
        'Vengeful Ancestors: When Spirit Shield reduces damage, the attacker takes the same amount as force damage.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Path of the Storm Herald',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Born of lightning, sand, or arctic cold, the Storm Herald crackles with elemental energy and reshapes the battlefield with each furious swing.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Storm Aura: Choose desert (fire damage to nearby foes), sea (lightning chain between enemies), or tundra (freeze water and slow enemies).',
        'Storm Soul: Passive resistances and environmental abilities based on your aura type.',
        'Shielding Storm: Allies within your aura share your elemental resistance.',
        'Raging Storm: Once per rage, trigger a powerful elemental effect tied to your chosen environment.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Path of the Zealot',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'The divine powers you serve fuel your rage into holy (or unholy) wrath. You are nearly impossible to kill and fight with the conviction of a true martyr.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Divine Fury: First hit each turn deals bonus radiant or necrotic damage while raging.',
        'Warrior of the Gods: Resurrection spells cast on you require no material component.',
        'Fanatical Focus: Once per rage, reroll a failed saving throw.',
        'Zealous Presence: Grant up to 10 creatures advantage on attack rolls and saving throws for one turn.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Path of the Beast',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A savage beast lurks within, manifesting as claws, fangs, or a lashing tail. The Beast barbarian blurs the line between warrior and monster.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Form of the Beast: Grow claws (extra attack + climb speed), a bite (regain HP on a hit), or a tail (reaction attack when an ally would be hit).',
        'Bestial Soul: Your natural weapons count as magical and you gain one permanent movement benefit.',
        'Infectious Fury: A creature you hit must make a WIS save or attack another creature or take psychic damage.',
        'Call the Hunt: Grant up to 5 allies bonus damage on their first attack each turn while you rage.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Path of Wild Magic',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Raw arcane chaos seeps into your rages, producing unpredictable magical bursts. Expect the unexpected — and weaponize it.',
      playstyle: ['damage dealer', 'utility'],
      keyFeatures: [
        'Magic Awareness: Detect the presence of spells or magic items as an action.',
        'Wild Surge: Each rage triggers a random magical effect (teleport, invisibility, spectral flight, and more).',
        'Bolstering Magic: Grant an ally (or yourself) a bonus to attack/ability checks or restore a spell slot.',
        'Unstable Backlash: When you take damage or fail a save, you can trigger a new Wild Surge as a reaction.',
      ],
      recommendedFor: 'experienced',
    },
  ],

  // -------------------------------------------------------------------------
  // BARD — subclass at level 3
  // -------------------------------------------------------------------------
  Bard: [
    {
      name: 'College of Lore',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The Lore bard hoards secrets and stories from every corner of the world, wielding knowledge as deftly as any sword. The iconic utility bard.',
      playstyle: ['support', 'utility', 'controller'],
      keyFeatures: [
        'Bonus Proficiencies: Three skill proficiencies of your choice.',
        'Cutting Words: Use a Bardic Inspiration die to subtract from an enemy\'s attack, ability check, or damage roll.',
        'Additional Magical Secrets: Learn two spells from any class list at level 6, two levels earlier than other bards.',
        'Peerless Skill: Add a Bardic Inspiration die to your own ability checks.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'College of Valor',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Songs of heroism ring loudest from the front line. The Valor bard charges into battle alongside allies, inspiring greatness through personal example.',
      playstyle: ['damage dealer', 'support'],
      keyFeatures: [
        'Bonus Proficiencies: Medium armor, shields, and martial weapons.',
        'Combat Inspiration: Allies can use Bardic Inspiration to boost AC against one attack or add to a weapon damage roll.',
        'Extra Attack: Attack twice with the Attack action.',
        'Battle Magic: Cast a bard spell and make a weapon attack as a bonus action.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'College of Glamour',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Touched by the fey courts, the Glamour bard radiates an almost supernatural magnetism, bending hearts and commanding loyalty with a word.',
      playstyle: ['support', 'controller'],
      keyFeatures: [
        'Mantle of Inspiration: Grant several allies temporary HP and free movement without provoking opportunity attacks.',
        'Enthralling Performance: After a short rest, charm humanoids who watched you perform.',
        'Mantle of Majesty: Cast command as a bonus action each turn for 1 minute without using a spell slot.',
        'Unbreakable Majesty: Creatures attacking you must make a CHA save or target someone else.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'College of Swords',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Acrobats, duelists, and knife-throwers who make combat itself their art form. The Swords bard fights with flair and rewards aggressive play.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Bonus Proficiencies: Medium armor and scimitars.',
        'Fighting Style: Choose Dueling or Two-Weapon Fighting.',
        'Blade Flourish: After attacking, use a Bardic Inspiration die for Defensive, Slashing, or Mobile Flourish.',
        'Extra Attack: Attack twice when you take the Attack action.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'College of Whispers',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'A predator in plain sight, the Whispers bard harvests fears and shadows, stabbing enemies in the heart — both literally and psychologically.',
      playstyle: ['striker', 'utility', 'stealth'],
      keyFeatures: [
        'Psychic Blades: Expend Bardic Inspiration to add psychic damage (2d6–8d6) to a weapon hit.',
        'Words of Terror: Frighten a creature during a private conversation after a short rest.',
        'Mantle of Whispers: Steal a dead humanoid\'s identity and memories for 1 hour.',
        'Shadow Lore: Magically dominate a creature by whispering its darkest fear.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'College of Creation',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Reality itself is your instrument. By tapping into the Song of Creation, you breathe life into objects and conjure matter from music.',
      playstyle: ['support', 'utility', 'controller'],
      keyFeatures: [
        'Mote of Potential: Bardic Inspiration dice roll twice for checks, have splash damage potential on attacks, and grant temp HP on saves.',
        'Performance of Creation: Summon a nonmagical object worth up to 20gp (scaling with proficiency bonus) that lasts 1 hour.',
        'Animating Performance: Animate a Large or smaller nonmagical item to fight alongside you for 1 hour.',
        'Creative Crescendo: Create multiple items with Performance of Creation simultaneously.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'College of Eloquence',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'The perfect persuader, mediator, and orator. The Eloquence bard never fails a social roll and makes every word count on and off the battlefield.',
      playstyle: ['support', 'controller', 'utility'],
      keyFeatures: [
        'Silver Tongue: Minimum of 10 on Persuasion and Deception rolls.',
        'Unsettling Words: Use a Bardic Inspiration die to reduce an enemy\'s saving throw result.',
        'Unfailing Inspiration: Allies keep their Bardic Inspiration die even if they fail the roll.',
        'Universal Speech: Communicate with any creature that can understand a language for 10 minutes.',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // CLERIC — subclass at level 1 (full details in deityDomains.js)
  // -------------------------------------------------------------------------
  Cleric: [
    {
      name: 'Arcana Domain',
      source: 'SCAG',
      subclassLevel: 1,
      flavor:
        'Magic itself is your deity\'s portfolio. Arcana clerics blend divine and arcane power, eventually learning wizard spells and banishing magical creatures.',
      playstyle: ['damage dealer', 'utility'],
      keyFeatures: [
        'Arcane Initiate: Gain two cantrips from the wizard spell list.',
        'Arcane Abjuration: Turn celestials, elementals, fey, and fiends — and eventually banish weaker ones.',
        'Spell Breaker: When restoring HP with a spell, also end one spell on the target.',
        'Potent Spellcasting: Add WIS modifier to cleric cantrip damage.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Death Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'A subclass reserved for dark clerics and villains, but available for players seeking necromantic mastery or morally complex campaigns.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Reaper: Cleric necromancy cantrips can target two creatures instead of one.',
        'Touch of Death: Drain 5 + (cleric level × 2) HP from a creature you hit in melee.',
        'Inescapable Destruction: Necrotic damage from your spells and Channel Divinity ignores resistance.',
        'Divine Strike: Bonus necrotic damage on weapon hits (2d8 at level 14).',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Forge Domain',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'The god of craft and creation blesses you with the power to shape metal, wear the heaviest armor, and imbue weapons with divine enchantments.',
      playstyle: ['tank', 'support'],
      keyFeatures: [
        'Blessing of the Forge: Imbue a weapon or armor with a +1 bonus after each long rest.',
        'Artisan\'s Blessing: Create metal items worth up to 100 gp during a short rest.',
        'Soul of the Forge: +1 AC in heavy armor; resistance to fire damage.',
        'Divine Strike: Bonus fire damage on weapon hits.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Grave Domain',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'Standing at the boundary between life and death, the Grave cleric ensures that every soul passes in its proper time — and not a moment sooner.',
      playstyle: ['support', 'utility'],
      keyFeatures: [
        'Circle of Mortality: Healing spells cast on a creature at 0 HP always heal maximum.',
        'Eyes of the Grave: Detect undead within 60 feet at will.',
        'Path to the Grave: Mark a creature as cursed; the next hit against it is a critical.',
        'Potent Spellcasting: Add WIS modifier to cleric cantrip damage.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Knowledge Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Information is power. The Knowledge cleric serves a deity of learning and seeks to master all skills, steal all secrets, and divine all truths.',
      playstyle: ['utility', 'support'],
      keyFeatures: [
        'Blessings of Knowledge: Proficiency + expertise in two knowledge skills.',
        'Channel Divinity — Knowledge of the Ages: Gain proficiency in any skill or tool for 10 minutes.',
        'Channel Divinity — Read Thoughts: Read a creature\'s surface thoughts; optionally cast suggestion without a spell slot.',
        'Potent Spellcasting: Add WIS modifier to cleric cantrip damage.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Life Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'The quintessential healer. Life clerics pour healing magic into their allies with unmatched efficiency, keeping even the most battered party standing.',
      playstyle: ['support'],
      keyFeatures: [
        'Disciple of Life: Healing spells restore 2 + spell level additional HP.',
        'Preserve Life: Distribute up to (5 × cleric level) HP among any creatures at half HP or fewer within 30 feet.',
        'Blessed Healer: When you heal someone else, you regain 2 + spell level HP yourself.',
        'Supreme Healing: Healing spells always deal maximum HP instead of rolling dice.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Light Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'The blazing servant of a sun deity. Light clerics scorch enemies with radiant fire and keep the darkness — both literal and figurative — at bay.',
      playstyle: ['damage dealer', 'support'],
      keyFeatures: [
        'Warding Flare: Use a reaction to impose disadvantage on an attack against you (WIS mod uses per long rest).',
        'Radiance of the Dawn: Dispel magical darkness and deal radiant damage to all hostiles within 30 feet.',
        'Improved Flare: Use Warding Flare to protect allies, not just yourself.',
        'Potent Spellcasting + Corona of Light: Enemies within 60 feet are vulnerable to fire and radiant damage.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Nature Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'A divine champion of forests, beasts, and growing things. The Nature cleric is a sturdier, more combat-capable alternative to the druid.',
      playstyle: ['support', 'utility'],
      keyFeatures: [
        'Acolyte of Nature: Gain a druid cantrip and proficiency in one nature-adjacent skill.',
        'Charm Animals and Plants: Channel Divinity to charm beasts and plants within 30 feet.',
        'Dampen Elements: Use a reaction to grant resistance to acid, cold, fire, lightning, or thunder damage.',
        'Divine Strike: Bonus cold, fire, or lightning damage on weapon hits.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Order Domain',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'Civilization, law, and hierarchy are divine virtues. The Order cleric commands allies into action and punishes those who defy rightful authority.',
      playstyle: ['support', 'controller'],
      keyFeatures: [
        'Voice of Authority: When you cast a spell on an ally, they can use their reaction to make a weapon attack.',
        'Order\'s Demand: Channel Divinity to charm creatures; charmed targets drop held items.',
        'Embodiment of the Law: Cast enchantment spells of 5th level or lower as a bonus action once per turn.',
        'Divine Strike: Bonus psychic damage on weapon hits.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Peace Domain',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'The most purely supportive cleric subclass. The Peace domain binds allies together with bonds of magical solidarity that amplify every action.',
      playstyle: ['support'],
      keyFeatures: [
        'Emboldening Bond: Link up to (proficiency bonus) creatures so they can add a 1d4 to any attack, check, or save once per turn.',
        'Balm of Peace: Move up to your speed and heal each creature you pass (2d6 + WIS) without spending spell slots.',
        'Protective Bond: Bonded creatures can take damage for each other as a reaction.',
        'Potent Spellcasting: Add WIS modifier to cantrip damage.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Tempest Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Thunder, lightning, and raging seas are your divine birthright. The Tempest cleric is an aggressive front-liner who punishes enemies with storm-fueled wrath.',
      playstyle: ['damage dealer', 'tank'],
      keyFeatures: [
        'Bonus Proficiencies: Martial weapons and heavy armor.',
        'Wrath of the Storm: Reaction lightning/thunder damage when an enemy hits you (CON save for half).',
        'Destructive Wrath: Maximize thunder or lightning spell damage with Channel Divinity.',
        'Thunderbolt Strike: Pushes large or smaller creatures 10 feet with lightning damage.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Trickery Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Illusions, deception, and mayhem are your sacred rites. The Trickery cleric is a disruptive force who shapes chaos in service of a divine prankster.',
      playstyle: ['utility', 'support', 'stealth'],
      keyFeatures: [
        'Blessing of the Trickster: Grant an ally advantage on Stealth checks for 1 hour.',
        'Invoke Duplicity: Create an illusion duplicate to distract enemies and let you cast from its location.',
        'Cloak of Shadows: Turn invisible as an action once per Channel Divinity.',
        'Divine Strike: Bonus poison damage on weapon hits.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Twilight Domain',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'The comforting darkness between day and night is your domain. The Twilight cleric is a powerful protector who guards allies with twilight\'s embrace.',
      playstyle: ['support', 'tank'],
      keyFeatures: [
        'Bonus Proficiencies: Martial weapons and heavy armor.',
        'Eyes of Night: Darkvision up to 300 feet; share darkvision with allies as an action.',
        'Twilight Sanctuary: Aura that grants allies temp HP or removes charmed/frightened each turn.',
        'Steps of Night: Fly in dim light or darkness as a bonus action (WIS mod uses per long rest).',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'War Domain',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Your deity revels in battle. The War cleric charges into the thick of combat, striking harder than most clerics and inspiring allies to strike harder too.',
      playstyle: ['damage dealer', 'tank'],
      keyFeatures: [
        'Bonus Proficiencies: Martial weapons and heavy armor.',
        'War Priest: Make a bonus weapon attack when you use the Attack action (WIS mod uses per long rest).',
        'Guided Strike: Add +10 to an attack roll using Channel Divinity.',
        'Divine Strike: Bonus damage on weapon hits matching your deity\'s weapon.',
      ],
      recommendedFor: 'beginner',
    },
  ],

  // -------------------------------------------------------------------------
  // DRUID — subclass at level 2
  // -------------------------------------------------------------------------
  Druid: [
    {
      name: 'Circle of the Land',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'The ancient druids who meditate on the magic of the natural world. Land druids recover spell slots on short rests and expand their spell list with terrain-themed spells.',
      playstyle: ['utility', 'support', 'controller'],
      keyFeatures: [
        'Natural Recovery: Recover expended spell slots (up to half druid level combined) during a short rest.',
        'Circle Spells: Always have a set of terrain-themed bonus spells prepared (arctic, coast, desert, forest, grassland, mountain, swamp, or underdark).',
        'Land\'s Stride: Move through nonmagical difficult terrain without extra movement; ignore plant-based spells.',
        'Nature\'s Ward: Immune to poison, disease, and elemental charm/fear effects.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Circle of the Moon',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'The savage shape-shifter. Moon druids transform into far more powerful beasts and can even take on elemental forms, becoming a versatile melee powerhouse.',
      playstyle: ['tank', 'damage dealer', 'striker'],
      keyFeatures: [
        'Combat Wild Shape: Wild Shape as a bonus action; expend spell slots for temp HP while transformed.',
        'Circle Forms: Wild Shape into CR 1 beasts at level 2 (max CR = half druid level).',
        'Elemental Wild Shape: Expend two Wild Shape uses to become an air, earth, fire, or water elemental.',
        'Thousand Forms: Cast alter self at will.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Circle of Dreams',
      source: 'XGE',
      subclassLevel: 2,
      flavor:
        'Touched by the Feywild\'s dreaming power, this druid heals and protects allies with verdant magic while opening paths between the waking and dreaming worlds.',
      playstyle: ['support', 'utility'],
      keyFeatures: [
        'Balm of the Summer Court: Pool of d6s equal to druid level; distribute them as healing and movement speed to allies.',
        'Hearth of Moonlight and Shadow: During a short or long rest, create a magical camp that hides your party from detection.',
        'Hidden Paths: Teleport up to 60 feet as a bonus action, or teleport a willing ally.',
        'Walker in Dreams: Once per long rest, cast dream, scrying, or teleportation circle without a spell slot.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Circle of the Shepherd',
      source: 'XGE',
      subclassLevel: 2,
      flavor:
        'A protector of beasts and spirits, the Shepherd druid summons mighty spirit animals and amplifies conjuration spells to call forth entire armies of creatures.',
      playstyle: ['support', 'controller'],
      keyFeatures: [
        'Speech of the Woods: Speak with beasts; friendly beasts understand you.',
        'Spirit Totem: Summon a Bear (temp HP), Hawk (advantage on Perception + attack advantage), or Unicorn (healing boost) spirit aura.',
        'Mighty Summoner: Summoned or conjured beasts and fey gain extra HP and magical natural weapons.',
        'Guardian Spirit: Beasts and fey you summon regain HP at the end of each of your turns.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Circle of Spores',
      source: 'TCE',
      subclassLevel: 2,
      flavor:
        'Life and death are part of the same cycle. The Spores druid embraces rot and decay, animating corpses and infecting foes with clouds of fungal spores.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Halo of Spores: Reaction to deal 1d4–3d10 necrotic damage to a creature that moves within 10 feet.',
        'Symbiotic Entity: Use Wild Shape charges to gain temp HP and bonus damage with Halo of Spores and melee weapons.',
        'Fungal Infestation: Animate a Small or Medium humanoid that dies nearby as a zombie for 1 hour.',
        'Spreading Spores: Create a 10-foot cube of spores as a bonus action to spread your Halo of Spores.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Circle of Stars',
      source: 'TCE',
      subclassLevel: 2,
      flavor:
        'The stars are an ancient map of magic. Stars druids draw constellations in the sky to gain combat versatility and peer into the future.',
      playstyle: ['support', 'damage dealer', 'utility'],
      keyFeatures: [
        'Star Map: Create a star map that works as a spellcasting focus and grants free guidance cantrip and one free guiding bolt per long rest.',
        'Starry Form: Transform into a starry body with Archer (bonus radiant damage), Chalice (heal yourself when casting spells), or Dragon (concentration advantage) form.',
        'Twinkling Constellations: Upgrade your Starry Form abilities at level 10.',
        'Full of Stars: While in Starry Form, creatures can\'t see you clearly and have disadvantage on attacks against you.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Circle of Wildfire',
      source: 'TCE',
      subclassLevel: 2,
      flavor:
        'Fire destroys — but also clears the way for new growth. The Wildfire druid wields devastating flame and bonds with a fiery spirit companion.',
      playstyle: ['damage dealer', 'support'],
      keyFeatures: [
        'Summon Wildfire Spirit: Call a fire spirit to harass enemies, teleport allies up to 15 feet, and deal fire damage on entry.',
        'Enhanced Bond: Boost healing and fire damage when your wildfire spirit is nearby.',
        'Cauterizing Flames: When a creature near you dies, create a fiery spirit that heals or harms the next creature to interact with it.',
        'Blazing Revival: The wildfire spirit can revive you from 0 HP once per day.',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // FIGHTER — subclass at level 3
  // -------------------------------------------------------------------------
  Fighter: [
    {
      name: 'Champion',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The purest expression of martial perfection. The Champion trains relentlessly to land devastating critical hits and outlast any foe through sheer physical supremacy.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Improved Critical: Score a critical hit on a natural 19 or 20.',
        'Remarkable Athlete: Add half proficiency bonus to STR/DEX/CON checks that don\'t already use proficiency.',
        'Additional Fighting Style: Learn a second Fighting Style at level 10.',
        'Superior Critical: Score a critical hit on 18–20 at level 15.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Battle Master',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Tactical genius in plate armor. The Battle Master uses a repertoire of combat maneuvers and superiority dice to control the battlefield with surgical precision.',
      playstyle: ['damage dealer', 'controller', 'support'],
      keyFeatures: [
        'Combat Superiority: Pool of Superiority Dice (d8–d12) to fuel powerful maneuvers.',
        'Maneuvers: Choose 3 maneuvers from a list of 16 (e.g., Trip Attack, Disarming Strike, Commander\'s Strike).',
        'Student of War: Proficiency with one artisan\'s tool.',
        'Know Your Enemy: Study a creature for 1 minute to compare ability scores with your own.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Eldritch Knight',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Steel and sorcery in equal measure. The Eldritch Knight blends fighter durability with wizard spells, becoming a spell-enhanced melee powerhouse.',
      playstyle: ['damage dealer', 'utility'],
      keyFeatures: [
        'Spellcasting: Learn abjuration and evocation spells from the wizard list (eventually any school).',
        'Weapon Bond: Bind up to two weapons; they can\'t be disarmed and teleport back to your hand.',
        'War Magic: When you cast a cantrip, make one weapon attack as a bonus action.',
        'Arcane Charge: Add Action Surge teleport — move 30 feet before attacking.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Arcane Archer',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'An elven-inspired archer who imbues arrows with powerful magical effects, from banishment to entanglement to explosive bursts.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Arcane Arrow: Infuse arrows with magic (2/short rest): Banishing, Beguiling, Bursting, Enfeebling, Grasping, Piercing, Seeking, or Shadow.',
        'Magic Arrow: Arrows count as magical for overcoming resistances.',
        'Curving Shot: Use a bonus action to redirect a missed arrow to a new target.',
        'Ever-Ready Shot: Regain one Arcane Arrow use on initiative if you have none left.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Cavalier',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'An armored champion who fights most powerfully from horseback, protecting their mount and making themselves an immovable wall of steel between enemies and allies.',
      playstyle: ['tank', 'support'],
      keyFeatures: [
        'Bonus Proficiency: One of Animal Handling, History, Insight, Performance, or Persuasion.',
        'Born to the Saddle: Advantage against being dismounted; mount falling doesn\'t knock you prone.',
        'Unwavering Mark: Mark a creature when you hit it; it has disadvantage on attacks against others, and you get a bonus attack if it ignores the mark.',
        'Hold the Line: Creatures provoke opportunity attacks when they move within 5 feet of you.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Samurai',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Honor, precision, and relentless fighting spirit. The Samurai shrugs off pain and pushes through wounds that would fell lesser warriors.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Bonus Proficiency: One of History, Insight, Performance, or Persuasion (or a new language).',
        'Fighting Spirit: Gain advantage on all attacks this turn and temp HP as a bonus action (3/long rest).',
        'Elegant Courtier: Add WIS modifier to Persuasion checks.',
        'Rapid Strike: Give up advantage on an attack to make one additional attack.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Echo Knight',
      source: 'EGW',
      subclassLevel: 3,
      flavor:
        'A warrior who manifests a duplicate of themselves from a different timeline — a ghostly echo that fights alongside them and can even replace them in an instant.',
      playstyle: ['damage dealer', 'striker', 'utility'],
      keyFeatures: [
        'Manifest Echo: Create a magical duplicate that you can attack from, teleport to, and use to make opportunity attacks.',
        'Unleash Incarnation: Make one extra attack through your echo for each use of Extra Attack (CON mod uses per long rest).',
        'Echo Avatar: See and hear through your echo from up to 1,000 feet away.',
        'Shadow Martyr: Redirect an attack targeting an ally to your echo instead.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Rune Knight',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A warrior who carves ancient giant runes into weapons and armor, growing to tremendous size and wielding the power of elemental forces.',
      playstyle: ['tank', 'damage dealer', 'utility'],
      keyFeatures: [
        'Bonus Proficiency: Smith\'s tools and the Giant language.',
        'Rune Carver: Inscribe magical runes (Cloud, Stone, Storm, Fire, Frost, Hill) granting passive bonuses and active powers.',
        'Giant\'s Might: Grow to Large size, gaining advantage on STR checks and bonus weapon damage (bonus action, CON mod uses per long rest).',
        'Runic Shield: Use a reaction to make an attacker reroll their attack against an ally.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Psi Warrior',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A fighter who has awakened psychic powers, using telekinesis to hurl objects, protect allies, and pummel enemies with invisible force.',
      playstyle: ['damage dealer', 'utility', 'controller'],
      keyFeatures: [
        'Psionic Power: Pool of Psionic Energy Dice (d6–d12) for powering abilities.',
        'Protective Field: Use a die to reduce damage to yourself or a nearby ally.',
        'Psionic Strike: Add a Psionic Energy Die to weapon damage (force type).',
        'Telekinetic Movement: Move a creature or object up to 30 feet as a bonus action.',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // MONK — subclass at level 3
  // -------------------------------------------------------------------------
  Monk: [
    {
      name: 'Way of the Open Hand',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The purest path of martial discipline. Open Hand monks perfect unarmed combat, using Flurry of Blows to debilitate, topple, and destroy enemies.',
      playstyle: ['striker', 'damage dealer'],
      keyFeatures: [
        'Open Hand Technique: Flurry of Blows hits can knock prone, push 15 feet, or deny reactions.',
        'Wholeness of Body: Regain up to (3 × monk level) HP as an action once per long rest.',
        'Tranquility: End each long rest with the effect of sanctuary on yourself.',
        'Quivering Palm: Set up a deadly vibration in a target; trigger later to reduce to 0 HP (or 10d10 force on a save).',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Way of Shadow',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Silence and darkness are your weapons. Shadow monks teleport between shadows, turn invisible, and silence a room before their enemies even notice them.',
      playstyle: ['striker', 'stealth', 'utility'],
      keyFeatures: [
        'Shadow Arts: Cast darkness, darkvision, pass without trace, or silence with ki points.',
        'Shadow Step: Teleport between areas of dim light/darkness as a bonus action; gain advantage on your next attack.',
        'Cloak of Shadows: Turn invisible in darkness as an action (free, sustained until light or attack).',
        'Opportunist: Make a reaction attack when an ally hits a nearby creature.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Way of the Four Elements',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Bend fire, water, earth, and air to your will. Four Elements monks are the cinematic avatar fantasy of elemental mastery, if ki-hungry.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Disciple of the Elements: Learn Elemental Disciplines to cast spells (burning hands, wall of fire, etc.) using ki.',
        'Elemental Attunement: Minor elemental manipulation cantrip for free.',
        'Versatile Spell Selection: Swap out disciplines on level up.',
        'Warning: This subclass is ki-intensive and generally considered weak compared to alternatives.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Way of the Kensei',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'The sword (or bow, or any weapon) is an extension of the self. Kensei monks transform chosen weapons into monk weapons and achieve transcendent combat precision.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Path of the Kensei: Designate 2 weapons as kensei weapons; use them as monk weapons without losing unarmed benefits.',
        'One with the Blade: Kensei attacks count as magical; spend 1 ki for +1d4 damage with a kensei weapon.',
        'Sharpen the Blade: Spend ki (up to 3) to add a +1/+2/+3 bonus to kensei weapon attacks and damage.',
        'Unerring Accuracy: Reroll one missed attack per turn.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Way of the Drunken Master',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Unpredictable, loose, and deceptively dangerous. The Drunken Master lurches and staggers, making their movements impossible to predict or counter.',
      playstyle: ['striker', 'utility'],
      keyFeatures: [
        'Bonus Proficiencies: Performance skill and brewer\'s supplies.',
        'Drunken Technique: Flurry of Blows grants Disengage and +10 movement speed that turn.',
        'Tipsy Sway: Use a reaction to redirect a missed attack to another creature within 5 feet.',
        'Drunkard\'s Luck: Spend 2 ki to remove disadvantage on one attack, check, or save.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Way of the Sun Soul',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Your ki manifests as radiant fire. Sun Soul monks blast enemies at range and unleash searing bursts of holy energy.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Radiant Sun Bolt: Ranged spell attack (30/60 ft.) dealing 1d4+DEX radiant as a monk weapon; spend ki for Flurry of Blows ranged.',
        'Searing Arc Strike: Spend ki to cast burning hands after attacking.',
        'Searing Sunburst: Create a 20-foot radius burst dealing 2d6 radiant (CON save halves); spend ki for extra damage dice.',
        'Sun Shield: Emit bright/dim light; reaction to deal 5 + WIS radiant when hit by melee.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Way of the Astral Self',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Your ki forms an astral projection that amplifies your senses and strikes. The Astral Self monk grows a ghostly set of arms, a visage of terrifying power, and eventually a full spectral body.',
      playstyle: ['damage dealer', 'striker', 'utility'],
      keyFeatures: [
        'Arms of the Astral Self: Spend 1 ki to manifest spectral arms (1 hour): use WIS for unarmed strikes, deal extra damage on Flurry of Blows.',
        'Visage of the Astral Self: Spend 1 ki for darkvision 120 ft., advantage on Insight/Intimidation, and resist charm/frighten.',
        'Body of the Astral Self: Spend 1 ki on Arms + Visage to gain damage reduction and a knockback reaction.',
        'Awakened Astral Self: Manifest all features for 3 ki; gain reach, extra damage, and enhanced defense.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Way of Mercy',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Behind the haunting mask of a Mercy monk is a healer and a executioner in equal measure — bringing both comfort and swift death to those who need it most.',
      playstyle: ['support', 'striker'],
      keyFeatures: [
        'Implements of Mercy: Proficiency in Insight and Medicine; gain a herbalism kit and a haunting mask.',
        'Hand of Healing: Spend 1 ki to heal a creature (1d6 + WIS) and remove one condition; can replace a Flurry of Blows hit.',
        'Hand of Harm: Spend 1 ki to add necrotic damage (1d6 + WIS) once per turn and potentially poison the target.',
        'Noxious Aura: Enemies within 10 feet of you must save or be poisoned until end of their next turn.',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // PALADIN — subclass at level 3
  // -------------------------------------------------------------------------
  Paladin: [
    {
      name: 'Oath of Devotion',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The classic holy knight. Devotion paladins embody honesty, courage, and justice, wielding sacred flame and divine power in the name of righteousness.',
      playstyle: ['damage dealer', 'support', 'tank'],
      keyFeatures: [
        'Sacred Weapon: Imbue a weapon with a +CHA bonus to attacks and make it glow for 1 minute (Channel Divinity).',
        'Turn the Unholy: Turn fiends and undead with Channel Divinity.',
        'Aura of Devotion: You and nearby allies can\'t be charmed while you\'re conscious.',
        'Holy Nimbus: Aura of bright sunlight that damages undead and fiends; advantage on saves against spells cast by fiends/undead.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Oath of the Ancients',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Defender of the natural world and the light of life. Ancients paladins are joyful warriors who stand against the darkness with magic resistance and nature\'s power.',
      playstyle: ['tank', 'support'],
      keyFeatures: [
        'Nature\'s Wrath: Restrain a creature in magical vines with Channel Divinity (STR or DEX save).',
        'Turn the Faithless: Turn fey and fiends.',
        'Aura of Warding: You and nearby allies have resistance to spell damage.',
        'Undying Sentinel: When you drop to 0 HP, stay at 1 HP instead (once per long rest); no aging penalties.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Oath of Vengeance',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Justice through overwhelming force. The Vengeance paladin hunts the wicked with relentless focus, using every trick available to destroy a single target.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Abjure Enemy: Frighten or slow a creature with Channel Divinity.',
        'Vow of Enmity: Grant yourself advantage on attacks against one creature with Channel Divinity.',
        'Relentless Avenger: After an opportunity attack hit, move up to half your speed without provoking opportunity attacks.',
        'Soul of Vengeance: Make a bonus weapon attack when a sworn enemy makes an attack.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Oath of Conquest',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Domination and fear are your divine weapons. The Conquest paladin rules through intimidation, freezing enemies in place and feeding on their terror.',
      playstyle: ['controller', 'tank', 'damage dealer'],
      keyFeatures: [
        'Conquering Presence: Frighten all enemies within 30 feet (WIS save) with Channel Divinity.',
        'Guided Strike: Add +10 to an attack roll with Channel Divinity.',
        'Aura of Conquest: Frightened creatures near you have their speed reduced to 0 and take psychic damage each turn.',
        'Scornful Rebuke: When you take damage, deal CHA mod psychic damage back to the attacker.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Oath of Redemption',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Violence is a last resort. The Redemption paladin uses persuasion and nonviolent power to prevent conflict, becoming an almost indestructible shield for their allies.',
      playstyle: ['support', 'tank'],
      keyFeatures: [
        'Emissary of Peace: +5 to Persuasion checks with Channel Divinity.',
        'Rebuke the Violent: React when a nearby ally is damaged — the attacker takes the same damage (radiant).',
        'Aura of the Guardian: Take damage for an ally within your aura as a reaction (no action required).',
        'Protective Spirit: Regain HP at the start of your turn if below half HP and not incapacitated.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Oath of Glory',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'You are destined for greatness — and so is everyone you fight beside. The Glory paladin inspires legendary feats and makes their entire party feel like heroes.',
      playstyle: ['support', 'damage dealer'],
      keyFeatures: [
        'Inspiring Smite: After Divine Smite, distribute temp HP among creatures within 30 feet.',
        'Peerless Athlete: +10 to Athletics and Acrobatics checks; double carrying capacity (Channel Divinity).',
        'Aura of Alacrity: +10 ft. movement speed for you; allies starting turns within 5 ft. gain +10 ft. as well.',
        'Glorious Defense: Use your reaction to add CHA modifier to an ally\'s AC; if the attack misses, make a weapon attack.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Oath of the Watchers',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Guardian against extraplanar threats. The Watchers paladin keeps aberrations, celestials, elementals, fey, and fiends at bay — and destroys them when they cross over.',
      playstyle: ['support', 'controller'],
      keyFeatures: [
        'Watcher\'s Will: Give allies advantage on INT, WIS, and CHA saves against extraplanar creatures (Channel Divinity).',
        'Abjure the Extraplanar: Turn aberrations, celestials, elementals, fey, and fiends.',
        'Aura of the Sentinel: +proficiency bonus to initiative for you and nearby allies.',
        'Mortal Bulwark: Gain truesight 120 ft., advantage on attacks vs. extraplanar creatures, and free banishment attempts.',
      ],
      recommendedFor: 'experienced',
    },
  ],

  // -------------------------------------------------------------------------
  // RANGER — subclass at level 3
  // -------------------------------------------------------------------------
  Ranger: [
    {
      name: 'Hunter',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The straightforward ranger. The Hunter picks from a menu of combat techniques at key levels, becoming a flexible and dependable warrior against any foe.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Hunter\'s Prey: Choose Colossus Slayer (bonus damage per turn), Giant Killer (reaction attack), or Horde Breaker (free extra attack).',
        'Defensive Tactics: Choose Escape the Horde (no OA), Multiattack Defense (+4 AC vs subsequent attacks), or Steel Will (advantage vs. frighten).',
        'Multiattack: Extra attack options at level 11.',
        'Superior Hunter\'s Defense: Evasion, Stand Against the Tide, or Uncanny Dodge.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Beast Master',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'A ranger and their animal companion against the world. Beast Master rangers form a deep bond with a beast, fighting together as a team.',
      playstyle: ['damage dealer', 'support', 'utility'],
      keyFeatures: [
        'Ranger\'s Companion: Gain a beast with CR ≤ 1/4 that acts independently and improves with your level.',
        'Exceptional Training: The beast can Dash, Disengage, Help, or Hide as a bonus action.',
        'Bestial Fury: Beast attacks twice when you command it to attack.',
        'Share Spells: Spells targeting only you can also affect your beast companion.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Gloom Stalker',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Hunter of the dark places. The Gloom Stalker vanishes in shadows, terrorizes enemies in the first round of combat, and makes a perfect dungeon-delving striker.',
      playstyle: ['striker', 'stealth', 'damage dealer'],
      keyFeatures: [
        'Dread Ambusher: +initiative, extra attack on first turn, bonus damage on that attack.',
        'Umbral Sight: Darkvision 60 ft.; creatures with darkvision can\'t use it to see you.',
        'Iron Mind: Proficiency in WIS saves.',
        'Shadowy Dodge: Reaction to impose disadvantage on an attack against you.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Horizon Walker',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'Planar guardian and portal hunter. The Horizon Walker slips between planes of existence and fights extraplanar threats with weapons imbued with the power of the multiverse.',
      playstyle: ['damage dealer', 'utility', 'striker'],
      keyFeatures: [
        'Detect Portal: Sense planar portals within 1 mile.',
        'Planar Warrior: Deal force damage instead of your attack\'s normal type (bonus action, 1d8 at level 3, 2d8 at level 11).',
        'Ethereal Step: Cast etherealness as a bonus action once per short rest.',
        'Distant Strike: Extra attack, and if targeting two different creatures, a free attack against a third.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Monster Slayer',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'A specialist in hunting dangerous supernatural prey. Monster Slayers exploit the weaknesses of magical beasts, undead, and fiends with cold expertise.',
      playstyle: ['damage dealer', 'utility'],
      keyFeatures: [
        'Hunter\'s Sense: Learn a creature\'s immunities and resistances as a bonus action.',
        'Slayer\'s Prey: Mark a creature; first hit per turn deals +1d6, and it can\'t escape without opportunity attacks.',
        'Supernatural Defense: Add a 1d6 to saves against your prey\'s spells and special abilities.',
        'Magic-User\'s Nemesis: Use a reaction to try to counter a teleport or magical summon once per short rest.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Fey Wanderer',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Touched by the courts of the Feywild, the Fey Wanderer combines Charisma-based charm with ranger combat skill, beguiling enemies and bolstering allies with fey magic.',
      playstyle: ['support', 'damage dealer', 'utility'],
      keyFeatures: [
        'Dreadful Strikes: Deal psychic damage (1d4, once per turn) on weapon hits.',
        'Fey Wanderer Magic: Always have charm person, misty step, dispel magic, and more prepared.',
        'Otherworldly Glamour: Add WIS modifier to CHA checks; proficiency in Deception, Performance, or Persuasion.',
        'Beguiling Twist: React to redirect a charm/frighten save that succeeded onto another creature.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Swarmkeeper',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Surrounded by an ever-present cloud of spirits in the form of bees, birds, or beetles, the Swarmkeeper weaponizes their swarm to move enemies, deal damage, and survive.',
      playstyle: ['damage dealer', 'controller', 'utility'],
      keyFeatures: [
        'Gathered Swarm: After a hit, the swarm moves the target 15 ft., deals 1d6 piercing, or carries you 5 ft.',
        'Swarmkeeper Magic: Always have faerie fire, web, gaseous form, and more prepared.',
        'Writhing Tide: Use the swarm to fly 10 ft. as a bonus action for 1 minute.',
        'Swarming Dispersal: React to damage by turning invisible and teleporting 30 ft. (discards damage).',
      ],
      recommendedFor: 'experienced',
    },
  ],

  // -------------------------------------------------------------------------
  // ROGUE — subclass at level 3
  // -------------------------------------------------------------------------
  Rogue: [
    {
      name: 'Thief',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'The archetypal nimble trickster. Thieves move fast, climb faster, and use items and objects in ways no one else can, including activating magic items with no training.',
      playstyle: ['striker', 'stealth', 'utility'],
      keyFeatures: [
        'Fast Hands: Use Sleight of Hand, disarm traps, open locks, or activate Use an Object as a bonus action.',
        'Second-Story Work: Climb at full speed; jump distance increases by DEX modifier.',
        'Supreme Sneak: Advantage on Stealth checks if you move no more than half speed.',
        'Use Magic Device: Ignore class/race/level requirements for magic item use.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Assassin',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'Death before they know you\'re there. The Assassin front-loads devastating damage in the first round of combat and can infiltrate any identity.',
      playstyle: ['striker', 'damage dealer', 'stealth'],
      keyFeatures: [
        'Bonus Proficiencies: Disguise kit and poisoner\'s kit.',
        'Assassinate: Advantage on attacks against creatures that haven\'t taken a turn; automatic crit on surprised enemies.',
        'Infiltration Expertise: Create a flawless false identity over a week of work.',
        'Imposter: Mimic a creature\'s voice, handwriting, and mannerisms after 3 hours of study.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Arcane Trickster',
      source: 'PHB',
      subclassLevel: 3,
      flavor:
        'A thief who adds wizard magic to their bag of tricks. The Arcane Trickster uses illusion and enchantment spells to misdirect, confuse, and pick pockets from a distance.',
      playstyle: ['striker', 'utility', 'controller'],
      keyFeatures: [
        'Spellcasting: Learn enchantment and illusion spells from the wizard list.',
        'Mage Hand Legerdemain: Your mage hand is invisible and can steal, disarm traps, pick locks, and stash items.',
        'Magical Ambush: Creatures have disadvantage on saves against your spells if you\'re hidden.',
        'Spell Thief: After a creature fails a spell save, you can steal the spell for 8 hours.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Scout',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'The natural world is your hunting ground. The Scout combines rogue agility with ranger-like outdoor expertise to become an expert skirmisher.',
      playstyle: ['striker', 'utility', 'stealth'],
      keyFeatures: [
        'Skirmisher: React when an enemy ends its turn within 5 feet of you — move half your speed without provoking opportunity attacks.',
        'Survivalist: Gain proficiency and expertise in Nature and Survival.',
        'Superior Mobility: +10 ft. movement speed.',
        'Ambush Master: Advantage on initiative; first turn allies gain advantage on attacks against creatures you hit.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Swashbuckler',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'A dashing duelist who wins fights with panache. The Swashbuckler doesn\'t need to hide to Sneak Attack — they just need to be alone in the dance.',
      playstyle: ['striker', 'damage dealer'],
      keyFeatures: [
        'Fancy Footwork: After attacking in melee, enemies you attacked can\'t make opportunity attacks against you.',
        'Rakish Audacity: Add CHA modifier to initiative; Sneak Attack when you\'re the only one adjacent to the target.',
        'Panache: Charm or taunt a creature with a Persuasion contest — charmed or provoked into attacking only you.',
        'Elegant Maneuver: Use a bonus action for advantage on Athletics or Acrobatics checks.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Mastermind',
      source: 'XGE',
      subclassLevel: 3,
      flavor:
        'The chess player of the party. The Mastermind manipulates allies and enemies alike, feeds information to their team, and uses disguise to pass through any social situation.',
      playstyle: ['support', 'utility'],
      keyFeatures: [
        'Master of Intrigue: Proficiency in disguise kit, forgery kit, two gaming sets, and two languages.',
        'Master of Tactics: Use Help as a bonus action from 30 feet away.',
        'Insightful Manipulator: Study a creature for 1 minute to learn two of its stats, class, or personality traits.',
        'Misdirection: Use a nearby distracted creature to grant yourself cover.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Phantom',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'You walk among the dead. The Phantom rogue steals tokens of the deceased, uses ghastly flight, and blurs the line between the living and the grave.',
      playstyle: ['striker', 'utility'],
      keyFeatures: [
        'Whispers of the Dead: Gain a skill or tool proficiency from a nearby spirit; changes on short rest.',
        'Wails from the Grave: After Sneak Attack, deal half the Sneak Attack dice as necrotic damage to a second nearby target.',
        'Tokens of the Departed: Harvest soul trinkets from dying creatures for defensive and informational benefits.',
        'Ghost Walk: Become an incorporeal flying wraith for 10 minutes (1/long rest or 1 soul trinket).',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Soulknife',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'Your mind is your weapon. The Soulknife manifests blades of psychic energy, reads thoughts, and teleports short distances — a psionic assassin.',
      playstyle: ['striker', 'damage dealer', 'utility'],
      keyFeatures: [
        'Psionic Power: Pool of Psionic Energy Dice (d6–d12) to fuel abilities.',
        'Psychic Blades: Manifest two psychic daggers (1d6 / 1d4) that appear and vanish; work with Sneak Attack; one can be thrown 60 ft.',
        'Soul Blades: Spend a die to homing-strike a target (reroll attack) or teleport 10 ft. before attacking.',
        'Psychic Veil: Turn invisible for 1 hour or until you attack/cast (1/long rest or 1 die).',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // SORCERER — subclass at level 1
  // -------------------------------------------------------------------------
  Sorcerer: [
    {
      name: 'Draconic Bloodline',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Dragon blood flows through your veins, granting you tough scales, elemental affinity, and the commanding presence of dragonkind.',
      playstyle: ['damage dealer', 'tank'],
      keyFeatures: [
        'Dragon Ancestor: Choose a dragon type for an element affinity; speak Draconic.',
        'Draconic Resilience: +1 HP per level; unarmored AC = 13 + DEX.',
        'Elemental Affinity: Add CHA modifier to one damage roll per spell cast of your dragon\'s element; optionally spend 1 sorcery point for resistance.',
        'Dragon Wings: Sprout wings for a fly speed equal to your walking speed.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Wild Magic',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Your magic is a barely-contained maelstrom. Wild Magic sorcerers trigger random magical surges and generate Tides of Chaos — chaotic but surprisingly powerful.',
      playstyle: ['damage dealer', 'utility'],
      keyFeatures: [
        'Wild Magic Surge: Roll a d20 after casting a leveled spell; on a 1, roll on the Wild Magic Surge table (100 entries).',
        'Tides of Chaos: Gain advantage on one attack, check, or save; DM may trigger a surge to recharge it.',
        'Bend Luck: Spend 2 sorcery points to add or subtract 1d4 from any creature\'s attack, check, or save.',
        'Controlled Chaos: Roll twice on the surge table and choose the result.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Divine Soul',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'A divine blessing courses through your sorcery. The Divine Soul gains access to the entire cleric spell list and can choose to be touched by celestial or dark energy.',
      playstyle: ['support', 'damage dealer'],
      keyFeatures: [
        'Divine Magic: Learn one cleric spell; access the full cleric spell list for future spells known.',
        'Otherworldly Wings: Grow angelic or shadowy wings for a fly speed at level 14.',
        'Empowered Healing: When rolling healing dice in range, spend 1 sorcery point to reroll any number of dice.',
        'Unearthly Recovery: Regain half your max HP as a bonus action (once per long rest) when below half HP.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Shadow Magic',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'Born in shadows, possibly from the Shadowfell. The Shadow sorcerer commands darkness, raises undead, and peers past death itself.',
      playstyle: ['damage dealer', 'stealth', 'controller'],
      keyFeatures: [
        'Eyes of the Dark: Darkvision 120 ft.; spend 2 sorcery points to cast darkness without material components.',
        'Strength of the Grave: When damage reduces you to 0, roll a CHA save to stay at 1 HP (not vs. radiant or critical hits).',
        'Hound of Ill Omen: Spend 3 sorcery points to summon a shadowy dire wolf that has advantage on attacks vs. your target.',
        'Shadow Walk: Teleport 120 ft. between areas of dim light/darkness as a bonus action.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Storm Sorcery',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'The power of storms lives in your blood. Storm sorcerers crackle with lightning and thunder, darting across the battlefield on gusts of wind.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Wind Speaker: Speak Primordial.',
        'Tempestuous Magic: After casting a leveled spell, fly 10 ft. as a bonus action without provoking opportunity attacks.',
        'Heart of the Storm: Resistance to lightning and thunder; nearby enemies take 1d8 lightning/thunder when you cast lightning or thunder spells.',
        'Ride the Wind: Fly at your walking speed for 1 hour (spend 1 sorcery point to maintain).',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'Clockwork Soul',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'Order and precision define your magic, gifted by Mechanus or a clockwork deity. The Clockwork Soul cancels out random chance and weaves spells of pure law.',
      playstyle: ['support', 'controller', 'utility'],
      keyFeatures: [
        'Clockwork Magic: Bonus spells from the conjuration and transmutation lists; can swap one per long rest.',
        'Restore Balance: As a reaction, cancel advantage or disadvantage on a roll (WIS mod uses per long rest).',
        'Bastion of Law: Spend 1–5 sorcery points to give a creature temp HP equal to 5 × points spent — damage to temp HP doesn\'t create conditions.',
        'Trance of Order: Ignore the lower die on d20 rolls (treat any result below 10 as 10) for 1 minute.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Aberrant Mind',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'Touched by something beyond the stars, the Aberrant Mind sorcerer blends psionic telepathy with eldritch sorcery, reshaping the minds of others.',
      playstyle: ['controller', 'utility', 'support'],
      keyFeatures: [
        'Psionic Spells: Bonus spells from divination and enchantment lists; can swap one per long rest.',
        'Telepathic Speech: Speak telepathically with one creature within 30 ft. for WIS mod minutes.',
        'Psionic Sorcery: Cast psionic spells spending only sorcery points (no material components required).',
        'Revelation in Flesh: Spend 1–4 sorcery points for aquatic adaptation, climb speed, flight, or see through solid objects.',
      ],
      recommendedFor: 'experienced',
    },
  ],

  // -------------------------------------------------------------------------
  // WARLOCK — subclass at level 1
  // -------------------------------------------------------------------------
  Warlock: [
    {
      name: 'The Archfey',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'Your patron is a capricious fey lord or lady. Archfey warlocks beguile enemies with fear and charm, slipping in and out of danger with fey magic.',
      playstyle: ['controller', 'utility'],
      keyFeatures: [
        'Fey Presence: Charm or frighten all creatures within 10 feet (WIS save) once per short rest.',
        'Misty Escape: React to taking damage — turn invisible and teleport up to 60 ft. once per short rest.',
        'Beguiling Defenses: Immune to charm; reflect charm attempts back on the caster.',
        'Dark Delirium: Target is charmed or frightened and has no awareness of surroundings for 1 minute.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'The Fiend',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'You struck a deal with a devil or demon and came away with tremendous destructive power. The Fiend warlock is among the most consistently powerful and beginner-friendly.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Dark One\'s Blessing: Regain CHA + warlock level temp HP each time you reduce a creature to 0 HP.',
        'Dark One\'s Own Luck: Add a d10 to any ability check or saving throw once per short rest.',
        'Fiendish Resilience: Gain resistance to one damage type; change it on short rest.',
        'Hurl Through Hell: After a hit, send the target through a hellish dimension for devastating psychic damage (once per long rest).',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'The Great Old One',
      source: 'PHB',
      subclassLevel: 1,
      flavor:
        'An alien intelligence beyond comprehension granted you power. Great Old One warlocks peer into minds, speak telepathically, and wield knowledge of things that should not be known.',
      playstyle: ['utility', 'controller'],
      keyFeatures: [
        'Awakened Mind: Telepathically communicate with any creature within 30 ft. that has a language.',
        'Entropic Ward: Impose disadvantage on an attack; if it misses, gain advantage on your next attack against them.',
        'Thought Shield: Resistance to psychic damage; no one can read your thoughts without your permission.',
        'Create Thrall: Touch an incapacitated humanoid and charm them indefinitely.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'The Celestial',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'A radiant being of the Upper Planes granted you power to heal and destroy. The Celestial warlock is the only warlock with meaningful healing capability.',
      playstyle: ['support', 'damage dealer'],
      keyFeatures: [
        'Bonus Cantrips: Always know sacred flame and light.',
        'Healing Light: Pool of d6s (1 + warlock level) for healing as a bonus action — use any number of dice per heal.',
        'Radiant Soul: Resistance to radiant damage; add CHA modifier to radiant or fire cantrip damage.',
        'Searing Vengeance: When you\'d fail a death save, rise with 50% HP and deal radiant splash damage (once per long rest).',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'The Hexblade',
      source: 'XGE',
      subclassLevel: 1,
      flavor:
        'A shadowy entity of the Shadowfell bound to your weapon. The Hexblade warlock is one of the strongest in the game: melee-focused, self-sufficient, and dripping with dark charisma.',
      playstyle: ['damage dealer', 'striker', 'tank'],
      keyFeatures: [
        'Hexblade\'s Curse: Mark a creature for bonus damage, crit on 19+, and HP recovery on kill (once per short rest).',
        'Hex Warrior: Medium armor, shields, and martial weapon proficiency; use CHA for one weapon\'s attacks.',
        'Accursed Specter: When you kill a humanoid, raise them as a specter under your control.',
        'Armor of Hexes: Cursed targets have a 50% chance to miss you entirely.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'The Fathomless',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'Something vast and hungry lurks in the deep oceans, and it noticed you. The Fathomless warlock commands tentacles, breathes underwater, and devours the unlucky.',
      playstyle: ['controller', 'utility', 'damage dealer'],
      keyFeatures: [
        'Tentacle of the Deeps: Summon a spectral tentacle (10 ft. reach, 1d8 cold + slow movement on hit) as a bonus action.',
        'Gift of the Sea: Swim speed 40 ft.; breathe underwater.',
        'Oceanic Soul: Resistance to cold; telepathy with creatures underwater.',
        'Grasping Tentacles: Cast Evard\'s black tentacles once per long rest without a spell slot; gain temp HP.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'The Genie',
      source: 'TCE',
      subclassLevel: 1,
      flavor:
        'You are the confidant of a noble genie — dao, djinni, efreeti, or marid. The Genie warlock is remarkably versatile, trading in wishes and living inside a personal extradimensional vessel.',
      playstyle: ['utility', 'damage dealer', 'support'],
      keyFeatures: [
        'Genie\'s Vessel: A tiny vessel serves as a spellcasting focus; once per long rest, enter it for a short rest (6-hour rest in 1 hour from outside).',
        'Elemental Gift: Resistance to your genie\'s element; fly 30 ft. as a bonus action (CON mod rounds, recharges on short rest).',
        'Sanctuary Vessel: Allies can join you in the vessel; grant them temp HP on exit.',
        'Limited Wish: Replicate any spell of 6th level or lower from any class list once per 1d4 long rests.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'The Undead',
      source: 'VRGR',
      subclassLevel: 1,
      flavor:
        'You have made a pact with a powerful undead being, such as a lich, vampire, or mummy lord, gaining the power to channel the forces of death.',
      playstyle: ['damage dealer', 'controller', 'tank'],
      keyFeatures: [
        'Form of Dread: Transform into frightening undead form',
        'Grave Touched: Replace damage types with necrotic, extra die on necrotic/radiant attacks',
        'Mortal Husk: Resist necrotic, explode when reduced to 0 HP',
        'Spirit Projection: Project soul from body for combat and exploration',
      ],
      recommendedFor: 'beginner',
    },
  ],

  // -------------------------------------------------------------------------
  // WIZARD — subclass at level 2
  // -------------------------------------------------------------------------
  Wizard: [
    {
      name: 'School of Abjuration',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'A master of protective magic. The Abjuration wizard surrounds themselves and allies with arcane wards and dismantles enemy spells with practiced ease.',
      playstyle: ['tank', 'support', 'utility'],
      keyFeatures: [
        'Abjuration Savant: Copy abjuration spells for half cost.',
        'Arcane Ward: Casting abjuration spells reinforces a magical barrier (max HP = 2× wizard level + INT mod) that absorbs damage.',
        'Projected Ward: Transfer your Arcane Ward damage absorption to an ally within 30 ft.',
        'Improved Abjuration: Add proficiency bonus to ability checks when casting counterspell or dispel magic.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'School of Conjuration',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'Summoner and transporter. Conjuration wizards call creatures, teleport across short distances, and eventually create objects out of thin air.',
      playstyle: ['support', 'utility', 'controller'],
      keyFeatures: [
        'Conjuration Savant: Copy conjuration spells for half cost.',
        'Minor Conjuration: Summon a nonmagical Small or smaller object for 1 hour as an action.',
        'Benign Transposition: Teleport 30 ft. or swap places with a friendly creature as a bonus action (once per long rest or conjuration spell).',
        'Focused Conjuration: Concentration on conjuration spells can\'t be broken by damage.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'School of Divination',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'The oracle among wizards. Divination wizards see the future, cheat fate, and answer questions that others can only guess at.',
      playstyle: ['utility', 'support'],
      keyFeatures: [
        'Divination Savant: Copy divination spells for half cost.',
        'Portent: Roll two d20s at dawn; replace any attack roll, save, or check for any creature with one of these dice.',
        'Expert Divination: Regain a lower-level spell slot when casting divination spells of 2nd level or higher.',
        'The Third Eye: As a bonus action, gain darkvision, ethereal sight, read minds, or see invisibility until your next rest.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'School of Enchantment',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'The manipulator\'s school. Enchantment wizards bend the will of others, redirecting attacks and eventually bending even the most powerful minds.',
      playstyle: ['controller', 'support'],
      keyFeatures: [
        'Enchantment Savant: Copy enchantment spells for half cost.',
        'Hypnotic Gaze: Incapacitate a creature with sustained eye contact (CON save to resist; reapply each action).',
        'Instinctive Charm: When a creature attacks you, make it attack a different target instead (WIS save; once per short rest per creature).',
        'Alter Memories: Make a charmed humanoid forget the time they were charmed after the spell ends.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'School of Evocation',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'Pure magical firepower. Evocation wizards blast enemies with the raw energy of the universe and learn to exclude allies from their own explosions.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Evocation Savant: Copy evocation spells for half cost.',
        'Sculpt Spells: Automatically exclude allies from evocation spells — no save required.',
        'Potent Cantrip: Targets who save against your damage cantrips still take half damage.',
        'Overchannel: Maximize damage of evocation spells of 5th level or lower at the cost of necrotic self-damage (scaling on repeated use).',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'School of Illusion',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'Reality is what you say it is. Illusion wizards craft near-perfect fakes, become real their own creations, and eventually become visually indistinguishable from anyone.',
      playstyle: ['utility', 'controller', 'stealth'],
      keyFeatures: [
        'Illusion Savant: Copy illusion spells for half cost.',
        'Improved Minor Illusion: Create both sound and image when casting minor illusion.',
        'Malleable Illusions: Change a sustained illusion as an action without recasting.',
        'Illusory Self: Interpose a figment to negate one attack per short rest.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'School of Necromancy',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'Death is a resource. Necromancy wizards harvest life force from their spells, raise armies of undead, and eventually command those undead with total authority.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Necromancy Savant: Copy necromancy spells for half cost.',
        'Grim Harvest: Regain HP (2× spell level, or 3× for life-drain spells) whenever you kill with a spell.',
        'Undead Thralls: Animate dead creates one extra zombie/skeleton and all your undead gain bonus HP and damage.',
        'Command Undead: CHA save or any undead comes under your control permanently.',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'School of Transmutation',
      source: 'PHB',
      subclassLevel: 2,
      flavor:
        'Reshape matter and life. Transmutation wizards modify creatures, transform lead into gold, and eventually become alchemists of reality itself.',
      playstyle: ['utility', 'support'],
      keyFeatures: [
        'Transmutation Savant: Copy transmutation spells for half cost.',
        'Minor Alchemy: Temporarily transform one material into another (wood, stone, iron, copper, silver, gold).',
        'Transmuter\'s Stone: Create a stone granting darkvision, +10 ft. speed, proficiency in CON saves, or resistance to energy — and pass it to an ally.',
        'Shapechanger: Cast polymorph on yourself without a spell slot (once per short rest).',
      ],
      recommendedFor: 'either',
    },
    {
      name: 'School of War Magic',
      source: 'XGE',
      subclassLevel: 2,
      flavor:
        'Forged in magical warfare, War Magic wizards blend resilience with offensive efficiency, bolstering defenses without sacrificing their destructive output.',
      playstyle: ['damage dealer', 'tank'],
      keyFeatures: [
        'Arcane Deflection: React to add +2 AC or +4 to a save; costs you from casting non-cantrips next turn.',
        'Tactical Wit: Add INT modifier to initiative.',
        'Power Surge: Track power surges when you use Arcane Deflection or counterspell; discharge for extra force damage.',
        'Durable Magic: +2 AC and saving throws while maintaining concentration.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Bladesinging',
      source: 'SCAG',
      subclassLevel: 2,
      flavor:
        'An elven tradition that merges swordplay with spellcasting. The Bladesinger wizard is among the most mobile and defensively powerful in the game.',
      playstyle: ['damage dealer', 'striker', 'utility'],
      keyFeatures: [
        'Training in War and Song: Light armor, one one-handed melee weapon, and Performance proficiency.',
        'Bladesong: Bonus action to activate — +INT to AC, +10 ft. speed, advantage on Acrobatics, +INT to concentration saves (once per short rest, CHA mod times per TCE).',
        'Extra Attack: Attack twice; one attack can be replaced with a cantrip.',
        'Song of Defense: Spend spell slots to reduce incoming damage while Bladesong is active.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Chronurgy Magic',
      source: 'EGW',
      subclassLevel: 2,
      flavor:
        'A master of time itself. The Chronurgy wizard manipulates the flow of time to alter die rolls, freeze enemies in temporal stasis, and duplicate their own actions.',
      playstyle: ['controller', 'utility', 'support'],
      keyFeatures: [
        'Chronal Shift: After any creature rolls, use a reaction to force a reroll and choose which result stands (twice per long rest).',
        'Temporal Awareness: Add INT modifier to initiative.',
        'Momentary Stasis: Slow a Large or smaller creature to 0 speed (CON save) for 1 turn (INT mod uses per long rest).',
        'Convergent Future: See all possible futures and guarantee a success or failure on one roll — take a level of exhaustion.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Graviturgy Magic',
      source: 'EGW',
      subclassLevel: 2,
      flavor:
        'Gravity is your playground. The Graviturgy wizard hurls creatures through the air, crushes enemies with invisible force, and warps movement across the battlefield.',
      playstyle: ['controller', 'utility'],
      keyFeatures: [
        'Adjust Density: Double or halve a creature\'s weight — affecting speed, carrying capacity, and concentration saves.',
        'Gravity Well: After a spell hits a creature, move them 5 feet in any direction.',
        'Violent Attraction: Add 1d10 to one weapon damage roll or falling damage (INT mod uses per long rest).',
        'Event Horizon: 30-ft. aura that costs creatures 4 ft. per ft. moved (STR save to escape).',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Order of Scribes',
      source: 'TCE',
      subclassLevel: 2,
      flavor:
        'The scholar\'s scholar. The Order of Scribes wizard copies spells instantly with their Awakened Spellbook, swaps damage types on the fly, and eventually duplicates their own spells.',
      playstyle: ['utility', 'damage dealer'],
      keyFeatures: [
        'Wizardly Quill: Magical quill that copies spells in 2 minutes (not hours) and requires no gold; can erase its own writing.',
        'Awakened Spellbook: Use the spellbook as a spellcasting focus; swap a spell\'s damage type to match any other spell in the book.',
        'Manifest Mind: Project a ghostly mind from your spellbook to scout or cast spells through.',
        'One with the Word: When you would be incapacitated by damage, sacrifice spell levels stored in the book to negate the damage.',
      ],
      recommendedFor: 'experienced',
    },
  ],

  // -------------------------------------------------------------------------
  // ARTIFICER — subclass at level 3
  // -------------------------------------------------------------------------
  Artificer: [
    {
      name: 'Alchemist',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A master of combining reagents to produce mystical effects. The Alchemist uses their knowledge of chemistry and magic to brew potions, elixirs, and experimental concoctions that heal allies and harm enemies.',
      playstyle: ['support', 'utility'],
      keyFeatures: [
        'Experimental Elixir: Create magical elixirs at the start of each day that grant effects like healing, flight, resilience, or transformation.',
        'Alchemical Savant: Add your INT modifier to one roll of acid, fire, necrotic, or poison damage, or to a roll that restores hit points.',
        'Restorative Reagents: Casting Lesser Restoration for free a number of times equal to your INT modifier; experimental elixirs grant temporary hit points.',
        'Chemical Mastery: Resistance to acid and poison damage, immunity to the poisoned condition, and free castings of Greater Restoration and Heal.',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Armorer',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'An artificer who specializes in magically enhanced armor. The Armorer modifies their suit into an arcane exoskeleton, choosing between a hulking Guardian mode or a stealthy Infiltrator configuration.',
      playstyle: ['tank', 'utility'],
      keyFeatures: [
        'Arcane Armor: Transform a suit of armor into Arcane Armor that replaces missing limbs, cannot be removed against your will, and covers your entire body.',
        'Armor Model: Choose Guardian (thunder gauntlets, temporary HP) or Infiltrator (lightning launcher, speed boost, stealth advantage) each rest.',
        'Extra Attack: You can attack twice whenever you take the Attack action on your turn.',
        'Perfected Armor: Guardian pulls creatures toward you and deals thunder damage; Infiltrator imposes disadvantage on attacks against you after you hit.',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Artillerist',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A specialist in destructive magic and defensive wards channeled through arcane cannons. The Artillerist deploys eldritch artillery on the battlefield, raining fire or shielding allies with force barriers.',
      playstyle: ['damage dealer', 'support'],
      keyFeatures: [
        'Eldritch Cannon: Create a Small or Tiny magical cannon (flamethrower, force ballista, or protector) that you can activate as a bonus action each turn.',
        'Arcane Firearm: Use a wand, staff, or rod as a spellcasting focus that adds 1d8 to one damage roll of any artificer spell you cast.',
        'Explosive Cannon: Your cannon\'s damage increases by 1d8 and you can detonate it as an action, dealing damage in a 20-foot radius.',
        'Fortified Position: You can create two cannons at once, and allies within 10 feet of either cannon gain half cover (+2 AC).',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Battle Smith',
      source: 'TCE',
      subclassLevel: 3,
      flavor:
        'A warrior-artificer who fights alongside a Steel Defender companion. The Battle Smith combines martial prowess with magical augmentation, using INT for weapon attacks and commanding a loyal construct in battle.',
      playstyle: ['damage dealer', 'tank', 'utility'],
      keyFeatures: [
        'Battle Ready: Proficiency with martial weapons, and you can use INT instead of STR or DEX for magic weapon attack and damage rolls.',
        'Steel Defender: A loyal construct companion that fights alongside you, using your bonus action to command; it can impose disadvantage on attacks against nearby allies.',
        'Extra Attack: You can attack twice whenever you take the Attack action on your turn.',
        'Arcane Jolt: When you or your Steel Defender hits with an attack, you can channel magical energy to deal extra force damage or heal an ally within 30 feet.',
      ],
      recommendedFor: 'either',
    },
  ],

  // -------------------------------------------------------------------------
  // BLOOD HUNTER — subclass at level 3 (Critical Role)
  // -------------------------------------------------------------------------
  'Blood Hunter': [
    {
      name: 'Order of the Ghostslayer',
      source: 'CR',
      subclassLevel: 3,
      flavor:
        'Spectral hunters who destroy undead and protect against dark forces.',
      playstyle: ['damage dealer', 'striker'],
      keyFeatures: [
        'Rite of the Dawn: radiant rite damage',
        'Ethereal Step: enter Ethereal Plane briefly',
        'Brand of Sundering: strip resistances from branded creature',
        'Blood Curse of the Exorcist: force possession/charm effects to end',
      ],
      recommendedFor: 'beginner',
    },
    {
      name: 'Order of the Lycan',
      source: 'CR',
      subclassLevel: 3,
      flavor:
        'Blood hunters who embrace lycanthropy, transforming into a hybrid beast form.',
      playstyle: ['damage dealer', 'tank'],
      keyFeatures: [
        'Hybrid Transformation: bonus action transform with claws and resilience',
        "Stalker's Prowess: enhanced senses and speed",
        'Advanced Transformation: flight or swim in hybrid form',
        'Brand of the Voracious: heal when damaging branded target',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Order of the Mutant',
      source: 'CR',
      subclassLevel: 3,
      flavor:
        'Alchemists who consume dangerous mutagens to gain power at a cost.',
      playstyle: ['utility', 'damage dealer'],
      keyFeatures: [
        'Mutagencraft: create and consume mutagens for stat boosts',
        'Strange Metabolism: advantage vs poison, ignore mutagen side effects',
        'Brand of Axiom: force shapechanger to reveal true form',
        'Blood Curse of Corrosion: dissolve enemy armor and defenses',
      ],
      recommendedFor: 'experienced',
    },
    {
      name: 'Order of the Profane Soul',
      source: 'CR',
      subclassLevel: 3,
      flavor:
        'Blood hunters who forge a pact with a lesser evil to fight greater ones.',
      playstyle: ['damage dealer', 'controller'],
      keyFeatures: [
        'Otherworldly Patron: warlock-style pact magic',
        'Mystic Frenzy: cast cantrip as bonus action after Attack',
        'Brand of the Sapping Scar: reduce branded creature speed to 0',
        'Blood Curse of the Souleater: soul siphon on killed creature',
      ],
      recommendedFor: 'experienced',
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns all subclasses for a given class name.
 *
 * @param {string} className - The class name (e.g., "Fighter", "Wizard").
 * @returns {Array} Array of subclass objects, or empty array if class not found.
 */
export function getSubclasses(className) {
  return SUBCLASSES[className] ?? [];
}

/**
 * Returns a specific subclass by class name and subclass name.
 * The subclass name match is case-insensitive.
 *
 * @param {string} className     - The class name (e.g., "Rogue").
 * @param {string} subclassName  - The subclass name (e.g., "Phantom").
 * @returns {Object|null} The subclass object, or null if not found.
 */
export function getSubclass(className, subclassName) {
  const list = SUBCLASSES[className];
  if (!list) return null;
  const lower = subclassName.toLowerCase();
  return list.find((sc) => sc.name.toLowerCase() === lower) ?? null;
}

/**
 * Returns all subclasses across all classes that include the given playstyle tag.
 *
 * @param {string} playstyle - Tag to filter by (e.g., "support", "damage dealer").
 * @returns {Array} Array of objects with { className, subclass } shape.
 */
export function getSubclassesByPlaystyle(playstyle) {
  const results = [];
  const lower = playstyle.toLowerCase();
  for (const [className, subclasses] of Object.entries(SUBCLASSES)) {
    for (const sc of subclasses) {
      if (sc.playstyle.some((tag) => tag.toLowerCase() === lower)) {
        results.push({ className, subclass: sc });
      }
    }
  }
  return results;
}

/**
 * Returns the level at which a class gains its subclass.
 *
 * @param {string} className - The class name (e.g., "Cleric", "Fighter").
 * @returns {number|null} The subclass level, or null if class not found.
 */
export function getSubclassLevel(className) {
  return SUBCLASS_LEVELS[className] ?? null;
}

/**
 * Returns subclasses for a class that are recommended for beginners.
 *
 * @param {string} className - The class name (e.g., "Barbarian").
 * @returns {Array} Array of subclass objects with recommendedFor "beginner" or "either".
 */
export function getBeginnerSubclasses(className) {
  const list = SUBCLASSES[className];
  if (!list) return [];
  return list.filter(
    (sc) => sc.recommendedFor === 'beginner' || sc.recommendedFor === 'either'
  );
}
