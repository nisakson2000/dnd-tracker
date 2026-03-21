/**
 * Social Encounters — NPC Attitude Tracking, Skill Challenges, Negotiation
 *
 * Covers roadmap items related to social encounter mechanics, NPC attitude
 * shifting, conversation actions, negotiation frameworks, and cultural etiquette.
 * Based on DMG social interaction rules (p.244–245) and skill challenge variants.
 */

// ── NPC Attitudes (DMG p.244) ──────────────────────────────────────────────

/**
 * Five-tier attitude scale from the Dungeon Master's Guide.
 * Each tier includes the DC required to shift the NPC one step upward via a
 * Charisma check, a description of their general disposition, typical
 * behaviors the DM can roleplay, and mechanical effects on interaction checks.
 */
export const NPC_ATTITUDES = [
  {
    id: 'hostile',
    label: 'Hostile',
    level: 0,
    shiftUpDC: 25,
    description:
      'This NPC actively opposes the party. They may attack, deceive, or undermine the characters at every opportunity.',
    typicalBehavior: [
      'Shouts insults or threats',
      'Refuses to answer questions — or lies',
      'May call guards or summon allies',
      'Leaves the room or turns their back',
    ],
    mechanicalEffects: {
      persuasionDCMod: +10,
      deceptionDCMod: +5,
      intimidationDCMod: -5,
      insightDCMod: +5,
      note: 'Any failed Persuasion or Deception check worsens the encounter. Intimidation may work but poisons future dealings.',
    },
    color: '#ef4444',
  },
  {
    id: 'unfriendly',
    label: 'Unfriendly',
    level: 1,
    shiftUpDC: 20,
    description:
      'Wary and uncooperative. They will not offer help freely but can be persuaded with the right appeal or sufficient pressure.',
    typicalBehavior: [
      'Gives short, guarded answers',
      'Crosses arms, avoids eye contact',
      'Demands something in return for basic information',
      'Warns the party not to push their luck',
    ],
    mechanicalEffects: {
      persuasionDCMod: +5,
      deceptionDCMod: +2,
      intimidationDCMod: 0,
      insightDCMod: +2,
      note: 'A single successful Persuasion or well-framed appeal can shift them to Indifferent.',
    },
    color: '#f97316',
  },
  {
    id: 'indifferent',
    label: 'Indifferent',
    level: 2,
    shiftUpDC: 15,
    description:
      'Neutral toward the party. They have no strong feelings and will help if there is something in it for them or if the ask is small.',
    typicalBehavior: [
      'Answers direct questions with direct answers',
      'Quotes prices or conditions before helping',
      'Shows no enthusiasm but no hostility',
      'Moves on quickly unless the party engages them',
    ],
    mechanicalEffects: {
      persuasionDCMod: 0,
      deceptionDCMod: 0,
      intimidationDCMod: 0,
      insightDCMod: 0,
      note: 'This is the baseline DC for all social checks as written in the PHB.',
    },
    color: '#6b7280',
  },
  {
    id: 'friendly',
    label: 'Friendly',
    level: 3,
    shiftUpDC: 10,
    description:
      'Positively disposed toward the party. Willing to help within reason, share useful information, and speak frankly.',
    typicalBehavior: [
      'Offers hospitality without being asked',
      'Shares rumors or local knowledge freely',
      'Advocates for the party to others',
      'Gives benefit of the doubt in ambiguous situations',
    ],
    mechanicalEffects: {
      persuasionDCMod: -5,
      deceptionDCMod: -2,
      intimidationDCMod: +5,
      insightDCMod: -2,
      note: 'Using Intimidation on a Friendly NPC risks shifting their attitude down. Deception is harder to detect.',
    },
    color: '#22c55e',
  },
  {
    id: 'helpful',
    label: 'Helpful',
    level: 4,
    shiftUpDC: null,
    description:
      'This NPC is an ally. They will take personal risk, share secrets, and go out of their way to assist the party.',
    typicalBehavior: [
      'Volunteers information without prompting',
      'Takes action on behalf of the party even when absent',
      'Warns the party of dangers or rivals',
      'Shares resources, safe houses, or introductions',
    ],
    mechanicalEffects: {
      persuasionDCMod: -10,
      deceptionDCMod: -5,
      intimidationDCMod: +10,
      insightDCMod: -5,
      note: 'Almost any reasonable request succeeds automatically. Betraying a Helpful NPC has lasting story consequences.',
    },
    color: '#3b82f6',
  },
];

// ── Social Skills ──────────────────────────────────────────────────────────

/**
 * The five Charisma- and Wisdom-based skills used in social encounters,
 * with guidance on when to call for each, typical DC ranges, and the
 * narrative consequences of extreme results.
 */
