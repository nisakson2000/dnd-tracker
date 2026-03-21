/**
 * narrationBroadcast.js
 *
 * Data and utilities for DM narration box and player broadcast system.
 *
 * Roadmap Items Covered:
 *   - 162: DM narration box / broadcast
 *
 * Exports:
 *   NARRATION_STYLES         - Visual/tonal style presets for narration delivery
 *   READ_ALOUD_TEMPLATES     - Templated read-aloud text for common moments
 *   BROADCAST_TYPES          - Types of content that can be broadcast to players
 *   DRAMATIC_PAUSES          - Timing presets for pacing narration
 *   TONE_MARKERS             - Inline markup tokens for delivery nuance
 *
 *   formatNarration(text, style)
 *   getReadAloudTemplate(situation)
 *   parseToneMarkers(text)
 *   createBroadcastMessage(type, content, style)
 *   getStyleCSS(styleName)
 *   suggestNarrationStyle(situation)
 */

// ---------------------------------------------------------------------------
// NARRATION_STYLES
// ---------------------------------------------------------------------------

/**
 * Six visual and tonal style presets controlling how narration is presented
 * to players. Each style includes CSS class hints, text reveal behavior,
 * font guidance, and a mood color for UI theming.
 */
export const NARRATION_STYLES = {
  dramatic: {
    id: "dramatic",
    label: "Dramatic",
    description: "Bold, sweeping statements with a slow reveal for maximum impact.",
    cssClass: "narration--dramatic",
    textEffect: "slow-typewriter",
    textEffectDurationMs: 4000,
    fontSuggestion: "Cinzel, serif",
    fontWeight: "700",
    moodColor: "#c0392b",
    moodColorLabel: "Crimson",
    letterSpacing: "0.08em",
    lineHeight: 1.8,
    useCase: "Major reveals, boss encounters, turning-point moments.",
  },

  descriptive: {
    id: "descriptive",
    label: "Descriptive",
    description: "Rich environmental prose that immerses players in sensory detail.",
    cssClass: "narration--descriptive",
    textEffect: "fade-in",
    textEffectDurationMs: 1200,
    fontSuggestion: "Palatino Linotype, Georgia, serif",
    fontWeight: "400",
    moodColor: "#27ae60",
    moodColorLabel: "Forest Green",
    letterSpacing: "0.02em",
    lineHeight: 1.9,
    useCase: "Room descriptions, arriving at locations, scene-setting.",
  },

  mysterious: {
    id: "mysterious",
    label: "Mysterious",
    description: "Cryptic, atmospheric language that hints at hidden truths.",
    cssClass: "narration--mysterious",
    textEffect: "flicker-in",
    textEffectDurationMs: 2500,
    fontSuggestion: "IM Fell English, Garamond, serif",
    fontWeight: "400",
    fontStyle: "italic",
    moodColor: "#8e44ad",
    moodColorLabel: "Deep Violet",
    letterSpacing: "0.04em",
    lineHeight: 2.0,
    useCase: "Clue discovery, mysterious NPCs, arcane or supernatural events.",
  },

  urgent: {
    id: "urgent",
    label: "Urgent",
    description: "Alarm-triggering, action-oriented delivery — no time to waste.",
    cssClass: "narration--urgent",
    textEffect: "flash-in",
    textEffectDurationMs: 300,
    fontSuggestion: "Rajdhani, Impact, sans-serif",
    fontWeight: "700",
    moodColor: "#e67e22",
    moodColorLabel: "Alarm Orange",
    letterSpacing: "0.06em",
    lineHeight: 1.5,
    useCase: "Trap triggers, combat start, sudden ambush, ticking clocks.",
  },

  conversational: {
    id: "conversational",
    label: "Conversational",
    description: "Warm, personal delivery suited to NPC dialogue and direct speech.",
    cssClass: "narration--conversational",
    textEffect: "typewriter",
    textEffectDurationMs: 2000,
    fontSuggestion: "Lora, Bookman Old Style, serif",
    fontWeight: "400",
    moodColor: "#2980b9",
    moodColorLabel: "Tavern Blue",
    letterSpacing: "0.01em",
    lineHeight: 1.75,
    useCase: "NPC dialogue, quest-givers, shopkeepers, roleplay moments.",
  },

  ominous: {
    id: "ominous",
    label: "Ominous",
    description: "Dark, foreboding prose that fills the room with dread.",
    cssClass: "narration--ominous",
    textEffect: "creep-in",
    textEffectDurationMs: 3500,
    fontSuggestion: "Uncial Antiqua, MedievalSharp, serif",
    fontWeight: "600",
    moodColor: "#2c3e50",
    moodColorLabel: "Void Dark",
    letterSpacing: "0.05em",
    lineHeight: 2.0,
    useCase: "Horror moments, cursed locations, villain monologues, death.",
  },
};

