import { Sparkles } from 'lucide-react';
import AiModules from '../components/dm-session/AiModules';
import { useAppMode } from '../contexts/ModeContext';

export default function AiModulesSection() {
  const { mode } = useAppMode();
  const isPlayer = mode === 'player';

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={20} style={{ color: 'rgba(139,92,246,0.6)' }} />
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'calc(20px * var(--font-scale))',
            fontWeight: 700, color: 'white', margin: 0,
          }}>
            AI Modules
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
            {isPlayer
              ? 'AI-powered generators for backstories, lore, and campaign recaps.'
              : '9 AI-powered generators for scene descriptions, NPC dialogue, story hooks & more.'
            }
          </p>
        </div>
      </div>

      <div style={{
        background: 'rgba(139,92,246,0.03)',
        border: '1px solid rgba(139,92,246,0.12)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <AiModules mode={isPlayer ? 'player' : 'dm'} />
      </div>
    </div>
  );
}
