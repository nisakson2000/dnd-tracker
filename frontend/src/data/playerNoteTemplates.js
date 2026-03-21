/**
 * playerNoteTemplates.js
 * Player Mode Improvements 158-170: Notes & Journal Data
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// 1. NOTE_CATEGORIES
// ---------------------------------------------------------------------------

export const NOTE_CATEGORIES = {
  combat: {
    id: "combat",
    label: "Combat",
    color: "#e53e3e",
    colorName: "red",
    iconHint: "sword",
    description: "Battle encounters, tactics, enemy info, and combat outcomes.",
  },
  lore: {
    id: "lore",
    label: "Lore",
    color: "#3182ce",
    colorName: "blue",
    iconHint: "book",
    description: "World history, legends, arcane knowledge, and discovered lore.",
  },
  npc: {
    id: "npc",
    label: "NPC",
    color: "#2c7a7b",
    colorName: "teal",
    iconHint: "person",
    description: "People encountered, their motives, relationships, and promises.",
  },
  quest: {
    id: "quest",
    label: "Quest",
    color: "#805ad5",
    colorName: "purple",
    iconHint: "scroll",
    description: "Active and completed quests, objectives, progress, and rewards.",
  },
  location: {
    id: "location",
    label: "Location",
    color: "#38a169",
    colorName: "green",
    iconHint: "map-pin",
    description: "Places visited, notable features, dangers, and inhabitants.",
  },
  general: {
    id: "general",
    label: "General",
    color: "#718096",
    colorName: "gray",
    iconHint: "note",
    description: "Miscellaneous observations, reminders, and session notes.",
  },
};

// ---------------------------------------------------------------------------
// 2. NOTE_TEMPLATES
// ---------------------------------------------------------------------------

export const NOTE_TEMPLATES = {
  npc_encounter: {
    id: "npc_encounter",
    label: "NPC Encounter",
    category: "npc",
    description: "Record details about a newly met NPC.",
    fields: ["name", "role", "location", "disposition", "info", "promises"],
    content:
      "Name: {name}\nRole: {role}\nLocation: {location}\nDisposition: {disposition}\nKey Info: {info}\nPromises Made: {promises}",
  },

  location_discovery: {
    id: "location_discovery",
    label: "Location Discovery",
    category: "location",
    description: "Document a newly discovered place.",
    fields: ["name", "type", "features", "dangers", "npcs", "loot"],
    content:
      "Name: {name}\nType: {type}\nNotable Features: {features}\nDangers: {dangers}\nNPCs Here: {npcs}\nLoot Found: {loot}",
  },

  combat_summary: {
    id: "combat_summary",
    label: "Combat Summary",
    category: "combat",
    description: "Summarise a combat encounter after it ends.",
    fields: ["enemies", "difficulty", "moments", "loot", "injuries"],
    content:
      "Enemies: {enemies}\nDifficulty: {difficulty}\nKey Moments: {moments}\nLoot: {loot}\nInjuries: {injuries}",
  },

  quest_update: {
    id: "quest_update",
    label: "Quest Update",
    category: "quest",
    description: "Track progress on an active quest.",
    fields: ["quest", "objective", "progress", "steps", "reward"],
    content:
      "Quest: {quest}\nObjective: {objective}\nProgress: {progress}\nNext Steps: {steps}\nReward: {reward}",
  },

  lore_discovery: {
    id: "lore_discovery",
    label: "Lore Discovery",
    category: "lore",
    description: "Capture a piece of world lore or hidden knowledge.",
    fields: ["topic", "source", "details", "relevance"],
    content:
      "Topic: {topic}\nSource: {source}\nDetails: {details}\nRelevance: {relevance}",
  },

  session_recap: {
    id: "session_recap",
    label: "Session Recap",
    category: "general",
    description: "End-of-session summary of events and decisions.",
    fields: ["date", "events", "decisions", "questions", "next"],
    content:
      "Date: {date}\nKey Events: {events}\nDecisions Made: {decisions}\nQuestions: {questions}\nNext Session: {next}",
  },
};

// ---------------------------------------------------------------------------
// 3. AUTO_NOTE_TRIGGERS
// ---------------------------------------------------------------------------

/**
 * Each trigger defines:
 *   eventType   — the string key fired by the app event system
 *   templateId  — which NOTE_TEMPLATES entry to use as the base
 *   label       — human-readable name shown in the UI
 *   description — brief explanation of what fires this trigger
 *   extract     — map of template field → path into eventData object
 *                 Supports dot-notation for nested properties.
 */