// ---------------------------------------------------------------------------
// READ_ALOUD_TEMPLATES
// ---------------------------------------------------------------------------

/**
 * Tokens used inside templates. Replace at runtime with actual values.
 *
 * Common tokens:
 *   {room_name}      - Name of the room or area
 *   {npc_name}       - Name of the NPC
 *   {npc_description}- Brief physical description of the NPC
 *   {item_name}      - Name of the treasure or item
 *   {trap_name}      - Name or type of trap
 *   {weather}        - Weather condition (e.g., "a driving rain")
 *   {location_name}  - Name of the destination
 *   {clue_detail}    - Description of the clue
 *   {sound_detail}   - Description of the sound heard
 *   {sight_detail}   - Description of what is seen in the distance
 *   {monster_name}   - Name of the enemy or monster
 *   {direction}      - Compass direction or spatial reference
 */

/**
 * Ten ready-to-use read-aloud templates covering the most common scene moments.
 * Each entry provides 2–3 variant texts using {placeholder} tokens.
 */
export const READ_ALOUD_TEMPLATES = {
  entering_room: {
    id: "entering_room",
    label: "Entering a Room",
    suggestedStyle: "descriptive",
    variants: [
      "The door swings open to reveal {room_name}. Dust motes drift through pale shafts of light, and the air carries the faint smell of old stone and something else — something you can't quite name.",
      "You step into {room_name}. Your footsteps echo against the walls as your eyes adjust to the dim interior. The space feels both ancient and oddly still, as though it has been waiting for you.",
      "Beyond the threshold lies {room_name}. A chill settles across your shoulders as you cross over, and the door groans shut behind you — or perhaps that was just the wind.",
    ],
  },

  meeting_npc: {
    id: "meeting_npc",
    label: "Meeting an NPC",
    suggestedStyle: "conversational",
    variants: [
      "{npc_name} looks up as you approach. {npc_description} A moment of silent appraisal passes before they speak: \"I wasn't sure anyone would come.\"",
      "A figure steps from the shadows — {npc_name}. {npc_description} They study each of you in turn, weighing something privately, before offering a cautious nod.",
      "{npc_name} is already watching you when you arrive. {npc_description} \"You're later than I expected,\" they say, though their tone carries more relief than accusation.",
    ],
  },

  discovering_treasure: {
    id: "discovering_treasure",
    label: "Discovering Treasure",
    suggestedStyle: "dramatic",
    variants: [
      "Beneath the grime and years of neglect, {item_name} catches the light. Your breath hitches — this is no ordinary find. Whatever brought you here, it has led you to this.",
      "There, almost hidden among the debris, rests {item_name}. The moment your eyes land on it, the room seems to narrow to a single point. Even the air feels different here.",
      "You almost missed it. But there it is: {item_name}, waiting as though it had been placed there for exactly this moment. For exactly you.",
    ],
  },

  triggering_trap: {
    id: "triggering_trap",
    label: "Triggering a Trap",
    suggestedStyle: "urgent",
    variants: [
      "Click. The sound is small — almost polite — but your instincts scream. A heartbeat later, {trap_name} roars to life. There is no time to think, only to move.",
      "Something shifts underfoot. A grinding of stone, a hiss of pressurized air — and then {trap_name} springs with brutal efficiency. Roll for initiative.",
      "The trigger gives way before anyone can shout a warning. {trap_name} erupts from concealment, and the corridor fills with chaos. The dungeon has teeth.",
    ],
  },

  start_of_combat: {
    id: "start_of_combat",
    label: "Start of Combat",
    suggestedStyle: "urgent",
    variants: [
      "{monster_name} lunges from the dark without warning — no parley, no mercy, no hesitation. Steel rings, boots scrape stone, and the fight begins. Roll for initiative.",
      "The last thread of diplomacy snaps. {monster_name} bares teeth and draws back for the first blow. The air crackles with sudden violence. Everyone: roll initiative.",
      "There is a moment — just one — where everyone understands what is about to happen. Then {monster_name} moves, and that moment is over. Roll for initiative.",
    ],
  },

  weather_change: {
    id: "weather_change",
    label: "Weather Change",
    suggestedStyle: "descriptive",
    variants: [
      "The sky shifts without ceremony, and {weather} sweeps across the land. Visibility drops, footing becomes treacherous, and the world takes on a new and hostile character.",
      "{weather} rolls in from the {direction}, carrying with it the smell of distant earth and cold air. The change is sudden — as though the sky itself decided to act.",
      "You feel it before you see it: {weather}. The temperature shifts, shadows lengthen strangely, and the world contracts around you. Travel will not be the same from here.",
    ],
  },

  arrival_at_location: {
    id: "arrival_at_location",
    label: "Arrival at Location",
    suggestedStyle: "descriptive",
    variants: [
      "After everything — the road, the doubt, the miles — {location_name} rises before you at last. It is exactly what you were told, and somehow nothing like you imagined.",
      "{location_name}. You have come a long way to stand here. The place carries its own weight, its own gravity, and you feel it the moment your eyes fall upon it.",
      "The path opens, and there it is: {location_name}. The journey has cost you something. Whether this destination was worth that cost remains to be seen.",
    ],
  },

  finding_clue: {
    id: "finding_clue",
    label: "Finding a Clue",
    suggestedStyle: "mysterious",
    variants: [
      "Amid the ordinary, something extraordinary: {clue_detail}. You almost passed it by — but now that you've seen it, you can't unsee it. What does it mean?",
      "{clue_detail}. Whoever left this did not intend it to be found. Or perhaps they did. Either way, it changes the picture in ways you haven't fully understood yet.",
      "Your eye catches {clue_detail}. A small thing, perhaps — but small things have a way of becoming large ones. This particular detail will not leave you alone.",
    ],
  },

  hearing_sound: {
    id: "hearing_sound",
    label: "Hearing a Sound",
    suggestedStyle: "mysterious",
    variants: [
      "Silence — and then {sound_detail}. Brief, directional, unmistakable. The sound does not repeat. But you all heard it, and none of you are inclined to dismiss it.",
      "{sound_detail} cuts through the ambient noise and lodges in your awareness. It came from {direction}. It may mean nothing. It may mean everything.",
      "You pause. Was that {sound_detail}? The others look to each other. Nobody moves. Then it comes again, a little louder, and a little closer.",
    ],
  },

  seeing_something_in_distance: {
    id: "seeing_something_in_distance",
    label: "Seeing Something in the Distance",
    suggestedStyle: "dramatic",
    variants: [
      "On the horizon — {sight_detail}. Too far for detail, close enough to know it matters. You have the uncomfortable sense that it has already noticed you.",
      "{sight_detail} catches the light at the edge of your vision. For a moment no one speaks. Then someone asks the question everyone is thinking: what is that?",
      "There, across the {direction}: {sight_detail}. Distance softens it, but distance is not the same as safety. Whatever it is, it is part of your story now.",
    ],
  },
};

