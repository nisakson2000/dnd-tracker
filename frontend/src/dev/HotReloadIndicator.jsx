import { useState, useEffect } from 'react';

export default function HotReloadIndicator() {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!import.meta.hot) return;
    let flashTimer = null;

    import.meta.hot.on('vite:beforeUpdate', () => {
      setFlash({ type: 'HMR', color: '#4ade80' });
      if (flashTimer) clearTimeout(flashTimer);
      flashTimer = setTimeout(() => setFlash(null), 2000);
    });

    import.meta.hot.on('vite:beforeFullReload', () => {
      setFlash({ type: 'Full Reload', color: '#fbbf24' });
    });

    return () => {
      if (flashTimer) clearTimeout(flashTimer);
    };
  }, []);

  if (!flash) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '12px', left: '12px', zIndex: 99997,
      padding: '4px 12px', borderRadius: '6px',
      background: 'rgba(0,0,0,0.8)', border: `1px solid ${flash.color}40`,
      color: flash.color, fontSize: '10px', fontWeight: 700,
      fontFamily: '"DM Sans", sans-serif',
      animation: 'fadeIn 0.15s ease',
      transition: 'opacity 0.3s',
    }}>
      {flash.type}
    </div>
  );
}