export const AUTO_NOTE_TRIGGERS = {
  QuestRevealed: {
    eventType: "QuestRevealed",
    templateId: "quest_update",
    label: "Quest Revealed",
    description: "Fires when a new quest is introduced to the player.",
    extract: {
      quest: "quest.name",
      objective: "quest.objective",
      progress: "quest.status",
      steps: "quest.nextSteps",
      reward: "quest.reward",
    },
  },

  NPCDiscovered: {
    eventType: "NPCDiscovered",
    templateId: "npc_encounter",
    label: "NPC Discovered",
    description: "Fires when the player meets or reveals a new NPC.",
    extract: {
      name: "npc.name",
      role: "npc.role",
      location: "npc.location",
      disposition: "npc.disposition",
      info: "npc.description",
      promises: "npc.promises",
    },
  },

  LootDrop: {
    eventType: "LootDrop",
    templateId: "combat_summary",
    label: "Loot Dropped",
    description: "Fires when loot is awarded after a combat encounter.",
    extract: {
      enemies: "combat.enemies",
      difficulty: "combat.difficulty",
      moments: "combat.highlights",
      loot: "loot.items",
      injuries: "combat.injuries",
    },
  },

  QuestUpdated: {
    eventType: "QuestUpdated",
    templateId: "quest_update",
    label: "Quest Updated",
    description: "Fires when an existing quest changes state or progress.",
    extract: {
      quest: "quest.name",
      objective: "quest.objective",
      progress: "quest.status",
      steps: "quest.nextSteps",
      reward: "quest.reward",
    },
  },

  SceneRevealed: {
    eventType: "SceneRevealed",
    templateId: "location_discovery",
    label: "Scene Revealed",
    description: "Fires when a new scene or area is revealed to the player.",
    extract: {
      name: "scene.name",
      type: "scene.type",
      features: "scene.features",
      dangers: "scene.dangers",
      npcs: "scene.npcs",
      loot: "scene.loot",
    },
  },

  WorldStateChanged: {
    eventType: "WorldStateChanged",
    templateId: "lore_discovery",
    label: "World State Changed",
    description: "Fires when a significant world or narrative state shift occurs.",
    extract: {
      topic: "change.topic",
      source: "change.source",
      details: "change.details",
      relevance: "change.relevance",
    },
  },
};

// ---------------------------------------------------------------------------
// 4. NOTE_SEARCH_FIELDS
// ---------------------------------------------------------------------------

export const NOTE_SEARCH_FIELDS = {
  title: {
    key: "title",
    label: "Title",
    type: "text",
    description: "Search within the note title.",
  },
  content: {
    key: "content",
    label: "Content",
    type: "text",
    description: "Full-text search within the note body.",
  },
  category: {
    key: "category",
    label: "Category",
    type: "enum",
    options: Object.keys(NOTE_CATEGORIES),
    description: "Filter by note category (combat, lore, npc, quest, location, general).",
  },
  tags: {
    key: "tags",
    label: "Tags",
    type: "text",
    description: "Search by one or more comma-separated tags.",
  },
  dateRange: {
    key: "dateRange",
    label: "Date Range",
    type: "dateRange",
    description: "Filter notes created or updated within a date window.",
    subFields: {
      from: { key: "from", label: "From", type: "date" },
      to: { key: "to", label: "To", type: "date" },
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER — safely read a dot-notation path from an object
// ---------------------------------------------------------------------------

function _getByPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, obj);
}

// ---------------------------------------------------------------------------
// EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns a single note template by its id.
 * @param {string} templateId
 * @returns {object|null}
 */
export function getNoteTemplate(templateId) {
  return NOTE_TEMPLATES[templateId] ?? null;
}

/**
 * Returns a note template's content string with all {field} placeholders
 * replaced by values from the supplied data object.
 * Any placeholder without a matching key is left as-is.
 *
 * @param {string} templateId
 * @param {Record<string, string>} data  — { fieldName: value, … }
 * @returns {string|null}  Filled content string, or null if template not found.
 */
export function fillNoteTemplate(templateId, data = {}) {
  const template = getNoteTemplate(templateId);
  if (!template) return null;

  return template.content.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = data[key];
    return value !== undefined && value !== null ? String(value) : `{${key}}`;
  });
}

/**
 * Given an event type and its data payload, returns a pre-filled note object
 * ready to be saved, or null if no trigger is registered for the event.
 *
 * @param {string} eventType
 * @param {object} eventData
 * @returns {{ templateId: string, category: string, title: string, content: string, auto: true }|null}
 */