// ---------------------------------------------------------------------------
// BROADCAST_TYPES
// ---------------------------------------------------------------------------

/**
 * Defines the types of content a DM can broadcast to connected players,
 * including how each type is rendered on the player-side display.
 */
export const BROADCAST_TYPES = {
  text: {
    id: "text",
    label: "Narration Text",
    icon: "scroll",
    description: "Sends a styled text narration to all connected players.",
    playerDisplayBehavior: {
      component: "NarrationBox",
      fullscreen: false,
      dismissable: true,
      autoScroll: true,
      animateIn: true,
      overlayDim: 0.0,
    },
    requiresContent: ["text"],
    supportsStyle: true,
  },

  image_reveal: {
    id: "image_reveal",
    label: "Image Reveal",
    icon: "image",
    description: "Displays a full-screen image reveal to players — useful for maps, handout art, or monster reveals.",
    playerDisplayBehavior: {
      component: "ImageReveal",
      fullscreen: true,
      dismissable: true,
      animateIn: true,
      animationType: "fade-in",
      overlayDim: 0.85,
      showCaption: true,
    },
    requiresContent: ["imageUrl"],
    supportsStyle: false,
  },

  sound_cue: {
    id: "sound_cue",
    label: "Sound Cue",
    icon: "volume-2",
    description: "Triggers a sound effect or ambient audio change on player devices.",
    playerDisplayBehavior: {
      component: "SoundCue",
      fullscreen: false,
      dismissable: false,
      showVisualIndicator: true,
      indicatorDurationMs: 2000,
      overlayDim: 0.0,
    },
    requiresContent: ["soundId"],
    supportsStyle: false,
  },

  map_update: {
    id: "map_update",
    label: "Map Update",
    icon: "map",
    description: "Pushes an updated map state or reveals a new map region to players.",
    playerDisplayBehavior: {
      component: "MapViewer",
      fullscreen: false,
      dismissable: true,
      panToReveal: true,
      highlightNewRegion: true,
      overlayDim: 0.0,
    },
    requiresContent: ["mapId", "revealedRegions"],
    supportsStyle: false,
  },

  handout: {
    id: "handout",
    label: "Handout",
    icon: "file-text",
    description: "Delivers a document, letter, or in-world text as a readable handout.",
    playerDisplayBehavior: {
      component: "HandoutViewer",
      fullscreen: false,
      dismissable: true,
      parchmentStyle: true,
      animateIn: true,
      overlayDim: 0.4,
    },
    requiresContent: ["handoutText"],
    supportsStyle: true,
  },

  npc_portrait: {
    id: "npc_portrait",
    label: "NPC Portrait",
    icon: "user",
    description: "Shows an NPC portrait alongside a brief description or quote.",
    playerDisplayBehavior: {
      component: "NpcPortrait",
      fullscreen: false,
      dismissable: true,
      showNameplate: true,
      animateIn: true,
      overlayDim: 0.3,
    },
    requiresContent: ["npcId"],
    supportsStyle: true,
  },

  ambient_change: {
    id: "ambient_change",
    label: "Ambient Change",
    icon: "wind",
    description: "Shifts the ambient audio environment on player devices (e.g., tavern to dungeon).",
    playerDisplayBehavior: {
      component: "AmbientOverlay",
      fullscreen: false,
      dismissable: false,
      crossfadeDurationMs: 3000,
      showVisualIndicator: true,
      overlayDim: 0.0,
    },
    requiresContent: ["ambientId"],
    supportsStyle: false,
  },
};

