/**
 * @file playerHandouts.js
 * @description Data and helpers for the DM handout/document sharing system.
 *              Covers handout types, templates, visual styles, revelation modes,
 *              and metadata tracking for player-facing documents.
 * @module playerHandouts
 */

// ---------------------------------------------------------------------------
// HANDOUT_TYPES
// ---------------------------------------------------------------------------

/**
 * The eight canonical handout document types available to DMs.
 * Each entry describes the document's nature, formatting hints, and typical
 * structural sections so renderers and template pickers can present consistent UI.
 *
 * @type {Object.<string, {
 *   id: string,
 *   label: string,
 *   description: string,
 *   formattingStyle: string,
 *   fontSuggestion: string,
 *   backgroundStyleHint: string,
 *   typicalSections: string[]
 * }>}
 */
export const HANDOUT_TYPES = {
  letter_note: {
    id: "letter_note",
    label: "Letter / Note",
    description: "Personal correspondence, short notes, or messages passed between characters.",
    formattingStyle: "prose",
    fontSuggestion: "Palatino Linotype, Book Antiqua, serif",
    backgroundStyleHint: "cream-parchment",
    typicalSections: ["salutation", "opening", "body", "closing", "signature"],
  },

  map: {
    id: "map",
    label: "Map",
    description: "Rough sketches, dungeon layouts, regional overviews, or treasure maps with annotations.",
    formattingStyle: "annotated-diagram",
    fontSuggestion: "Cinzel, Trajan Pro, serif",
    backgroundStyleHint: "worn-parchment",
    typicalSections: ["title", "legend", "scale_note", "annotations", "hidden_markings"],
  },

  wanted_poster: {
    id: "wanted_poster",
    label: "Wanted Poster",
    description: "Official or unofficial bounty notices posted in towns, taverns, and guildhalls.",
    formattingStyle: "poster",
    fontSuggestion: "Wanted M54, Impact, sans-serif",
    backgroundStyleHint: "weathered-wood-paper",
    typicalSections: ["header", "subject_name", "crime_description", "reward", "last_seen", "contact_authority"],
  },

  quest_notice: {
    id: "quest_notice",
    label: "Quest Notice",
    description: "Bulletin board postings, guild job boards, or town crier announcements seeking adventurers.",
    formattingStyle: "notice",
    fontSuggestion: "IM Fell English, Garamond, serif",
    backgroundStyleHint: "pinboard-paper",
    typicalSections: ["headline", "task_summary", "requirements", "reward", "contact_info", "deadline"],
  },

  contract_deed: {
    id: "contract_deed",
    label: "Contract / Deed",
    description: "Legal agreements, land deeds, guild contracts, sworn oaths, and binding documents.",
    formattingStyle: "legal",
    fontSuggestion: "UnifrakturMaguntia, Old English Text MT, serif",
    backgroundStyleHint: "formal-vellum",
    typicalSections: ["parties", "preamble", "terms", "obligations", "penalties", "duration", "signatures", "witness"],
  },

  journal_entry: {
    id: "journal_entry",
    label: "Journal Entry",
    description: "Personal diary pages, research notes, or field observations written in first person.",
    formattingStyle: "handwritten-prose",
    fontSuggestion: "Caveat, Architects Daughter, cursive",
    backgroundStyleHint: "notebook-paper",
    typicalSections: ["date_entry", "location", "body", "personal_reflection", "sketches_notes"],
  },

  ancient_text: {
    id: "ancient_text",
    label: "Ancient Text",
    description: "Fragments of old tomes, runic inscriptions, prophecies, or lost-language documents.",
    formattingStyle: "archaic",
    fontSuggestion: "MedievalSharp, Runic, serif",
    backgroundStyleHint: "stone-etching-or-crumbling-scroll",
    typicalSections: ["title_glyph", "provenance", "body_text", "translation_notes", "missing_sections"],
  },

  newspaper_broadsheet: {
    id: "newspaper_broadsheet",
    label: "Newspaper / Broadsheet",
    description: "In-world printed news, propaganda leaflets, gossip rags, or official proclamations.",
    formattingStyle: "multi-column-print",
    fontSuggestion: "Special Elite, Courier New, monospace",
    backgroundStyleHint: "newsprint",
    typicalSections: ["masthead", "date_edition", "headline", "lead_paragraph", "body_columns", "advertisements", "notices"],
  },
};

