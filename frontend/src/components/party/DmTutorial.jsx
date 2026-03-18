import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Crown, MapPin, Swords, Megaphone, ScrollText, Sparkles, ChevronRight, ChevronLeft, Play, Gift, Users, Scroll, Wifi, BookOpen, Globe, Target, HandHelping, Rocket, Gamepad2 } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';

const STORAGE_KEY = 'codex-dm-tutorial-dismissed-v3';

const STEPS = [
  {
    title: 'Welcome, Dungeon Master',
    icon: Crown,
    color: '#c9a84c',
    content: [
      'Welcome to The Codex! This guide will walk you through running your first live session — from connecting players to managing combat, quests, and story.',
      'The DM Toolbar gives you full control over everything during a session. You can reopen this tutorial anytime by clicking the ? button on the toolbar.',
      'Read through each step, or click the dots at the top to jump to a specific topic.',
    ],
  },
  {
    title: 'Connecting Players',
    icon: Wifi,
    color: '#4ade80',
    content: [
      '1. From the Dashboard, enter DM Mode and select or create a campaign.',
      '2. Go to Settings → Party Connect, and click "Host Party" to start your server. A room code will be generated.',
      '3. Share your IP address and room code with your players. They enter this on the "Join Session" screen.',
      '4. Players will appear in your party list once they connect. You can approve or deny join requests.',
      '5. Once everyone is connected, click "Start Live Session" from the Campaign Lobby. Player HP, AC, conditions, and spell slots sync automatically — no manual setup needed.',
      'Tip: Players on the same Wi-Fi network use your local IP (e.g. 192.168.x.x). Remote players need your public IP with port 7878 forwarded.',
    ],
  },
  {
    title: 'Running Quests & Plot',
    icon: Target,
    color: '#a78bfa',
    content: [
      'Quests are the backbone of your campaign. Go to Quests & Plot in the sidebar to create and manage them.',
      'Each quest has a title, giver NPC, description, objectives, difficulty, and rewards (XP, gold, items). Players can check off objectives as they complete them.',
      'During a live session, the Quest Runner (in the DM Toolbar) shows all active quests. Select one to see its current beat — the story step you\'re on.',
      'Use quest action buttons to: reveal linked NPCs to players, set the scene, start an encounter, or broadcast the quest description.',
      'Mark objectives complete as your party progresses. When all objectives are done, mark the quest as Completed to auto-award XP.',
      'Tip: Use the timeline sidebar to see all quest beats at a glance. Create sub-objectives for complex tasks and secret objectives that only reveal when you choose.',
    ],
  },
  {
    title: 'NPCs & Lore',
    icon: Users,
    color: '#f59e0b',
    content: [
      'NPCs: Go to the NPCs section to create characters your players will interact with. Set their name, race, class, location, role (ally/antagonist/neutral), and personality notes.',
      'During sessions, reveal NPCs to players using the Quest Runner or Campaign Panel. Players see the NPC\'s public info; you see your private DM notes.',
      'Social encounters: Use the DM Actions → Social tab to run NPC conversations. Set a Persuasion/Deception/Intimidation DC and the NPC\'s disposition auto-updates based on player rolls.',
      'Lore & Locations: Go to Lore & Locations in the sidebar to build your world. Create entries for places, factions, history, religions, and legends.',
      'Each lore entry has a category, body text (supports markdown), and can be linked to NPCs. Use these as reference during sessions to stay consistent.',
      'Tip: Premade campaigns come with NPCs and lore pre-loaded. For homebrew, use AI Modules to quickly generate taverns, dungeons, NPCs, and rumors.',
    ],
  },
  {
    title: 'Scenes & Locations',
    icon: MapPin,
    color: '#22c55e',
    content: [
      'Scenes are the building blocks of your live session. Each scene represents a location, event, or story beat.',
      'Premade campaigns auto-generate scenes from their location data. For homebrew, create scenes in the Campaign Lobby before starting your session.',
      'Each scene has: a name, player-visible description, DM-only notes, mood setting, and linked NPCs/quests/encounters.',
      'During a live session, navigate between scenes from the Campaign Panel. When you change scenes, the mood and description update for all connected players.',
      'Scene Moods (Combat, Exploration, Social, Mystery, Danger) change the atmosphere on player screens. Use them to set the tone before big reveals.',
      'Tip: Use Quick Actions that appear below each scene to instantly reveal NPCs, activate quests, or start encounters tied to that location.',
    ],
  },
  {
    title: 'Combat & Encounters',
    icon: Swords,
    color: '#ef4444',
    content: [
      'Start encounters from the Campaign Panel, Quest Runner, or Encounter Runner in the sidebar.',
      'Initiative is auto-rolled for all players (using their DEX modifiers) and monsters. You can manually adjust initiative order.',
      'Track monster HP with the damage/heal buttons. Monsters auto-die at 0 HP, and XP is logged for the party.',
      'The Player HP strip shows your entire party\'s health at a glance — click any player to adjust their HP directly.',
      'Use the combat mini-bar (always visible during combat) to advance turns, end the encounter, or add/remove combatants mid-fight.',
      'Apply conditions (Poisoned, Stunned, Prone, etc.) to monsters or players. Condition effects are tracked automatically with duration countdowns.',
      'Tip: Use the Encounter Builder in the sidebar (during campaign prep) to pre-build balanced encounters with CR calculations.',
    ],
  },
  {
    title: 'DM Actions & Loot',
    icon: Gift,
    color: '#f97316',
    content: [
      'The DM Actions panel (in the toolbar) has tabs: Quick, Skill Check, Conditions, Loot, Social, and Results.',
      'Skill Check: Request ability checks, saving throws, or skill checks with custom DCs. Results show pass/fail automatically with the player\'s modifiers applied.',
      'Loot: Give items to specific players — search the built-in SRD item database, or create custom weapons, armor, potions, and consumables with full stat blocks.',
      'Conditions: Apply or remove D&D conditions on connected players with one click.',
      'Social: Run NPC social encounters with disposition tracking based on roll outcomes.',
      'Tip: After combat, use the Loot tab to distribute treasure. Items appear directly in the player\'s inventory.',
    ],
  },
  {
    title: 'Communications & Broadcasts',
    icon: Megaphone,
    color: '#60a5fa',
    content: [
      'Broadcast: Send narrative text, scene descriptions, loot announcements, or quest updates to all players. These appear as dramatic pop-ups on player screens.',
      'Prompt: Request specific actions from players — skill checks, choices, or free-text responses. Target specific players or send to everyone.',
      'Quick Checks: One-click buttons for common skill checks (Perception, Stealth, Investigation, etc.) with proper DCs by difficulty tier.',
      'All player HP, AC, and conditions sync automatically — you never need to ask "what\'s your HP?" again.',
      'Tip: Use broadcasts to set the scene before players arrive at a new location. Read the boxed text aloud while players see it on screen.',
    ],
  },
  {
    title: 'Session Journal & Log',
    icon: ScrollText,
    color: '#818cf8',
    content: [
      'Every session event is automatically logged — scene changes, combat rounds, monster kills, NPC reveals, quest updates, loot drops, and more.',
      'The Action Log (in the toolbar) shows a timestamped, color-coded feed of everything that happened. Use it to recap or settle disputes.',
      'Session Notes (in the sidebar) let you write freeform notes during or after each session. Record important player decisions, improvised plot twists, or reminders for next time.',
      'The Campaign Journal preserves the narrative arc across sessions — what happened, who was involved, and what changed.',
      'Tip: After each session, spend 5 minutes writing a quick journal entry. Your future self will thank you when players ask "wait, what happened last time?"',
    ],
  },
  {
    title: 'Building a Homebrew Campaign',
    icon: BookOpen,
    color: '#22c55e',
    content: [
      '1. Dashboard → Create Campaign → name it, pick a ruleset, choose "Homebrew."',
      '2. Open the Campaign Hub and start building: add NPCs, write quests with objectives, create lore for your world.',
      '3. Use the Encounter Builder to design balanced combat encounters with CR calculations.',
      '4. Use AI Modules (sidebar) to generate content: dungeons, NPCs, rumors, scene descriptions, and dialogue.',
      '5. Set up scenes in the Campaign Lobby — each scene links to quests, NPCs, and encounters for quick access during play.',
      '6. Use the Homebrew Builder for custom magic items, monsters, and rules.',
      '7. When ready, host your party, start the live session, and your entire campaign is at your fingertips.',
      'Tip: Start small — one quest, three NPCs, two locations. You can always add more between sessions.',
    ],
  },
  {
    title: 'Premade Campaigns',
    icon: Globe,
    color: '#c9a84c',
    content: [
      'Don\'t want to build from scratch? The Codex includes 18 ready-to-play campaign templates covering levels 1-8.',
      'Go to Premade Campaigns in the sidebar to browse them. Each includes NPCs, quests with objectives, lore entries, items, and a journal introduction.',
      'Click "Load Campaign" to import everything into your character/campaign. NPCs, quests, lore, and items are auto-populated.',
      'Premade campaigns auto-generate scenes from their location data — just start the session and go.',
      'You can also browse Community Adventures from the 5etools homebrew library for hundreds of additional adventures.',
      'Tip: Premade campaigns are a starting point, not a cage. Edit NPCs, add quests, change lore — make it your own.',
    ],
  },
  {
    title: 'Tips & Tricks',
    icon: Sparkles,
    color: '#c084fc',
    content: [
      'Click the status bars (green session bar or red combat bar) to quickly jump to the relevant toolbar panel.',
      'The DM Toolbar stays visible across all app sections while you\'re hosting — switch between NPCs, quests, and combat freely.',
      'Use Short Rest / Long Rest buttons in the Campaign Panel — they sync to all players and auto-restore HP, hit dice, and spell slots.',
      'The Random Encounters section (sidebar → Tools) has offline rollable tables for loot, encounters, NPCs, and world-building — no AI needed.',
      'Use the Arcane Advisor (AI Assistant) during sessions for quick rules lookups, improvised NPC names, or encounter scaling advice.',
      'Export your campaign as a .json file to share with other DMs, or archive completed campaigns for future reference.',
      'Keyboard shortcut during sessions: press R to quick-roll a d20, Escape to dismiss popups.',
    ],
  },
];

