/**
 * @file darkGifts.js
 * @description Dark gifts, supernatural boons, corruption system, and pact templates
 * for use in Ravenloft/Van Richten's-inspired D&D campaigns.
 *
 * Covers: dark powers, boons, corruption tracking, and supernatural pacts.
 * No React dependencies — pure data and helper functions.
 *
 * @module darkGifts
 */

// ---------------------------------------------------------------------------
// DARK GIFTS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} DarkGift
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} description - Flavour description
 * @property {string} benefit - Mechanical benefit
 * @property {string} drawback - Mechanical drawback
 * @property {'minor'|'moderate'|'severe'} severity - How dangerous this gift is
 * @property {string} trigger - Condition that activates the drawback or complication
 */

/** @type {DarkGift[]} */
export const DARK_GIFTS = [
  {
    id: "echoing_soul",
    name: "Echoing Soul",
    description:
      "The boundary between you and the dead has thinned. Voices of those who have passed seep through the veil and into your mind at all hours.",
    benefit:
      "You can cast Speak with Dead at will, requiring no spell slot or material components. You also have advantage on Intelligence (History) checks about deceased individuals.",
    drawback:
      "Whenever you finish a long rest in a location where someone has died, you must succeed on a DC 13 Wisdom saving throw or gain one level of exhaustion from the ceaseless whispers.",
    severity: "moderate",
    trigger:
      "Resting in locations with residual death energy, or entering a graveyard, crypt, or battlefield.",
  },
  {
    id: "living_shadow",
    name: "Living Shadow",
    description:
      "Your shadow has developed a will of its own. It lingers where it should not, gestures when you are still, and occasionally turns to regard you with hollow eyes.",
    benefit:
      "Your shadow can act as a scout. As a bonus action, you can send it to explore an area within 60 feet, gaining visual information from its perspective for up to 1 minute. It can pass through gaps as thin as 1 inch.",
    drawback:
      "Your shadow acts erratically in social situations. Creatures that notice it (Perception DC 14) become frightened or distrustful, imposing disadvantage on your Charisma (Persuasion) checks with that creature for 24 hours.",
    severity: "moderate",
    trigger:
      "Bright light causes the shadow to writhe visibly. In dim light or darkness, the shadow may act independently on a failed DC 11 Wisdom check.",
  },
  {
    id: "mist_walker",
    name: "Mist Walker",
    description:
      "The Mists of Ravenloft part for you as though you are kin. You move through them with unnatural ease while others stumble and are lost.",
    benefit:
      "You cannot become lost in the Mists of Ravenloft. You always know the direction of the nearest domain border. You can enter and exit the Mists safely, and the transit time for you is halved.",
    drawback:
      "The Dark Powers have taken note of your passage. Once per week, the DM may have a Dark Power send you a vision, compulsion, or unwanted summons while you sleep.",
    severity: "minor",
    trigger:
      "Spending more than 8 consecutive hours in the Mists requires a DC 12 Charisma saving throw or you begin to hear the beckoning of a Dark Lord.",
  },
  {
    id: "second_skin",
    name: "Second Skin",
    description:
      "Your flesh is malleable in ways it should not be. You can reshape your features, but the process is agony — bone grinds, skin tears and reforms.",
    benefit:
      "As an action, you can alter your appearance to look like any Medium humanoid you have observed, including voice. This functions as the Disguise Self spell but is real, physical change. Lasts until you change again.",
    drawback:
      "Each transformation deals 1d6 psychic damage to you and requires a DC 14 Constitution saving throw or you are incapacitated until the end of your next turn from the pain.",
    severity: "moderate",
    trigger:
      "Stress, strong emotion, or taking 20+ damage in a single hit may cause an involuntary partial transformation (DC 13 Wisdom save to resist).",
  },
  {
    id: "symbiotic_being",
    name: "Symbiotic Being",
    description:
      "Something else lives within you — an ancient consciousness, a bound spirit, or a fragment of something alien. It watches. It advises. It wants.",
    benefit:
      "The entity grants you proficiency in two skills of its choice (determined at acquisition). Once per long rest, you can consult it for a Portent-style roll: roll 1d20, and you may replace any ability check or saving throw you make with that number.",
    drawback:
      "The entity has its own goals. Once per session, the DM may have it exert influence, compelling you to take one specific action or provide a piece of information to an NPC.",
    severity: "severe",
    trigger:
      "The entity grows stronger when you are unconscious or dying. It may attempt to take control temporarily (DC 15 Wisdom saving throw) when you drop to 0 hit points.",
  },
  {
    id: "touch_of_death",
    name: "Touch of Death",
    description:
      "Necrotic energy bleeds from your hands. Plants wilt at your sustained contact. Small animals grow still. Even the warmth of a handshake feels wrong to others.",
    benefit:
      "As a bonus action, you can charge your touch with necrotic energy. Your next melee attack or touch deals an additional 2d8 necrotic damage. This charge lasts until used or until you complete a short rest.",
    drawback:
      "You deal 1d4 necrotic damage to any creature you hold or grapple at the start of their turn, including allies. You cannot turn this off passively.",
    severity: "moderate",
    trigger:
      "Contact with holy water or sacred ground causes the necrotic energy to flare, dealing 1d6 necrotic damage to you and making the charge visible as a black miasma.",
  },
  {
    id: "deadly_reach",
    name: "Deadly Reach",
    description:
      "Your limbs extend with sickening fluidity beyond natural human limits. Joints bend the wrong way. Tendons stretch with wet, snapping sounds.",
    benefit:
      "Your reach for melee attacks and grapples increases by 10 feet. You can squeeze through spaces sized for a creature one size smaller than you without penalty.",
    drawback:
      "Creatures that witness you extend your reach must make a DC 13 Wisdom saving throw or become frightened of you for 1 minute. This applies once per creature per encounter.",
    severity: "moderate",
    trigger:
      "Cold temperatures cause involuntary extension of your limbs. In environments below freezing, you must succeed on a DC 12 Constitution saving throw each hour or your reach extends visibly and uncontrollably.",
  },
  {
    id: "watchers_eye",
    name: "Watcher's Eye",
    description:
      "One of your eyes has changed. The iris has gone pale, or deep black, or reflects light like a cats eye. Through it you see things no one was meant to see — but it also sees you.",
    benefit:
      "You can see through solid, non-magical surfaces up to 1 foot thick (as if using See Invisibility for hidden creatures). You also cannot be surprised.",
    drawback:
      "Other creatures can perceive you through the same surfaces if they are within 30 feet and make a DC 14 Perception check. This includes enemies who may use it to locate you while hiding.",
    severity: "moderate",
    trigger:
      "Magical darkness causes the eye to become the sole source of light — a pale, faint glow emanating from your face, negating your ability to hide in magical darkness.",
  },
  {
    id: "gathered_whispers",
    name: "Gathered Whispers",
    description:
      "Thoughts bleed into your mind from everyone nearby. You did not choose this. You cannot turn it off. The noise is constant.",
    benefit:
      "You gain telepathy with a range of 60 feet. You can send and receive thoughts to willing creatures. You also automatically detect creatures within 30 feet regardless of invisibility or darkness.",
    drawback:
      "In areas with 5 or more sentient creatures, the mental noise is overwhelming. You have disadvantage on all Concentration checks and Intelligence-based ability checks while in such environments.",
    severity: "severe",
    trigger:
      "High-emotion events (combat, large crowds, death nearby) cause a psychic surge — DC 14 Wisdom saving throw or you are stunned until the end of your next turn.",
  },
  {
    id: "elusive_target",
    name: "Elusive Target",
    description:
      "Pain has become a doorway. When the blow lands, something inside you snaps sideways — and you are somewhere else.",
    benefit:
      "When you take damage from an attack, you can use your reaction to teleport up to 15 feet to an unoccupied space you can see. You can use this ability a number of times equal to your proficiency bonus per long rest.",
    drawback:
      "The teleportation is involuntary at low hit points. When you are below half your hit point maximum, each time you take damage you must succeed on a DC 12 Wisdom saving throw or the teleport triggers automatically, potentially moving you to a dangerous location.",
    severity: "minor",
    trigger:
      "Critical hits always trigger the teleport regardless of the saving throw, and the destination is chosen by the DM.",
  },
  {
    id: "vampiric_bite",
    name: "Vampiric Bite",
    description:
      "Your canines have lengthened. The hunger for blood has become a quiet companion — not overwhelming, but always present, like thirst on a warm day.",
    benefit:
      "As an action, you can bite a grappled or willing creature, dealing 1d6 piercing damage and regaining hit points equal to the damage dealt. If the target has more than half its hit points remaining, you regain an additional 1d6 hit points.",
    drawback:
      "After 24 hours without using this ability, you gain one level of exhaustion. The exhaustion cannot be removed by any means until you use the bite.",
    severity: "severe",
    trigger:
      "The scent of blood (any creature taking piercing or slashing damage nearby) requires a DC 13 Wisdom saving throw or you must spend your movement to move toward the bleeding creature on your next turn.",
  },
  {
    id: "inner_demon",
    name: "Inner Demon",
    description:
      "Something monstrous lives just beneath your surface. Under enough pressure, it erupts — and you are no longer entirely yourself.",
    benefit:
      "When you drop to 0 hit points, instead of falling unconscious, you can choose to transform. You immediately regain 2d12 + your Constitution modifier hit points, gain advantage on all melee attack rolls, and deal an extra 1d6 damage of a type tied to the demon (fire, necrotic, or cold). This lasts for 1 minute.",
    drawback:
      "While transformed, you must make a DC 15 Wisdom saving throw at the start of each turn to avoid attacking the nearest creature, friend or foe. When the transformation ends, you gain three levels of exhaustion.",
    severity: "severe",
    trigger:
      "Extreme stress or emotional trauma (DM discretion) can force a partial or full transformation even at full hit points, requiring a DC 16 Wisdom saving throw to resist.",
  },
];