export const SOCIAL_SKILLS = [
  {
    id: 'persuasion',
    label: 'Persuasion',
    ability: 'Charisma',
    description:
      'An honest, good-faith appeal using logic, emotion, or shared interest. The character believes what they are saying.',
    whenToUse: [
      'Appealing to an NPC\'s self-interest with a genuine offer',
      'Convincing a guard to let the party through with the truth',
      'Negotiating a fair price or treaty',
      'De-escalating a confrontation by acknowledging concerns',
    ],
    typicalDCRange: { low: 10, moderate: 15, hard: 20, veryHard: 25 },
    dcModifiers: {
      npcKnowsCharacter: -2,
      appealAlignedWithWants: -3,
      requestGoesAgainstNPCInterests: +5,
      previousBrokenPromise: +5,
    },
    criticalSuccess: {
      threshold: 10,
      effect:
        'NPC shifts attitude one step upward AND grants an additional favor, secret, or boon beyond what was requested.',
    },
    criticalFailure: {
      threshold: -5,
      effect:
        'NPC shifts attitude one step downward and becomes skeptical of all future honest appeals from this character.',
    },
  },
  {
    id: 'deception',
    label: 'Deception',
    ability: 'Charisma',
    description:
      'Concealing the truth through misdirection, half-truths, or outright lies. Success depends on the NPC\'s credulity and the plausibility of the lie.',
    whenToUse: [
      'Claiming a false identity or cover story',
      'Denying involvement in an event',
      'Disguising the true purpose of a request',
      'Misdirecting suspicion toward another party',
    ],
    typicalDCRange: { low: 10, moderate: 15, hard: 20, veryHard: 25 },
    dcModifiers: {
      lieIsPlausible: -3,
      lieIsOutlandish: +5,
      npcHasInsightProficiency: +3,
      npcAlreadySuspicious: +5,
      corroboratingEvidence: -4,
    },
    criticalSuccess: {
      threshold: 10,
      effect:
        'NPC believes the lie completely and may even actively defend the false narrative to others.',
    },
    criticalFailure: {
      threshold: -5,
      effect:
        'NPC sees through the deception, shifts attitude one step downward, and may alert others or report the party.',
    },
  },
  {
    id: 'intimidation',
    label: 'Intimidation',
    ability: 'Charisma',
    description:
      'Using threats, displays of power, or coercion to force compliance. Effective in the short term but poisons long-term relationships.',
    whenToUse: [
      'Threatening harm to extract information quickly',
      'Demonstrating power to prevent violence before it starts',
      'Cowing a minion into revealing their master\'s plan',
      'Breaking a suspect\'s composure during interrogation',
    ],
    typicalDCRange: { low: 10, moderate: 15, hard: 20, veryHard: 25 },
    dcModifiers: {
      pcHasPhysicalAdvantage: -3,
      npcHasBackup: +5,
      npcIsCurrentlyFriendlyOrBetter: +5,
      pcReputationForViolence: -4,
      npcIsFanatical: +10,
    },
    criticalSuccess: {
      threshold: 10,
      effect:
        'NPC is cowed into full compliance and will not report the incident. Any witnesses are also intimidated.',
    },
    criticalFailure: {
      threshold: -5,
      effect:
        'NPC calls the bluff, becomes Hostile, and immediately seeks to report or punish the party.',
    },
  },
  {
    id: 'performance',
    label: 'Performance',
    ability: 'Charisma',
    description:
      'Entertaining, distracting, or inspiring an audience through music, storytelling, acting, or other performance. Can shift group attitudes or create openings for other actions.',
    whenToUse: [
      'Busking to blend into a crowd while gathering information',
      'Distracting a crowd while allies act',
      'Earning goodwill in a tavern before making a request',
      'Impersonating a figure of authority through roleplay',
    ],
    typicalDCRange: { low: 10, moderate: 15, hard: 20, veryHard: 25 },
    dcModifiers: {
      audienceIsIntoxicated: -3,
      performanceMatchesCulture: -2,
      performanceClashesCulture: +4,
      hecklerInCrowd: +3,
    },
    criticalSuccess: {
      threshold: 10,
      effect:
        'Entire crowd shifts to Friendly. One target NPC is so impressed they offer the party a favor or piece of information unprompted.',
    },
    criticalFailure: {
      threshold: -5,
      effect:
        'Performance backfires — the party draws mockery or suspicion. Crowd attitude shifts to Unfriendly for the rest of the session.',
    },
  },
  {
    id: 'insight',
    label: 'Insight',
    ability: 'Wisdom',
    description:
      'Reading an NPC\'s true emotional state, hidden motives, or whether they are lying. Does not shift attitude directly but informs better choices.',
    whenToUse: [
      'Sensing that an NPC is hiding something before making an offer',
      'Determining whether a claimed alliance is genuine',
      'Reading body language to detect a trap in a negotiation',
      'Identifying which emotional appeal will land best',
    ],
    typicalDCRange: { low: 10, moderate: 15, hard: 20, veryHard: 25 },
    dcModifiers: {
      npcIsDeceptionTrained: +3,
      npcIsEmotionallyDistressed: -4,
      playerHasPriorKnowledgeOfNPC: -3,
    },
    criticalSuccess: {
      threshold: 10,
      effect:
        'DM reveals the NPC\'s deepest fear or most pressing want, granting advantage on the next Persuasion or Deception check.',
    },
    criticalFailure: {
      threshold: -5,
      effect:
        'Player receives a false read — believes the NPC is honest when lying, or suspects betrayal where there is none.',
    },
  },
];

