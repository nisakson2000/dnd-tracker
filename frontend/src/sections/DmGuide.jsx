import { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronRight, Plus, Map, Users,
  Globe, Swords, Hammer, Sparkles,
  CheckCircle,
} from 'lucide-react';

const GUIDE_SECTIONS = [
  {
    title: 'Getting Started',
    icon: Plus,
    color: '#4ade80',
    steps: [
      'Your campaign starts in Building mode — only creation tools are visible.',
      'The Campaign Builder dashboard shows your progress and a readiness checklist.',
      'You need at least 1 NPC, 1 Quest, and 1 Lore entry before you can publish.',
      'Use the sidebar to navigate between building tools. Everything saves automatically.',
    ],
  },
  {
    title: 'Creating NPCs',
    icon: Users,
    color: '#4ade80',
    steps: [
      'Go to NPCs in the sidebar to create characters for your world.',
      'Set their role (ally, enemy, neutral), race, class, location, and description.',
      'Add secret DM notes that only you can see — great for hidden motivations.',
      'Use the random NPC generator or pick from templates (Tavern Keeper, Quest Giver, etc.).',
      'Set disposition and relationship type to track how NPCs feel about the party.',
      'Add quest hooks to NPCs so you remember which quests they offer.',
    ],
  },
  {
    title: 'Designing Quests & Plot',
    icon: Map,
    color: '#fbbf24',
    steps: [
      'Go to Quests & Plot to create your campaign\'s story threads.',
      'Choose a quest type: Main Story, Side Quest, Personal, or Bounty.',
      'Add objectives that players need to complete — these track progress during play.',
      'Set difficulty (trivial to deadly) and priority (low to critical) for pacing.',
      'Link quests to NPCs by setting a quest giver and location.',
      'Use quest templates (Bounty Hunt, Rescue Mission, Investigation, etc.) for quick setup.',
      'Add rewards: XP, gold, and item descriptions for when players complete them.',
    ],
  },
  {
    title: 'Writing Lore & Locations',
    icon: Globe,
    color: '#c084fc',
    steps: [
      'Go to Lore & Locations to build your world knowledge base.',
      'Categorize entries: Location, History, Religion, Organization, Faction, Creature, Magic, Item.',
      'Use templates for common entries (Tavern, Town, Dungeon, Faction, Legend, Magic Item).',
      'Mark discovery type (Confirmed, Rumor, Speculation) to track what players know.',
      'Link related entries together to create a connected world.',
      'Add source NPCs — who told the players about this piece of lore?',
    ],
  },
  {
    title: 'Building Encounters',
    icon: Swords,
    color: '#ef4444',
    steps: [
      'Go to Encounter Builder to design combat encounters.',
      'Search the SRD monster database to find creatures by name or CR.',
      'Add multiple monsters and adjust quantities to build your encounter.',
      'The difficulty calculator shows Easy/Medium/Hard/Deadly based on party size and level.',
      'Save encounters so they\'re ready to run when you publish your campaign.',
    ],
  },
  {
    title: 'Homebrew Content',
    icon: Hammer,
    color: '#f59e0b',
    steps: [
      'Go to Homebrew Builder to create custom content.',
      'Monsters — Build full stat blocks with abilities, resistances, and legendary actions. The balance checker validates CR.',
      'Spells — Create custom spells with school, level, casting time, and damage scaling.',
      'Items — Design magic items with rarity, attunement, properties, and pricing.',
      'All homebrew content is saved to your local library and persists across campaigns.',
    ],
  },
  {
    title: 'Using AI to Generate Content',
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
  {
    title: 'Publishing Your Campaign',
    icon: CheckCircle,
    color: '#22c55e',
    steps: [
      'Once you\'ve met the minimum requirements (1 NPC, 1 Quest, 1 Lore), the Publish button unlocks.',
      'Open Campaign Builder and click "Publish Campaign" at the top.',
      'Publishing unlocks all DM session tools: Party Overview, Session Notes, Encounter Runner, Battle Map, and Party Loot.',
      'You can still add NPCs, quests, lore, and encounters after publishing — building never stops!',
      'Your campaign will show as "Active" on the Dashboard instead of "Building".',
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
            Create a Campaign Tutorial
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
            Step-by-step guide to building your campaign in The Codex.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GUIDE_SECTIONS.map((section, i) => {
          const isOpen = openSection === i;
          const Icon = section.icon;
          return (
            <div key={i} style={{
              borderRadius: 12, overflow: 'hidden',
              background: isOpen ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
              border: `1px solid ${isOpen ? section.color + '30' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.2s',
            }}>
              <button
                onClick={() => setOpenSection(isOpen ? -1 : i)}
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
        })}
      </div>
    </div>
  );
}