// ---------------------------------------------------------------------------
// SUPERNATURAL BOONS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SupernaturalBoon
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} description - Flavour and mechanical description
 * @property {string} mechanicalEffect - Concise rules text
 * @property {number} levelRequirement - Minimum character level (typically 20+)
 * @property {string} source - Source reference
 */

/** @type {SupernaturalBoon[]} */
export const SUPERNATURAL_BOONS = [
  {
    id: "boon_combat_prowess",
    name: "Boon of Combat Prowess",
    description:
      "Your martial skill transcends mortal limits. When your strike would miss, fate itself bends to ensure the blow lands.",
    mechanicalEffect:
      "When you miss with a melee weapon attack, you can choose to hit instead. Once you use this boon, you can't use it again until the start of your next turn.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_dimensional_travel",
    name: "Boon of Dimensional Travel",
    description:
      "The fabric of space yields to your will. Distance and walls are merely suggestions.",
    mechanicalEffect:
      "As a bonus action, you can cast the Misty Step spell, without expending a spell slot.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_fate",
    name: "Boon of Fate",
    description:
      "You have gained the ability to nudge the skein of fate, helping others succeed or ensuring enemies fail at critical moments.",
    mechanicalEffect:
      "When another creature that you can see within 60 feet of you makes an ability check, an attack roll, or a saving throw, you can roll a d10 and apply the result as a bonus or penalty to the roll. Once you use this boon, you can't use it again until the start of your next turn.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_fortitude",
    name: "Boon of Fortitude",
    description:
      "Your vitality is beyond mortal reckoning. Wounds that would fell lesser beings are trivial inconveniences to you.",
    mechanicalEffect:
      "Your hit point maximum increases by 40.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_high_magic",
    name: "Boon of High Magic",
    description:
      "The weave of magic bends in your favor. Even your most exhausted reserves find one last spark of power.",
    mechanicalEffect:
      "You gain one 9th-level spell slot, provided you already have one. This bonus spell slot refreshes on a long rest.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_immortality",
    name: "Boon of Immortality",
    description:
      "Time has lost its claim on you. You age no more, and death is forced to look elsewhere.",
    mechanicalEffect:
      "You stop aging. You are immune to any effect that would age you, and you cannot die of old age. You still die from wounds, illness, or other causes.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_invincibility",
    name: "Boon of Invincibility",
    description:
      "For brief moments, you are untouchable. Swords turn aside. Fire splits around you. Even the gods' own wrath finds no purchase.",
    mechanicalEffect:
      "When you take damage from any source, you can choose to become immune to that instance of damage. Once you use this boon, you can't use it again until the start of your next turn.",
    levelRequirement: 20,
    source: "DMG",
  },
  {
    id: "boon_speed",
    name: "Boon of Speed",
    description:
      "You move with a swiftness that defies comprehension. Others barely register where you stood before you are already elsewhere.",
    mechanicalEffect:
      "Your walking speed increases by 30 feet. Additionally, you can take the Dash action as a bonus action.",
    levelRequirement: 20,
    source: "DMG",
  },
];