// ---------------------------------------------------------------------------
// DRAMATIC_PAUSES
// ---------------------------------------------------------------------------

/**
 * Named timing presets for pacing narration delivery.
 * Use these values to insert deliberate silences that heighten tension.
 */
export const DRAMATIC_PAUSES = {
  short: {
    id: "short",
    label: "Short Pause",
    durationMs: 1000,
    durationDisplay: "1 second",
    marker: "[pause:short]",
    whenToUse: [
      "Between two related sentences where a brief breath improves rhythm.",
      "After a character's name is mentioned for the first time.",
      "Before answering a player question with an NPC reply.",
    ],
  },

  medium: {
    id: "medium",
    label: "Medium Pause",
    durationMs: 3000,
    durationDisplay: "3 seconds",
    marker: "[pause:medium]",
    whenToUse: [
      "After delivering a major piece of information or plot point.",
      "When transitioning between two different tones (e.g., calm to tense).",
      "After a character takes significant damage or something important is lost.",
    ],
  },

  long: {
    id: "long",
    label: "Long Pause",
    durationMs: 5000,
    durationDisplay: "5 seconds",
    marker: "[pause:long]",
    whenToUse: [
      "After a shocking revelation players need time to absorb.",
      "Before describing the aftermath of a decisive combat moment.",
      "When an NPC falls silent deliberately — to communicate weight.",
    ],
  },

  dramatic: {
    id: "dramatic",
    label: "Dramatic Pause",
    durationMs: 8000,
    durationDisplay: "8 seconds",
    marker: "[pause:dramatic]",
    whenToUse: [
      "The single most impactful moment in the session — use sparingly.",
      "After a campaign-defining reveal (a death, a betrayal, an arrival).",
      "When you want the table to sit in silence and let the moment breathe.",
    ],
  },
};

