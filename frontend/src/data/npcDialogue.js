/**
 * NPC Dialogue System — Templates, Callbacks, and Memory
 *
 * Covers roadmap items 211, 246-247, 271, 348 (NPC memory, NPC callbacks,
 * AI dialogue references, Recurring NPCs, AI NPC dialogue generator).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Dialogue Templates by NPC Role ──
export const DIALOGUE_TEMPLATES = {
  tavernKeeper: {
    role: 'Tavern Keeper',
    greetings: [
      'Welcome, welcome! What\'ll it be? We\'ve got ale, mead, and something the cook swears is stew.',
      'Another group of adventurers? You lot keep the place interesting. Sit down, I\'ll bring drinks.',
      'Back again? Your usual table is open. Same as last time?',
    ],
    rumors: [
      'Heard tell of strange lights in the {location} these past few nights. Might be nothing, might be trouble.',
      'That {npc} was in here last night, buying rounds for everyone. Either celebrating or spending someone else\'s gold.',
      'Word is the {faction} are moving troops toward {location}. Could mean war, could mean exercises. Who can tell?',
    ],
    farewells: [
      'Safe travels, friend. Come back in one piece — I hate losing good customers.',
      'May your road be smooth and your purse be full when you return.',
    ],
  },
  merchant: {
    role: 'Merchant',
    greetings: [
      'Ah, a discerning customer! Please, browse my wares. Everything is of the finest quality.',
      'Welcome! I just received a fresh shipment from {location}. Some truly remarkable items.',
      'You look like someone who appreciates value. Let me show you something special...',
    ],
    haggling: [
      'That price is already a steal! But for you... I might come down a little.',
      'You drive a hard bargain. My children will starve, but... deal.',
      'I can\'t go that low. My supplier would have my head. Final offer?',
      'Tell you what — buy two and I\'ll throw in a discount. Fair?',
    ],
    farewells: [
      'A pleasure doing business! Tell your friends about my shop.',
      'Come back anytime. I\'ll have new stock next tenday.',
    ],
  },
  guard: {
    role: 'Guard',
    greetings: [
      'Halt. State your business.',
      'Papers, please. What brings you to {location}?',
      'Keep your weapons sheathed and your hands where I can see them.',
    ],
    warnings: [
      'There\'s been trouble in the {location} district. Watch yourselves.',
      'We\'ve had reports of {threat} in the area. The captain says to be vigilant.',
      'Curfew\'s at sundown. Don\'t let me catch you on the streets after dark.',
    ],
    bribed: [
      'I didn\'t see anything. Understood? Now get moving.',
      '*glances around* ...I suppose the gate was left unlocked. Not my shift, not my problem.',
    ],
    farewells: [
      'Move along.',
      'Keep out of trouble.',
    ],
  },
  questGiver: {
    role: 'Quest Giver',
    hooks: [
      'I\'ve been looking for capable adventurers. I have a problem that gold alone can\'t solve.',
      'You look like the sort who doesn\'t back down from a challenge. Am I right?',
      'I don\'t trust just anyone with this, but... I\'ve heard good things about your group.',
      'Time is running out and I\'m desperate. Will you hear me out?',
    ],
    urgency: [
      'Every day we delay, it gets worse. People are counting on us.',
      'If this isn\'t handled before {deadline}, the consequences will be... severe.',
      'I\'ve already lost two groups to this. You\'re my last hope.',
    ],
    reward: [
      'I can offer {reward} gold pieces, plus whatever you find along the way.',
      'The reward is modest, but the gratitude of this town is priceless. Also {reward} gold.',
      'Complete this task and I\'ll owe you a favor. In this city, that\'s worth more than gold.',
    ],
    completion: [
      'You actually did it. I... I don\'t know what to say. You\'ve saved us all.',
      'Well done. The agreed payment, as promised. You\'ve earned every copper.',
      'I knew I was right to trust you. This calls for celebration!',
    ],
  },
  villain: {
    role: 'Villain',
    monologues: [
      'You think you can stop me? I\'ve been planning this for {timespan}. You\'re merely an inconvenience.',
      'How predictable. Heroes always come, always fight, and always fail to see the bigger picture.',
      'Join me. You have the potential to be so much more than pawns of the people who sent you.',
      'Every step you\'ve taken has been exactly as I planned. You think you found me? I INVITED you.',
    ],
    taunts: [
      'Is that the best you can do? My {minion} hits harder than that.',
      'Your friend screamed louder than you when they fell. Disappointing.',
      'How does it feel, knowing that every victory you\'ve had was because I ALLOWED it?',
    ],
    defeat: [
      'This... isn\'t over. You\'ve won the battle, but the war... *collapses*',
      'You fool. Killing me won\'t stop what\'s already in motion.',
      'Remember this moment. Because when I return... and I WILL return...',
    ],
  },
  sage: {
    role: 'Sage / Scholar',
    greetings: [
      'Ah, seekers of knowledge! Come in, come in. What mysteries bring you to my library?',
      'Fascinating. I\'ve been reading about your exploits. Please, sit. I have questions.',
      'Knowledge is not given freely — but I am willing to trade. What do you know?',
    ],
    lore: [
      'The ancient texts speak of {topic}. Most scholars dismiss it as myth, but I have evidence...',
      'What you describe matches the prophecy of {prophecy}. Have you considered that you might be...',
      'This symbol. I\'ve seen it before. It belongs to {faction}. They were thought extinct for centuries.',
    ],
    warnings: [
      'Be careful with this knowledge. Those who know too much about {topic} tend to disappear.',
      'The more I learn about {threat}, the more I believe we are running out of time.',
    ],
  },
};

// ── NPC Memory Templates ──
export const MEMORY_TEMPLATES = {
  positive: [
    'I remember you! You helped me with {event}. I won\'t forget that kindness.',
    'Ah, the heroes who {event}! Welcome back, friends.',
    'Last time you were here, you {event}. People still talk about that.',
  ],
  negative: [
    'You. I remember what you did. Don\'t expect a warm welcome here.',
    'After what happened with {event}... you\'ve got nerve showing your face here.',
    'Last time, you {event}. I lost {cost} because of you.',
  ],
  neutral: [
    'You again? Passing through or staying a while?',
    'I thought you\'d moved on. What brings you back?',
    'It\'s been {time} since I last saw you. Things have changed around here.',
  ],
};

// ── Callback Templates (NPC references past events) ──
export const CALLBACK_TEMPLATES = [
  'You know, I still think about that time you {past_event}. Changed my perspective on things.',
  'Speaking of which — you never did explain why you {past_event}.',
  'I told {npc_name} about how you {past_event}. They couldn\'t believe it.',
  'Remember when you {past_event}? Something similar happened just last tenday.',
  'After you {past_event}, I started {change}. Just thought you should know.',
  'I hear you {past_event}. Is that true? Because if so, I have something you should see.',
];

/**
 * Get dialogue templates for an NPC role.
 */