// ---------------------------------------------------------------------------
// CORRUPTION SYSTEM
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} CorruptionThreshold
 * @property {number} score - The score at or above which this threshold applies
 * @property {string} label - Short label for this stage
 * @property {string} physicalChanges - Visible physical manifestations
 * @property {string} behavioralShifts - Personality and behavioral effects
 * @property {string} mechanicalEffect - Rules consequences
 */

/**
 * @typedef {Object} CorruptionAction
 * @property {string} id - Unique identifier
 * @property {string} label - Human-readable description
 * @property {number} points - Corruption points gained (positive) or lost (negative)
 */

/**
 * @typedef {Object} CorruptionSystem
 * @property {number} minScore - Minimum corruption score
 * @property {number} maxScore - Maximum corruption score
 * @property {CorruptionAction[]} gainSources - Actions that increase corruption
 * @property {CorruptionAction[]} lossSources - Actions that decrease corruption
 * @property {CorruptionThreshold[]} thresholds - Effects at each threshold
 */

/** @type {CorruptionSystem} */
export const CORRUPTION_SYSTEM = {
  minScore: 0,
  maxScore: 10,

  gainSources: [
    { id: "use_dark_gift", label: "Using a dark gift for personal gain", points: 1 },
    { id: "dark_gift_malicious", label: "Using a dark gift to harm an innocent", points: 2 },
    { id: "evil_bargain", label: "Accepting a bargain with an evil power", points: 2 },
    { id: "necromancy_minor", label: "Casting minor necromancy (Animate Dead, etc.)", points: 1 },
    { id: "necromancy_major", label: "Casting major necromancy (Create Undead, Finger of Death)", points: 2 },
    { id: "artifact_contact_short", label: "Prolonged contact with an evil artifact (1+ days)", points: 1 },
    { id: "artifact_contact_long", label: "Attuning to a cursed or evil artifact", points: 2 },
    { id: "betrayal_ally", label: "Betraying a close ally for power or survival", points: 1 },
    { id: "innocent_sacrifice", label: "Participating in the sacrifice of an innocent", points: 3 },
    { id: "domain_lord_service", label: "Willingly serving a Dark Lord's ends", points: 2 },
  ],

  lossSources: [
    { id: "atonement_spell", label: "Having the Atonement spell cast on you", points: -3 },
    { id: "quest_redemption", label: "Completing a quest of redemption as assigned by a cleric or paladin", points: -2 },
    { id: "divine_intervention", label: "Divine intervention from a good-aligned deity", points: -4 },
    { id: "confession_penance", label: "Confession and penance at a holy site", points: -1 },
    { id: "selfless_sacrifice", label: "Willingly accepting great harm to protect an innocent", points: -2 },
    { id: "destroy_artifact", label: "Destroying an evil artifact at personal cost", points: -2 },
    { id: "long_rest_holy", label: "Spending a week in a blessed sanctuary in prayer", points: -1 },
  ],

  thresholds: [
    {
      score: 0,
      label: "Untouched",
      physicalChanges: "None. You appear as you always have.",
      behavioralShifts: "None. Your personality is your own.",
      mechanicalEffect: "No mechanical effects.",
    },
    {
      score: 1,
      label: "Marked",
      physicalChanges: "Subtle signs: a faint chill to the touch, eyes that catch light oddly, hair that moves without wind.",
      behavioralShifts: "Slight pull toward pragmatism. You find it easier to justify small moral compromises.",
      mechanicalEffect: "No mechanical effects yet, but NPCs with Insight (DC 16) may sense something unsettling about you.",
    },
    {
      score: 3,
      label: "Touched",
      physicalChanges:
        "Minor physical changes appear: dark veins near the eyes, a persistent shadow under the skin, eyes that shift color in darkness, or a voice that carries an unnatural harmonic.",
      behavioralShifts:
        "You find it difficult to empathize with strangers. Acts of pure altruism feel hollow. The first time each session you are asked to perform a selfless act, make a DC 12 Wisdom saving throw or hesitate.",
      mechanicalEffect:
        "Beasts with CR 1 or lower are frightened of you and will not approach. Wisdom (Insight) checks made against you by NPCs are made with disadvantage.",
    },
    {
      score: 6,
      label: "Corrupted",
      physicalChanges:
        "Unmistakable alterations: claws, elongated teeth, skin that shifts or crawls, eyes fully changed color, a permanent cold aura that causes nearby candles to flicker.",
      behavioralShifts:
        "You experience intrusive thoughts urging darker courses of action. Once per session, the DM may present a sinister impulse — you must succeed on a DC 14 Wisdom saving throw or act on it.",
      mechanicalEffect:
        "You gain resistance to necrotic damage. Children and animals are automatically frightened by your presence. Clerics and paladins must succeed on a DC 13 Wisdom check before willingly healing you.",
    },
    {
      score: 9,
      label: "Near-Lost",
      physicalChanges:
        "Transformation is obvious and monstrous. You may appear barely humanoid, with multiple dark gift traits manifesting simultaneously even if you do not possess them.",
      behavioralShifts:
        "Goodness feels like a foreign language. Maintaining good alignment requires active, constant effort. At the start of each session, make a DC 16 Wisdom saving throw or your alignment shifts one step toward Evil.",
      mechanicalEffect:
        "You are immune to necrotic damage. Undead of CR 3 or lower do not attack you unless directed. Holy water deals 2d6 radiant damage to you on contact.",
    },
    {
      score: 10,
      label: "Lost to Darkness",
      physicalChanges:
        "The transformation is complete. The character's original form is barely recognizable. The Dark Powers have claimed their prize.",
      behavioralShifts:
        "The character is fully consumed. Their personality, goals, and alignment are replaced by the will of the Dark Powers. The character becomes an NPC under DM control.",
      mechanicalEffect:
        "Character is removed from player control. They become a servant of the Dark Powers — potentially a recurring villain or a tragic figure for the party to redeem (requiring a major quest and reducing corruption to 5 or lower).",
    },
  ],
};