// ---------------------------------------------------------------------------
// HANDOUT_TEMPLATES
// ---------------------------------------------------------------------------

/**
 * Pre-built templates keyed by handout type id.
 * Each template uses {placeholder} tokens that can be filled via fillHandoutTemplate().
 * Two to three templates are provided per type, ranging from simple to elaborate.
 *
 * @type {Object.<string, Array<{
 *   id: string,
 *   name: string,
 *   description: string,
 *   template: string
 * }>>}
 */
export const HANDOUT_TEMPLATES = {
  letter_note: [
    {
      id: "letter_formal",
      name: "Formal Letter",
      description: "A polished, formal piece of correspondence.",
      template:
        "To {recipient},\n\nI write to you with {urgency} regarding the matter of {subject}.\n\n{body}\n\nI trust you will give this your fullest attention. Should you require further counsel, you may reach me through {contact_method}.\n\nYours faithfully,\n{sender}\n{sender_title}",
    },
    {
      id: "letter_personal",
      name: "Personal Note",
      description: "A brief, informal note passed between acquaintances.",
      template:
        "{recipient} —\n\n{body}\n\nMeet me at {meeting_place} before {meeting_time}. Tell no one.\n\n— {sender}",
    },
    {
      id: "letter_distress",
      name: "Distress Letter",
      description: "A hurried message written under duress or time pressure.",
      template:
        "If you are reading this, I may already be {fate}.\n\nMy name is {sender}. I have hidden {secret} in {location}. Do not trust {warning_person}.\n\n{final_message}\n\nPlease, {plea}.\n\n{sender}",
    },
  ],

  map: [
    {
      id: "map_treasure",
      name: "Treasure Map",
      description: "A classic treasure map with directions and a marked destination.",
      template:
        "[ MAP OF {region_name} ]\n\nFrom {starting_point}, travel {direction_one} for {distance_one}.\nAt the {landmark_one}, turn {direction_two}.\nBeware {hazard}.\nThe prize lies beneath {final_marker}.\n\n~ Drawn by {cartographer} in the year {year} ~\n\n[ANNOTATIONS: {annotations}]",
    },
    {
      id: "map_dungeon_note",
      name: "Dungeon Sketch Note",
      description: "A scrawled note accompanying a rough dungeon sketch.",
      template:
        "ROUGH SURVEY — {dungeon_name}\n\nEntrance: {entrance_description}\nKey Rooms: {room_list}\nKnown Dangers: {dangers}\nPossible Exits: {exits}\n\nNOTE: {surveyor_note}\n\n— {surveyor}, {survey_date}",
    },
    {
      id: "map_regional",
      name: "Regional Overview",
      description: "High-level notes about a region's layout and points of interest.",
      template:
        "REGION: {region_name}\nScale: approx. {scale}\n\nPoints of Interest:\n{points_of_interest}\n\nRoads & Paths: {roads}\nWater Features: {water_features}\nSettlements: {settlements}\n\nDangerous Areas: {dangerous_areas}\n\nCartographer's Note: {cartographer_note}",
    },
  ],

  wanted_poster: [
    {
      id: "wanted_standard",
      name: "Standard Bounty",
      description: "The classic tavern-board wanted notice.",
      template:
        "╔══════════════════════╗\n   W A N T E D\n╚══════════════════════╝\n\n{name}\n\nFor the crime of {crime}.\n\nREWARD: {reward} gold pieces\nDEAD OR {dead_or_alive}\n\nLast seen: {location}\nDescription: {description}\n\nContact: {authority}\n{issuing_body}",
    },
    {
      id: "wanted_guild",
      name: "Thieves' Guild Contract",
      description: "An underworld contract rather than an official notice.",
      template:
        "CONTRACT ISSUED\n\nTarget: {name}\nLast Known Location: {location}\nMarking: {identifying_marks}\n\nOffense Against the {guild_name}: {offense}\n\nPayment upon proof: {reward} coin\nProof Required: {proof_type}\n\nExpiry: {expiry_date}\n\nDo not ask who placed this order.\n\n[SEAL OF THE {guild_name}]",
    },
    {
      id: "wanted_missing",
      name: "Missing Person Notice",
      description: "A worried family's plea for information.",
      template:
        "MISSING\n\n{name}, age {age}\nLast seen at {last_location} on {last_date}\n\nDescription: {description}\nDistinguishing features: {features}\n\nIf you have any information, please contact {contact_name} at {contact_location}.\n\nA reward of {reward} gold is offered for safe return.\n\n{emotional_appeal}",
    },
  ],

  quest_notice: [
    {
      id: "quest_guild_board",
      name: "Guild Job Board Posting",
      description: "A formal adventurers' guild job listing.",
      template:
        "[ ADVENTURERS' GUILD — {guild_location} ]\nPosting #{posting_id} | Rank Required: {rank}\n\n{headline}\n\nTask: {task_summary}\n\nDetails: {details}\n\nReward: {reward}\nBonus: {bonus_condition}\n\nReport to: {contact_name}, {contact_location}\nDeadline: {deadline}\n\n— {guild_officer}, Guild Registrar",
    },
    {
      id: "quest_town_crier",
      name: "Town Crier Broadside",
      description: "A publicly posted notice from town leadership.",
      template:
        "BY ORDER OF {authority}\n{settlement_name} SEEKS AID\n\n{headline}\n\nThe good people of {settlement_name} are {problem_statement}.\n\nWe seek capable individuals to {task}.\n\nCompensation: {reward}\nAdditional: {additional_reward}\n\nPresent yourselves at {location} no later than {deadline}.\n\nMay the gods favor the brave.\n\n— {authority_name}, {authority_title}",
    },
    {
      id: "quest_personal",
      name: "Personal Request",
      description: "A direct plea nailed to the board by a desperate individual.",
      template:
        "PLEASE HELP\n\n{personal_plea}\n\nI need someone to {task}.\n\nI cannot pay much — only {reward} — but I swear on {sworn_on} it is all I have.\n\n{additional_details}\n\nAsk for {contact_name} at {contact_location}.\n\nThank you. — {petitioner_name}",
    },
  ],

  contract_deed: [
    {
      id: "contract_service",
      name: "Contract of Service",
      description: "A formal agreement for rendered adventuring services.",
      template:
        "CONTRACT OF SERVICE\n\nThis agreement entered on the {day} day of {month}, in the year {year},\nbetween {employer_name} (hereafter \"the Employer\") and {contractor_name} (hereafter \"the Contractor\").\n\nSCOPE OF WORK:\n{scope_of_work}\n\nTERMS & OBLIGATIONS:\n{terms}\n\nCOMPENSATION:\n{compensation}\n\nDURATION:\nThis contract runs from {start_date} until {end_date} or upon completion of {completion_condition}.\n\nPENALTIES FOR BREACH:\n{penalties}\n\nSIGNED:\n{employer_name} ________________\n{contractor_name} ________________\n\nWITNESSED BY: {witness_name}",
    },
    {
      id: "deed_property",
      name: "Property Deed",
      description: "A deed of ownership for land or a building.",
      template:
        "DEED OF TITLE\n\nLet it be known to all that {grantor_name} does hereby grant, convey, and transfer to {grantee_name} full and exclusive ownership of:\n\n{property_description}\n\nBounded to the {north_boundary} in the north, {east_boundary} in the east, {south_boundary} in the south, and {west_boundary} in the west.\n\nConsideration paid: {consideration}\n\nEncumbrances: {encumbrances}\n\nThis deed is lawful and binding under the laws of {jurisdiction}.\n\n{grantor_name} ________________  Date: {date}\n\nRecorded by: {official_name}, {official_title}",
    },
    {
      id: "contract_oath",
      name: "Sworn Oath",
      description: "A magically or legally binding oath or vow.",
      template:
        "OATH OF {oath_name}\n\nI, {swearer_name}, do solemnly swear before {witness_deity_or_authority}:\n\n{oath_text}\n\nI understand that violation of this oath shall result in {consequence}.\n\nThis oath is sworn freely and without coercion on {date}.\n\n{swearer_name} ________________\n\nBound in the presence of: {witnesses}\n\n[{magical_seal_description}]",
    },
  ],

  journal_entry: [
    {
      id: "journal_expedition",
      name: "Expedition Log",
      description: "A field researcher or explorer's daily log.",
      template:
        "{date}, {location}\n\nDay {day_number} of the expedition.\n\nWeather: {weather}\n\n{body}\n\nDiscoveries today: {discoveries}\nLosses or setbacks: {setbacks}\n\nMorale: {morale_note}\n\nTomorrow I intend to {plans}.\n\n— {author}",
    },
    {
      id: "journal_personal",
      name: "Personal Diary",
      description: "An intimate personal diary entry.",
      template:
        "{date}\n\nDear journal,\n\n{opening_thoughts}\n\n{body}\n\n{emotional_reflection}\n\nI keep returning to the thought of {recurring_thought}. Perhaps one day I will understand.\n\nUntil tomorrow,\n{author}",
    },
    {
      id: "journal_research",
      name: "Scholar's Research Notes",
      description: "Academic notes from a mage, sage, or investigator.",
      template:
        "RESEARCH NOTES — {subject}\nDate: {date}  Location: {location}\nInvestigator: {author}\n\nHYPOTHESIS:\n{hypothesis}\n\nOBSERVATIONS:\n{observations}\n\nCROSS-REFERENCES:\n{cross_references}\n\nANOMALIES NOTED:\n{anomalies}\n\nCONCLUSIONS (PRELIMINARY):\n{conclusions}\n\nFURTHER QUESTIONS:\n{further_questions}",
    },
  ],

  ancient_text: [
    {
      id: "ancient_prophecy",
      name: "Prophecy Fragment",
      description: "A cryptic prophetic verse recovered from ruins.",
      template:
        "— FRAGMENT, source: {source_location}, recovered {recovery_date} —\n\n[ TRANSCRIPTION ]\n\"{prophecy_text}\"\n\n[ TRANSLATOR'S NOTE ]\n{translator_note}\n\n[ MISSING OR DAMAGED SECTIONS ]\n{missing_sections}\n\n[ PROVENANCE ]\n{provenance}\n\nEstimated Age: {estimated_age}\n— {translator_name}, {translation_date}",
    },
    {
      id: "ancient_inscription",
      name: "Runic Inscription",
      description: "An inscription found carved into stone or metal.",
      template:
        "INSCRIPTION — {material}, {find_location}\n\n[ ORIGINAL SCRIPT ]\n{original_script}\n\n[ TRANSLITERATION ]\n{transliteration}\n\n[ TRANSLATION ]\n{translation}\n\n[ CONTEXT NOTES ]\nSurrounding symbols: {surrounding_context}\nEstimated origin: {origin}\nPossible purpose: {purpose}\n\n— Recorded by {recorder}",
    },
    {
      id: "ancient_tome_page",
      name: "Torn Tome Page",
      description: "A page or pages torn from an ancient magical or scholarly tome.",
      template:
        "[ PAGE {page_number} — {tome_title} ]\n\n...{preceding_context}...\n\n{body_text}\n\n[ MARGIN ANNOTATIONS ]\n{margin_notes}\n\n...{following_context}...\n\n[ ARCHIVIST'S NOTE ]\n{archivist_note}\n— {archivist_name}",
    },
  ],

  newspaper_broadsheet: [
    {
      id: "broadsheet_standard",
      name: "Standard Broadsheet",
      description: "A typical in-world newspaper front page.",
      template:
        "══════════════════════════════════════\n         THE {publication_name}\n   {settlement_name} — {date} — {price}\n══════════════════════════════════════\n\n{headline}\n\n{lead_paragraph}\n\n{body_column_one}\n\n-----\n\n{secondary_headline}\n{secondary_story}\n\n-----\n\nNOTICES & ADVERTISEMENTS:\n{notices}\n\n[ Printed by {printer_name}, Licensed under {authority} ]",
    },
    {
      id: "broadsheet_gossip",
      name: "Gossip Rag",
      description: "A sensationalist gossip leaflet or tabloid.",
      template:
        "✦ THE {publication_name} ✦\n\"All the scandal that's fit to print!\"\n{date} — {price} copper\n\nSCANDAL: {headline}!\n\n{lead_paragraph}\n\nOur sources tell us that {rumor_one}. Furthermore, it is whispered that {rumor_two}.\n\n{speculation}\n\nASK THE ORACLE: {advice_column}\n\nSPOTTED ABOUT TOWN:\n{spotted_notices}\n\n— {editor_pseudonym}, Editor",
    },
    {
      id: "broadsheet_proclamation",
      name: "Official Proclamation",
      description: "A royal or civic official proclamation printed for distribution.",
      template:
        "BY ORDER OF {issuing_authority}\n\nPROCLAMATION\n\nLet it be known throughout {jurisdiction} that:\n\n{proclamation_body}\n\nAll citizens are expected to {citizen_obligation}.\n\nViolation shall be punishable by {punishment}.\n\nIssued on this day, {date}, from {issuing_location}.\n\n{authority_name}\n{authority_title}\n\n[ SEAL OF {seal_name} ]",
    },
  ],
};