// ── Conversation Actions ───────────────────────────────────────────────────

/**
 * Eight tactical actions a character can take during a social encounter.
 * Each maps to a relevant skill, carries an attitude modifier if successful,
 * a risk level, and guidance on which NPC attitudes it works best against.
 */
export const CONVERSATION_ACTIONS = [
  {
    id: 'appeal_to_interest',
    label: 'Appeal to Interest',
    description:
      'Identify what the NPC stands to gain from cooperating and frame your request around that benefit.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: 0,
    riskLevel: 'low',
    bestAgainst: ['indifferent', 'unfriendly'],
    mechanicalNote:
      'Requires a successful Insight check (DC 12) first, or prior knowledge of the NPC\'s wants. On success, the Persuasion check gains advantage.',
    example: '"You want the guild contract. We can put your name on the recommendation — if you help us tonight."',
  },
  {
    id: 'appeal_to_emotion',
    label: 'Appeal to Emotion',
    description:
      'Connect with the NPC through shared experience, sympathy, or invoking people they care about.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: -1,
    riskLevel: 'moderate',
    bestAgainst: ['unfriendly', 'indifferent', 'friendly'],
    mechanicalNote:
      'The appeal must reference something real and meaningful to the NPC. If it feels manipulative or false, DC increases by 5.',
    example: '"You lost a brother in the war. So did we. Help us end this before more families go through that."',
  },
  {
    id: 'offer_bribe',
    label: 'Offer Bribe',
    description:
      'Present coin, goods, or services as direct payment for cooperation.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: -1,
    riskLevel: 'moderate',
    bestAgainst: ['indifferent', 'unfriendly'],
    mechanicalNote:
      'Bribe amount affects the DC: inadequate (DC +5), fair (DC 0), generous (DC -3), extravagant (DC -5). Offering bribes to officials in formal settings may backfire.',
    example: '"Twenty gold now, another twenty when we return safely. No questions asked."',
  },
  {
    id: 'threaten',
    label: 'Threaten',
    description:
      'Imply or state explicitly that there will be consequences for non-cooperation.',
    relevantSkill: 'intimidation',
    successAttitudeMod: 0,
    failureAttitudeMod: -1,
    riskLevel: 'high',
    bestAgainst: ['indifferent', 'unfriendly', 'hostile'],
    mechanicalNote:
      'Succeeding gets compliance, not goodwill. Attitude does not improve. Failure causes attitude to drop one step and may trigger combat or alarm.',
    example: '"Tell us where he is. We\'d hate for your employer to learn how easily you talk."',
  },
  {
    id: 'flatter',
    label: 'Flatter',
    description:
      'Compliment the NPC\'s intelligence, reputation, taste, or accomplishments to make them more receptive.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: 0,
    riskLevel: 'low',
    bestAgainst: ['indifferent', 'friendly', 'unfriendly'],
    mechanicalNote:
      'Hollow flattery on an NPC with a high Insight modifier may be seen through (contested Deception vs Insight). Genuine flattery referencing real achievements is always Persuasion.',
    example: '"Everyone in the city speaks of your work. We came to you specifically because no one else could handle this."',
  },
  {
    id: 'logical_argument',
    label: 'Logical Argument',
    description:
      'Present evidence, reasoning, or a clear cause-and-effect chain to convince the NPC that cooperation is the rational choice.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: 0,
    riskLevel: 'low',
    bestAgainst: ['indifferent', 'friendly', 'unfriendly'],
    mechanicalNote:
      'Works best when the party has gathered evidence beforehand. Each piece of corroborating evidence reduces the DC by 2, to a minimum reduction of 6.',
    example: '"Three murders in three weeks. All victims linked to the same merchant. The pattern is undeniable."',
  },
  {
    id: 'invoke_authority',
    label: 'Invoke Authority',
    description:
      'Reference a title, faction, patron, or legal power that obligates or pressures the NPC to comply.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +1,
    failureAttitudeMod: -1,
    riskLevel: 'moderate',
    bestAgainst: ['indifferent', 'unfriendly', 'hostile'],
    mechanicalNote:
      'The authority invoked must be real and verifiable, or this becomes a Deception check instead. If the NPC outranks the authority cited, the check automatically fails.',
    example: '"By order of Lord Harwick and the Crown\'s Writ, you are required to assist this investigation."',
  },
  {
    id: 'share_secret',
    label: 'Share Secret',
    description:
      'Offer sensitive information — about a third party, a situation, or the party itself — as a gesture of good faith or leverage.',
    relevantSkill: 'persuasion',
    successAttitudeMod: +2,
    failureAttitudeMod: -1,
    riskLevel: 'high',
    bestAgainst: ['unfriendly', 'indifferent', 'friendly'],
    mechanicalNote:
      'The secret must be genuinely useful and not already known. If the NPC distrusts the party, a DC 14 Insight check determines whether the secret is taken as a trap.',
    example: '"The duke is skimming from the treasury. We know because we helped him set it up. Now we\'re trying to fix it — and we need your silence."',
  },
];