// ---------------------------------------------------------------------------
// PACT TEMPLATES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} PactTerm
 * @property {string} label - Short term label
 * @property {string} description - Full description of the term
 */

/**
 * @typedef {Object} PactTemplate
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} patron - The type of entity offering the pact
 * @property {string} flavour - Atmospheric description
 * @property {PactTerm} offer - What the entity gives
 * @property {PactTerm} price - What the entity demands
 * @property {number} corruptionOnSign - Corruption points gained upon signing
 * @property {number} corruptionOnBreach - Corruption points gained if the pact is broken
 * @property {string[]} breakingConditions - Conditions under which the pact ends (and consequences follow)
 * @property {string} consequence - What happens if the price is not paid
 */

/** @type {PactTemplate[]} */
export const PACT_TEMPLATES = [
  {
    id: "fiendish_bargain",
    name: "Fiendish Bargain",
    patron: "Devil or Demon (Archdevil, Demon Prince, or their agents)",
    flavour:
      "The contract is written in blood on vellum that does not burn. The fiend smiles with too many teeth. The offer is always generous. The price is always your soul.",
    offer: {
      label: "Power for the Soul",
      description:
        "The fiend grants immediate, tangible power: a dark gift of the player's choice, proficiency in all weapons, or a +2 to any ability score (max 24). This power is felt instantly.",
    },
    price: {
      label: "Soul Forfeiture",
      description:
        "Upon death, your soul travels directly to the fiend's realm instead of to your deity or the afterlife. The soul remains bound until the pact is fulfilled, the contract is broken, or another entity intercedes.",
    },
    corruptionOnSign: 3,
    corruptionOnBreach: 4,
    breakingConditions: [
      "A Wish spell can void the contract (but the fiend will retaliate).",
      "Completing a task the fiend assigns — which will always be morally costly.",
      "A celestial of CR 16+ interceding on your behalf.",
    ],
    consequence:
      "If you die before fulfilling the terms, your soul is immediately drawn to the fiend's realm. Resurrection magic fails unless the contracting entity consents or the contract is voided first.",
  },
  {
    id: "fey_debt",
    name: "Fey Debt",
    patron: "Archfey, powerful Fey noble, or denizen of the Feywild",
    flavour:
      "There was no contract — only a gift freely given, with a smile that said you would understand eventually. Now the debt is called in, and Fey memory is eternal.",
    offer: {
      label: "Gift of Glamour",
      description:
        "The fey bestows a gift: proficiency in Persuasion and Deception, the ability to cast Charm Person at will, immunity to being put to sleep by magic, or a glamour that makes the recipient appear unnaturally beautiful (+2 Charisma).",
    },
    price: {
      label: "Future Favor",
      description:
        "The fey does not name their price at the time of the gift. They will call in the favor later, at the most inconvenient possible moment. The favor will be strange, personal, and impossible to refuse without breaking the debt.",
    },
    corruptionOnSign: 1,
    corruptionOnBreach: 3,
    breakingConditions: [
      "Fulfilling the favor, whatever it turns out to be.",
      "Offering a gift of equal or greater value as judged by a neutral Fey arbiter.",
      "Abandoning all connection to the Feywild permanently.",
    ],
    consequence:
      "Breaking a Fey debt results in being hunted by a Fey assassin (CR 10+) until the debt is repaid or the creature is permanently destroyed. The Feywild becomes hostile to the debtor — portals close, Fey refuse aid.",
  },
  {
    id: "aberrant_whisper",
    name: "Aberrant Whisper",
    patron: "Elder Brain, Great Old One, or aberrant entity from beyond the known planes",
    flavour:
      "It did not approach you. The knowledge simply arrived. You understood things you had not learned. And in return, something now understands you.",
    offer: {
      label: "Forbidden Knowledge",
      description:
        "The entity shares a fragment of its vast, alien understanding. The recipient gains proficiency in Arcana and one other Intelligence-based skill, learns two spells of 5th level or lower from any class list, and can read any written language.",
    },
    price: {
      label: "Sanity for Secrets",
      description:
        "Your mind becomes partially open to the entity. Your maximum Wisdom score is permanently reduced by 2. Additionally, the entity may access your memories and perceptions at any time — you are never truly alone.",
    },
    corruptionOnSign: 2,
    corruptionOnBreach: 5,
    breakingConditions: [
      "There is no clean break. The knowledge cannot be unlearned.",
      "A Wish or divine intervention may sever the psychic link, but the Wisdom reduction remains.",
      "Destroying the physical manifestation of the entity (if it has one) in this plane.",
    ],
    consequence:
      "Attempting to break the pact triggers a psychic assault: DC 18 Wisdom saving throw or suffer the effects of the Feeblemind spell for 30 days. The entity will send agents to reclaim what it considers its.",
  },
  {
    id: "undead_pact",
    name: "Undead Pact",
    patron: "Lich, vampire lord, death deity, or ancient undead of great power",
    flavour:
      "Life is not something the patron values. What they offer is more: continuation. The body will not fail. The mind will persist. There is only the question of what you owe.",
    offer: {
      label: "Life Extended",
      description:
        "The undead patron halts the recipient's aging entirely and grants the Boon of Immortality (death by old age becomes impossible). Additionally, once per long rest, you may reroll a death saving throw and take the higher result.",
    },
    price: {
      label: "Service Beyond Death",
      description:
        "If you die by violence, your patron may raise you as an intelligent undead (retaining personality and memories) to serve them for a period of 1 year before your soul is released. During this service, you are bound to obey the patron's direct commands.",
    },
    corruptionOnSign: 2,
    corruptionOnBreach: 3,
    breakingConditions: [
      "Fulfilling the service term upon a single death.",
      "Destroying the patron permanently (not just reducing to 0 hp).",
      "Having a Wish cast to sever the pact — the patron will respond with hostility.",
    ],
    consequence:
      "Breaking the pact before service is rendered causes the life extension to be violently revoked — you immediately age 1d10 × 10 years. If this would exceed your natural lifespan, you die.",
  },
  {
    id: "shadow_deal",
    name: "Shadow Deal",
    patron: "Shadar-kai lord, entity of the Shadowfell, or a living avatar of darkness",
    flavour:
      "The shadow spoke to you in your own voice. It offered you everything you needed to disappear, to slip past enemies, to strike unseen. It asked only for something small. Something you loved.",
    offer: {
      label: "Gift of Stealth",
      description:
        "You become nearly supernatural in your ability to hide. You gain advantage on all Dexterity (Stealth) checks, the ability to Hide as a bonus action, and the ability to pass through magical darkness without hindrance.",
    },
    price: {
      label: "Something Loved",
      description:
        "The entity takes something you genuinely love: a memory of a lost person (you can no longer remember their face or voice), your ability to feel warmth (you are always cold and no longer enjoy food, music, or touch), or a relationship (an NPC you love forgets you completely).",
    },
    corruptionOnSign: 2,
    corruptionOnBreach: 3,
    breakingConditions: [
      "Stepping fully into bright daylight for 30 consecutive days — the shadow weakens and may release you, but the thing taken is never returned.",
      "Offering a replacement: something you love equally must be given willingly.",
      "Confronting the entity directly in the Shadowfell and besting it in a contest of its choosing.",
    ],
    consequence:
      "Breaking the deal causes the shadows themselves to turn hostile. For 1d6 months, darkness is dangerous to you — dim light is treated as difficult terrain, and you have disadvantage on attack rolls while in any shadow or dim light.",
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve a dark gift by its ID.
 * @param {string} giftId
 * @returns {DarkGift|undefined}
 */
export function getDarkGift(giftId) {
  return DARK_GIFTS.find((g) => g.id === giftId);
}

/**
 * Retrieve a supernatural boon by its ID.
 * @param {string} boonId
 * @returns {SupernaturalBoon|undefined}
 */
export function getSupernaturaLBoon(boonId) {
  return SUPERNATURAL_BOONS.find((b) => b.id === boonId);
}

/**
 * Calculate a corruption score from an array of action IDs.
 *
 * Looks up each action ID in both gainSources and lossSources. Unknown IDs are
 * silently skipped. The result is clamped between CORRUPTION_SYSTEM.minScore
 * and CORRUPTION_SYSTEM.maxScore.
 *
 * @param {string[]} actions - Array of CorruptionAction IDs
 * @returns {number} Final corruption score (0–10)
 *
 * @example
 * const score = calculateCorruption(['use_dark_gift', 'evil_bargain', 'atonement_spell']);
 * // => 0 (1 + 2 - 3 = 0)
 */
export function calculateCorruption(actions) {
  const allSources = [
    ...CORRUPTION_SYSTEM.gainSources,
    ...CORRUPTION_SYSTEM.lossSources,
  ];

  const total = actions.reduce((acc, actionId) => {
    const action = allSources.find((s) => s.id === actionId);
    return action ? acc + action.points : acc;
  }, 0);

  return Math.min(
    CORRUPTION_SYSTEM.maxScore,
    Math.max(CORRUPTION_SYSTEM.minScore, total)
  );
}

/**
 * Return the highest applicable corruption threshold for a given score.
 *
 * Thresholds are matched by finding all entries whose `score` value is less than
 * or equal to the provided score, then returning the one with the highest score.
 *
 * @param {number} score - Current corruption score (0–10)
 * @returns {CorruptionThreshold} The matching threshold entry
 */
export function getCorruptionEffects(score) {
  const clamped = Math.min(
    CORRUPTION_SYSTEM.maxScore,
    Math.max(CORRUPTION_SYSTEM.minScore, score)
  );

  const applicable = CORRUPTION_SYSTEM.thresholds.filter(
    (t) => t.score <= clamped
  );

  return applicable.reduce((best, t) =>
    t.score > best.score ? t : best
  );
}

/**
 * Generate a pact object for a given pact type, optionally filling in
 * the name of the entity offering the pact and the recipient.
 *
 * @param {string} pactType - One of the PACT_TEMPLATES ids
 * @param {{ entityName?: string, recipientName?: string }} [options]
 * @returns {{ template: PactTemplate, entityName: string, recipientName: string, summary: string }|null}
 *   Returns null if the pactType is not found.
 */
export function generatePact(pactType, options = {}) {
  const template = PACT_TEMPLATES.find((p) => p.id === pactType);
  if (!template) return null;

  const entityName = options.entityName || `[${template.patron}]`;
  const recipientName = options.recipientName || "[Recipient]";

  const summary = [
    `PACT: ${template.name}`,
    `Between: ${entityName} and ${recipientName}`,
    ``,
    `OFFER — ${template.offer.label}:`,
    template.offer.description,
    ``,
    `PRICE — ${template.price.label}:`,
    template.price.description,
    ``,
    `Corruption on signing: +${template.corruptionOnSign}`,
    `Corruption on breach: +${template.corruptionOnBreach}`,
    ``,
    `Breaking conditions:`,
    template.breakingConditions.map((c, i) => `  ${i + 1}. ${c}`).join("\n"),
    ``,
    `Consequence of breach: ${template.consequence}`,
  ].join("\n");

  return { template, entityName, recipientName, summary };
}

/**
 * Simulate rolling for a dark gift's drawback trigger.
 *
 * Uses Math.random() to simulate a d20 roll. The drawback is considered
 * triggered if the roll meets or exceeds the threshold for that gift's severity.
 *
 * Severity thresholds:
 *   - minor:    triggers on 18–20 (15% chance)
 *   - moderate: triggers on 14–20 (35% chance)
 *   - severe:   triggers on 10–20 (55% chance)
 *
 * @param {string} giftId - The dark gift ID to roll for
 * @returns {{ gift: DarkGift, roll: number, threshold: number, triggered: boolean, triggerDescription: string }|null}
 *   Returns null if the giftId is not found.
 */
export function rollDarkGiftDrawback(giftId) {
  const gift = getDarkGift(giftId);
  if (!gift) return null;

  const thresholdMap = {
    minor: 18,
    moderate: 14,
    severe: 10,
  };

  const threshold = thresholdMap[gift.severity] ?? 14;
  const roll = Math.floor(Math.random() * 20) + 1;
  const triggered = roll >= threshold;

  return {
    gift,
    roll,
    threshold,
    triggered,
    triggerDescription: triggered
      ? `Drawback triggered (rolled ${roll}, needed ${threshold}+): ${gift.trigger}`
      : `Drawback avoided (rolled ${roll}, needed ${threshold}+).`,
  };
}