// ---------------------------------------------------------------------------
// PARCHMENT_STYLES
// ---------------------------------------------------------------------------

/**
 * Visual style presets for rendering handouts.
 * CSS hints are intentionally descriptive strings — apply them via your
 * stylesheet or inline style logic as appropriate.
 *
 * @type {Object.<string, {
 *   id: string,
 *   label: string,
 *   description: string,
 *   cssHints: {
 *     background: string,
 *     border: string,
 *     filter: string,
 *     color: string,
 *     boxShadow: string,
 *     textShadow: string
 *   }
 * }>}
 */
export const PARCHMENT_STYLES = {
  clean_parchment: {
    id: "clean_parchment",
    label: "Clean Parchment",
    description: "Fresh, unspoiled parchment. Readable and elegant.",
    cssHints: {
      background: "#f5e6c8",
      border: "2px solid #c8a96a",
      filter: "none",
      color: "#2c1a0e",
      boxShadow: "2px 4px 8px rgba(0,0,0,0.25)",
      textShadow: "none",
    },
  },

  aged_yellowed: {
    id: "aged_yellowed",
    label: "Aged / Yellowed",
    description: "Old, yellowed parchment that has survived decades or centuries.",
    cssHints: {
      background: "#d4b483",
      border: "2px solid #8b6914",
      filter: "sepia(40%) contrast(0.95)",
      color: "#1a0f05",
      boxShadow: "3px 5px 12px rgba(0,0,0,0.4)",
      textShadow: "0 1px 1px rgba(0,0,0,0.15)",
    },
  },

  burnt_edges: {
    id: "burnt_edges",
    label: "Burnt Edges",
    description: "Singed or fire-damaged document with charred borders.",
    cssHints: {
      background: "radial-gradient(ellipse at center, #e8d5a3 55%, #5c3a1a 80%, #1a0a00 100%)",
      border: "4px solid #3a1a00",
      filter: "sepia(20%) contrast(1.1)",
      color: "#1a0a00",
      boxShadow: "0 0 20px rgba(80,30,0,0.6), inset 0 0 30px rgba(50,20,0,0.3)",
      textShadow: "none",
    },
  },

  blood_stained: {
    id: "blood_stained",
    label: "Blood-Stained",
    description: "A grim document bearing old bloodstains — clearly from a violent scene.",
    cssHints: {
      background: "#e8d5a3",
      border: "2px solid #8b1a1a",
      filter: "sepia(15%) saturate(1.1)",
      color: "#1a0f05",
      boxShadow: "2px 4px 10px rgba(100,0,0,0.35)",
      textShadow: "none",
    },
  },

  magical_glowing: {
    id: "magical_glowing",
    label: "Magical / Glowing",
    description: "Enchanted document with faint luminescence, glowing runes or ink.",
    cssHints: {
      background: "#0d1a2e",
      border: "2px solid #4a90d9",
      filter: "brightness(1.1) saturate(1.4)",
      color: "#a8d8ff",
      boxShadow: "0 0 15px rgba(74,144,217,0.6), 0 0 40px rgba(74,144,217,0.2)",
      textShadow: "0 0 8px rgba(168,216,255,0.8)",
    },
  },
};

