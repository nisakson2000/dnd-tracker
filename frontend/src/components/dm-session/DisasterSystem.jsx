import { useState, useMemo } from 'react';
import {
  AlertTriangle, Zap, Plus, Trash2, ChevronUp, ChevronDown,
  SkullIcon, Flame, Droplets, Mountain, CloudRain, Sparkles,
  Bug, Swords, Landmark, Coins, RotateCcw, Check,
  Dices, ArrowRight, Loader2, Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Disaster Templates ── */

const DISASTER_TEMPLATES = [
  {
    type: 'plague',
    name: 'The Wasting Plague',
    Icon: Bug,
    color: '#4ade80',
    descriptions: [
      'A virulent disease spreads through the populace, resisting all mundane cures.',
      'Mysterious boils and fevers sweep through the slums, killing the weak.',
      'An arcane pestilence turns the afflicted into mindless husks before death.',
    ],
    stages: [
      { name: 'Outbreak', desc: 'Isolated cases appear in the lower districts. Healers are puzzled.', social: 'Rumors spread', economic: 'Minor trade disruption', military: 'No impact' },
      { name: 'Spreading', desc: 'The disease reaches multiple districts. Quarantines are attempted.', social: 'Fear grips the populace', economic: 'Markets closing', military: 'Guards stretched thin' },
      { name: 'Epidemic', desc: 'Mass casualties. Temples overwhelmed. Bodies pile in the streets.', social: 'Panic and riots', economic: 'Economy collapses', military: 'Desertions begin' },
      { name: 'Collapse', desc: 'Society breaks down. Survivors flee or barricade themselves.', social: 'Lawlessness', economic: 'Total collapse', military: 'Military disbanded' },
    ],
    resolutions: [
      'Find and destroy the source of the plague (cursed artifact, corrupted well)',
      'Secure a rare alchemical ingredient for a mass cure',
      'Convince a reclusive druid or cleric to perform a grand healing ritual',
    ],
    escalationDays: 7,
  },
  {
    type: 'famine',
    name: 'The Great Hunger',
    Icon: Droplets,
    color: '#f59e0b',
    descriptions: [
      'Crops wither and livestock die as an unnatural blight descends upon the land.',
      'Trade routes are severed and granaries run dry. The people grow desperate.',
      'A curse upon the farmlands leaves nothing but ash where wheat once grew.',
    ],
    stages: [
      { name: 'Shortage', desc: 'Food prices double. The poor begin to go hungry.', social: 'Grumbling discontent', economic: 'Inflation begins', military: 'Rations reduced' },
      { name: 'Rationing', desc: 'The ruling authority imposes strict rationing. Black markets emerge.', social: 'Class tensions rise', economic: 'Black market thrives', military: 'Morale drops' },
      { name: 'Starvation', desc: 'People die in the streets. Desperate mobs raid granaries.', social: 'Riots and looting', economic: 'Currency worthless', military: 'Mutiny threats' },
      { name: 'Exodus', desc: 'Mass migration. The region is abandoned by all who can leave.', social: 'Ghost towns', economic: 'Total ruin', military: 'No standing force' },
    ],
    resolutions: [
      'Restore the land with powerful druidic magic or remove the curse',
      'Negotiate emergency food shipments from a neighboring realm',
      'Discover a hidden cache of preserved food or a fertile valley',
    ],
    escalationDays: 10,
  },
  {
    type: 'war',
    name: 'March of the Iron Host',
    Icon: Swords,
    color: '#ef4444',
    descriptions: [
      'A neighboring kingdom masses its armies at the border, demanding tribute.',
      'An ancient enemy resurfaces with a massive army of conquest.',
      'Civil war erupts as a pretender to the throne raises their banner.',
    ],
    stages: [
      { name: 'Tensions', desc: 'Diplomatic relations break down. Scouts report troop movements.', social: 'Patriotic fervor', economic: 'War economy begins', military: 'Mobilization ordered' },
      { name: 'Skirmishes', desc: 'Border conflicts erupt. Villages burn. Refugees stream inward.', social: 'Fear of invasion', economic: 'Trade routes cut', military: 'Frontline established' },
      { name: 'Full War', desc: 'Major battles rage. Cities are besieged. The death toll mounts.', social: 'War weariness', economic: 'Severe shortages', military: 'Heavy casualties' },
      { name: 'Siege', desc: 'The capital itself is threatened. All hope seems lost.', social: 'Desperation', economic: 'Collapsed', military: 'Last stand' },
    ],
    resolutions: [
      'Lead a daring strike against the enemy commander or their war machine',
      'Forge an alliance with a third power to turn the tide',
      'Negotiate a peace treaty, possibly with significant concessions',
    ],
    escalationDays: 5,
  },
  {
    type: 'earthquake',
    name: 'The Sundering',
    Icon: Mountain,
    color: '#a78bfa',
    descriptions: [
      'The earth itself rebels, splitting the land and toppling ancient structures.',
      'Deep tremors crack open the Underdark, releasing horrors from below.',
      'A sleeping primordial stirs, and the world shakes in response.',
    ],
    stages: [
      { name: 'Tremors', desc: 'Minor quakes rattle windows. Cracks appear in old buildings.', social: 'Mild concern', economic: 'Minor disruption', military: 'Watch doubled' },
      { name: 'Aftershocks', desc: 'Larger quakes collapse buildings. Underground passages shift.', social: 'Growing fear', economic: 'Construction halted', military: 'Rescue operations' },
      { name: 'Major Quake', desc: 'A devastating quake levels entire districts. The ground splits open.', social: 'Mass panic', economic: 'Infrastructure destroyed', military: 'Overwhelmed' },
    ],
    resolutions: [
      'Seal the rift or stabilize the ley line causing the disturbance',
      'Defeat or pacify the primordial entity causing the tremors',
      'Use powerful earth magic to reinforce the foundations of civilization',
    ],
    escalationDays: 3,
  },
  {
    type: 'flood',
    name: 'The Drowning Tide',
    Icon: CloudRain,
    color: '#60a5fa',
    descriptions: [
      'Unceasing rains swell rivers beyond their banks, consuming the lowlands.',
      'A dam breaks after sabotage, unleashing a wall of water.',
      'The sea rises unnaturally, swallowing coastal settlements.',
    ],
    stages: [
      { name: 'Rising Waters', desc: 'Rivers overflow. Low-lying areas begin to flood.', social: 'Evacuations begin', economic: 'Farmland submerged', military: 'Sandbagging efforts' },
      { name: 'Flooding', desc: 'Entire districts underwater. Boats replace carts.', social: 'Displacement camps', economic: 'Harvests lost', military: 'Rescue missions' },
      { name: 'Deluge', desc: 'Only rooftops remain above water. Disease follows the flood.', social: 'Desperation', economic: 'Total agricultural loss', military: 'Cannot operate' },
    ],
    resolutions: [
      'Find and close the source of the unnatural rain or tidal surge',
      'Build or repair the great dam with engineering and magic combined',
      'Appeal to a water deity or elemental lord to recede the waters',
    ],
    escalationDays: 4,
  },
  {
    type: 'volcanic_eruption',
    name: 'Wrath of the Fire Mountain',
    Icon: Flame,
    color: '#f97316',
    descriptions: [
      'The long-dormant volcano awakens with fury, raining ash and fire.',
      'Deep underground, a fire elemental lord breaches the surface.',
      'Ancient dwarven mining awakened something terrible beneath the mountain.',
    ],
    stages: [
      { name: 'Smoke & Ash', desc: 'The mountain belches smoke. Ash falls like grey snow.', social: 'Ominous dread', economic: 'Crops threatened', military: 'Evacuation planning' },
      { name: 'Lava Flows', desc: 'Rivers of molten rock carve paths of destruction toward settlements.', social: 'Mass evacuation', economic: 'Mines abandoned', military: 'Defensive lines' },
      { name: 'Eruption', desc: 'A cataclysmic eruption. Pyroclastic flows consume everything.', social: 'Refugees everywhere', economic: 'Region devastated', military: 'Survival mode' },
    ],
    resolutions: [
      'Descend into the volcano and seal the elemental rift',
      'Perform an ancient ritual to appease the mountain spirit',
      'Evacuate the population and find them a new home',
    ],
    escalationDays: 3,
  },
  {
    type: 'magical_catastrophe',
    name: 'The Weave Unravels',
    Icon: Sparkles,
    color: '#c084fc',
    descriptions: [
      'Wild magic surges destabilize the fabric of reality itself.',
      'A failed ritual tears a hole between planes, leaking raw chaos.',
      'The death of an archmage releases centuries of stored magical energy.',
    ],
    stages: [
      { name: 'Anomalies', desc: 'Spells misfire. Strange lights in the sky. Animals behave oddly.', social: 'Superstitious fear', economic: 'Magical trade disrupted', military: 'Mages recalled' },
      { name: 'Wild Surges', desc: 'Uncontrolled magical effects warp reality. Mutations appear.', social: 'Anti-magic sentiment', economic: 'Enchanted goods malfunction', military: 'Magical weapons unstable' },
      { name: 'Planar Breach', desc: 'Reality tears open. Creatures from other planes pour through.', social: 'Existential terror', economic: 'Irrelevant', military: 'All-out defense' },
      { name: 'Unraveling', desc: 'The laws of physics bend. Time and space become unreliable.', social: 'Madness', economic: 'Meaningless', military: 'Impossible to coordinate' },
    ],
    resolutions: [
      'Find the epicenter and perform a counter-ritual to seal the breach',
      'Gather fragments of a shattered artifact that once stabilized the Weave',
      'Seek an ancient being who can reweave the damaged fabric of magic',
    ],
    escalationDays: 5,
  },
  {
    type: 'monster_invasion',
    name: 'The Horde Awakens',
    Icon: SkullIcon,
    color: '#dc2626',
    descriptions: [
      'Something has driven the monsters from the wilds into civilized lands.',
      'An ancient dragon rallies lesser creatures under its banner of destruction.',
      'The Underdark disgorges its horrors as something worse pushes them upward.',
    ],
    stages: [
      { name: 'Sightings', desc: 'Unusual monster activity near settlements. Livestock vanishes.', social: 'Hunters on alert', economic: 'Trade routes dangerous', military: 'Patrols increased' },
      { name: 'Raids', desc: 'Organized attacks on villages. Caravans destroyed.', social: 'Refugees flee', economic: 'Commerce halted', military: 'Garrisons deployed' },
      { name: 'Invasion', desc: 'A massive horde descends. Walls are tested. Heroes are needed.', social: 'Siege mentality', economic: 'Survival only', military: 'Major battles' },
      { name: 'Overrun', desc: 'Defenses fall. The monsters control the countryside.', social: 'Scattered survivors', economic: 'Destroyed', military: 'Guerrilla resistance' },
    ],
    resolutions: [
      'Slay the alpha creature or horde leader to scatter the monsters',
      'Discover what drove the monsters out and eliminate that greater threat',
      'Unite rival factions to mount a coordinated counterattack',
    ],
    escalationDays: 6,
  },
  {
    type: 'political_uprising',
    name: 'The People\'s Revolt',
    Icon: Landmark,
    color: '#ec4899',
    descriptions: [
      'The common folk rise up against their tyrannical rulers.',
      'A charismatic demagogue incites the populace to overthrow the government.',
      'Long-simmering ethnic and class tensions finally boil over.',
    ],
    stages: [
      { name: 'Unrest', desc: 'Protests in the streets. Pamphlets circulate. Secret meetings held.', social: 'Divided loyalties', economic: 'Strikes begin', military: 'Ordered to stand down' },
      { name: 'Rebellion', desc: 'Open conflict. Barricades in the streets. Government buildings seized.', social: 'Civil war brewing', economic: 'Commerce frozen', military: 'Split allegiances' },
      { name: 'Revolution', desc: 'Full-scale revolution. The old order crumbles.', social: 'Power vacuum', economic: 'Looting and redistribution', military: 'Fractured' },
    ],
    resolutions: [
      'Mediate between the factions and negotiate reforms',
      'Support one side to achieve a swift, if imperfect, resolution',
      'Expose the hidden manipulator pulling strings behind the unrest',
    ],
    escalationDays: 8,
  },
  {
    type: 'economic_collapse',
    name: 'The Great Default',
    Icon: Coins,
    color: '#fbbf24',
    descriptions: [
      'A major trading house collapses, taking the economy with it.',
      'Counterfeit gold floods the market, destroying faith in currency.',
      'A dragon\'s hoard is discovered, crashing the value of gold overnight.',
    ],
    stages: [
      { name: 'Downturn', desc: 'Banks close. Merchants hoard goods. Credit dries up.', social: 'Anxiety and blame', economic: 'Recession', military: 'Pay delayed' },
      { name: 'Crisis', desc: 'Currency becomes worthless. Barter economy emerges.', social: 'Class warfare', economic: 'Depression', military: 'Mercenaries unpaid' },
      { name: 'Collapse', desc: 'No functioning economy. Survival of the fittest.', social: 'Anarchy', economic: 'Non-existent', military: 'Disbanded or rogue' },
    ],
    resolutions: [
      'Root out the counterfeiters or stabilize the currency with a new standard',
      'Broker a deal with a wealthy faction to inject capital and restore confidence',
      'Establish a new trade route or resource that revitalizes the economy',
    ],
    escalationDays: 12,
  },
];

/* ── Shared Styles ── */

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

/* ── Severity Meter ── */

function SeverityMeter({ currentStage, totalStages }) {
  const pct = ((currentStage + 1) / totalStages) * 100;
  const getColor = () => {
    if (pct <= 25) return '#60a5fa';
    if (pct <= 50) return '#f59e0b';
    if (pct <= 75) return '#ef4444';
    return '#dc2626';
  };
  const color = getColor();

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: '4px',
      }}>
        <span style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
          Severity
        </span>
        <span style={{ fontSize: '10px', color, fontWeight: 700, fontFamily: 'var(--font-ui)' }}>
          Stage {currentStage + 1} / {totalStages}
        </span>
      </div>
      <div style={{
        width: '100%', height: '6px', borderRadius: '3px',
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '3px',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: 'width 0.4s ease, background 0.4s ease',
          boxShadow: `0 0 8px ${color}44`,
        }} />
      </div>
    </div>
  );
}