// ── Social Encounter Template ──────────────────────────────────────────────

/**
 * A structured template for building a social encounter around a single NPC.
 * Uses the 3-successes-before-3-failures skill challenge variant from the DMG.
 * The template is a factory function that returns a new encounter object.
 */
export const SOCIAL_ENCOUNTER_TEMPLATE = {
  version: '1.0',
  description:
    'Skill challenge social encounter. Party needs 3 successes before accumulating 3 failures. Each skill check must use a different skill or approach unless the player explains a new angle.',

  /**
   * Returns a blank encounter scaffold the DM can fill in.
   */
  create({
    npcName = 'Unknown NPC',
    startingAttitude = 'indifferent',
    wants = [],
    fears = [],
    secrets = [],
    successConditions = [],
    failureConsequences = [],
    complicationTriggers = [],
  } = {}) {
    return {
      npc: {
        name: npcName,
        attitude: startingAttitude,
        wants,
        fears,
        secrets,
      },
      skillChallenge: {
        successesNeeded: 3,
        failuresAllowed: 2,
        currentSuccesses: 0,
        currentFailures: 0,
        usedSkills: [],
        log: [],
      },
      successConditions:
        successConditions.length > 0
          ? successConditions
          : [
              'NPC agrees to the party\'s primary request',
              'NPC shifts attitude to Friendly or better',
              'NPC reveals at least one secret or key piece of information',
            ],
      failureConsequences:
        failureConsequences.length > 0
          ? failureConsequences
          : [
              'NPC refuses all further requests this scene',
              'NPC attitude shifts to Hostile',
              'NPC alerts allies or authorities',
            ],
      complicationTriggers:
        complicationTriggers.length > 0
          ? complicationTriggers
          : [
              { condition: 'firstFailure', event: 'NPC\'s bodyguard enters the room' },
              { condition: 'attitudeDropsToHostile', event: 'NPC reaches for a weapon or alarm' },
              { condition: 'secretRevealed', event: 'A third party overhears and reacts' },
            ],
    };
  },

  exampleEncounter: {
    npc: {
      name: 'Councilor Maren Voss',
      attitude: 'unfriendly',
      wants: ['Re-election to the council', 'Evidence of Lord Daren\'s corruption', 'Her daughter returned safely'],
      fears: ['Being exposed as a former member of the thieves\' guild', 'Losing her political standing', 'Physical violence'],
      secrets: ['She paid to have a rival\'s warehouse burned three years ago', 'Her daughter ran away to join a revolutionary group'],
    },
    approach: 'The party needs Maren to open the council vault after hours.',
    suggestedSkills: ['persuasion', 'insight', 'deception', 'intimidation'],
    dmNotes: 'Maren responds best to appeals to her political interests. Mentioning her daughter shifts her attitude immediately to Friendly but she becomes desperate and unpredictable.',
  },
};

// ── Negotiation Framework ──────────────────────────────────────────────────

/**
 * A six-step structured negotiation process with mechanical suggestions for
 * each phase. DMs can use this as a pacing guide for extended negotiations.
 */