// ---------------------------------------------------------------------------
// REVELATION_MODES
// ---------------------------------------------------------------------------

/**
 * Defines how a handout is revealed or shared with players.
 * The renderer or game engine should interpret the `mode` and its `config`
 * to apply the appropriate interaction pattern.
 *
 * @type {Object.<string, {
 *   id: string,
 *   label: string,
 *   description: string,
 *   config: Object
 * }>}
 */
export const REVELATION_MODES = {
  instant: {
    id: "instant",
    label: "Instant Reveal",
    description: "The full handout is shown immediately when shared — no delay or interaction required.",
    config: {
      delay: 0,
      animation: "fade-in",
      interactionRequired: false,
    },
  },

  gradual: {
    id: "gradual",
    label: "Gradual (Typing Effect)",
    description: "Text appears character by character, as if being written or slowly revealed.",
    config: {
      typingSpeedMs: 30,
      pauseOnPunctuation: true,
      pauseDurationMs: 200,
      interactionRequired: false,
      allowSkip: true,
    },
  },

  puzzle: {
    id: "puzzle",
    label: "Puzzle (Scrambled Until Decoded)",
    description: "Text appears scrambled or encoded. Players must solve a puzzle or make a check to decode it.",
    config: {
      scrambleMethod: "caesar_shift", // caesar_shift | anagram | symbol_substitution
      hintAvailable: true,
      hintCost: "arcana_check_dc15",
      revealOnSolve: true,
      interactionRequired: true,
    },
  },

  conditional: {
    id: "conditional",
    label: "Conditional (Requires Check)",
    description: "The handout — or portions of it — are only visible if players meet a condition (skill check, item in possession, etc.).",
    config: {
      conditions: [
        // Example shape: { conditionType: "skill_check", skill: "arcana", dc: 15, revealsSection: "hidden_markings" }
      ],
      failureText: "You cannot make sense of this portion of the document.",
      partialRevealAllowed: true,
      interactionRequired: true,
    },
  },

  timed: {
    id: "timed",
    label: "Timed (Disappears After Viewing)",
    description: "The handout self-destructs, fades, or becomes unreadable after a set duration.",
    config: {
      displayDurationSeconds: 60,
      warningAtSeconds: 10,
      onExpiry: "blur_and_lock", // blur_and_lock | delete | replace_with_ash_text
      canExtend: false,
      expiryMessage: "The ink has faded. The document is no longer legible.",
    },
  },
};