export function getAutoNoteForEvent(eventType, eventData = {}) {
  const trigger = AUTO_NOTE_TRIGGERS[eventType];
  if (!trigger) return null;

  const template = getNoteTemplate(trigger.templateId);
  if (!template) return null;

  // Build the data map by extracting paths from eventData
  const extracted = {};
  for (const [field, path] of Object.entries(trigger.extract)) {
    const value = _getByPath(eventData, path);
    extracted[field] = value !== undefined && value !== null ? String(value) : "";
  }

  const content = fillNoteTemplate(trigger.templateId, extracted);

  // Derive a sensible default title
  const titleField = extracted.name || extracted.quest || extracted.topic || trigger.label;

  return {
    templateId: trigger.templateId,
    category: template.category,
    title: `${trigger.label}: ${titleField}`.trim(),
    content,
    auto: true,
    eventType,
  };
}

/**
 * Returns all note categories as an array, sorted by label.
 * @returns {object[]}
 */
export function getNoteCategories() {
  return Object.values(NOTE_CATEGORIES).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

/**
 * Formats a note object into a plain-text string suitable for export
 * (copy-to-clipboard, markdown export, etc.).
 *
 * @param {{ title?: string, category?: string, tags?: string[], createdAt?: string|Date, updatedAt?: string|Date, content?: string }} note
 * @returns {string}
 */
export function formatNoteForExport(note) {
  if (!note) return "";

  const lines = [];

  if (note.title) {
    lines.push(`# ${note.title}`);
    lines.push("");
  }

  const meta = [];
  if (note.category) {
    const cat = NOTE_CATEGORIES[note.category];
    meta.push(`Category: ${cat ? cat.label : note.category}`);
  }
  if (Array.isArray(note.tags) && note.tags.length > 0) {
    meta.push(`Tags: ${note.tags.join(", ")}`);
  }
  if (note.createdAt) {
    const d = new Date(note.createdAt);
    meta.push(`Created: ${isNaN(d) ? note.createdAt : d.toLocaleDateString()}`);
  }
  if (note.updatedAt) {
    const d = new Date(note.updatedAt);
    meta.push(`Updated: ${isNaN(d) ? note.updatedAt : d.toLocaleDateString()}`);
  }

  if (meta.length > 0) {
    lines.push(...meta);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  if (note.content) {
    lines.push(note.content);
  }

  return lines.join("\n");
}

/**
 * Searches an array of note objects against a query string and optional filters.
 *
 * @param {object[]} notes  — Array of note objects.
 * @param {string}   query  — Free-text search string (searches title + content + tags).
 * @param {{
 *   category?: string,
 *   tags?: string[],
 *   dateRange?: { from?: string|Date, to?: string|Date }
 * }} filters
 * @returns {object[]}  Filtered and ranked list of matching notes.
 */
export function searchNotes(notes, query = "", filters = {}) {
  if (!Array.isArray(notes)) return [];

  const queryLower = query.trim().toLowerCase();

  return notes.filter((note) => {
    // --- Category filter ---
    if (filters.category && note.category !== filters.category) {
      return false;
    }

    // --- Tag filter ---
    if (Array.isArray(filters.tags) && filters.tags.length > 0) {
      const noteTags = Array.isArray(note.tags) ? note.tags.map((t) => t.toLowerCase()) : [];
      const hasAll = filters.tags.every((ft) => noteTags.includes(ft.toLowerCase()));
      if (!hasAll) return false;
    }

    // --- Date range filter ---
    if (filters.dateRange) {
      const noteDate = note.updatedAt
        ? new Date(note.updatedAt)
        : note.createdAt
        ? new Date(note.createdAt)
        : null;

      if (noteDate) {
        if (filters.dateRange.from) {
          const from = new Date(filters.dateRange.from);
          if (!isNaN(from) && noteDate < from) return false;
        }
        if (filters.dateRange.to) {
          const to = new Date(filters.dateRange.to);
          // Inclusive upper bound: treat end-of-day
          to.setHours(23, 59, 59, 999);
          if (!isNaN(to) && noteDate > to) return false;
        }
      }
    }

    // --- Full-text query ---
    if (queryLower) {
      const titleMatch = (note.title ?? "").toLowerCase().includes(queryLower);
      const contentMatch = (note.content ?? "").toLowerCase().includes(queryLower);
      const tagMatch = Array.isArray(note.tags)
        ? note.tags.some((t) => t.toLowerCase().includes(queryLower))
        : false;

      if (!titleMatch && !contentMatch && !tagMatch) return false;
    }

    return true;
  });
}