export const NEGOTIATION_FRAMEWORK = [
  {
    step: 1,
    phase: 'Establish Rapport',
    description:
      'Before any demands are made, the party tries to create a baseline of goodwill or at least mutual respect.',
    goal: 'Shift starting attitude one step upward, or confirm the NPC\'s current disposition.',
    mechanicalSuggestion:
      'One Persuasion or Performance check, DC equal to current attitude\'s shiftUpDC minus 5. Failure does not count as a skill challenge failure — it simply means the party starts from the current attitude.',
    durationEstimate: '1–3 minutes of roleplay',
    tips: [
      'Find common ground: shared enemies, shared hometown, mutual acquaintances',
      'Compliment something specific about the NPC\'s work or reputation',
      'Offer a small gesture of goodwill before asking for anything',
    ],
  },
  {
    step: 2,
    phase: 'Discover Needs',
    description:
      'The party probes to understand what the NPC actually wants, fears, or needs — this is the intelligence-gathering phase.',
    goal: 'Identify at least one want or fear to use as leverage or an appeal in later steps.',
    mechanicalSuggestion:
      'Insight check (DC 13) or open-ended roleplay questions. Success reveals one want or fear. Critical success reveals both a want and a fear.',
    durationEstimate: '2–5 minutes of roleplay',
    tips: [
      'Ask indirect questions about the NPC\'s current situation',
      'Listen for what the NPC complains about',
      'Watch for physical cues when sensitive topics arise',
    ],
  },
  {
    step: 3,
    phase: 'Make Offer',
    description:
      'The party presents their primary request and initial offer, framed around what they learned in step two.',
    goal: 'Get the NPC to engage with the offer seriously rather than refuse outright.',
    mechanicalSuggestion:
      'Persuasion check using the conversation action that best matches the discovered need. DC is the NPC\'s current shiftUpDC. This counts as the first skill challenge check.',
    durationEstimate: '2–4 minutes of roleplay',
    tips: [
      'Lead with what the NPC gets, not what the party needs',
      'Do not reveal your fallback position yet',
      'Match the formality of the setting',
    ],
  },
  {
    step: 4,
    phase: 'Counter-Offer',
    description:
      'The NPC responds with conditions, objections, or a counter-proposal. The party must respond without losing ground.',
    goal: 'Reach a middle position that satisfies the NPC\'s core need while preserving the party\'s primary objective.',
    mechanicalSuggestion:
      'Insight to read the counter-offer\'s true intent, followed by Persuasion or Deception to respond. Both checks count toward the skill challenge.',
    durationEstimate: '3–6 minutes of roleplay',
    tips: [
      'Identify which of the NPC\'s conditions are genuine and which are posturing',
      'Concede on minor points to hold firm on major ones',
      'A silence can be as powerful as a rebuttal',
    ],
  },
  {
    step: 5,
    phase: 'Resolve',
    description:
      'Both sides either reach agreement or the negotiation breaks down. This is the final check of the skill challenge.',
    goal: 'Skill challenge reaches 3 successes (agreement) or 3 failures (breakdown).',
    mechanicalSuggestion:
      'Final Persuasion check. On success, record what was agreed. On failure, determine whether the NPC is Unfriendly (will try again later) or Hostile (negotiation is over for this session).',
    durationEstimate: '1–3 minutes of roleplay',
    tips: [
      'Summarize the agreement aloud to ensure both sides understand the terms',
      'Have the NPC name one condition that must be met before they act',
      'A partial success can still move the story forward',
    ],
  },
  {
    step: 6,
    phase: 'Aftermath',
    description:
      'What happens after the negotiation ends, regardless of outcome. Relationships shift, word spreads, obligations are created.',
    goal: 'Establish the long-term consequences of the negotiation for the campaign.',
    mechanicalSuggestion:
      'No check required. DM notes attitude change, any information exchanged, commitments made, and who else might learn of the outcome.',
    durationEstimate: 'Narrative — no fixed time',
    tips: [
      'NPC attitude after the encounter persists into future sessions',
      'Failed negotiations can become future plot hooks',
      'Success creates obligations on both sides — track them',
    ],
  },
];

// ── Etiquette by Culture ───────────────────────────────────────────────────

/**
 * Five broad cultural contexts with behavioral expectations, taboos, and the
 * mechanical consequences of violating social norms.
 */