// ---------------------------------------------------------------------------
// HANDOUT_METADATA
// ---------------------------------------------------------------------------

/**
 * The shape of metadata attached to every handout instance.
 * Use this as a reference schema when creating handout records.
 * DM-only fields are marked with `dmOnly: true` — never send these to players.
 *
 * @type {Object.<string, {
 *   field: string,
 *   type: string,
 *   default: *,
 *   dmOnly: boolean,
 *   description: string
 * }>}
 */
export const HANDOUT_METADATA = {
  id: {
    field: "id",
    type: "string",
    default: null,
    dmOnly: false,
    description: "Unique identifier for the handout instance (UUID).",
  },
  title: {
    field: "title",
    type: "string",
    default: "Untitled Document",
    dmOnly: false,
    description: "Display name shown to both the DM and players.",
  },
  handoutType: {
    field: "handoutType",
    type: "string",
    default: null,
    dmOnly: false,
    description: "One of the HANDOUT_TYPES ids.",
  },
  parchmentStyle: {
    field: "parchmentStyle",
    type: "string",
    default: "clean_parchment",
    dmOnly: false,
    description: "One of the PARCHMENT_STYLES ids.",
  },
  revelationMode: {
    field: "revelationMode",
    type: "string",
    default: "instant",
    dmOnly: false,
    description: "One of the REVELATION_MODES ids.",
  },
  content: {
    field: "content",
    type: "string",
    default: "",
    dmOnly: false,
    description: "The rendered text content of the handout.",
  },
  createdDate: {
    field: "createdDate",
    type: "string",
    default: null,
    dmOnly: true,
    description: "ISO 8601 date-time when the handout was created by the DM.",
  },
  lastModifiedDate: {
    field: "lastModifiedDate",
    type: "string",
    default: null,
    dmOnly: true,
    description: "ISO 8601 date-time of the last edit.",
  },
  lastSharedDate: {
    field: "lastSharedDate",
    type: "string",
    default: null,
    dmOnly: true,
    description: "ISO 8601 date-time when the handout was most recently shared with players.",
  },
  sharedWithPlayers: {
    field: "sharedWithPlayers",
    type: "array",
    default: [],
    dmOnly: false,
    description: "Array of player IDs or names the handout has been shared with.",
  },
  readStatusByPlayer: {
    field: "readStatusByPlayer",
    type: "object",
    default: {},
    dmOnly: false,
    description: "Map of playerId -> boolean indicating whether each player has opened/read the handout.",
  },
  dmNotes: {
    field: "dmNotes",
    type: "string",
    default: "",
    dmOnly: true,
    description: "Private DM notes about this handout — never visible to players.",
  },
  tags: {
    field: "tags",
    type: "array",
    default: [],
    dmOnly: false,
    description: "Optional array of string tags for filtering and organization.",
  },
  isArchived: {
    field: "isArchived",
    type: "boolean",
    default: false,
    dmOnly: true,
    description: "Whether the DM has archived this handout (hidden from active lists).",
  },
  campaignId: {
    field: "campaignId",
    type: "string",
    default: null,
    dmOnly: false,
    description: "ID of the campaign this handout belongs to.",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Generates a simple unique ID string.
 * Uses crypto.randomUUID if available, otherwise falls back to a timestamp-based ID.
 *
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `handout_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Creates a new handout record with default metadata populated.
 *
 * @param {string} type - A key from HANDOUT_TYPES (e.g., "letter_note").
 * @param {string} content - The text body of the handout.
 * @param {string} [style="clean_parchment"] - A key from PARCHMENT_STYLES.
 * @returns {{
 *   id: string,
 *   title: string,
 *   handoutType: string,
 *   parchmentStyle: string,
 *   revelationMode: string,
 *   content: string,
 *   createdDate: string,
 *   lastModifiedDate: string,
 *   lastSharedDate: null,
 *   sharedWithPlayers: [],
 *   readStatusByPlayer: {},
 *   dmNotes: string,
 *   tags: [],
 *   isArchived: boolean,
 *   campaignId: null
 * }}
 */
export function createHandout(type, content, style = "clean_parchment") {
  if (!HANDOUT_TYPES[type]) {
    console.warn(`[playerHandouts] createHandout: unknown type "${type}". Defaulting to "letter_note".`);
    type = "letter_note";
  }
  if (!PARCHMENT_STYLES[style]) {
    console.warn(`[playerHandouts] createHandout: unknown style "${style}". Defaulting to "clean_parchment".`);
    style = "clean_parchment";
  }
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: HANDOUT_TYPES[type].label,
    handoutType: type,
    parchmentStyle: style,
    revelationMode: "instant",
    content: content || "",
    createdDate: now,
    lastModifiedDate: now,
    lastSharedDate: null,
    sharedWithPlayers: [],
    readStatusByPlayer: {},
    dmNotes: "",
    tags: [],
    isArchived: false,
    campaignId: null,
  };
}

/**
 * Retrieves a specific pre-built template by type and index.
 *
 * @param {string} type - A key from HANDOUT_TYPES (e.g., "wanted_poster").
 * @param {number} [templateIndex=0] - Zero-based index into the type's template array.
 * @returns {{ id: string, name: string, description: string, template: string } | null}
 *   The matching template object, or null if not found.
 */
export function getHandoutTemplate(type, templateIndex = 0) {
  const templates = HANDOUT_TEMPLATES[type];
  if (!templates || templates.length === 0) {
    console.warn(`[playerHandouts] getHandoutTemplate: no templates for type "${type}".`);
    return null;
  }
  if (templateIndex < 0 || templateIndex >= templates.length) {
    console.warn(
      `[playerHandouts] getHandoutTemplate: index ${templateIndex} out of range for type "${type}". Returning index 0.`
    );
    return templates[0];
  }
  return templates[templateIndex];
}

/**
 * Applies a parchment style to a handout record, returning a new object.
 * Does not mutate the original.
 *
 * @param {{ parchmentStyle?: string, [key: string]: * }} handout - Existing handout record.
 * @param {string} style - A key from PARCHMENT_STYLES.
 * @returns {{ parchmentStyle: string, [key: string]: * }} Updated handout copy with new style applied.
 */
export function formatHandout(handout, style) {
  if (!PARCHMENT_STYLES[style]) {
    console.warn(`[playerHandouts] formatHandout: unknown style "${style}". No change applied.`);
    return { ...handout };
  }
  return {
    ...handout,
    parchmentStyle: style,
    lastModifiedDate: new Date().toISOString(),
  };
}

/**
 * Returns an array of all handout type definitions for use in UI pickers.
 *
 * @returns {Array<{
 *   id: string,
 *   label: string,
 *   description: string,
 *   formattingStyle: string,
 *   fontSuggestion: string,
 *   backgroundStyleHint: string,
 *   typicalSections: string[]
 * }>}
 */
export function getHandoutTypes() {
  return Object.values(HANDOUT_TYPES);
}

/**
 * Returns the parchment style definition for a given style name.
 *
 * @param {string} styleName - A key from PARCHMENT_STYLES (e.g., "burnt_edges").
 * @returns {{
 *   id: string,
 *   label: string,
 *   description: string,
 *   cssHints: {
 *     background: string,
 *     border: string,
 *     filter: string,
 *     color: string,
 *     boxShadow: string,
 *     textShadow: string
 *   }
 * } | null} The style object, or null if not found.
 */
export function getParchmentStyle(styleName) {
  if (!PARCHMENT_STYLES[styleName]) {
    console.warn(`[playerHandouts] getParchmentStyle: unknown style "${styleName}".`);
    return null;
  }
  return PARCHMENT_STYLES[styleName];
}

/**
 * Fills a template string's {placeholder} tokens with values from a context object.
 * Any placeholder that has no matching key in context is left as-is (with braces intact),
 * making it easy to spot unfilled fields.
 *
 * @param {{ template: string, [key: string]: * } | string} template
 *   Either a raw template string or a template object from HANDOUT_TEMPLATES
 *   (in which case its `.template` property is used).
 * @param {Object.<string, string>} context - Map of placeholder names to replacement values.
 * @returns {string} The filled template string.
 *
 * @example
 * const tpl = getHandoutTemplate("wanted_poster", 0);
 * const filled = fillHandoutTemplate(tpl, {
 *   name: "Malachar the Grim",
 *   crime: "murder and arson",
 *   reward: "500",
 *   dead_or_alive: "ALIVE",
 *   location: "Duskwall Market",
 *   description: "Tall, scarred, grey cloak",
 *   authority: "Captain Verra, City Watch",
 *   issuing_body: "City Watch of Ashenveil",
 * });
 */
export function fillHandoutTemplate(template, context = {}) {
  const raw = typeof template === "string" ? template : template?.template ?? "";
  if (!raw) {
    console.warn("[playerHandouts] fillHandoutTemplate: received empty or invalid template.");
    return "";
  }
  return raw.replace(/\{(\w+)\}/g, (_match, key) => {
    if (Object.prototype.hasOwnProperty.call(context, key) && context[key] !== undefined && context[key] !== null) {
      return String(context[key]);
    }
    return `{${key}}`;
  });
}
