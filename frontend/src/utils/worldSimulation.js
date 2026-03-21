/**
 * Off-Screen World Simulation Engine
 *
 * Generates "what happened while the party was away" events between sessions.
 * Uses faction goals, villain plans, active crises, NPC motivations, and
 * unresolved quests to create a living world that moves without the players.
 *
 * DM approves/rejects/modifies events before next session.
 */

// ── Event Templates ──

const FACTION_EVENT_TEMPLATES = [
  // Military actions
  { type: 'military', template: '{faction} sent scouts to {location}. Their military strength ({military}) suggests {outcome}.', minMilitary: 40 },
  { type: 'military', template: '{faction} launched a raid on {target_faction}\'s supply lines.', minMilitary: 60 },
  { type: 'military', template: '{faction} recruited new soldiers. Military strength increased.', minMilitary: 20 },
  { type: 'military', template: '{faction} fortified their position at {location}.', minMilitary: 30 },
  // Political actions
  { type: 'political', template: '{faction} sent envoys to negotiate with {target_faction}.', minInfluence: 40 },
  { type: 'political', template: '{faction} spread propaganda against {target_faction} in {location}.', minInfluence: 50 },
  { type: 'political', template: '{faction} bribed officials to gain favor in {location}.', minWealth: 60 },
  { type: 'political', template: '{faction} publicly accused {target_faction} of treachery.', minInfluence: 30 },
  // Economic actions
  { type: 'economic', template: '{faction} established a new trade route to {location}.', minWealth: 50 },
  { type: 'economic', template: '{faction} imposed tariffs on goods from {target_faction}\'s territory.', minWealth: 40 },
  { type: 'economic', template: '{faction} funded construction of a new {building} in {location}.', minWealth: 60 },
  // Expansion
  { type: 'expansion', template: '{faction} claimed unclaimed territory near {location}.', minMilitary: 50 },
  { type: 'expansion', template: '{faction} absorbed a smaller faction that was struggling to survive.', minInfluence: 70 },
];

const VILLAIN_EVENT_TEMPLATES = [
  { phase: 'early', template: '{villain} sent agents to gather intelligence on the party\'s allies.' },
  { phase: 'early', template: 'Strange disappearances have been reported near {location} — {villain}\'s agents are suspected.' },
  { phase: 'early', template: '{villain} acquired a powerful artifact from {location}.' },
  { phase: 'mid', template: '{villain} eliminated a key informant who could have revealed their plans.' },
  { phase: 'mid', template: '{villain}\'s forces were spotted near {location}, testing defenses.' },
  { phase: 'mid', template: '{villain} turned one of the party\'s contacts — {npc} is now working against them.' },
  { phase: 'mid', template: '{villain} completed a dark ritual at {location}. Strange phenomena have been reported.' },
  { phase: 'late', template: '{villain} launched an attack on {location}. The situation is critical.' },
  { phase: 'late', template: '{villain}\'s power has grown significantly. Allies are getting nervous.' },
  { phase: 'late', template: '{villain} issued an ultimatum to {faction}: join or be destroyed.' },
];

const CRISIS_ESCALATION_TEMPLATES = [
  { severity: 'low', template: 'The {crisis} worsened slightly. Locals are growing concerned.' },
  { severity: 'medium', template: 'The {crisis} has spread to neighboring areas. Refugees are fleeing.' },
  { severity: 'high', template: 'The {crisis} is now out of control. Multiple settlements are affected.' },
  { severity: 'critical', template: 'The {crisis} has reached a tipping point. Without intervention, {consequence}.' },
];

const QUEST_DEADLINE_TEMPLATES = [
  { urgency: 'warning', template: 'Time is running out on "{quest}". {npc} sent a desperate message.' },
  { urgency: 'critical', template: '"{quest}" deadline has passed. {consequence}' },
  { urgency: 'expired', template: 'The window to complete "{quest}" has closed. {fallout}' },
];

const NPC_AUTONOMOUS_TEMPLATES = [
  { motivation: 'ambition', template: '{npc} made a bold move — they {action} without waiting for the party.' },
  { motivation: 'survival', template: '{npc} fled {location} after receiving threats. Their whereabouts are unknown.' },
  { motivation: 'revenge', template: '{npc} began plotting revenge against {target} for past wrongs.' },
  { motivation: 'loyalty', template: '{npc} publicly declared support for {faction}, strengthening the alliance.' },
  { motivation: 'greed', template: '{npc} struck a secret deal with {faction} for personal gain.' },
  { motivation: 'fear', template: '{npc} went into hiding. They\'re afraid of what\'s coming.' },
];

// ── World Simulation Generator ──

