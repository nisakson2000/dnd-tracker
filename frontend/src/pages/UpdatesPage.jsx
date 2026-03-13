import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Updates from '../sections/Updates';

export default function UpdatesPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #04040b)',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 28px', maxWidth: '720px', margin: '0 auto' }}>
        <Updates />
      </div>
    </div>
  );
}