export function getDialogueForRole(role) {
  return DIALOGUE_TEMPLATES[role] || DIALOGUE_TEMPLATES.questGiver;
}

/**
 * Generate a greeting based on NPC role and relationship.
 */
export function generateGreeting(role, relationship = 'neutral') {
  const templates = DIALOGUE_TEMPLATES[role];
  if (!templates || !templates.greetings) return 'Hello, traveler.';
  return pick(templates.greetings);
}

/**
 * Generate a memory-based greeting.
 */
export function generateMemoryGreeting(relationship, pastEvent) {
  let templates;
  if (relationship > 0) templates = MEMORY_TEMPLATES.positive;
  else if (relationship < 0) templates = MEMORY_TEMPLATES.negative;
  else templates = MEMORY_TEMPLATES.neutral;

  return pick(templates).replace('{event}', pastEvent || 'what happened').replace('{time}', 'a while').replace('{cost}', 'much');
}

/**
 * Generate a callback reference.
 */
export function generateCallback(pastEvent, npcName) {
  return pick(CALLBACK_TEMPLATES)
    .replace('{past_event}', pastEvent || 'helped that stranger')
    .replace('{npc_name}', npcName || 'someone')
    .replace('{change}', 'seeing things differently');
}

/**
 * Get all NPC roles.
 */
export function getNPCRoles() {
  return Object.entries(DIALOGUE_TEMPLATES).map(([key, t]) => ({
    id: key, label: t.role,
  }));
}

/**
 * Fill in dialogue template placeholders.
 */
export function fillTemplate(template, context = {}) {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}