/**
 * Generate between-session world events based on game state.
 *
 * @param {Object} worldState
 * @param {Array} worldState.factions — [{ name, military, wealth, influence, goals_json, alignment, status }]
 * @param {Array} worldState.villains — [{ name, current_phase, master_plan_json, power_level, is_active }]
 * @param {Array} worldState.crises — [{ name, severity, status, current_stage }]
 * @param {Array} worldState.quests — [{ title, status, deadline_session, current_session }]
 * @param {Array} worldState.npcs — [{ name, role, location, disposition, motivations }]
 * @param {Array} worldState.locations — location names for template filling
 * @returns {Array} Generated events for DM review — [{ type, description, source, severity, suggested_action }]
 */
export function generateWorldEvents(worldState = {}) {
  const events = [];
  const {
    factions = [],
    villains = [],
    crises = [],
    quests = [],
    npcs = [],
    locations = ['the capital', 'the borderlands', 'the trade district', 'the docks', 'the old quarter'],
  } = worldState;

  // ── Faction Events ──
  const activeFactions = factions.filter(f => f.status === 'active');
  for (const faction of activeFactions) {
    // Each faction has a chance to make a move
    if (Math.random() < 0.4) { // 40% chance per faction per session
      const eligible = FACTION_EVENT_TEMPLATES.filter(t => {
        if (t.minMilitary && (faction.military || 0) < t.minMilitary) return false;
        if (t.minWealth && (faction.wealth || 0) < t.minWealth) return false;
        if (t.minInfluence && (faction.influence || 0) < t.minInfluence) return false;
        return true;
      });

      if (eligible.length > 0) {
        const template = eligible[Math.floor(Math.random() * eligible.length)];
        const targetFaction = activeFactions.find(f => f.name !== faction.name);
        const location = locations[Math.floor(Math.random() * locations.length)];

        let desc = template.template
          .replace('{faction}', faction.name)
          .replace('{target_faction}', targetFaction?.name || 'a rival group')
          .replace('{location}', location)
          .replace('{military}', faction.military || '?')
          .replace('{outcome}', (faction.military || 0) > 60 ? 'they mean business' : 'this is a probe, not an invasion')
          .replace('{building}', ['watchtower', 'market hall', 'barracks', 'temple'][Math.floor(Math.random() * 4)]);

        events.push({
          type: 'faction',
          subtype: template.type,
          description: desc,
          source: faction.name,
          severity: (faction.military || 0) > 70 ? 'major' : 'minor',
          suggested_action: `Consider how this affects the party's relationship with ${faction.name}.`,
        });
      }
    }
  }

  // ── Villain Events ──
  for (const villain of villains.filter(v => v.is_active)) {
    if (Math.random() < 0.6) { // 60% chance — villains are always scheming
      const phase = (villain.current_phase || 1) <= 2 ? 'early' : (villain.current_phase || 1) <= 4 ? 'mid' : 'late';
      const eligible = VILLAIN_EVENT_TEMPLATES.filter(t => t.phase === phase);

      if (eligible.length > 0) {
        const template = eligible[Math.floor(Math.random() * eligible.length)];
        const npc = npcs.length > 0 ? npcs[Math.floor(Math.random() * npcs.length)] : { name: 'an unknown contact' };
        const location = locations[Math.floor(Math.random() * locations.length)];
        const faction = activeFactions.length > 0 ? activeFactions[Math.floor(Math.random() * activeFactions.length)] : { name: 'the local authorities' };

        let desc = template.template
          .replace('{villain}', villain.name)
          .replace('{location}', location)
          .replace('{npc}', npc.name || 'a contact')
          .replace('{faction}', faction.name);

        events.push({
          type: 'villain',
          subtype: phase,
          description: desc,
          source: villain.name,
          severity: phase === 'late' ? 'critical' : phase === 'mid' ? 'major' : 'minor',
          suggested_action: `The party should learn about this through rumors, NPC warnings, or direct evidence.`,
        });
      }
    }
  }

  // ── Crisis Escalation ──
  for (const crisis of crises.filter(c => c.status === 'active')) {
    if (Math.random() < 0.5) { // 50% chance — crises worsen without intervention
      const severity = (crisis.severity || 1) <= 3 ? 'low' : (crisis.severity || 1) <= 6 ? 'medium' : (crisis.severity || 1) <= 8 ? 'high' : 'critical';
      const eligible = CRISIS_ESCALATION_TEMPLATES.filter(t => t.severity === severity);

      if (eligible.length > 0) {
        const template = eligible[Math.floor(Math.random() * eligible.length)];
        let desc = template.template
          .replace('{crisis}', crisis.name)
          .replace('{consequence}', 'the region may become uninhabitable')
          .replace('{fallout}', 'lasting damage has been done');

        events.push({
          type: 'crisis',
          subtype: severity,
          description: desc,
          source: crisis.name,
          severity: severity === 'critical' ? 'critical' : severity === 'high' ? 'major' : 'minor',
          suggested_action: `If the party doesn't address this soon, escalate severity by 1.`,
        });
      }
    }
  }

  // ── Quest Deadlines ──
  for (const quest of quests.filter(q => q.status === 'active' && q.deadline_session)) {
    const sessionsLeft = quest.deadline_session - (quest.current_session || 0);
    if (sessionsLeft <= 2 && sessionsLeft > 0) {
      events.push({
        type: 'quest',
        subtype: 'deadline',
        description: `"${quest.title}" has ${sessionsLeft} session${sessionsLeft > 1 ? 's' : ''} remaining before the deadline.`,
        source: quest.title,
        severity: sessionsLeft <= 1 ? 'critical' : 'major',
        suggested_action: `Remind the party about this quest through an NPC or environmental clue.`,
      });
    } else if (sessionsLeft <= 0) {
      events.push({
        type: 'quest',
        subtype: 'expired',
        description: `The deadline for "${quest.title}" has passed. The situation has worsened without the party's intervention.`,
        source: quest.title,
        severity: 'critical',
        suggested_action: `Generate consequences: NPC disappointment, faction reputation loss, or the problem getting worse.`,
      });
    }
  }

  // ── NPC Autonomous Actions ──
  for (const npc of npcs.filter(n => n.motivations || n.disposition === 'Allied' || n.disposition === 'Hostile')) {
    if (Math.random() < 0.2) { // 20% chance — NPCs occasionally act on their own
      const motivation = npc.motivations?.[0] || 'survival';
      const eligible = NPC_AUTONOMOUS_TEMPLATES.filter(t => t.motivation === motivation);
      const template = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] :
        NPC_AUTONOMOUS_TEMPLATES[Math.floor(Math.random() * NPC_AUTONOMOUS_TEMPLATES.length)];

      const faction = activeFactions.length > 0 ? activeFactions[Math.floor(Math.random() * activeFactions.length)] : { name: 'unknown forces' };
      const target = npcs.find(n2 => n2.name !== npc.name) || { name: 'their enemies' };
      const location = npc.location || locations[Math.floor(Math.random() * locations.length)];

      let desc = template.template
        .replace('{npc}', npc.name)
        .replace('{location}', location)
        .replace('{faction}', faction.name)
        .replace('{target}', target.name)
        .replace('{action}', ['negotiated a truce', 'gathered allies', 'sought out an artifact', 'made a sacrifice'][Math.floor(Math.random() * 4)]);

      events.push({
        type: 'npc',
        subtype: motivation,
        description: desc,
        source: npc.name,
        severity: 'minor',
        suggested_action: `The party may hear about this through gossip or direct encounter.`,
      });
    }
  }

  // Limit to 3-5 events to avoid overwhelming the DM
  if (events.length > 5) {
    // Prioritize by severity
    const severityOrder = { critical: 0, major: 1, minor: 2 };
    events.sort((a, b) => (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2));
    return events.slice(0, 5);
  }

  // Ensure at least 1 event if there's any active content
  if (events.length === 0 && (activeFactions.length > 0 || villains.length > 0 || npcs.length > 0)) {
    events.push({
      type: 'world',
      subtype: 'quiet',
      description: 'The world is quiet between sessions. An uneasy calm settles over the land — but for how long?',
      source: 'World',
      severity: 'minor',
      suggested_action: 'Use this calm to build tension. Foreshadow coming events.',
    });
  }

  return events;
}

/**
 * Apply approved world events — update faction stats, crisis severity, NPC status.
 * Returns a list of state changes for the DM to review.
 */
export function resolveWorldEvent(event) {
  const changes = [];

  switch (event.type) {
    case 'faction':
      if (event.subtype === 'military') {
        changes.push({ target: event.source, field: 'military', delta: +5, reason: 'Military action taken' });
      } else if (event.subtype === 'economic') {
        changes.push({ target: event.source, field: 'wealth', delta: +3, reason: 'Economic development' });
      } else if (event.subtype === 'political') {
        changes.push({ target: event.source, field: 'influence', delta: +4, reason: 'Political maneuvering' });
      }
      break;

    case 'crisis':
      changes.push({ target: event.source, field: 'severity', delta: +1, reason: 'Crisis escalated without intervention' });
      break;

    case 'villain':
      if (event.subtype === 'mid' || event.subtype === 'late') {
        changes.push({ target: event.source, field: 'power_level', delta: +1, reason: 'Villain plan advanced' });
      }
      break;

    default:
      break;
  }

  return changes;
}