/* ── Crisis Card (Active) ── */

function ActiveCrisisCard({ crisis, onEscalate, onResolve, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const template = crisis.template;
  const currentStage = template.stages[crisis.currentStageIndex];
  const canEscalate = crisis.currentStageIndex < template.stages.length - 1;
  const TIcon = template.Icon;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${template.color}33`,
      borderRadius: '10px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <TIcon size={16} style={{ color: template.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px', fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {crisis.name}
          </div>
          <div style={{
            fontSize: '10px', color: template.color, fontWeight: 600,
            fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
          }}>
            {template.type.replace(/_/g, ' ')} - Stage: {currentStage.name}
          </div>
        </div>
        <span style={{
          fontSize: '9px', fontWeight: 700, padding: '2px 7px',
          borderRadius: '4px', background: `${template.color}22`,
          color: template.color, border: `1px solid ${template.color}44`,
          fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
        }}>
          Active
        </span>
        {expanded ? <ChevronUp size={13} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={13} style={{ color: 'var(--text-mute)' }} />}
      </div>

      {expanded && (
        <div style={{
          padding: '10px 14px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {/* Severity Meter */}
          <SeverityMeter
            currentStage={crisis.currentStageIndex}
            totalStages={template.stages.length}
          />

          {/* Stage Progress */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {template.stages.map((stage, i) => {
              const isPast = i < crisis.currentStageIndex;
              const isCurrent = i === crisis.currentStageIndex;
              const isFuture = i > crisis.currentStageIndex;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <div style={{
                    width: '100%', height: '4px', borderRadius: '2px',
                    background: isPast ? template.color : isCurrent ? `${template.color}88` : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.3s',
                  }} />
                  <span style={{
                    fontSize: '8px',
                    color: isCurrent ? template.color : isFuture ? 'var(--text-mute)' : 'var(--text-dim)',
                    fontWeight: isCurrent ? 700 : 500,
                    fontFamily: 'var(--font-ui)', textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Stage Details */}
          <div style={{
            padding: '10px 12px', borderRadius: '8px',
            background: `${template.color}08`,
            border: `1px solid ${template.color}18`,
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, color: template.color,
              fontFamily: 'var(--font-ui)', marginBottom: '4px',
            }}>
              {currentStage.name}
            </div>
            <p style={{
              fontSize: '12px', lineHeight: 1.6, color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)', margin: 0,
            }}>
              {currentStage.desc}
            </p>
          </div>

          {/* Impact Grid */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { label: 'Social', value: currentStage.social, color: '#60a5fa' },
              { label: 'Economic', value: currentStage.economic, color: '#f59e0b' },
              { label: 'Military', value: currentStage.military, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                flex: 1, padding: '6px 8px', borderRadius: '6px',
                background: `${color}08`, border: `1px solid ${color}15`,
              }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, color,
                  fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '2px',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: '10px', color: 'var(--text-dim)',
                  fontFamily: 'var(--font-ui)', lineHeight: 1.3,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Resolution Options */}
          <div>
            <div style={labelStyle}>Possible Resolutions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {template.resolutions.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '6px',
                  padding: '5px 8px', borderRadius: '5px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <Shield size={10} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{
                    fontSize: '11px', color: 'var(--text-dim)',
                    fontFamily: 'var(--font-ui)', lineHeight: 1.4,
                  }}>
                    {r}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation info */}
          <div style={{
            fontSize: '10px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)', textAlign: 'center',
            fontStyle: 'italic',
          }}>
            Escalates every ~{template.escalationDays} game days
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {canEscalate && (
              <button
                onClick={() => onEscalate(crisis.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 14px', borderRadius: '6px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontSize: '11px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                }}
              >
                <ArrowRight size={12} /> Escalate
              </button>
            )}
            <button
              onClick={() => onResolve(crisis.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', borderRadius: '6px',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)',
                color: '#4ade80', fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              <Check size={12} /> Resolve
            </button>
            <button
              onClick={() => onRemove(crisis.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-mute)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
                marginLeft: 'auto',
              }}
            >
              <Trash2 size={11} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Generated Crisis Preview ── */

function GeneratedCrisisPreview({ crisis, onActivate, onDiscard }) {
  const [expanded, setExpanded] = useState(false);
  const template = crisis.template;
  const TIcon = template.Icon;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px', overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <TIcon size={14} style={{ color: template.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px', fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}>
            {crisis.name}
          </div>
          <div style={{
            fontSize: '10px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
          }}>
            {template.type.replace(/_/g, ' ')} - {template.stages.length} stages
          </div>
        </div>
        {expanded ? <ChevronUp size={12} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={12} style={{ color: 'var(--text-mute)' }} />}
      </div>

      {expanded && (
        <div style={{
          padding: '10px 14px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <p style={{
            fontSize: '12px', lineHeight: 1.6, color: 'var(--text-dim)',
            fontFamily: 'var(--font-ui)', margin: 0,
          }}>
            {crisis.description}
          </p>

          {/* Stages preview */}
          <div>
            <div style={labelStyle}>Escalation Stages</div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '4px',
              paddingLeft: '10px',
              borderLeft: `2px solid ${template.color}33`,
            }}>
              {template.stages.map((stage, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '-15px', top: '4px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: `${template.color}44`,
                    border: `1.5px solid ${template.color}`,
                  }} />
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: template.color,
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {stage.name}
                  </div>
                  <div style={{
                    fontSize: '10px', color: 'var(--text-mute)',
                    fontFamily: 'var(--font-ui)', lineHeight: 1.4,
                  }}>
                    {stage.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution options */}
          <div>
            <div style={labelStyle}>Resolution Methods</div>
            {template.resolutions.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '5px',
                marginBottom: '3px',
              }}>
                <Shield size={9} style={{ color: '#4ade80', flexShrink: 0, marginTop: '3px' }} />
                <span style={{
                  fontSize: '10px', color: 'var(--text-dim)',
                  fontFamily: 'var(--font-ui)', lineHeight: 1.4,
                }}>
                  {r}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button
              onClick={() => onActivate(crisis)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 16px', borderRadius: '6px',
                background: `linear-gradient(135deg, ${template.color}22, ${template.color}11)`,
                border: `1px solid ${template.color}44`,
                color: template.color, fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              <Zap size={12} /> Activate Crisis
            </button>
            <button
              onClick={() => onDiscard(crisis.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-mute)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              <X size={11} /> Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

let nextId = 1;

export default function DisasterSystem() {
  const [generated, setGenerated] = useState([]);
  const [activeCrises, setActiveCrises] = useState([]);
  const [resolvedCrises, setResolvedCrises] = useState([]);
  const [showResolved, setShowResolved] = useState(false);

  const generateCrisis = () => {
    const template = DISASTER_TEMPLATES[Math.floor(Math.random() * DISASTER_TEMPLATES.length)];
    const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];

    // Create a slightly randomized name variation
    const prefixes = ['The', 'A', 'The Great', 'The Terrible', 'The Dreaded'];
    const prefix = Math.random() > 0.5 ? prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' : '';
    const name = prefix + template.name.replace(/^The\s+/, '');

    const crisis = {
      id: nextId++,
      name,
      description,
      template,
      generatedAt: new Date().toISOString(),
    };

    setGenerated(prev => [crisis, ...prev]);
    toast.success(`Generated: ${crisis.name}`);
  };

  const activateCrisis = (crisis) => {
    const active = {
      ...crisis,
      id: nextId++,
      currentStageIndex: 0,
      activatedAt: new Date().toISOString(),
    };
    setActiveCrises(prev => [active, ...prev]);
    setGenerated(prev => prev.filter(g => g.id !== crisis.id));
    toast.success(`Crisis activated: ${crisis.name}`);
  };

  const escalateCrisis = (crisisId) => {
    setActiveCrises(prev => prev.map(c => {
      if (c.id !== crisisId) return c;
      const nextStage = Math.min(c.currentStageIndex + 1, c.template.stages.length - 1);
      toast(`${c.name} escalated to: ${c.template.stages[nextStage].name}`, { icon: '🔥' });
      return { ...c, currentStageIndex: nextStage };
    }));
  };

  const resolveCrisis = (crisisId) => {
    const crisis = activeCrises.find(c => c.id === crisisId);
    if (crisis) {
      setResolvedCrises(prev => [{ ...crisis, resolvedAt: new Date().toISOString() }, ...prev]);
      setActiveCrises(prev => prev.filter(c => c.id !== crisisId));
      toast.success(`Crisis resolved: ${crisis.name}`);
    }
  };

  const removeCrisis = (crisisId) => {
    setActiveCrises(prev => prev.filter(c => c.id !== crisisId));
  };

  const discardGenerated = (crisisId) => {
    setGenerated(prev => prev.filter(g => g.id !== crisisId));
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertTriangle size={15} style={{ color: '#c084fc' }} />
          <span style={{
            fontSize: '12px', fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}>
            Disaster / Crisis System
          </span>
          {activeCrises.length > 0 && (
            <span style={{
              fontSize: '10px', fontWeight: 700,
              padding: '1px 6px', borderRadius: '4px',
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
              fontFamily: 'var(--font-ui)',
            }}>
              {activeCrises.length} active
            </span>
          )}
        </div>
        <button
          onClick={generateCrisis}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '6px 14px', borderRadius: '6px',
            background: 'linear-gradient(135deg, rgba(192,132,252,0.2), rgba(192,132,252,0.1))',
            border: '1px solid rgba(192,132,252,0.35)',
            color: '#c084fc', fontSize: '11px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
          }}
        >
          <Dices size={13} /> Generate Crisis
        </button>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Active Crises */}
        {activeCrises.length > 0 && (
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#ef4444',
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '8px',
            }}>
              <Zap size={11} /> Active Crises
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeCrises.map(crisis => (
                <ActiveCrisisCard
                  key={crisis.id}
                  crisis={crisis}
                  onEscalate={escalateCrisis}
                  onResolve={resolveCrisis}
                  onRemove={removeCrisis}
                />
              ))}
            </div>
          </div>
        )}

        {/* Generated (Pending) */}
        {generated.length > 0 && (
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#c084fc',
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '8px',
            }}>
              <Dices size={11} /> Generated Crises
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {generated.map(crisis => (
                <GeneratedCrisisPreview
                  key={crisis.id}
                  crisis={crisis}
                  onActivate={activateCrisis}
                  onDiscard={discardGenerated}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {activeCrises.length === 0 && generated.length === 0 && (
          <div style={{
            padding: '32px', textAlign: 'center',
          }}>
            <AlertTriangle size={24} style={{ color: 'rgba(192,132,252,0.2)', margin: '0 auto 8px' }} />
            <div style={{
              fontSize: '12px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)', marginBottom: '4px',
            }}>
              No active crises. The world is at peace... for now.
            </div>
            <div style={{
              fontSize: '11px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)', opacity: 0.6,
            }}>
              Click "Generate Crisis" to create a random disaster for your world.
            </div>
          </div>
        )}

        {/* Resolved History */}
        {resolvedCrises.length > 0 && (
          <div>
            <button
              onClick={() => setShowResolved(!showResolved)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-mute)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                width: '100%', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              {showResolved ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              <Check size={11} style={{ color: '#4ade80' }} />
              Resolved Crises ({resolvedCrises.length})
            </button>

            {showResolved && (
              <div style={{
                marginTop: '8px',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                {resolvedCrises.map(crisis => {
                  const TIcon = crisis.template.Icon;
                  return (
                    <div key={crisis.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(74,222,128,0.1)',
                      opacity: 0.6,
                    }}>
                      <TIcon size={12} style={{ color: crisis.template.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)',
                          fontFamily: 'var(--font-ui)',
                          textDecoration: 'line-through',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {crisis.name}
                        </div>
                        <div style={{
                          fontSize: '10px', color: 'var(--text-mute)',
                          fontFamily: 'var(--font-ui)',
                        }}>
                          Reached stage {crisis.currentStageIndex + 1}/{crisis.template.stages.length}
                          {crisis.resolvedAt && ` - Resolved ${new Date(crisis.resolvedAt).toLocaleDateString()}`}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                        borderRadius: '4px', background: 'rgba(74,222,128,0.12)',
                        color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)',
                        fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
                      }}>
                        Resolved
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
