import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';

/* ── Hex geometry helpers (mirrored from BattleMap) ── */
function hexCenter(col, row, size) {
  const w = Math.sqrt(3) * size;
  const h = 2 * size;
  const x = col * w + (row % 2 === 1 ? w / 2 : 0) + w / 2;
  const y = row * (h * 0.75) + h / 2;
  return { x, y };
}

function hexCorners(cx, cy, size) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push({ x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) });
  }
  return pts;
}

const SIZE_MAP = {
  tiny: 0.5, small: 1, medium: 1, large: 2, huge: 3, gargantuan: 4,
};

const CONDITION_COLORS = {
  none: 'transparent', poisoned: '#22c55e', stunned: '#eab308',
  frightened: '#a855f7', restrained: '#f97316', concentrating: '#3b82f6',
  prone: '#ef4444', blessed: '#e2e8f0',
};

export default function PlayerBattleMap() {
  const { syncedBattleMap } = useCampaignSync();
  const canvasRef = useRef(null);

  const mapData = syncedBattleMap;

  const {
    tokens = [], fog = {}, drawings = [],
    gridW = 20, gridH = 20, cellPx = 32, hexMode = false,
  } = mapData || {};

  /* ── Canvas dimensions ── */
  const canvasW = useMemo(() => {
    if (hexMode) return Math.ceil((gridW + 0.5) * Math.sqrt(3) * (cellPx / 2));
    return gridW * cellPx;
  }, [gridW, cellPx, hexMode]);

  const canvasH = useMemo(() => {
    if (hexMode) return Math.ceil((gridH * 0.75 + 0.25) * cellPx);
    return gridH * cellPx;
  }, [gridH, cellPx, hexMode]);

  const cellCenter = useCallback((col, row) => {
    if (hexMode) {
      const size = cellPx / 2;
      return hexCenter(col, row, size);
    }
    return { x: col * cellPx + cellPx / 2, y: row * cellPx + cellPx / 2 };
  }, [cellPx, hexMode]);

  /* ── Draw the map ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapData) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#04040b';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;

    if (hexMode) {
      const size = cellPx / 2;
      for (let r = 0; r < gridH; r++) {
        for (let c = 0; c < gridW; c++) {
          const { x, y } = hexCenter(c, r, size);
          const corners = hexCorners(x, y, size);
          ctx.beginPath();
          ctx.moveTo(corners[0].x, corners[0].y);
          for (let i = 1; i < 6; i++) ctx.lineTo(corners[i].x, corners[i].y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    } else {
      for (let x = 0; x <= gridW; x++) {
        ctx.beginPath(); ctx.moveTo(x * cellPx, 0); ctx.lineTo(x * cellPx, canvasH); ctx.stroke();
      }
      for (let y = 0; y <= gridH; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * cellPx); ctx.lineTo(canvasW, y * cellPx); ctx.stroke();
      }
    }

    // Drawings (freehand)
    for (const stroke of drawings) {
      if (!stroke.points || stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }

    // Fog of war
    for (const key in fog) {
      if (!fog[key]) continue;
      const [c, r] = key.split(',').map(Number);
      if (hexMode) {
        const size = cellPx / 2;
        const { x, y } = hexCenter(c, r, size);
        const corners = hexCorners(x, y, size);
        ctx.fillStyle = 'rgba(0,0,0,0.82)';
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 6; i++) ctx.lineTo(corners[i].x, corners[i].y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.82)';
        ctx.fillRect(c * cellPx, r * cellPx, cellPx, cellPx);
      }
    }

    // Tokens
    for (const tok of tokens) {
      const { x, y } = cellCenter(tok.col, tok.row);
      const gridSize = SIZE_MAP[tok.size] || 1;
      const radius = (cellPx * gridSize) / 2 - 2;

      // Condition ring
      if (tok.condition && tok.condition !== 'none') {
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = CONDITION_COLORS[tok.condition] || '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Token circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = tok.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Initials
      const initials = tok.name.length <= 2 ? tok.name : tok.name.slice(0, 2).toUpperCase();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(9, radius * 0.75)}px var(--font-ui, sans-serif)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, x, y + 1);
    }
  }, [mapData, canvasW, canvasH, gridW, gridH, cellPx, hexMode, tokens, fog, drawings, cellCenter]);

  useEffect(() => { draw(); }, [draw]);

  if (!mapData) {
    return (
      <div style={{
        padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.25)',
        fontSize: 13, fontFamily: 'var(--font-ui)',
      }}>
        No battle map shared yet.
        <div style={{ fontSize: 10, marginTop: 6, color: 'rgba(255,255,255,0.15)' }}>
          The DM will share the battle map when combat begins.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: 'var(--font-ui)', position: 'relative',
    }}>
      {/* Live indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px',
        background: 'rgba(201,168,76,0.06)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: '#c9a84c',
          boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontSize: 10, color: '#c9a84c', textTransform: 'uppercase',
          fontWeight: 600, letterSpacing: '0.5px',
        }}>
          Live Battle Map
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
          {tokens.length} token{tokens.length !== 1 ? 's' : ''} &middot; {gridW}x{gridH} {hexMode ? 'hex' : 'grid'}
        </span>
      </div>

      {/* Canvas area (read-only) */}
      <div style={{
        flex: 1, overflow: 'auto', background: '#04040b',
        cursor: 'default',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: canvasW, height: canvasH,
            display: 'block', margin: '0 auto',
          }}
        />
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