// ---------------------------------------------------------------------------
// TONE_MARKERS
// ---------------------------------------------------------------------------

/**
 * Inline markup tokens that DMs embed in narration text to guide delivery.
 * The parser (parseToneMarkers) processes these into structured instructions.
 *
 * Syntax examples:
 *   [whisper]She was never here.[/whisper]
 *   [shout]Run![/shout]
 *   [pause]
 *   [slow]The. Door. Opens.[/slow]
 *   [emphasis]This is the one.[/emphasis]
 *   [sfx:thunder]
 */
export const TONE_MARKERS = {
  whisper: {
    id: "whisper",
    token: "whisper",
    syntax: "[whisper]text[/whisper]",
    selfClosing: false,
    description: "Render the enclosed text as a whisper — small, intimate, hushed.",
    parserRule: {
      cssClass: "tone--whisper",
      fontSize: "0.85em",
      opacity: 0.75,
      fontStyle: "italic",
      letterSpacing: "0.01em",
      ttsInstruction: "speak at low volume and slow rate",
    },
  },

  shout: {
    id: "shout",
    token: "shout",
    syntax: "[shout]text[/shout]",
    selfClosing: false,
    description: "Render the enclosed text as a shout — large, bold, arresting.",
    parserRule: {
      cssClass: "tone--shout",
      fontSize: "1.3em",
      fontWeight: "900",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      ttsInstruction: "speak at high volume and fast rate",
    },
  },

  pause: {
    id: "pause",
    token: "pause",
    syntax: "[pause] or [pause:short|medium|long|dramatic]",
    selfClosing: true,
    description: "Insert a deliberate pause. Defaults to medium if no duration specified.",
    parserRule: {
      defaultDuration: "medium",
      validDurations: ["short", "medium", "long", "dramatic"],
      renderAs: "pause-indicator",
      cssClass: "tone--pause",
      ttsInstruction: "insert silence of specified duration",
    },
  },

  slow: {
    id: "slow",
    token: "slow",
    syntax: "[slow]text[/slow]",
    selfClosing: false,
    description: "Deliver the enclosed text at a noticeably reduced pace.",
    parserRule: {
      cssClass: "tone--slow",
      letterSpacing: "0.12em",
      wordSpacing: "0.3em",
      fontStyle: "normal",
      ttsInstruction: "speak at 60% of normal rate with extended inter-word gaps",
    },
  },

  emphasis: {
    id: "emphasis",
    token: "emphasis",
    syntax: "[emphasis]text[/emphasis]",
    selfClosing: false,
    description: "Highlight a word or phrase as critically important.",
    parserRule: {
      cssClass: "tone--emphasis",
      fontWeight: "700",
      fontStyle: "italic",
      color: "var(--narration-emphasis-color, #e0b060)",
      ttsInstruction: "stress each word with rising pitch",
    },
  },

  sfx: {
    id: "sfx",
    token: "sfx",
    syntax: "[sfx:sound_name]",
    selfClosing: true,
    description: "Trigger a sound effect inline during narration playback.",
    parserRule: {
      cssClass: "tone--sfx",
      renderAs: "sfx-indicator",
      extractParam: true,
      paramKey: "soundName",
      ttsInstruction: "play sound effect matching sound_name, continue narration after",
      knownSounds: [
        "thunder", "door_creak", "sword_ring", "crowd_gasp", "wolf_howl",
        "bell_toll", "fire_crackle", "water_drip", "wind_howl", "chains",
        "horn_blast", "arrow_whoosh", "explosion", "scream", "laughter",
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Wraps narration text in the metadata and CSS hints for a given style.
 *
 * @param {string} text - Raw narration text.
 * @param {string} styleName - Key from NARRATION_STYLES.
 * @returns {{ text: string, style: object, cssClass: string, effect: string } | null}
 */
export function formatNarration(text, styleName) {
  if (!text || typeof text !== "string") return null;

  const style = NARRATION_STYLES[styleName];
  if (!style) {
    console.warn(`formatNarration: unknown style "${styleName}". Falling back to "descriptive".`);
    return formatNarration(text, "descriptive");
  }

  return {
    text: text.trim(),
    style,
    cssClass: style.cssClass,
    effect: style.textEffect,
    effectDurationMs: style.textEffectDurationMs,
    moodColor: style.moodColor,
    font: style.fontSuggestion,
  };
}

/**
 * Returns a read-aloud template entry for the given situation key.
 * Optionally returns a specific variant (0-indexed); defaults to variant 0.
 *
 * @param {string} situation - Key from READ_ALOUD_TEMPLATES.
 * @param {number} [variantIndex=0] - Which variant to return (0, 1, or 2).
 * @returns {{ template: string, style: object, tokens: string[] } | null}
 */
export function getReadAloudTemplate(situation, variantIndex = 0) {
  const entry = READ_ALOUD_TEMPLATES[situation];
  if (!entry) {
    console.warn(`getReadAloudTemplate: no template for situation "${situation}".`);
    return null;
  }

  const variant = entry.variants[variantIndex] ?? entry.variants[0];
  const style = NARRATION_STYLES[entry.suggestedStyle] ?? NARRATION_STYLES.descriptive;

  // Extract all {placeholder} tokens from the variant
  const tokenRegex = /\{([^}]+)\}/g;
  const tokens = [];
  let match;
  while ((match = tokenRegex.exec(variant)) !== null) {
    if (!tokens.includes(match[1])) tokens.push(match[1]);
  }

  return {
    situation: entry.id,
    label: entry.label,
    template: variant,
    tokens,
    suggestedStyle: entry.suggestedStyle,
    style,
  };
}

/**
 * Parses inline tone markers in a narration string into a structured segment list.
 * Returns an array of segments, each with type and relevant metadata.
 *
 * Segment types: "text", "whisper", "shout", "slow", "emphasis", "pause", "sfx"
 *
 * @param {string} text - Narration text containing [marker] tokens.
 * @returns {Array<{ type: string, content?: string, cssClass?: string, soundName?: string, durationMs?: number }>}
 */
export function parseToneMarkers(text) {
  if (!text || typeof text !== "string") return [];

  const segments = [];

  // Regex covers both paired tags and self-closing tags with optional params
  // Paired:       [whisper]...[/whisper]
  // Self-closing: [pause], [pause:long], [sfx:thunder]
  const tokenPattern = /\[(\/?)(whisper|shout|slow|emphasis|pause(?::[a-z]+)?|sfx(?::[a-z_]+)?)\]|([^\[]+)/gi;

  let stack = []; // tracks open paired tags
  let buffer = "";

  const flushBuffer = () => {
    if (buffer.trim()) {
      const openTag = stack[stack.length - 1] ?? null;
      if (openTag) {
        const marker = TONE_MARKERS[openTag.token];
        segments.push({
          type: openTag.token,
          content: buffer,
          cssClass: marker?.parserRule?.cssClass ?? "",
          ttsInstruction: marker?.parserRule?.ttsInstruction ?? "",
        });
      } else {
        segments.push({ type: "text", content: buffer });
      }
      buffer = "";
    }
  };

  let match;
  while ((match = tokenPattern.exec(text)) !== null) {
    const [fullMatch, closing, tagRaw, plainText] = match;

    if (plainText !== undefined) {
      // Plain text segment
      buffer += plainText;
      continue;
    }

    // Parse tag and optional param (e.g., "pause:long" or "sfx:thunder")
    const [tagName, tagParam] = tagRaw.split(":");

    if (tagName === "pause") {
      flushBuffer();
      const duration = tagParam && DRAMATIC_PAUSES[tagParam]
        ? DRAMATIC_PAUSES[tagParam].durationMs
        : DRAMATIC_PAUSES.medium.durationMs;
      segments.push({
        type: "pause",
        cssClass: TONE_MARKERS.pause.parserRule.cssClass,
        durationMs: duration,
        label: tagParam ?? "medium",
      });
      continue;
    }

    if (tagName === "sfx") {
      flushBuffer();
      const soundName = tagParam ?? "unknown";
      segments.push({
        type: "sfx",
        cssClass: TONE_MARKERS.sfx.parserRule.cssClass,
        soundName,
        known: TONE_MARKERS.sfx.parserRule.knownSounds.includes(soundName),
      });
      continue;
    }

    // Paired open/close tags
    if (closing) {
      // Closing tag — flush current buffer with open tag context
      flushBuffer();
      if (stack.length > 0 && stack[stack.length - 1].token === tagName) {
        stack.pop();
      }
    } else {
      // Opening tag
      flushBuffer();
      stack.push({ token: tagName });
    }
  }

  // Flush any remaining buffer
  flushBuffer();

  return segments;
}

/**
 * Constructs a broadcast message object ready for dispatch to connected players.
 *
 * @param {string} type - Key from BROADCAST_TYPES.
 * @param {object} content - Content payload (keys depend on type.requiresContent).
 * @param {string} [styleName] - Optional narration style key (only relevant when type.supportsStyle is true).
 * @returns {{ id: string, type: object, content: object, style: object|null, timestamp: number } | null}
 */
export function createBroadcastMessage(type, content, styleName = null) {
  const broadcastType = BROADCAST_TYPES[type];
  if (!broadcastType) {
    console.warn(`createBroadcastMessage: unknown broadcast type "${type}".`);
    return null;
  }

  if (!content || typeof content !== "object") {
    console.warn(`createBroadcastMessage: content must be a non-null object.`);
    return null;
  }

  // Validate required content keys
  const missing = broadcastType.requiresContent.filter((key) => !(key in content));
  if (missing.length > 0) {
    console.warn(`createBroadcastMessage: missing required content keys for type "${type}": ${missing.join(", ")}`);
  }

  let style = null;
  if (broadcastType.supportsStyle && styleName) {
    style = NARRATION_STYLES[styleName] ?? null;
    if (!style) {
      console.warn(`createBroadcastMessage: unknown style "${styleName}", omitting style.`);
    }
  }

  return {
    id: `broadcast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: broadcastType,
    content,
    style,
    playerDisplayBehavior: broadcastType.playerDisplayBehavior,
    timestamp: Date.now(),
  };
}

/**
 * Returns the CSS property map for a given narration style name.
 * Useful for applying styles programmatically to DOM elements or inline styles.
 *
 * @param {string} styleName - Key from NARRATION_STYLES.
 * @returns {object | null} CSS property object, or null if style not found.
 */
export function getStyleCSS(styleName) {
  const style = NARRATION_STYLES[styleName];
  if (!style) {
    console.warn(`getStyleCSS: unknown style "${styleName}".`);
    return null;
  }

  const css = {
    fontFamily: style.fontSuggestion,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    lineHeight: style.lineHeight,
    color: style.moodColor,
  };

  if (style.fontStyle) css.fontStyle = style.fontStyle;

  return css;
}

/**
 * Suggests a narration style and optional read-aloud template based on a
 * plain-language description of the situation.
 *
 * The matching is keyword-based — good for a quick recommendation without AI.
 *
 * @param {string} situation - Free-text description of the current moment (e.g., "players enter a dark tomb").
 * @returns {{ suggestedStyle: string, suggestedTemplate: string|null, rationale: string }}
 */
export function suggestNarrationStyle(situation) {
  if (!situation || typeof situation !== "string") {
    return { suggestedStyle: "descriptive", suggestedTemplate: null, rationale: "Default fallback." };
  }

  const lower = situation.toLowerCase();

  const rules = [
    {
      keywords: ["trap", "ambush", "sudden", "attack", "explode", "alarm", "urgent", "initiative"],
      style: "urgent",
      template: "triggering_trap",
      rationale: "Urgent moments demand fast, high-impact delivery.",
    },
    {
      keywords: ["combat", "fight", "battle", "war", "initiative", "monster", "enemy", "charge"],
      style: "urgent",
      template: "start_of_combat",
      rationale: "Combat openings benefit from high-energy, no-hesitation narration.",
    },
    {
      keywords: ["death", "curse", "undead", "horror", "dark", "evil", "dread", "villain", "doom"],
      style: "ominous",
      template: null,
      rationale: "Ominous styling builds dread for dark or villainous moments.",
    },
    {
      keywords: ["mystery", "clue", "secret", "hidden", "strange", "arcane", "magic", "puzzle", "cipher"],
      style: "mysterious",
      template: "finding_clue",
      rationale: "Mystery and intrigue call for atmospheric, cryptic delivery.",
    },
    {
      keywords: ["npc", "character", "person", "merchant", "innkeeper", "dialogue", "speaks", "says", "voice"],
      style: "conversational",
      template: "meeting_npc",
      rationale: "Conversational style humanizes NPC interactions.",
    },
    {
      keywords: ["reveal", "discover", "treasure", "artifact", "item", "relic", "find", "found"],
      style: "dramatic",
      template: "discovering_treasure",
      rationale: "Dramatic style maximizes the impact of a major discovery.",
    },
    {
      keywords: ["enter", "room", "door", "chamber", "hall", "corridor", "space", "inside"],
      style: "descriptive",
      template: "entering_room",
      rationale: "Descriptive style grounds players in their physical environment.",
    },
    {
      keywords: ["arrive", "arrival", "reach", "destination", "location", "city", "town", "landmark"],
      style: "descriptive",
      template: "arrival_at_location",
      rationale: "Arrival moments deserve rich, grounding description.",
    },
    {
      keywords: ["weather", "rain", "storm", "wind", "fog", "snow", "sun", "cloud"],
      style: "descriptive",
      template: "weather_change",
      rationale: "Environmental changes set the scene with sensory detail.",
    },
    {
      keywords: ["sound", "hear", "noise", "creak", "footstep", "voice", "distant"],
      style: "mysterious",
      template: "hearing_sound",
      rationale: "Unexplained sounds build tension and invite investigation.",
    },
    {
      keywords: ["see", "horizon", "distance", "far", "silhouette", "shape", "approaching"],
      style: "dramatic",
      template: "seeing_something_in_distance",
      rationale: "Distant sightings build anticipation with a dramatic reveal.",
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return {
        suggestedStyle: rule.style,
        suggestedTemplate: rule.template,
        rationale: rule.rationale,
        style: NARRATION_STYLES[rule.style],
      };
    }
  }

  // Default fallback
  return {
    suggestedStyle: "descriptive",
    suggestedTemplate: null,
    rationale: "No specific keywords matched — descriptive is a safe default for most scene moments.",
    style: NARRATION_STYLES.descriptive,
  };
}