export const ETIQUETTE_BY_CULTURE = [
  {
    id: 'formal_court',
    label: 'Formal Court',
    description:
      'Noble courts, royal audiences, and aristocratic gatherings. Hierarchy is everything. Improper address or breach of ceremony can end a career.',
    expectedBehavior: [
      'Address nobles by correct title (Lord, Lady, Your Grace, etc.)',
      'Wait to be spoken to before speaking to a superior',
      'Bow or curtsy at introduction and departure',
      'Do not turn your back on the monarch or highest-ranking official',
      'Accept or decline hospitality graciously — never seem ungrateful',
    ],
    taboos: [
      'Interrupting a superior',
      'Reaching across the table',
      'Displaying weapons unless invited to',
      'Speaking directly to the ruler before being acknowledged',
      'Sitting without permission in formal chambers',
    ],
    faux_pas_consequences: {
      minor: 'Disadvantage on all Persuasion checks for the remainder of the audience.',
      moderate: 'The offending character is asked to leave. Party must arrange a new audience.',
      severe: 'The entire party is escorted out by guards and considered persona non grata at court.',
    },
    skillBonuses: {
      persuasion: 'Advantage if the character has noble background or the Courtier feat.',
      intimidation: 'Automatically fails unless the character significantly outranks the target.',
    },
  },
  {
    id: 'tavern_casual',
    label: 'Tavern Casual',
    description:
      'Common rooms, market stalls, dockside bars, and working-class gathering places. Directness and rough humor are respected. Pretension is punished.',
    expectedBehavior: [
      'Buy a round before asking for a favor',
      'Match the energy of those around you — do not be stiff or superior',
      'First names or no names — titles mean nothing here',
      'Settle disputes with a drinking contest, arm wrestle, or a bet before a fight',
      'Leave when you\'ve overstayed your welcome',
    ],
    taboos: [
      'Claiming to be above manual labor when you need help from those who do it',
      'Refusing offered food or drink without a good reason',
      'Speaking poorly of someone\'s trade or craft to their face',
      'Cheating at cards or dice — even if undetected, it is a grave personal sin if discovered',
    ],
    faux_pas_consequences: {
      minor: 'Crowd goes quiet. Disadvantage on Performance and Persuasion for this scene.',
      moderate: 'Barkeep asks the offending character to step outside. Group loses Friendly attitude.',
      severe: 'Fight starts. The party is physically removed and barred from this establishment.',
    },
    skillBonuses: {
      persuasion: 'Advantage if the character has a working-class background (Sailor, Folk Hero, etc.).',
      performance: 'Advantage on checks to entertain — the crowd is receptive and easy to please.',
    },
  },
  {
    id: 'military_discipline',
    label: 'Military Discipline',
    description:
      'Barracks, command tents, military tribunals, and officer corps. Chain of command is absolute. Efficiency and competence are respected; emotionalism is not.',
    expectedBehavior: [
      'Stand at attention when addressed by a superior officer',
      'Give rank and unit when introducing yourself',
      'Speak in facts and be brief — no unnecessary elaboration',
      'Carry yourself with physical readiness and confidence',
      'Do not question orders in public — request clarification in private',
    ],
    taboos: [
      'Showing fear or weakness in front of enlisted soldiers',
      'Questioning chain of command in front of subordinates',
      'Lying directly to an officer — shading the truth is acceptable; blatant deception is not',
      'Handling another soldier\'s weapon without permission',
    ],
    faux_pas_consequences: {
      minor: 'Officer becomes Unfriendly. The conversation becomes adversarial.',
      moderate: 'Character is dressed down publicly. Disadvantage on all checks for the rest of the encounter.',
      severe: 'Character is placed under guard and the party is escorted off the premises pending a formal inquiry.',
    },
    skillBonuses: {
      persuasion: 'Advantage if appealing to duty, unit loyalty, or tactical necessity.',
      intimidation: 'Advantage if the character holds military rank equal to or above the target.',
    },
  },
  {
    id: 'religious_ceremony',
    label: 'Religious Ceremony',
    description:
      'Temple grounds, holy rites, funerary proceedings, and sacred festivals. Reverence is required. The divine is present and behavior reflects on the soul.',
    expectedBehavior: [
      'Remove helmets and lower weapons before entering a temple',
      'Speak in measured, respectful tones',
      'Follow the lead of the officiating priest for seating, standing, and responses',
      'Make an offering appropriate to the deity',
      'Do not interrupt a rite in progress — wait at the threshold',
    ],
    taboos: [
      'Invoking a rival deity within the temple grounds',
      'Interrupting prayer, chant, or ritual speech',
      'Bringing undead or profane objects into consecrated space',
      'Raising one\'s voice in anger during a ceremony',
      'Turning away or refusing an offered blessing',
    ],
    faux_pas_consequences: {
      minor: 'Priest becomes Unfriendly. Congregation watches the party with suspicion.',
      moderate: 'Party is asked to leave and cleanse themselves before returning. Access to temple services is suspended.',
      severe: 'The party is declared blasphemers in a public ceremony. Hostile attitude from all devout NPCs in the region until amends are made.',
    },
    skillBonuses: {
      persuasion: 'Advantage if the character worships the same deity or carries a genuine relic of the faith.',
      performance: 'Advantage if performing a piece of devotional art appropriate to the deity.',
    },
  },
  {
    id: 'tribal_council',
    label: 'Tribal Council',
    description:
      'Village elders, clan chieftains, wilderness councils, and indigenous governing bodies. Wisdom and experience are sacred. Patience is a prerequisite for respect.',
    expectedBehavior: [
      'Sit when the elder sits — do not stand over someone seeking to speak with you',
      'Allow silences to breathe — interrupting silence is considered rude and anxious',
      'Bring a gift appropriate to the season or the purpose of the visit',
      'Ask permission before speaking on matters that concern only the tribe',
      'Speak for yourself — do not claim to speak for people who are not present',
    ],
    taboos: [
      'Interrupting an elder mid-sentence for any reason',
      'Speaking about tribal ancestors disrespectfully',
      'Making eye contact aggressively with the council head',
      'Handling sacred objects without invitation',
      'Offering coin instead of goods — many tribal councils find monetary bribery insulting',
    ],
    faux_pas_consequences: {
      minor: 'Elder pauses and the council exchanges looks. Persuasion DC increases by 5 for the rest of the audience.',
      moderate: 'The offending character is asked to be silent. Another party member must lead all remaining checks.',
      severe: 'The council ends the audience. The tribe will not speak with the party again until a public apology or restorative task is completed.',
    },
    skillBonuses: {
      persuasion: 'Advantage if the character has Outlander background or has spent significant time with this culture.',
      insight: 'Advantage when reading the council — the culture values transparency and emotions are rarely concealed.',
    },
  },
];

