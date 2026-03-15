import { useState } from 'react';
import {
  BookOpen, ChevronDown, ChevronRight, X,
  Target, AlertTriangle, Shield, Swords, Moon,
} from 'lucide-react';

const sectionData = [
  {
    key: 'dc',
    title: 'Difficulty Classes',
    icon: <Target size={12} />,
    content: (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px', color: '#c9a84c', fontWeight: 600 }}>Task</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', color: '#c9a84c', fontWeight: 600 }}>DC</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Very Easy', 5],
            ['Easy', 10],
            ['Medium', 15],
            ['Hard', 20],
            ['Very Hard', 25],
            ['Nearly Impossible', 30],
          ].map(([task, dc]) => (
            <tr key={task} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td style={{ padding: '3px 8px', color: 'var(--text)' }}>{task}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', color: '#e2c97e', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{dc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    key: 'conditions',
    title: 'Common Conditions',
    icon: <AlertTriangle size={12} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', padding: '4px 8px' }}>
        {[
          ['Blinded', "Can't see, auto-fail sight checks, attacks have disadvantage"],
          ['Charmed', "Can't attack charmer, charmer has advantage on social checks"],
          ['Deafened', "Can't hear, auto-fail hearing checks"],
          ['Frightened', "Disadvantage on checks/attacks while source visible, can't approach"],
          ['Grappled', 'Speed 0, ends if grappler incapacitated'],
          ['Incapacitated', "Can't take actions or reactions"],
          ['Invisible', 'Impossible to see, attacks have advantage, attacks against have disadvantage'],
          ['Paralyzed', 'Incapacitated, auto-fail STR/DEX saves, attacks have advantage, melee crits'],
          ['Petrified', 'Turned to stone, weight x10, immune to poison/disease'],
          ['Poisoned', 'Disadvantage on attacks and ability checks'],
          ['Prone', 'Disadvantage on attacks, melee against have advantage, ranged have disadvantage'],
          ['Restrained', 'Speed 0, attacks have disadvantage, DEX saves disadvantage'],
          ['Stunned', 'Incapacitated, auto-fail STR/DEX saves, attacks have advantage'],
          ['Unconscious', 'Incapacitated, prone, auto-fail STR/DEX saves, attacks have advantage, melee crits'],
        ].map(([name, desc]) => (
          <div key={name} style={{ display: 'flex', gap: '6px', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ color: '#c9a84c', fontWeight: 700, minWidth: '90px', flexShrink: 0 }}>{name}</span>
            <span style={{ color: 'var(--text-mute)' }}>{desc}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'cover',
    title: 'Cover Rules',
    icon: <Shield size={12} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', padding: '4px 8px' }}>
        {[
          ['Half Cover', '+2 AC, +2 DEX saves'],
          ['Three-quarters', '+5 AC, +5 DEX saves'],
          ['Full Cover', "Can't be targeted directly"],
        ].map(([name, desc]) => (
          <div key={name} style={{ display: 'flex', gap: '6px', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ color: '#c9a84c', fontWeight: 700, minWidth: '110px', flexShrink: 0 }}>{name}</span>
            <span style={{ color: 'var(--text-mute)' }}>{desc}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'actions',
    title: 'Actions in Combat',
    icon: <Swords size={12} />,
    content: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '6px 8px' }}>
        {['Attack', 'Cast Spell', 'Dash', 'Disengage', 'Dodge', 'Help', 'Hide', 'Ready', 'Search', 'Use Object'].map(action => (
          <span key={action} style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: '#e2c97e',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
          }}>
            {action}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'rest',
    title: 'Rest Rules',
    icon: <Moon size={12} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', padding: '4px 8px' }}>
        {[
          ['Short Rest', '1+ hours, spend Hit Dice to heal'],
          ['Long Rest', '8+ hours, regain all HP, half Hit Dice (min 1)'],
        ].map(([name, desc]) => (
          <div key={name} style={{ display: 'flex', gap: '6px', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ color: '#c9a84c', fontWeight: 700, minWidth: '80px', flexShrink: 0 }}>{name}</span>
            <span style={{ color: 'var(--text-mute)' }}>{desc}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function QuickReferencePanel({ onClose }) {
  const [expandedSections, setExpandedSections] = useState({ dc: true });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-mute)',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'space-between',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={12} style={{ color: '#c9a84c' }} /> Quick Reference
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-mute)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Accordion Sections */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {sectionData.map(section => (
          <div key={section.key}>
            <button
              onClick={() => toggleSection(section.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: expandedSections[section.key] ? 'rgba(201,168,76,0.05)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                color: expandedSections[section.key] ? '#c9a84c' : 'var(--text-mute)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {expandedSections[section.key]
                ? <ChevronDown size={10} />
                : <ChevronRight size={10} />
              }
              {section.icon}
              {section.title}
            </button>
            {expandedSections[section.key] && (
              <div style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(0,0,0,0.15)',
              }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
