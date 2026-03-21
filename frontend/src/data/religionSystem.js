/**
 * Religion System — Worship mechanics and divine interaction.
 *
 * Roadmap items covered:
 *   - 189: Religion system (devotion, worship actions, divine intervention,
 *           holy days, domain blessings, prayer effectiveness)
 *
 * Distinct from pantheonBuilder.js, which handles deity creation/structure.
 * This module handles the mechanical side of religious practice: how devotion
 * is earned and lost, how divine intervention resolves, and what boons
 * a worshipper gains for their level of piety.
 */

// ---------------------------------------------------------------------------
// DEVOTION_LEVELS
// ---------------------------------------------------------------------------

/**
 * Seven tiers of devotion to a deity, scored 0–10.
 * Each tier carries flavor text plus modifiers that feed into prayer and
 * divine-intervention mechanics.
 *
 * Fields:
 *   score        {number|string}  exact score or range string ("1-2")
 *   min / max    {number}         numeric bounds for range checks
 *   label        {string}         display name
 *   description  {string}         narrative description
 *   prayerMod    {number}         added to prayer effectiveness roll
 *   interventionDCMod {number}    added to divine intervention DC (positive = harder)
 *   blessingsAvailable {string[]} blessing keys available at this tier (cumulative with lower tiers)
 */
export const DEVOTION_LEVELS = [
  {
    score: 0,
    min: 0,
    max: 0,
    label: 'Unaware',
    description:
      'The character has no knowledge of or relationship with this deity. The god takes no notice of them.',
    prayerMod: -4,
    interventionDCMod: 10,
    blessingsAvailable: [],
  },
  {
    score: '1-2',
    min: 1,
    max: 2,
    label: 'Indifferent',
    description:
      'The character knows the deity exists but has made no effort to worship. Prayers go mostly unanswered.',
    prayerMod: -2,
    interventionDCMod: 6,
    blessingsAvailable: [],
  },
  {
    score: '3-4',
    min: 3,
    max: 4,
    label: 'Casual',
    description:
      'Occasional prayers, small offerings at temples. The deity is aware of this worshipper but unimpressed.',
    prayerMod: 0,
    interventionDCMod: 3,
    blessingsAvailable: ['minor_guidance'],
  },
  {
    score: '5-6',
    min: 5,
    max: 6,
    label: 'Devout',
    description:
      'Regular worship, tithing, and genuine faith. The deity watches this character with favor.',
    prayerMod: 2,
    interventionDCMod: 0,
    blessingsAvailable: ['minor_guidance', 'domain_minor_1', 'domain_minor_2'],
  },
  {
    score: '7-8',
    min: 7,
    max: 8,
    label: 'Zealot',
    description:
      'The character\'s life revolves around the deity\'s will. They proselytize, undertake holy quests, and make significant sacrifices.',
    prayerMod: 4,
    interventionDCMod: -3,
    blessingsAvailable: ['minor_guidance', 'domain_minor_1', 'domain_minor_2', 'domain_minor_3', 'domain_major_1'],
  },
  {
    score: 9,
    min: 9,
    max: 9,
    label: 'Champion',
    description:
      'Chosen instrument of the deity\'s will on the mortal plane. Direct communication is possible. The god invests real power in this individual.',
    prayerMod: 6,
    interventionDCMod: -6,
    blessingsAvailable: ['minor_guidance', 'domain_minor_1', 'domain_minor_2', 'domain_minor_3', 'domain_major_1', 'domain_major_2'],
  },
  {
    score: 10,
    min: 10,
    max: 10,
    label: 'Avatar',
    description:
      'The deity\'s essence partially inhabits this mortal. They are a living conduit of divine power. Extraordinary deeds are expected — and granted.',
    prayerMod: 8,
    interventionDCMod: -10,
    blessingsAvailable: ['minor_guidance', 'domain_minor_1', 'domain_minor_2', 'domain_minor_3', 'domain_major_1', 'domain_major_2', 'domain_avatar'],
  },
];

// ---------------------------------------------------------------------------
// WORSHIP_ACTIONS
// ---------------------------------------------------------------------------

/**
 * Actions a character can take to gain or lose devotion.
 *
 * Fields:
 *   id           {string}   machine key
 *   label        {string}   display name
 *   category     {string}   'gain' | 'loss' | 'variable'
 *   devotionDelta {number|string} change to devotion score; string when variable
 *   frequency    {string}   how often the action can grant devotion
 *   timeRequired {string}   time cost (narrative)
 *   notes        {string}   additional mechanical notes
 */
export const WORSHIP_ACTIONS = [
  {
    id: 'pray_daily',
    label: 'Daily Prayer',
    category: 'gain',
    devotionDelta: 1,
    frequency: 'Once per week (accumulated from daily practice)',
    timeRequired: '10 minutes per day',
    notes:
      'Each day the character spends at least 10 minutes in sincere prayer counts toward a weekly accumulation. +1 devotion at the end of each week of consistent daily prayer.',
  },
  {
    id: 'tithe',
    label: 'Tithe (10% of income)',
    category: 'gain',
    devotionDelta: 1,
    frequency: 'Once per income event (per session/downtime period)',
    timeRequired: 'Instantaneous when income is received',
    notes:
      'Character voluntarily donates 10% of any gold or valuables gained to the church or a worthy cause aligned with the deity. No devotion gain if tithe is coerced.',
  },
  {
    id: 'pilgrimage',
    label: 'Pilgrimage to Holy Site',
    category: 'gain',
    devotionDelta: 2,
    frequency: 'Once per holy site (no repeats for the same site)',
    timeRequired: '1d6 days of travel + time at the site',
    notes:
      'Character must travel to a recognized holy site, spend at least one day in worship there, and complete any required rites. Each unique site can be visited once for devotion gain.',
  },
  {
    id: 'sacrifice',
    label: 'Sacrifice',
    category: 'variable',
    devotionDelta: '1–3 depending on value and deity alignment',
    frequency: 'Once per downtime period',
    timeRequired: '1 hour ritual',
    notes:
      'Minor sacrifice (candle, food, small coin): +1. Significant sacrifice (valuable item, weeks of labor): +2. Major sacrifice (irreplaceable treasure, personal hardship): +3. Blood sacrifice is only appropriate for evil or neutral deities; using it for good deities grants -2 instead.',
  },
  {
    id: 'build_shrine',
    label: 'Build or Fund a Shrine',
    category: 'gain',
    devotionDelta: 3,
    frequency: 'Once per structure built',
    timeRequired: '1 week construction (shrine) or 1 month+ (temple)',
    notes:
      'Shrine: +3 devotion. Full temple: +5 devotion (treated as two separate gains; +3 on groundbreaking, +2 on consecration). The character must personally commission or build it, not simply donate to an existing project.',
  },
  {
    id: 'convert_others',
    label: 'Convert or Inspire Another Worshipper',
    category: 'gain',
    devotionDelta: 1,
    frequency: 'Once per NPC successfully converted',
    timeRequired: 'Varies (days to months of interaction)',
    notes:
      'NPC must begin genuine, ongoing worship (DM discretion). Simply telling someone about the deity does not count. Gain is capped at +3 total from conversions to prevent exploitation.',
  },
  {
    id: 'holy_quest',
    label: 'Complete a Holy Quest',
    category: 'gain',
    devotionDelta: '3–5 depending on scope',
    frequency: 'Per quest completed',
    timeRequired: 'Adventure duration',
    notes:
      'Minor holy quest (single session): +3. Major holy quest (multi-session arc): +4. Epic holy quest (campaign-level undertaking in the deity\'s name): +5. Quest must be explicitly undertaken in the deity\'s name and completed successfully.',
  },
  {
    id: 'blasphemy',
    label: 'Blasphemy',
    category: 'loss',
    devotionDelta: -3,
    frequency: 'Per incident',
    timeRequired: 'Instantaneous',
    notes:
      'Publicly mocking, denying, or defiling the deity\'s name, symbol, or clergy in a way that reflects the character\'s genuine contempt. Accidental offenses or those done under magical compulsion do not apply.',
  },
  {
    id: 'desecrate',
    label: 'Desecrate a Holy Site or Symbol',
    category: 'loss',
    devotionDelta: -5,
    frequency: 'Per incident',
    timeRequired: 'Instantaneous',
    notes:
      'Deliberately destroying a shrine, defiling a holy relic, killing clergy of the deity, or committing a grave sin specifically prohibited by the deity\'s doctrine. This is the most severe devotion loss short of switching religions entirely.',
  },
];