export function shouldShowTutorial() {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function DmTutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const tutorial = useTutorial();
  const navigate = useNavigate();

  const handleDismissForever = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        maxWidth: 480, width: '92vw',
        background: 'linear-gradient(135deg, #1a1520, #12101a)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 16, padding: '28px 24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.08)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)', padding: 4, display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 24 : 8, height: 4, borderRadius: 2,
                background: i === step ? current.color : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: 12,
            background: `${current.color}12`, border: `1px solid ${current.color}30`,
            marginBottom: 12,
          }}>
            <Icon size={28} style={{ color: current.color }} />
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#e8d9b5',
            fontFamily: 'Cinzel, Georgia, serif',
          }}>
            {current.title}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {current.content.map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6,
                fontFamily: 'var(--font-ui)',
                padding: '0 4px',
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: step === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
              cursor: step === 0 ? 'default' : 'pointer',
            }}
          >
            <ChevronLeft size={12} /> Back
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {!isLast && (
              <button
                onClick={handleDismissForever}
                style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 11,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                }}
              >
                Don't show again
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setStep(s => s + 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: `${current.color}18`, border: `1px solid ${current.color}40`,
                  color: current.color, cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
                }}
              >
                Next <ChevronRight size={12} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    if (tutorial) tutorial.startTutorial();
                    handleDismissForever();
                    import('../../utils/loadTutorialCampaign').then(({ loadTutorialCampaign }) => {
                      loadTutorialCampaign().then(charId => navigate(`/dm/lobby/${charId}`));
                    });
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,197,94,0.1))',
                    border: '1px solid rgba(74,222,128,0.35)',
                    color: '#4ade80', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                    boxShadow: '0 0 12px rgba(74,222,128,0.1)',
                  }}
                >
                  <Gamepad2 size={14} /> Try Interactive Tutorial
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('codex-dm-guidance-mode', 'guided');
                    window.dispatchEvent(new CustomEvent('codex-guidance-mode-changed', { detail: 'guided' }));
                    handleDismissForever();
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
                    color: '#c9a84c', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                  }}
                >
                  <HandHelping size={14} /> Start Guided
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('codex-dm-guidance-mode', 'free');
                    window.dispatchEvent(new CustomEvent('codex-guidance-mode-changed', { detail: 'free' }));
                    handleDismissForever();
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.3)',
                    color: '#c084fc', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                  }}
                >
                  <Rocket size={14} /> I Know What I'm Doing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
