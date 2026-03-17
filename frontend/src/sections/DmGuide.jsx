import { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronRight, Sparkles, Play, Wifi,
  BookOpen, Shield, Wand2, BarChart3,
} from 'lucide-react';

const GUIDE_SECTIONS = [
  {
    title: 'Progressing Your Campaign',
    icon: BookOpen,
    color: '#fbbf24',
    steps: [
      'After each session, update quest objectives to track player progress — mark steps as completed.',
      'Change NPC dispositions based on how the party interacted with them (friendly, hostile, dead).',
      'Add new lore entries as players discover world secrets — mark discovery type as Confirmed, Rumor, or Speculation.',
      'Create new quests that branch from player decisions. Link them to existing NPCs and locations.',
      'Use the Session Recap to write a quick journal entry summarizing what happened — great for "last time on..." recaps.',
      'Level up the campaign by adjusting party level range. This affects encounter difficulty calculations.',
      'Track completed vs. active vs. failed quests to see campaign progress at a glance.',
      'Add new scenes for upcoming sessions. Scenes can be reused or marked as completed.',
      'Keep DM Notes on NPCs updated — jot down player theories, promises the party made, and unresolved threads.',
    ],
  },
  {
    title: 'Running a Session',
    icon: Play,
    color: '#4ade80',
    steps: [
      'From the Dashboard, click your published campaign to open the Campaign Lobby.',
      'The lobby shows your scenes, connected players, and a readiness checklist.',
      'Prepare scenes in the lobby — each scene represents a location or encounter in your session.',
      'Click "Start Session" to begin. A timer tracks session length automatically.',
      'During the session, select scenes from the top to set the current location.',
      'Use the Scene card to share player-visible descriptions and track DM-only notes.',
      'The DM Toolkit gives you access to generators during play: Dungeon, Encounter, Boss, Rumor, Improv, Puzzle, and Tavern.',
      'Session Recap automatically logs key events. Review and edit the recap after each session.',
    ],
  },
  {
    title: 'Connecting Players (Party Connect)',
    icon: Wifi,
    color: '#60a5fa',
    steps: [
      'Party Connect lets players join your session from the same network using WebSocket.',
      'Go to Settings > Party Connect to configure connection settings.',
      'When you start a session, a WebSocket server starts automatically. Share the address with players.',
      'Players open their character in The Codex and connect via Settings > Party Connect.',
      'You can auto-approve players or manually review each join request.',
      'Connected players see scene descriptions, initiative order, and their character\'s status in real time.',
      'Ruleset mismatch detection warns you if a player\'s character uses a different edition.',
    ],
  },
  {
    title: 'Running Combat & Encounters',
    icon: Shield,
    color: '#ef4444',
    steps: [
      'Click "Start" in the Encounter panel to begin combat. An encounter is created for the active scene.',
      'Add monsters by searching the SRD database — type a name and click to add. Adjust quantity as needed.',
      'Set initiative for each combatant. The tracker auto-sorts by initiative value, highest first.',
      'The left panel shows the initiative order. The current turn is highlighted in purple.',
      'Click "Next Turn" to advance. The tracker wraps around and increments the round counter automatically.',
      'Use the quick HP buttons (-5, +5) on each monster to track damage and healing during combat.',
      'Click the skull icon to instantly kill a monster (sets HP to 0, strikes through the name).',
      'Player HP, conditions, and death saves are visible in the right panel during combat.',
      'Track conditions (blinded, prone, stunned, etc.) on any combatant — 16 standard 5e conditions supported.',
      'When combat ends, click "End" to close the encounter. XP and loot are logged to session notes.',
      'Use the Encounter Generator from the DM Toolkit to create random encounters scaled to party level.',
      'The Boss Generator creates full boss stat blocks with legendary actions, resistances, and lair effects.',
    ],
  },
  {
    title: 'DM Toolkit & Generators',
    icon: Wand2,
    color: '#f59e0b',
    steps: [
      'The DM Toolkit panel is accessible during any live session.',
      'Dungeon Generator — Create random dungeon layouts with rooms, traps, and treasure.',
      'Encounter Generator — Roll up random encounters scaled to party level.',
      'Boss Generator — Build full boss stat blocks on the fly.',
      'Rumor Generator — Generate tavern gossip and quest hooks players can investigate.',
      'Improv Assistant — Get NPC personality traits, voices, and motivations when players go off-script.',
      'Puzzle Generator — Create logic puzzles, riddles, and environmental challenges.',
      'Tavern Generator — Generate tavern names, menus, patrons, and events.',
    ],
  },
  {
    title: 'World Simulation Tools',
    icon: BarChart3,
    color: '#8b5cf6',
    steps: [
      'World simulation tools run alongside your session for a living world experience.',
      'Factions — Track faction influence, relationships, and territory. Factions react to player actions.',
      'Weather — Generate weather conditions that affect travel and combat.',
      'Economy — Simulate regional economies with supply, demand, and price fluctuations.',
      'Travel Calculator — Plan journeys with distance, terrain, and random encounter chances.',
      'World Events — Trigger events like wars, plagues, or festivals that shape the narrative.',
      'Timeline — Track the chronological history of your campaign world.',
    ],
  },
  {
    title: 'Using AI Modules',
    icon: Sparkles,
    color: '#8b5cf6',
    steps: [
      'Go to AI Modules for AI-powered content generation (uses local Ollama — fully private).',
      'Scene Description — Generate atmospheric descriptions for locations and moments.',
      'NPC Dialogue — Create in-character dialogue and personality for your NPCs.',
      'Story Hooks — Generate adventure seeds that tie into your quests and factions.',
      'Lore Generator — Create world lore for locations, deities, artifacts, and history.',
      'All generated content can be saved directly into your campaign.',
    ],
  },
];

export default function DmGuide() {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle size={20} style={{ color: 'rgba(74,222,128,0.6)' }} />
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'calc(20px * var(--font-scale))',
            fontWeight: 700, color: 'white', margin: 0,
          }}>
            DM Mode Guide
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
            How to run sessions, combat, Party Connect, and manage your world.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GUIDE_SECTIONS.map((section, i) => (
          <GuideItem key={i} section={section} index={i} isOpen={openSection === i} onToggle={() => setOpenSection(openSection === i ? -1 : i)} />
        ))}
      </div>
    </div>
  );
}

function GuideItem({ section, index, isOpen, onToggle }) {
  const Icon = section.icon;
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      background: isOpen ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
      border: `1px solid ${isOpen ? section.color + '30' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all 0.2s',
    }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '14px 16px', border: 'none', background: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: `${section.color}12`, border: `1px solid ${section.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} style={{ color: section.color }} />
        </div>
        <span style={{
          flex: 1, fontFamily: 'var(--font-heading)', fontSize: 14,
          color: isOpen ? section.color : 'var(--text)', fontWeight: 600,
        }}>
          {section.title}
        </span>
        {isOpen
          ? <ChevronDown size={14} style={{ color: section.color, flexShrink: 0 }} />
          : <ChevronRight size={14} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
        }
      </button>

      {isOpen && (
        <div style={{ padding: '0 16px 16px 62px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section.steps.map((step, j) => (
              <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: `${section.color}12`, border: `1px solid ${section.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: section.color,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {j + 1}
                </div>
                <div style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
                  fontFamily: 'var(--font-ui)',
                }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