// ---------------------------------------------------------------------------
// DIVINE_INTERVENTION
// ---------------------------------------------------------------------------

/**
 * Expanded divine intervention table for Cleric level 10+ (PHB p. 59).
 *
 * Core mechanic: Roll percentile dice (d100). If result <= cleric level, intervention succeeds.
 * A successful roll triggers an effect appropriate to the deity's domain.
 *
 * Each entry covers one domain and lists possible effects (roll 1d4 or DM chooses).
 *
 * Fields:
 *   domain   {string}   cleric domain name
 *   effects  {object[]} array of possible intervention outcomes
 *     - id       {string}
 *     - label    {string}
 *     - effect   {string}  mechanical description
 */
export const DIVINE_INTERVENTION = [
  {
    domain: 'Life',
    effects: [
      {
        id: 'life_mass_heal',
        label: 'Wave of Restoration',
        effect:
          'All allies within 60 ft. are restored to their maximum hit points and any one condition (poisoned, blinded, paralyzed, etc.) is removed from each.',
      },
      {
        id: 'life_revive',
        label: 'Return from the Threshold',
        effect:
          'One creature that died within the last minute is restored to life with half their maximum hit points, as if by Raise Dead but without the exhaustion penalty.',
      },
      {
        id: 'life_sanctuary',
        label: 'Divine Sanctuary',
        effect:
          'A shimmering field of holy energy covers the area (60 ft. radius). All healing within the field is maximized for 1 minute.',
      },
      {
        id: 'life_banish_undead',
        label: 'Purge the Undead',
        effect:
          'All undead within 120 ft. of the cleric must succeed on a DC 20 Wisdom saving throw or be destroyed outright (CR ≤ cleric level / 2) or turned for 1 minute.',
      },
    ],
  },
  {
    domain: 'Light',
    effects: [
      {
        id: 'light_sunburst',
        label: 'Celestial Sunburst',
        effect:
          'A column of brilliant sunlight strikes the target point (120 ft. range). All creatures in a 60 ft. radius must succeed on a DC 20 Constitution save or take 12d6 radiant damage and be blinded for 1 minute (half damage, not blinded on a success). Undead and oozes have disadvantage.',
      },
      {
        id: 'light_reveal',
        label: 'Truth Revealed',
        effect:
          'All illusions, invisible creatures, and shapechangers within 120 ft. are revealed for 10 minutes. No saving throw.',
      },
      {
        id: 'light_beacon',
        label: 'Beacon of Hope',
        effect:
          'All allies within 60 ft. gain advantage on Wisdom saving throws and death saving throws, and regain the maximum number of hit points possible from any healing for 1 minute.',
      },
      {
        id: 'light_wall',
        label: 'Wall of Sacred Flame',
        effect:
          'A wall of divine fire (as Wall of Fire, but dealing radiant damage) springs into existence at a location the cleric can see within 120 ft. It lasts 10 minutes without concentration.',
      },
    ],
  },
  {
    domain: 'War',
    effects: [
      {
        id: 'war_martial_surge',
        label: 'Martial Surge',
        effect:
          'All allies within 60 ft. may immediately make one weapon attack as a reaction. These attacks score a critical hit on a roll of 18–20 until the start of the cleric\'s next turn.',
      },
      {
        id: 'war_divine_armor',
        label: 'Armor of the Warlord',
        effect:
          'The cleric and up to 6 allies gain +5 to AC and immunity to the frightened condition for 1 minute.',
      },
      {
        id: 'war_smite_enemy',
        label: 'Divine Smite of the Champion',
        effect:
          'One enemy the cleric can see within 120 ft. takes 10d10 thunder and radiant damage and is knocked prone. No attack roll; Constitution save DC 20 for half damage and not knocked prone.',
      },
      {
        id: 'war_battle_blessing',
        label: 'Blessing of Battle',
        effect:
          'All allies within 60 ft. may add 1d8 to all attack rolls and damage rolls for 1 minute.',
      },
    ],
  },
  {
    domain: 'Knowledge',
    effects: [
      {
        id: 'know_omniscience',
        label: 'Flash of Omniscience',
        effect:
          'The cleric instantly knows the answer to one question (as if by Legend Lore) and gains advantage on all Intelligence checks for 24 hours.',
      },
      {
        id: 'know_reveal_hidden',
        label: 'Unveil the Hidden',
        effect:
          'All secret doors, traps, and hidden objects within 120 ft. are revealed to the cleric and their party for 10 minutes.',
      },
      {
        id: 'know_enemy_weakness',
        label: 'Know Thy Enemy',
        effect:
          'The cleric learns all statistics, abilities, resistances, immunities, and vulnerabilities of up to 3 enemies they can see. All attacks by the party against those targets ignore resistance for 1 minute.',
      },
      {
        id: 'know_ward_mind',
        label: 'Ward of the Mind',
        effect:
          'All allies within 60 ft. are immune to psychic damage, the charmed condition, and the frightened condition for 1 hour.',
      },
    ],
  },
  {
    domain: 'Tempest',
    effects: [
      {
        id: 'tempest_storm_call',
        label: 'Call the Storm',
        effect:
          'A violent storm erupts in a 120 ft. radius. All enemies must succeed on a DC 20 Strength saving throw each round or be knocked prone. Lightning strikes one random enemy each round for 6d6 lightning damage (Dexterity save DC 20 for half) for 1 minute.',
      },
      {
        id: 'tempest_thunder_wave',
        label: 'Wrath of the Gale',
        effect:
          'A massive thunderwave (as Thunderwave but 60 ft. cube) erupts from the cleric. All creatures in the area take 8d8 thunder damage and are pushed 30 ft. (Constitution save DC 20 for half, not pushed).',
      },
      {
        id: 'tempest_fog',
        label: 'Shroud of the Tempest',
        effect:
          'Thick magical fog and howling winds fill a 120 ft. radius for 10 minutes. Enemies within are deafened and have disadvantage on ranged attack rolls. Allies are unaffected.',
      },
      {
        id: 'tempest_lightning_shield',
        label: 'Living Lightning',
        effect:
          'The cleric becomes wreathed in lightning for 1 minute. Any creature that hits the cleric with a melee attack takes 3d6 lightning damage. The cleric\'s melee attacks deal an additional 3d6 lightning damage.',
      },
    ],
  },
  {
    domain: 'Nature',
    effects: [
      {
        id: 'nature_wild_growth',
        label: 'Wild Surge',
        effect:
          'Vines, roots, and undergrowth erupt in a 60 ft. radius (as Entangle but DC 20 and covering the full area). The terrain becomes difficult terrain for enemies for 10 minutes.',
      },
      {
        id: 'nature_animal_swarm',
        label: 'Call of the Wild',
        effect:
          'A swarm of animals (as Conjure Animals, 8 CR 1/2 beasts) appears and fights for the party for 1 minute without requiring concentration.',
      },
      {
        id: 'nature_restoration',
        label: 'Nature\'s Restoration',
        effect:
          'All poison, disease, and curse effects are removed from the cleric and all allies within 60 ft. All affected allies also regain 4d8 + 20 hit points.',
      },
      {
        id: 'nature_earth_wrath',
        label: 'Wrath of the Earth',
        effect:
          'The ground in a 60 ft. radius around a point the cleric can see within 120 ft. shakes and splits. All enemies in the area must make a DC 20 Dexterity save or fall prone and take 6d8 bludgeoning damage (half on success).',
      },
    ],
  },
  {
    domain: 'Trickery',
    effects: [
      {
        id: 'trickery_mass_confusion',
        label: 'Veil of Madness',
        effect:
          'All enemies within 60 ft. must succeed on a DC 20 Wisdom save or be affected by Confusion for 1 minute.',
      },
      {
        id: 'trickery_duplicates',
        label: 'Mirror Army',
        effect:
          'Each ally within 60 ft. gains the effect of Mirror Image (3 duplicates each) for 1 minute.',
      },
      {
        id: 'trickery_mass_invis',
        label: 'Vanishing Act',
        effect:
          'The cleric and up to 8 allies become invisible (as Greater Invisibility) for 1 minute. The invisibility does not end when an affected creature attacks or casts a spell.',
      },
      {
        id: 'trickery_swap',
        label: 'Divine Transposition',
        effect:
          'The deity swaps the positions of up to 4 enemies, teleporting each to another enemy\'s space. All affected enemies must make a DC 20 Wisdom save or be stunned until the end of the cleric\'s next turn.',
      },
    ],
  },
  {
    domain: 'Death',
    effects: [
      {
        id: 'death_finger',
        label: 'Touch of the Reaper',
        effect:
          'One creature the cleric can see within 120 ft. must succeed on a DC 20 Constitution save or drop to 0 hit points. On a success, the creature takes 10d10 necrotic damage instead.',
      },
      {
        id: 'death_undead_army',
        label: 'Risen Legion',
        effect:
          'Up to 6 corpses within 60 ft. rise as undead under the cleric\'s command (as Animate Dead) for 1 hour without requiring concentration.',
      },
      {
        id: 'death_drain_area',
        label: 'Life Drain',
        effect:
          'All enemies within 60 ft. take 6d8 necrotic damage (Constitution save DC 20 for half). The cleric regains hit points equal to the total damage dealt.',
      },
      {
        id: 'death_word',
        label: 'Word of Death',
        effect:
          'The cleric speaks a single word of divine power. All enemies within 60 ft. with 50 hit points or fewer die instantly. No saving throw.',
      },
    ],
  },
  {
    domain: 'Forge',
    effects: [
      {
        id: 'forge_divine_arms',
        label: 'Divinely Forged Arms',
        effect:
          'All weapons and armor worn or carried by allies within 60 ft. become magical (+3) and resistant to damage for 1 hour.',
      },
      {
        id: 'forge_iron_ward',
        label: 'Iron Ward',
        effect:
          'The cleric and allies within 30 ft. gain immunity to nonmagical bludgeoning, piercing, and slashing damage for 1 minute.',
      },
      {
        id: 'forge_construct',
        label: 'Iron Sentinel',
        effect:
          'A massive iron golem (use Iron Golem stat block) is summoned and fights for the party for 1 hour without requiring concentration.',
      },
      {
        id: 'forge_shatter_enemy',
        label: 'Shatter the Unworthy',
        effect:
          'One enemy within 120 ft. must succeed on a DC 20 Constitution saving throw or have all their worn and carried items destroyed and take 8d8 force damage (half damage, items intact on success).',
      },
    ],
  },
  {
    domain: 'Grave',
    effects: [
      {
        id: 'grave_path_of_death',
        label: 'Path Denied',
        effect:
          'All death saving throw failures made by allies within 60 ft. are treated as successes for 1 minute. Creatures cannot die while in this area.',
      },
      {
        id: 'grave_final_rest',
        label: 'Final Rest',
        effect:
          'All undead within 120 ft. with a CR of 10 or lower are destroyed instantly. Undead with CR above 10 take 10d10 radiant damage.',
      },
      {
        id: 'grave_soul_recall',
        label: 'Soul Recall',
        effect:
          'Up to 3 allies who died in the last 10 minutes are restored to life with full hit points and no exhaustion levels, as if by True Resurrection.',
      },
      {
        id: 'grave_mark',
        label: 'Mark of the Grave',
        effect:
          'One creature within 120 ft. is marked for death. The marked creature has vulnerability to all damage and cannot regain hit points for 1 minute. No saving throw.',
      },
    ],
  },
  {
    domain: 'Order',
    effects: [
      {
        id: 'order_compel',
        label: 'Divine Edict',
        effect:
          'All enemies within 60 ft. must succeed on a DC 20 Wisdom save or be forced to stop all hostile actions and stand motionless until the end of the cleric\'s next turn (as if stunned).',
      },
      {
        id: 'order_coordinated_strike',
        label: 'Coordinated Divine Strike',
        effect:
          'All allies within 60 ft. may immediately use their reaction to make one attack. All these attacks are made with advantage and automatically deal maximum damage.',
      },
      {
        id: 'order_law_ward',
        label: 'Ward of Law',
        effect:
          'All allies within 60 ft. are immune to the charmed, frightened, and confused conditions and cannot be magically compelled for 1 hour.',
      },
      {
        id: 'order_judgement',
        label: 'Divine Judgement',
        effect:
          'One creature that has broken an oath, law, or sacred covenant within the past 24 hours takes 15d10 radiant damage and is paralyzed for 1 minute (Constitution save DC 20 for half and not paralyzed).',
      },
    ],
  },
  {
    domain: 'Peace',
    effects: [
      {
        id: 'peace_cease',
        label: 'Moment of Serenity',
        effect:
          'All combat within 120 ft. pauses for 1 minute. No creature can make an attack, cast a harmful spell, or take a hostile action during this time (Wisdom save DC 20 to resist). Compelled creatures automatically succeed on the save.',
      },
      {
        id: 'peace_mass_calm',
        label: 'Divine Calm',
        effect:
          'All hostile creatures within 120 ft. must succeed on a DC 20 Wisdom save or become indifferent to the party for 1 hour, ceasing all combat.',
      },
      {
        id: 'peace_empathy',
        label: 'Empathic Shield',
        effect:
          'All allies within 60 ft. gain the Emboldening Bond feature (Peace Cleric subclass) linking all of them. Linked allies add 1d4 to all saving throws and may teleport to a linked ally\'s space when they take damage (reaction). Lasts 1 hour.',
      },
      {
        id: 'peace_restoration_wave',
        label: 'Wave of Restoration',
        effect:
          'All negative conditions (charmed, frightened, paralyzed, poisoned, stunned, etc.) are removed from all allies within 120 ft. Each ally regains 5d8 + 20 hit points.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// HOLY_DAYS
// ---------------------------------------------------------------------------

/**
 * Eight template holy day archetypes that can be assigned to any deity.
 * DMs customize names and details; the mechanics are system-level.
 *
 * Fields:
 *   id           {string}
 *   type         {string}   archetype name
 *   description  {string}   what this holy day represents
 *   typicalActivities {string[]}  common observances
 *   mechanicalBonuses {object[]} in-game bonuses during celebration
 *     - bonus    {string}   description of the bonus
 *     - duration {string}   how long the bonus lasts
 *     - condition {string}  who/what qualifies
 */
export const HOLY_DAYS = [
  {
    id: 'solstice',
    type: 'Solstice (Summer or Winter)',
    description:
      'The longest or shortest day of the year. A time when the deity\'s power is said to be at its peak or at its most vulnerable, and great deeds are demanded.',
    typicalActivities: [
      'All-day prayer vigils',
      'Lighting bonfires or candles at dusk',
      'Fasting followed by a feast',
      'Outdoor processions to sacred sites',
      'Ritual cleansing in natural water',
    ],
    mechanicalBonuses: [
      {
        bonus: '+2 to all Charisma (Persuasion) checks made to spread the faith',
        duration: '24 hours',
        condition: 'Worshippers of the deity who observed the holy day rites',
      },
      {
        bonus: 'Spells with the deity\'s domain descriptor are cast at +1 effective level',
        duration: '24 hours (sunrise to sunrise)',
        condition: 'Clerics and paladins who completed at least 1 hour of observance',
      },
    ],
  },
  {
    id: 'equinox',
    type: 'Equinox (Spring or Autumn)',
    description:
      'A time of balance between day and night. Often associated with renewal, transition, and the weighing of souls or deeds.',
    typicalActivities: [
      'Public confessions or penance',
      'Planting (spring) or harvest offerings (autumn)',
      'Reaffirmation of oaths',
      'Judgment ceremonies for the accused',
      'Gift exchanges among worshippers',
    ],
    mechanicalBonuses: [
      {
        bonus: 'Advantage on death saving throws',
        duration: '24 hours',
        condition: 'Worshippers who completed equinox rites',
      },
      {
        bonus: '+1 devotion score (one-time, from completing the day\'s rites)',
        duration: 'Permanent',
        condition: 'Devout tier or higher who fully observed the holy day',
      },
    ],
  },
  {
    id: 'founding_day',
    type: 'Founding Day',
    description:
      'Commemorates the establishment of the religion, the deity\'s first great act, or the founding of the primary temple. A patriotic and spiritual celebration.',
    typicalActivities: [
      'Retelling the founding myth',
      'Initiation of new clergy or converts',
      'Competitions of arms or intellect aligned with the deity\'s domain',
      'Grand feasts funded by the temple',
      'Rededication oaths by existing clergy',
    ],
    mechanicalBonuses: [
      {
        bonus: '+2 to all attack rolls or skill checks related to the deity\'s primary domain',
        duration: '24 hours',
        condition: 'Worshippers who attended the founding day ceremony',
      },
      {
        bonus: 'Inspiration (as per bardic inspiration) that can only be used on domain-related actions',
        duration: 'Until used or 24 hours pass',
        condition: 'Those who swore or renewed an oath to the deity on this day',
      },
    ],
  },
  {
    id: 'saints_feast',
    type: 'Saint\'s Feast Day',
    description:
      'Celebrates a mortal who exemplified the deity\'s teachings and was elevated to sainthood or exaltation. Devotees seek to emulate the saint\'s specific virtue.',
    typicalActivities: [
      'Charitable acts honoring the saint\'s virtue',
      'Reciting the saint\'s story',
      'Sharing a communal meal mirroring the saint\'s humility or excess',
      'Prayers for miraculous intercession',
      'Pilgrimage to the saint\'s burial site or monument',
    ],
    mechanicalBonuses: [
      {
        bonus: 'Healing spells restore +1d6 additional hit points',
        duration: '24 hours',
        condition: 'Worshippers who completed an act of charity in the saint\'s name',
      },
      {
        bonus: 'Once during the day, may reroll one failed saving throw (keeping the new result)',
        duration: '24 hours',
        condition: 'Casual tier or higher who attended the feast',
      },
    ],
  },
  {
    id: 'harvest_festival',
    type: 'Harvest Festival',
    description:
      'A thanksgiving celebration for abundance, tied to deities of nature, life, or prosperity. Communities gather to share, feast, and honor the year\'s blessings.',
    typicalActivities: [
      'Offering first fruits or crafts at the altar',
      'Community feasts open to the poor',
      'Dancing, music, and storytelling',
      'Contests of agricultural or domestic skill',
      'Blessings of crops, animals, and tools for the coming season',
    ],
    mechanicalBonuses: [
      {
        bonus: '+2 to Constitution saving throws for 1 week following the festival',
        duration: '7 days',
        condition: 'Worshippers who partook in the communal feast and offering',
      },
      {
        bonus: 'Short rests restore the maximum number of hit dice rolled',
        duration: '24 hours',
        condition: 'Attendees who participated in festival activities',
      },
    ],
  },
  {
    id: 'day_of_the_dead',
    type: 'Day of the Dead',
    description:
      'A solemn observance honoring ancestors, fallen heroes, and the cycle of death. Associated with deities of death, grave, or life. The veil between worlds is thin.',
    typicalActivities: [
      'Lighting candles and placing offerings at graves',
      'Telling stories of the honored dead',
      'Fasting from sunrise to midnight',
      'Rituals to ease the restless dead',
      'Séance-like ceremonies to commune with departed souls',
    ],
    mechanicalBonuses: [
      {
        bonus: 'Once per day, a cleric may cast Speak with Dead without expending a spell slot',
        duration: '24 hours',
        condition: 'Clerics of the observing faith',
      },
      {
        bonus: 'Undead summoned or controlled on this day have +2 to their attack rolls',
        duration: '24 hours',
        condition: 'Clerics of death/grave domains',
      },
    ],
  },
  {
    id: 'purification',
    type: 'Day of Purification',
    description:
      'A period of ritual cleansing to drive out sin, corruption, or malevolent spirits. Worshippers undergo symbolic or literal purification rites.',
    typicalActivities: [
      'Ritual bathing in blessed or running water',
      'Burning of written sins or regrets',
      'Fasting and silence for a period (sunrise to noon)',
      'Confession to a priest with assigned penance',
      'Smudging homes and possessions with sacred herbs or fire',
    ],
    mechanicalBonuses: [
      {
        bonus: 'All curses and magical diseases are suppressed for 24 hours (not removed, just dormant)',
        duration: '24 hours',
        condition: 'Worshippers who completed the purification ritual',
      },
      {
        bonus: 'Immunity to the poisoned condition',
        duration: '24 hours',
        condition: 'Participants who completed the full fast and cleansing',
      },
    ],
  },
  {
    id: 'pilgrimage_season',
    type: 'Pilgrimage Season',
    description:
      'A designated period (usually 2–4 weeks) when travel to the deity\'s holiest site is expected of all true believers. The roads are crowded; strangers share food and shelter.',
    typicalActivities: [
      'Travel to the primary holy site (often the founding temple or a sacred natural feature)',
      'Wearing simple, humble clothing to strip away status',
      'Performing small acts of service for fellow pilgrims',
      'Completing assigned trials or tests at the holy site',
      'Receiving a blessing from the high priest upon completion',
    ],
    mechanicalBonuses: [
      {
        bonus: '+2 devotion upon successful completion of the pilgrimage (replaces standard pilgrimage gain)',
        duration: 'Permanent',
        condition: 'Worshippers who completed the full journey and rites',
      },
      {
        bonus: 'The character may ask the DM one yes/no question about their deity\'s will, which must be answered honestly',
        duration: 'Once per pilgrimage season',
        condition: 'Champion tier or higher who completed the pilgrimage',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DOMAIN_BLESSINGS
// ---------------------------------------------------------------------------

/**
 * Minor blessings available to devoted worshippers, organized by cleric domain.
 * Each blessing has a tier (minor, major, avatar) corresponding to devotion level.
 *
 * minor blessings: available at Devout (5–6) and above
 * major blessings: available at Zealot (7–8) and above
 * avatar blessing: available at Champion (9) and above
 *
 * Fields per blessing:
 *   id        {string}
 *   tier      {string}  'minor' | 'major' | 'avatar'
 *   label     {string}
 *   effect    {string}  mechanical description
 *   frequency {string}  how often the benefit can be used
 */
export const DOMAIN_BLESSINGS = {
  Life: [
    {
      id: 'life_stabilize',
      tier: 'minor',
      label: 'Touch of Mercy',
      effect:
          'Once per day, the worshipper can stabilize a dying creature (0 HP, making death saving throws) as a bonus action without needing a Medicine check or spell.',
      frequency: 'Once per day',
    },
    {
      id: 'life_medicine_bonus',
      tier: 'minor',
      label: 'Healer\'s Instinct',
      effect: '+1 bonus to all Medicine skill checks. When rolling Hit Dice during a short rest, the worshipper may reroll any 1s (must keep the new result).',
      frequency: 'Passive',
    },
    {
      id: 'life_bonus_healing',
      tier: 'major',
      label: 'Wellspring of Life',
      effect:
          'When the worshipper casts a healing spell of 1st level or higher, the target regains 1d4 additional hit points.',
      frequency: 'Passive (applies to all healing spells)',
    },
    {
      id: 'life_defy_death',
      tier: 'avatar',
      label: 'Defy Death',
      effect:
          'Once per long rest, when the worshipper would drop to 0 hit points, they instead drop to 1 hit point. This does not require any action.',
      frequency: 'Once per long rest',
    },
  ],

  Light: [
    {
      id: 'light_darkvision',
      tier: 'minor',
      label: 'Blessed Sight',
      effect:
          'The worshipper gains darkvision out to 30 ft. If they already have darkvision, its range increases by 30 ft.',
      frequency: 'Passive',
    },
    {
      id: 'light_sacred_flame_bonus',
      tier: 'minor',
      label: 'Empowered Flame',
      effect:
          'Sacred Flame and other fire/radiant cantrips deal +1 damage per die when cast by this worshipper.',
      frequency: 'Passive',
    },
    {
      id: 'light_blind_immunity',
      tier: 'major',
      label: 'Eyes of Truth',
      effect:
          'The worshipper has advantage on saving throws against the blinded condition and against illusion spells.',
      frequency: 'Passive',
    },
    {
      id: 'light_radiance',
      tier: 'avatar',
      label: 'Living Radiance',
      effect:
          'Once per long rest, the worshipper may emit a 30 ft. radius burst of holy light as a bonus action. All undead within range take 3d6 radiant damage and are blinded until the end of the worshipper\'s next turn (Constitution save DC 14 for half, not blinded).',
      frequency: 'Once per long rest',
    },
  ],

  War: [
    {
      id: 'war_weapon_bonus',
      tier: 'minor',
      label: 'Battle-Blessed Blade',
      effect:
          'Once per long rest, the worshipper may bless their weapon as a bonus action. For 1 minute, the weapon is treated as magical and deals an additional 1d4 radiant damage per hit.',
      frequency: 'Once per long rest',
    },
    {
      id: 'war_initiative',
      tier: 'minor',
      label: 'Warrior\'s Reflexes',
      effect: '+2 bonus to initiative rolls.',
      frequency: 'Passive',
    },
    {
      id: 'war_second_wind',
      tier: 'major',
      label: 'Battlefield Resilience',
      effect:
          'Once per short or long rest, as a bonus action, the worshipper can regain 1d10 + their proficiency bonus hit points.',
      frequency: 'Once per short or long rest',
    },
    {
      id: 'war_cleave',
      tier: 'avatar',
      label: 'Divine Cleave',
      effect:
          'Once per long rest, when the worshipper reduces a creature to 0 HP with a melee attack, they may immediately make one additional melee attack against another creature within reach.',
      frequency: 'Once per long rest',
    },
  ],

  Knowledge: [
    {
      id: 'know_language',
      tier: 'minor',
      label: 'Gift of Tongues',
      effect:
          'The worshipper can understand (but not speak) any spoken language. Once per day, they may also speak any one language fluently for 10 minutes.',
      frequency: 'Understand: Passive. Speak: Once per day',
    },
    {
      id: 'know_history_bonus',
      tier: 'minor',
      label: 'Lore Keeper',
      effect: '+2 bonus to all History and Arcana skill checks.',
      frequency: 'Passive',
    },
    {
      id: 'know_identify',
      tier: 'major',
      label: 'Discerning Mind',
      effect:
          'Once per day, the worshipper may cast Identify as a ritual (no components required).',
      frequency: 'Once per day',
    },
    {
      id: 'know_portent',
      tier: 'avatar',
      label: 'Fragment of Foresight',
      effect:
          'Once per long rest, after rolling a d20 for an attack roll, ability check, or saving throw, the worshipper may replace the result with a 15 (as if they had rolled a 15).',
      frequency: 'Once per long rest',
    },
  ],

  Tempest: [
    {
      id: 'tempest_swim',
      tier: 'minor',
      label: 'Child of the Storm',
      effect:
          'The worshipper has a swimming speed equal to their walking speed and can breathe underwater for up to 10 minutes before needing to surface.',
      frequency: 'Passive',
    },
    {
      id: 'tempest_thunder_resist',
      tier: 'minor',
      label: 'Storm-Hardened',
      effect: 'Resistance to lightning and thunder damage.',
      frequency: 'Passive',
    },
    {
      id: 'tempest_push',
      tier: 'major',
      label: 'Gale Force',
      effect:
          'Once per short or long rest, when the worshipper deals lightning or thunder damage, they may push the target up to 15 ft. in any direction (no save).',
      frequency: 'Once per short or long rest',
    },
    {
      id: 'tempest_storm_form',
      tier: 'avatar',
      label: 'Eye of the Storm',
      effect:
          'Once per long rest, as an action, the worshipper becomes wreathed in storm energy for 1 minute: they gain immunity to lightning and thunder damage, and any creature that hits them with a melee attack takes 2d6 lightning damage.',
      frequency: 'Once per long rest',
    },
  ],

  Nature: [
    {
      id: 'nature_animal_friend',
      tier: 'minor',
      label: 'Friend of Beasts',
      effect:
          'Natural beasts will not attack the worshipper unless provoked or under magical compulsion. The worshipper has advantage on Animal Handling checks.',
      frequency: 'Passive',
    },
    {
      id: 'nature_foraging',
      tier: 'minor',
      label: 'Nature\'s Larder',
      effect:
          '+2 to Survival checks. The worshipper always finds enough food and water for themselves and up to 3 others during a day of travel through natural terrain.',
      frequency: 'Passive',
    },
    {
      id: 'nature_plant_pass',
      tier: 'major',
      label: 'Verdant Path',
      effect:
          'Difficult terrain caused by plants, undergrowth, or natural growth does not cost extra movement for the worshipper.',
      frequency: 'Passive',
    },
    {
      id: 'nature_wild_shape_minor',
      tier: 'avatar',
      label: 'Wild Touch',
      effect:
          'Once per long rest, the worshipper may polymorph into any beast of CR 1 or lower (as Polymorph, self only) for up to 1 hour. They retain their personality and memories but gain the beast\'s statistics.',
      frequency: 'Once per long rest',
    },
  ],

  Trickery: [
    {
      id: 'trickery_disguise',
      tier: 'minor',
      label: 'Face of Many',
      effect:
          'Once per day, the worshipper may cast Disguise Self without expending a spell slot. The disguise lasts up to 1 hour.',
      frequency: 'Once per day',
    },
    {
      id: 'trickery_deception_bonus',
      tier: 'minor',
      label: 'Silver Tongue',
      effect: '+2 to Deception and Sleight of Hand checks.',
      frequency: 'Passive',
    },
    {
      id: 'trickery_lucky',
      tier: 'major',
      label: 'Favored by Fortune',
      effect:
          'Once per long rest, the worshipper may reroll any one d20 roll (attack, save, or check) after seeing the result, keeping the new roll.',
      frequency: 'Once per long rest',
    },
    {
      id: 'trickery_shadow_step',
      tier: 'avatar',
      label: 'Shadow Step',
      effect:
          'Once per short or long rest, as a bonus action in dim light or darkness, the worshipper may teleport up to 60 ft. to another area of dim light or darkness they can see.',
      frequency: 'Once per short or long rest',
    },
  ],

  Death: [
    {
      id: 'death_necrotic_resist',
      tier: 'minor',
      label: 'Hollow Vessel',
      effect: 'Resistance to necrotic damage and advantage on saving throws against the frightened condition.',
      frequency: 'Passive',
    },
    {
      id: 'death_speak_dead',
      tier: 'minor',
      label: 'Commune with the Fallen',
      effect:
          'Once per day, the worshipper may cast Speak with Dead (no spell slot, no components).',
      frequency: 'Once per day',
    },
    {
      id: 'death_drain_touch',
      tier: 'major',
      label: 'Draining Touch',
      effect:
          'Once per long rest, as an action, the worshipper makes a melee touch attack. On a hit, the target takes 4d8 necrotic damage and the worshipper regains hit points equal to half the damage dealt.',
      frequency: 'Once per long rest',
    },
    {
      id: 'death_undying',
      tier: 'avatar',
      label: 'Undying Pact',
      effect:
          'Once per long rest, when the worshipper is reduced to 0 HP and would die, they may instead succeed on all death saving throws this turn automatically and stand at 1 HP at the start of their next turn.',
      frequency: 'Once per long rest',
    },
  ],

  Forge: [
    {
      id: 'forge_tool_bonus',
      tier: 'minor',
      label: 'Master Craftsman',
      effect:
          '+2 to all checks made with artisan\'s tools. When crafting an item, the time required is reduced by one-quarter.',
      frequency: 'Passive',
    },
    {
      id: 'forge_identify_items',
      tier: 'minor',
      label: 'Item Lore',
      effect:
          'By touching a crafted object for 1 minute, the worshipper learns its composition, how it was made, and any magical properties (as Identify).',
      frequency: 'Unlimited (1 minute per item)',
    },
    {
      id: 'forge_repair',
      tier: 'major',
      label: 'Mending Hands',
      effect:
          'Once per short or long rest, as an action, the worshipper may fully repair one broken nonmagical item (as Mending but instantaneous and covers major breaks, not just tiny cracks).',
      frequency: 'Once per short or long rest',
    },
    {
      id: 'forge_iron_skin',
      tier: 'avatar',
      label: 'Iron Skin',
      effect:
          'Once per long rest, as a bonus action, the worshipper gains resistance to nonmagical bludgeoning, piercing, and slashing damage for 1 minute.',
      frequency: 'Once per long rest',
    },
  ],

  Grave: [
    {
      id: 'grave_sense_undead',
      tier: 'minor',
      label: 'Death Sense',
      effect:
          'The worshipper can sense the presence of undead within 30 ft. (as Detect Evil and Good, undead only). This is always active and does not require concentration.',
      frequency: 'Passive',
    },
    {
      id: 'grave_protect_dying',
      tier: 'minor',
      label: 'Warden of the Threshold',
      effect:
          'Once per day, as a reaction when an ally within 30 ft. would make a death saving throw, the worshipper may grant that ally advantage on the roll.',
      frequency: 'Once per day',
    },
    {
      id: 'grave_undead_ward',
      tier: 'major',
      label: 'Hallowed Ground',
      effect:
          'Once per long rest, as an action, the worshipper consecrates their current space in a 15 ft. radius. Undead cannot willingly enter this area for 1 hour (Wisdom save DC 14 to attempt entry each round).',
      frequency: 'Once per long rest',
    },
    {
      id: 'grave_last_rites',
      tier: 'avatar',
      label: 'Last Rites',
      effect:
          'Once per long rest, as an action over a fallen humanoid\'s body, the worshipper ensures they cannot be raised as undead for 1 year and 1 day, and the soul is immediately conveyed to its proper afterlife with no risk of entrapment.',
      frequency: 'Once per long rest',
    },
  ],

  Order: [
    {
      id: 'order_focus',
      tier: 'minor',
      label: 'Disciplined Mind',
      effect:
          'Advantage on saving throws against the charmed and frightened conditions.',
      frequency: 'Passive',
    },
    {
      id: 'order_presence',
      tier: 'minor',
      label: 'Voice of Authority',
      effect:
          '+2 to Intimidation and Persuasion checks when speaking to enforce law, order, or legitimate authority.',
      frequency: 'Passive (situational)',
    },
    {
      id: 'order_ally_bonus',
      tier: 'major',
      label: 'Inspiring Command',
      effect:
          'Once per short or long rest, as a bonus action, the worshipper may grant one ally within 30 ft. an extra action on that ally\'s next turn (as Action Surge).',
      frequency: 'Once per short or long rest',
    },
    {
      id: 'order_edict',
      tier: 'avatar',
      label: 'Word of Law',
      effect:
          'Once per long rest, the worshipper may issue a divine command (as Command, 5th level — affecting up to 6 creatures) with no spell slot required. Save DC is 8 + proficiency bonus + Charisma modifier.',
      frequency: 'Once per long rest',
    },
  ],

  Peace: [
    {
      id: 'peace_calm_presence',
      tier: 'minor',
      label: 'Calming Presence',
      effect:
          'Once per day, the worshipper may end one hostile creature\'s aggression directed at themselves (Wisdom save DC 13) as an action, causing the creature to become indifferent for 1 minute.',
      frequency: 'Once per day',
    },
    {
      id: 'peace_healing_touch',
      tier: 'minor',
      label: 'Gentle Touch',
      effect:
          'Once per short or long rest, as an action, the worshipper may restore 1d6 + Wisdom modifier hit points to one creature they touch (no spell required).',
      frequency: 'Once per short or long rest',
    },
    {
      id: 'peace_link',
      tier: 'major',
      label: 'Soul Link',
      effect:
          'Once per long rest, the worshipper may link themselves to one willing creature within 30 ft. for 1 hour. While linked, when either creature takes damage, they can transfer up to half that damage to the other (reaction).',
      frequency: 'Once per long rest',
    },
    {
      id: 'peace_sanctuary',
      tier: 'avatar',
      label: 'Mantle of Peace',
      effect:
          'Once per long rest, as a bonus action, the worshipper emanates an aura of peace in a 30 ft. radius for 1 minute. All creatures in the aura that are not actively attacking have advantage on Charisma (Persuasion) checks, and all attack rolls against the worshipper are made at disadvantage unless the attacker succeeds on a DC 15 Wisdom save.',
      frequency: 'Once per long rest',
    },
  ],
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the devotion level object for a given numeric score.
 *
 * @param {number} score - Devotion score (0–10, clamped automatically)
 * @returns {object} The matching DEVOTION_LEVELS entry
 */
export function getDevotionLevel(score) {
  const clamped = Math.max(0, Math.min(10, Math.round(score)));
  return (
    DEVOTION_LEVELS.find(
      (level) => clamped >= level.min && clamped <= level.max
    ) || DEVOTION_LEVELS[0]
  );
}

/**
 * Applies a worship action to a current devotion score and returns the new score.
 * Score is clamped to [0, 10].
 *
 * @param {number} currentScore - Current devotion score
 * @param {string} actionId     - ID from WORSHIP_ACTIONS (e.g. 'pray_daily')
 * @param {number} [overrideDelta] - Optional manual delta for variable actions (e.g. sacrifice)
 * @returns {{ newScore: number, delta: number, action: object|null }}
 */
export function modifyDevotion(currentScore, actionId, overrideDelta = null) {
  const action = WORSHIP_ACTIONS.find((a) => a.id === actionId);
  if (!action) {
    return { newScore: currentScore, delta: 0, action: null };
  }

  let delta;
  if (overrideDelta !== null) {
    delta = overrideDelta;
  } else if (typeof action.devotionDelta === 'number') {
    delta = action.devotionDelta;
  } else {
    // Variable action: parse the first integer from the string as a default
    const match = String(action.devotionDelta).match(/-?\d+/);
    delta = match ? parseInt(match[0], 10) : 0;
  }

  const newScore = Math.max(0, Math.min(10, currentScore + delta));
  return { newScore, delta, action };
}

/**
 * Resolves a divine intervention attempt for a cleric.
 * Core rule: roll d100; if result <= clericLevel, intervention succeeds.
 * Devotion level modifies the effective cleric level for the check.
 *
 * @param {number} clericLevel   - Cleric's class level (1–20)
 * @param {number} devotionScore - Current devotion score (0–10)
 * @returns {{
 *   roll: number,
 *   effectiveLevel: number,
 *   success: boolean,
 *   interventionDCMod: number,
 *   message: string
 * }}
 */
export function rollDivineIntervention(clericLevel, devotionScore) {
  if (clericLevel < 10) {
    return {
      roll: null,
      effectiveLevel: clericLevel,
      success: false,
      interventionDCMod: 0,
      message: 'Divine Intervention is only available to clerics of 10th level or higher.',
    };
  }

  const devotionData = getDevotionLevel(devotionScore);
  // A negative DCMod means the deity is more likely to respond (raise effective level)
  // A positive DCMod means the deity is less responsive (lower effective level)
  const effectiveLevel = Math.max(
    1,
    Math.min(100, clericLevel - devotionData.interventionDCMod)
  );

  const roll = Math.floor(Math.random() * 100) + 1; // 1–100
  const success = roll <= effectiveLevel;

  return {
    roll,
    effectiveLevel,
    success,
    interventionDCMod: devotionData.interventionDCMod,
    message: success
      ? `Intervention succeeds! (Rolled ${roll} ≤ ${effectiveLevel})`
      : `Intervention fails. (Rolled ${roll} > ${effectiveLevel})`,
  };
}

/**
 * Returns the blessings available to a worshipper for a given domain and devotion score.
 * Filters DOMAIN_BLESSINGS[domain] to tiers unlocked by the devotion level.
 *
 * Tier unlock thresholds:
 *   minor  — Devout (5+)
 *   major  — Zealot (7+)
 *   avatar — Champion (9+)
 *
 * @param {string} domain       - Domain name matching a key in DOMAIN_BLESSINGS
 * @param {number} devotionScore - Current devotion score (0–10)
 * @returns {object[]} Array of blessing objects available at this devotion tier
 */
export function getDomainBlessings(domain, devotionScore) {
  const blessings = DOMAIN_BLESSINGS[domain];
  if (!blessings) return [];

  const score = Math.max(0, Math.min(10, devotionScore));

  return blessings.filter((blessing) => {
    if (blessing.tier === 'minor') return score >= 5;
    if (blessing.tier === 'major') return score >= 7;
    if (blessing.tier === 'avatar') return score >= 9;
    return false;
  });
}

/**
 * Returns the holy day templates associated with a deity's primary domain.
 * All HOLY_DAYS templates are applicable to any deity; this function returns
 * the full list tagged with which are especially appropriate for the given domain.
 *
 * @param {string} deityDomain - Primary domain of the deity
 * @returns {object[]} HOLY_DAYS entries, each augmented with `recommended: boolean`
 */
export function getHolyDays(deityDomain) {
  const domainHolyDayMap = {
    Life: ['harvest_festival', 'saints_feast', 'purification'],
    Light: ['solstice', 'founding_day', 'purification'],
    War: ['founding_day', 'saints_feast', 'solstice'],
    Knowledge: ['founding_day', 'saints_feast', 'pilgrimage_season'],
    Tempest: ['solstice', 'equinox', 'founding_day'],
    Nature: ['solstice', 'equinox', 'harvest_festival', 'pilgrimage_season'],
    Trickery: ['saints_feast', 'day_of_the_dead', 'founding_day'],
    Death: ['day_of_the_dead', 'equinox', 'purification'],
    Forge: ['founding_day', 'harvest_festival', 'saints_feast'],
    Grave: ['day_of_the_dead', 'equinox', 'purification'],
    Order: ['founding_day', 'equinox', 'purification'],
    Peace: ['harvest_festival', 'saints_feast', 'purification'],
  };

  const recommended = domainHolyDayMap[deityDomain] || [];

  return HOLY_DAYS.map((day) => ({
    ...day,
    recommended: recommended.includes(day.id),
  }));
}

/**
 * Returns a summary of prayer effectiveness for a given devotion level.
 * Describes how reliably and powerfully the deity responds to prayers.
 *
 * @param {number} devotionScore - Current devotion score (0–10)
 * @returns {{
 *   devotionLevel: object,
 *   prayerMod: number,
 *   effectivenessLabel: string,
 *   description: string
 * }}
 */
export function checkPrayerEffectiveness(devotionScore) {
  const devotionLevel = getDevotionLevel(devotionScore);
  const { prayerMod } = devotionLevel;

  let effectivenessLabel;
  let description;

  if (prayerMod <= -4) {
    effectivenessLabel = 'None';
    description = 'This deity does not acknowledge prayers from this individual. No guidance or boons are granted.';
  } else if (prayerMod <= -2) {
    effectivenessLabel = 'Negligible';
    description = 'Prayers rarely receive a response. Occasional vague feelings of unease or comfort, nothing more.';
  } else if (prayerMod === 0) {
    effectivenessLabel = 'Modest';
    description = 'Prayers are heard. The deity may send minor signs or gentle guidance during moments of crisis.';
  } else if (prayerMod <= 2) {
    effectivenessLabel = 'Reliable';
    description = 'The deity regularly responds to sincere prayer with clear omens, helpful dreams, or minor miracles.';
  } else if (prayerMod <= 4) {
    effectivenessLabel = 'Strong';
    description = 'This worshipper has the deity\'s ear. Prayers are answered promptly and with meaningful effect.';
  } else if (prayerMod <= 6) {
    effectivenessLabel = 'Exceptional';
    description = 'The deity speaks directly through dreams, visions, and direct instruction. This worshipper is a favored champion.';
  } else {
    effectivenessLabel = 'Divine';
    description = 'The deity\'s power flows through this individual continuously. Prayer is less a request and more a two-way conversation.';
  }

  return {
    devotionLevel,
    prayerMod,
    effectivenessLabel,
    description,
  };
}