// ── Helper Functions ───────────────────────────────────────────────────────

/**
 * Returns the NPC_ATTITUDES entry for the given attitude id or level index.
 * @param {string|number} attitudeLevel - Attitude id (e.g. 'friendly') or level index 0–4.
 * @returns {object|null}
 */
export function getAttitude(attitudeLevel) {
  if (typeof attitudeLevel === 'number') {
    return NPC_ATTITUDES.find((a) => a.level === attitudeLevel) ?? null;
  }
  return NPC_ATTITUDES.find((a) => a.id === attitudeLevel) ?? null;
}

/**
 * Attempts to shift an NPC's attitude up or down based on a skill check result.
 * @param {string} current - Current attitude id (e.g. 'indifferent').
 * @param {'up'|'down'} direction - Which direction to attempt the shift.
 * @param {number} checkResult - The total of the skill check roll (die + modifiers).
 * @param {number} [dc] - Override the DC. If omitted, uses the attitude's shiftUpDC.
 * @returns {{ newAttitude: string, shifted: boolean, message: string }}
 */
export function shiftAttitude(current, direction, checkResult, dc) {
  const currentEntry = getAttitude(current);
  if (!currentEntry) {
    return { newAttitude: current, shifted: false, message: `Unknown attitude: ${current}` };
  }

  const sorted = [...NPC_ATTITUDES].sort((a, b) => a.level - b.level);
  const currentIndex = sorted.findIndex((a) => a.id === current);

  if (direction === 'up') {
    const effectiveDC = dc !== undefined ? dc : currentEntry.shiftUpDC;
    if (effectiveDC === null) {
      return {
        newAttitude: current,
        shifted: false,
        message: `${currentEntry.label} is already the highest attitude — no shift possible.`,
      };
    }
    if (checkResult >= effectiveDC) {
      const next = sorted[currentIndex + 1];
      if (!next) {
        return { newAttitude: current, shifted: false, message: 'Already at maximum attitude.' };
      }
      return {
        newAttitude: next.id,
        shifted: true,
        message: `Success (${checkResult} vs DC ${effectiveDC}). Attitude shifts from ${currentEntry.label} to ${next.label}.`,
      };
    } else {
      return {
        newAttitude: current,
        shifted: false,
        message: `Failure (${checkResult} vs DC ${effectiveDC}). Attitude remains ${currentEntry.label}.`,
      };
    }
  }

  if (direction === 'down') {
    const prev = sorted[currentIndex - 1];
    if (!prev) {
      return { newAttitude: current, shifted: false, message: 'Already at minimum attitude (Hostile).' };
    }
    return {
      newAttitude: prev.id,
      shifted: true,
      message: `Attitude drops from ${currentEntry.label} to ${prev.label}.`,
    };
  }

  return { newAttitude: current, shifted: false, message: `Unknown direction: ${direction}` };
}

/**
 * Resolves a conversation action against a specific NPC attitude and skill roll.
 * Returns an outcome summary the DM can use to narrate the result.
 * @param {string} actionId - A CONVERSATION_ACTIONS id (e.g. 'appeal_to_interest').
 * @param {string} skillId - The social skill used (e.g. 'persuasion').
 * @param {number} rollResult - The total skill check result.
 * @param {string} npcAttitudeId - The NPC's current attitude id.
 * @returns {{ success: boolean, attitudeChange: number, narrative: string, notes: string }}
 */
