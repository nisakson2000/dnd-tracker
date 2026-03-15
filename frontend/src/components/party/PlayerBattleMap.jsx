import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
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

export default function PlayerBattleMap({ playerName }) {
  const { syncedBattleMap, sendEvent } = useCampaignSync();
  const canvasRef = useRef(null);

  const mapData = syncedBattleMap;

  const {
    tokens = [], fog = {}, drawings = [],
    gridW = 20, gridH = 20, cellPx = 32, hexMode = false,
  } = mapData || {};

  /* ── Interactive state ── */
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState(null); // { x, y } in canvas coords
  const [measureMode, setMeasureMode] = useState(false);
  const [measureStart, setMeasureStart] = useState(null); // { col, row }
  const [measureEnd, setMeasureEnd] = useState(null); // { col, row }
  const [measureLine, setMeasureLine] = useState(null); // { start: {x,y}, end: {x,y}, distance }

  // Track shift key for measurement mode
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Shift') setMeasureMode(true); };
    const onKeyUp = (e) => {
      if (e.key === 'Shift') {
        setMeasureMode(false);
        setMeasureStart(null);
        setMeasureEnd(null);
        setMeasureLine(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Find the player's own token
  const myToken = useMemo(() => {
    if (!playerName) return null;
    const nameLower = playerName.toLowerCase();
    return tokens.find(t => t.name && t.name.toLowerCase() === nameLower) || null;
  }, [tokens, playerName]);

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

  /* ── Convert canvas pixel to grid cell ── */
  const pixelToCell = useCallback((px, py) => {
    if (hexMode) {
      const size = cellPx / 2;
      // Approximate: find nearest hex center
      let bestCol = 0, bestRow = 0, bestDist = Infinity;
      for (let r = 0; r < gridH; r++) {
        for (let c = 0; c < gridW; c++) {
          const { x, y } = hexCenter(c, r, size);
          const d = (x - px) ** 2 + (y - py) ** 2;
          if (d < bestDist) { bestDist = d; bestCol = c; bestRow = r; }
        }
      }
      return { col: bestCol, row: bestRow };
    }
    return { col: Math.floor(px / cellPx), row: Math.floor(py / cellPx) };
  }, [cellPx, hexMode, gridW, gridH]);

  /* ── Hit test: find token at pixel position ── */
  const tokenAtPixel = useCallback((px, py) => {
    for (let i = tokens.length - 1; i >= 0; i--) {
      const tok = tokens[i];
      const { x, y } = cellCenter(tok.col, tok.row);
      const gridSize = SIZE_MAP[tok.size] || 1;
      const radius = (cellPx * gridSize) / 2 - 2;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= radius) return tok;
    }
    return null;
  }, [tokens, cellCenter, cellPx]);

  /* ── Calculate distance in feet between two cells ── */
  const cellDistance = useCallback((c1, r1, c2, r2) => {
    if (hexMode) {
      // Hex distance using axial coordinates
      const size = cellPx / 2;
      const p1 = hexCenter(c1, r1, size);
      const p2 = hexCenter(c2, r2, size);
      const pixelDist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      const hexDist = Math.round(pixelDist / (Math.sqrt(3) * size));
      return hexDist * 5;
    }
    // Square grid: use D&D diagonal movement (each cell = 5ft)
    const dx = Math.abs(c2 - c1);
    const dy = Math.abs(r2 - r1);
    const diag = Math.min(dx, dy);
    const straight = Math.max(dx, dy) - diag;
    return (straight + diag) * 5;
  }, [hexMode, cellPx]);

  /* ── Get canvas-relative coordinates from mouse event ── */
  const getCanvasPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasW / rect.width;
    const scaleY = canvasH / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, [canvasW, canvasH]);

  /* ── Mouse handlers ── */
  const handleMouseDown = useCallback((e) => {
    const pos = getCanvasPos(e);

    // Measurement mode (Shift held)
    if (measureMode) {
      const cell = pixelToCell(pos.x, pos.y);
      if (!measureStart) {
        setMeasureStart(cell);
        setMeasureEnd(null);
        setMeasureLine(null);
      } else {
        // Second click: finalize measurement
        setMeasureEnd(cell);
        const dist = cellDistance(measureStart.col, measureStart.row, cell.col, cell.row);
        const startCenter = cellCenter(measureStart.col, measureStart.row);
        const endCenter = cellCenter(cell.col, cell.row);
        setMeasureLine({ start: startCenter, end: endCenter, distance: dist });
      }
      return;
    }

    // Token selection / drag start
    const tok = tokenAtPixel(pos.x, pos.y);
    if (tok && myToken && tok.id === myToken.id) {
      setSelectedTokenId(tok.id);
      setIsDragging(true);
      setDragPos(pos);
    } else {
      setSelectedTokenId(null);
    }
  }, [getCanvasPos, measureMode, measureStart, pixelToCell, cellDistance, cellCenter, tokenAtPixel, myToken]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const pos = getCanvasPos(e);
    setDragPos(pos);
  }, [isDragging, getCanvasPos]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging || !selectedTokenId) {
      setIsDragging(false);
      return;
    }
    const pos = getCanvasPos(e);
    const cell = pixelToCell(pos.x, pos.y);
    // Clamp to grid
    const col = Math.max(0, Math.min(gridW - 1, cell.col));
    const row = Math.max(0, Math.min(gridH - 1, cell.row));

    // Send movement event
    sendEvent('battle_map_token_move', {
      token_id: selectedTokenId,
      col,
      row,
    });

    setIsDragging(false);
    setDragPos(null);
  }, [isDragging, selectedTokenId, getCanvasPos, pixelToCell, gridW, gridH, sendEvent]);

  /* ── Cursor style ── */
  const getCursor = useCallback(() => {
    if (measureMode) return 'crosshair';
    if (isDragging) return 'grabbing';
    return 'default';
  }, [measureMode, isDragging]);

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
      const isBeingDragged = isDragging && tok.id === selectedTokenId;
      let tx, ty;
      if (isBeingDragged && dragPos) {
        tx = dragPos.x;
        ty = dragPos.y;
      } else {
        const center = cellCenter(tok.col, tok.row);
        tx = center.x;
        ty = center.y;
      }
      const gridSize = SIZE_MAP[tok.size] || 1;
      const radius = (cellPx * gridSize) / 2 - 2;

      // Selection highlight for player's own token
      const isOwn = myToken && tok.id === myToken.id;
      if (isOwn) {
        ctx.beginPath();
        ctx.arc(tx, ty, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = selectedTokenId === tok.id ? '#fbbf24' : 'rgba(251,191,36,0.4)';
        ctx.lineWidth = selectedTokenId === tok.id ? 2.5 : 1.5;
        ctx.setLineDash(selectedTokenId === tok.id ? [] : [4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Condition ring
      if (tok.condition && tok.condition !== 'none') {
        ctx.beginPath();
        ctx.arc(tx, ty, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = CONDITION_COLORS[tok.condition] || '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Token circle
      ctx.beginPath();
      ctx.arc(tx, ty, radius, 0, Math.PI * 2);
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
      ctx.fillText(initials, tx, ty + 1);
    }

    // Draw measurement line
    if (measureLine) {
      ctx.beginPath();
      ctx.moveTo(measureLine.start.x, measureLine.start.y);
      ctx.lineTo(measureLine.end.x, measureLine.end.y);
      ctx.strokeStyle = 'rgba(96,165,250,0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Distance label at midpoint
      const mx = (measureLine.start.x + measureLine.end.x) / 2;
      const my = (measureLine.start.y + measureLine.end.y) / 2;
      const label = `${measureLine.distance} ft`;
      ctx.font = 'bold 12px var(--font-ui, sans-serif)';
      const textW = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(mx - textW / 2 - 4, my - 8, textW + 8, 16);
      ctx.fillStyle = '#60a5fa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, mx, my);
    } else if (measureStart && measureMode) {
      // Draw a dot on the start cell while waiting for second click
      const sc = cellCenter(measureStart.col, measureStart.row);
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.fill();
    }
  }, [mapData, canvasW, canvasH, gridW, gridH, cellPx, hexMode, tokens, fog, drawings, cellCenter,
      isDragging, selectedTokenId, dragPos, myToken, measureLine, measureStart, measureMode]);

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
        {measureMode && (
          <span style={{
            fontSize: 9, color: '#60a5fa', background: 'rgba(96,165,250,0.12)',
            border: '1px solid rgba(96,165,250,0.3)', borderRadius: 4,
            padding: '1px 6px', fontWeight: 600,
          }}>
            MEASURE MODE
          </span>
        )}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
          {tokens.length} token{tokens.length !== 1 ? 's' : ''} &middot; {gridW}x{gridH} {hexMode ? 'hex' : 'grid'}
        </span>
      </div>

      {/* Canvas area */}
      <div style={{
        flex: 1, overflow: 'auto', background: '#04040b',
        cursor: getCursor(),
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isDragging) {
              setIsDragging(false);
              setDragPos(null);
            }
          }}
          style={{
            width: canvasW, height: canvasH,
            display: 'block', margin: '0 auto',
            cursor: getCursor(),
          }}
        />
      </div>

      {/* Hint bar */}
      <div style={{
        padding: '4px 12px', fontSize: 9, color: 'rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.3)', textAlign: 'center',
        fontFamily: 'var(--font-ui)',
      }}>
        {myToken
          ? 'Click your token to select, drag to move. Hold Shift + click two cells to measure distance.'
          : 'Hold Shift + click two cells to measure distance.'}
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