export function resolveConversationAction(actionId, skillId, rollResult, npcAttitudeId) {
  const action = CONVERSATION_ACTIONS.find((a) => a.id === actionId);
  const skill = SOCIAL_SKILLS.find((s) => s.id === skillId);
  const attitude = getAttitude(npcAttitudeId);

  if (!action || !skill || !attitude) {
    return {
      success: false,
      attitudeChange: 0,
      narrative: 'Invalid action, skill, or attitude provided.',
      notes: '',
    };
  }

  const dcModKey = `${skillId}DCMod`;
  const attitudeDCMod = attitude.mechanicalEffects[dcModKey] ?? 0;
  const baseDC = skill.typicalDCRange.moderate;
  const effectiveDC = baseDC + attitudeDCMod;

  const success = rollResult >= effectiveDC;
  const isBestMatch = action.bestAgainst.includes(npcAttitudeId);
  const attitudeChange = success
    ? action.successAttitudeMod + (isBestMatch ? 0 : -0)
    : action.failureAttitudeMod;

  const critSuccess = rollResult >= effectiveDC + (skill.criticalSuccess?.threshold ?? 10);
  const critFailure = rollResult <= effectiveDC + (skill.criticalFailure?.threshold ?? -5);

  let narrative;
  if (critSuccess) {
    narrative = `Critical success. ${skill.criticalSuccess?.effect ?? 'Outstanding result.'}`;
  } else if (critFailure) {
    narrative = `Critical failure. ${skill.criticalFailure?.effect ?? 'The attempt backfires badly.'}`;
  } else if (success) {
    narrative = `Success (${rollResult} vs DC ${effectiveDC}). The ${action.label} lands. Attitude ${attitudeChange > 0 ? 'improves' : attitudeChange < 0 ? 'worsens' : 'holds'}.`;
  } else {
    narrative = `Failure (${rollResult} vs DC ${effectiveDC}). The ${action.label} does not move the NPC. Attitude ${attitudeChange < 0 ? 'worsens' : 'holds'}.`;
  }

  return {
    success,
    attitudeChange,
    narrative,
    notes: action.mechanicalNote,
    effectiveDC,
    isBestMatch,
    critSuccess,
    critFailure,
  };
}

/**
 * Tracks state of a running social skill challenge.
 * Returns the updated challenge state and an outcome if the challenge is resolved.
 * @param {number} successes - Current number of successes.
 * @param {number} failures - Current number of failures.
 * @param {number} [maxSuccesses=3] - Successes needed to win.
 * @param {number} [maxFailures=3] - Failures allowed before losing.
 * @returns {{ status: 'ongoing'|'success'|'failure', successes: number, failures: number, message: string }}
 */
export function runSocialSkillChallenge(successes, failures, maxSuccesses = 3, maxFailures = 3) {
  if (successes >= maxSuccesses) {
    return {
      status: 'success',
      successes,
      failures,
      message: `Challenge succeeded with ${successes} successes and ${failures} failures. The NPC cooperates.`,
    };
  }
  if (failures >= maxFailures) {
    return {
      status: 'failure',
      successes,
      failures,
      message: `Challenge failed with ${failures} failures. The NPC refuses further engagement this scene.`,
    };
  }
  const remaining = maxSuccesses - successes;
  const allowed = maxFailures - failures;
  return {
    status: 'ongoing',
    successes,
    failures,
    message: `Ongoing: ${successes}/${maxSuccesses} successes, ${failures}/${maxFailures} failures. Need ${remaining} more success${remaining !== 1 ? 'es' : ''} with ${allowed} failure${allowed !== 1 ? 's' : ''} remaining.`,
  };
}

/**
 * Returns the etiquette entry for a given culture type id.
 * @param {string} cultureType - One of: formal_court, tavern_casual, military_discipline, religious_ceremony, tribal_council.
 * @returns {object|null}
 */
export function getEtiquette(cultureType) {
  return ETIQUETTE_BY_CULTURE.find((e) => e.id === cultureType) ?? null;
}

/**
 * Suggests the best conversation approach given an NPC's current attitude and
 * one or more known wants.
 * @param {string} npcAttitudeId - The NPC's current attitude id.
 * @param {string[]} npcWants - Array of descriptive want strings (from the NPC template).
 * @returns {{ primaryAction: object, fallbackAction: object, reasoning: string }}
 */
export function suggestApproach(npcAttitudeId, npcWants = []) {
  const attitude = getAttitude(npcAttitudeId);
  if (!attitude) {
    return { primaryAction: null, fallbackAction: null, reasoning: 'Unknown attitude.' };
  }

  // Find the best-matched action for this attitude
  const bestActions = CONVERSATION_ACTIONS.filter((a) =>
    a.bestAgainst.includes(npcAttitudeId)
  );

  // Prefer low-risk actions first; fall back to moderate
  const safePrimary =
    bestActions.find((a) => a.riskLevel === 'low') ||
    bestActions.find((a) => a.riskLevel === 'moderate') ||
    bestActions[0];

  const fallback =
    bestActions.find((a) => a !== safePrimary && a.riskLevel !== 'high') ||
    CONVERSATION_ACTIONS.find((a) => a.id === 'logical_argument');

  const wantHint =
    npcWants.length > 0
      ? ` Given the NPC wants "${npcWants[0]}", consider framing your ${safePrimary?.label ?? 'approach'} around that interest.`
      : '';

  const reasoning = `Against a ${attitude.label} NPC, "${safePrimary?.label}" is the recommended opening move (risk: ${safePrimary?.riskLevel}).${wantHint} Fallback option: "${fallback?.label}".`;

  return {
    primaryAction: safePrimary ?? null,
    fallbackAction: fallback ?? null,
    reasoning,
  };
}
