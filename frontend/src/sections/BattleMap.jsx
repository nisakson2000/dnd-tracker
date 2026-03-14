import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Grid3X3, Plus, Trash2, MousePointer, Ruler, Eye, EyeOff,
  Pencil, Eraser, Image, RotateCcw, Users, Hexagon, Square,
  ZoomIn, ZoomOut, Move, ChevronDown, Radio,
} from 'lucide-react';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';

/* ── Constants ── */
const STORAGE_KEY = 'codex_battle_map_state';
const TOKEN_COLORS = [
  { name: 'Red',    hex: '#ef4444' },
  { name: 'Blue',   hex: '#3b82f6' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Gold',   hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'White',  hex: '#e2e8f0' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Cyan',   hex: '#06b6d4' },
];

const SIZE_MAP = {
  tiny:        0.5,
  small:       1,
  medium:      1,
  large:       2,
  huge:        3,
  gargantuan:  4,
};

const CONDITION_COLORS = {
  none:          'transparent',
  poisoned:      '#22c55e',
  stunned:       '#eab308',
  frightened:    '#a855f7',
  restrained:    '#f97316',
  concentrating: '#3b82f6',
  prone:         '#ef4444',
  blessed:       '#e2e8f0',
};

const DRAW_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#e2e8f0'];

const PARTY_PRESETS = [
  { name: 'Fighter', color: '#ef4444', initials: 'Fi' },
  { name: 'Wizard',  color: '#3b82f6', initials: 'Wi' },
  { name: 'Rogue',   color: '#22c55e', initials: 'Ro' },
  { name: 'Cleric',  color: '#eab308', initials: 'Cl' },
];

function uid() { return Math.random().toString(36).slice(2, 9); }

/* ── Default state factory ── */
function defaultState() {
  return {
    gridW: 20,
    gridH: 20,
    hexMode: false,
    cellPx: 32,
    tokens: [],
    fog: {},          // "col,row" -> true (hidden)
    drawings: [],     // array of { points: [{x,y},...], color, width }
    bgImage: null,    // data-url string
    bgOffset: { x: 0, y: 0 },
    bgScale: 1,
    panOffset: { x: 0, y: 0 },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultState();
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/* ── Helper: hex geometry ── */
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

/* ── Toolbar button ── */
function TBtn({ icon: Icon, label, active, onClick, disabled, small, children, style: extraStyle }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: small ? '3px 6px' : '5px 8px',
        fontSize: small ? '10px' : '11px',
        fontFamily: 'var(--font-ui)',
        background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6, color: active ? '#fff' : 'rgba(255,255,255,0.55)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.12s', whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {Icon && <Icon size={small ? 12 : 14} />}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
}

/* ── Main component ── */
export default function BattleMap() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const fileRef = useRef(null);
  const tokensRef = useRef([]);

  // Campaign sync for battle map broadcasting (DM side)
  const campaignSync = useCampaignSyncSafe() || {};
  const {
    isHost, sendBattleMapSync, sendBattleMapTokenMove,
    sendBattleMapFogUpdate, sendBattleMapDrawingUpdate, sendBattleMapClear,
  } = campaignSync;

  // Core state
  const [state, setState] = useState(loadState);
  const { gridW, gridH, hexMode, cellPx, tokens, fog, drawings, bgImage, bgOffset, bgScale, panOffset } = state;
  tokensRef.current = tokens;

  // UI state
  const [tool, setTool] = useState('select'); // select | measure | fog | draw | erase | pan
  const [drawColor, setDrawColor] = useState(DRAW_COLORS[0]);
  const [measureStart, setMeasureStart] = useState(null);
  const [measureEnd, setMeasureEnd] = useState(null);
  const [draggingToken, setDraggingToken] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddToken, setShowAddToken] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { tokenId, x, y }
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [showGridConfig, setShowGridConfig] = useState(false);

  // Add-token form
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TOKEN_COLORS[0].hex);
  const [newSize, setNewSize] = useState('medium');

  // Persist state
  useEffect(() => { saveState(state); }, [state]);

  const patch = useCallback((updates) => setState(prev => ({ ...prev, ...updates })), []);

  /* ── Canvas dimensions ── */
  const canvasW = useMemo(() => {
    if (hexMode) return Math.ceil((gridW + 0.5) * Math.sqrt(3) * (cellPx / 2));
    return gridW * cellPx;
  }, [gridW, cellPx, hexMode]);

  const canvasH = useMemo(() => {
    if (hexMode) return Math.ceil((gridH * 0.75 + 0.25) * cellPx);
    return gridH * cellPx;
  }, [gridH, cellPx, hexMode]);

  /* ── Grid snapping ── */
  const snapToGrid = useCallback((px, py) => {
    if (hexMode) {
      const size = cellPx / 2;
      let bestDist = Infinity, bestCol = 0, bestRow = 0;
      for (let r = 0; r < gridH; r++) {
        for (let c = 0; c < gridW; c++) {
          const { x, y } = hexCenter(c, r, size);
          const d = (px - x) ** 2 + (py - y) ** 2;
          if (d < bestDist) { bestDist = d; bestCol = c; bestRow = r; }
        }
      }
      return { col: bestCol, row: bestRow };
    }
    return {
      col: Math.max(0, Math.min(gridW - 1, Math.floor(px / cellPx))),
      row: Math.max(0, Math.min(gridH - 1, Math.floor(py / cellPx))),
    };
  }, [gridW, gridH, cellPx, hexMode]);

  const cellCenter = useCallback((col, row) => {
    if (hexMode) {
      const size = cellPx / 2;
      return hexCenter(col, row, size);
    }
    return { x: col * cellPx + cellPx / 2, y: row * cellPx + cellPx / 2 };
  }, [cellPx, hexMode]);

  /* ── Drawing (render) ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#04040b';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Background image
    if (bgImage && canvas._bgImg) {
      ctx.save();
      ctx.translate(bgOffset.x, bgOffset.y);
      ctx.scale(bgScale, bgScale);
      ctx.drawImage(canvas._bgImg, 0, 0);
      ctx.restore();
    }

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
    const allStrokes = currentStroke ? [...drawings, currentStroke] : drawings;
    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
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

    // Measure line
    if (measureStart && measureEnd) {
      const s = cellCenter(measureStart.col, measureStart.row);
      const e = cellCenter(measureEnd.col, measureEnd.row);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      ctx.strokeStyle = 'rgba(251,191,36,0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Distance label
      let dist;
      if (hexMode) {
        // Hex distance approximation
        const dx = Math.abs(measureEnd.col - measureStart.col);
        const dy = Math.abs(measureEnd.row - measureStart.row);
        dist = Math.max(dx, dy) * 5;
      } else {
        const dx = Math.abs(measureEnd.col - measureStart.col);
        const dy = Math.abs(measureEnd.row - measureStart.row);
        dist = Math.max(dx, dy) * 5; // D&D diagonal = max(dx,dy) * 5
      }
      const mx = (s.x + e.x) / 2;
      const my = (s.y + e.y) / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(mx - 22, my - 10, 44, 20);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px var(--font-ui, sans-serif)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${dist} ft`, mx, my);
    }
  }, [canvasW, canvasH, gridW, gridH, cellPx, hexMode, tokens, fog, drawings, currentStroke, bgImage, bgOffset, bgScale, measureStart, measureEnd, cellCenter]);

  /* ── Load background image into canvas._bgImg ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!bgImage) { canvas._bgImg = null; draw(); return; }
    const img = new window.Image();
    img.onload = () => { canvas._bgImg = img; draw(); };
    img.src = bgImage;
  }, [bgImage]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Redraw on any state change ── */
  useEffect(() => { draw(); }, [draw]);

  /* ── Canvas coordinate helper ── */
  const canvasXY = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasW / rect.width),
      y: (e.clientY - rect.top) * (canvasH / rect.height),
    };
  }, [canvasW, canvasH]);

  /* ── Token hit test ── */
  const hitToken = useCallback((px, py) => {
    for (let i = tokens.length - 1; i >= 0; i--) {
      const tok = tokens[i];
      const { x, y } = cellCenter(tok.col, tok.row);
      const gridSize = SIZE_MAP[tok.size] || 1;
      const radius = (cellPx * gridSize) / 2;
      if ((px - x) ** 2 + (py - y) ** 2 <= radius ** 2) return tok;
    }
    return null;
  }, [tokens, cellPx, cellCenter]);

  /* ── Mouse handlers ── */
  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) return; // right-click handled separately
    setContextMenu(null);
    const { x, y } = canvasXY(e);
    const { col, row } = snapToGrid(x, y);

    if (tool === 'select') {
      const tok = hitToken(x, y);
      if (tok) {
        const tc = cellCenter(tok.col, tok.row);
        setDraggingToken(tok.id);
        setDragOffset({ x: x - tc.x, y: y - tc.y });
      }
    } else if (tool === 'measure') {
      setMeasureStart({ col, row });
      setMeasureEnd({ col, row });
    } else if (tool === 'fog') {
      const key = `${col},${row}`;
      const newFog = { ...fog, [key]: !fog[key] };
      patch({ fog: newFog });
      if (isHost && sendBattleMapFogUpdate) {
        sendBattleMapFogUpdate({ fog: newFog });
      }
    } else if (tool === 'draw') {
      setIsDrawing(true);
      setCurrentStroke({ points: [{ x, y }], color: drawColor, width: 2 });
    } else if (tool === 'erase') {
      // Erase strokes near click
      const threshold = 10;
      const kept = drawings.filter(stroke =>
        !stroke.points.some(p => Math.hypot(p.x - x, p.y - y) < threshold)
      );
      if (kept.length !== drawings.length) {
        patch({ drawings: kept });
        if (isHost && sendBattleMapDrawingUpdate) {
          sendBattleMapDrawingUpdate({ drawings: kept });
        }
      }
    } else if (tool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [tool, canvasXY, snapToGrid, hitToken, cellCenter, fog, drawColor, drawings, patch, isHost, sendBattleMapFogUpdate, sendBattleMapDrawingUpdate]);

  const handleMouseMove = useCallback((e) => {
    const { x, y } = canvasXY(e);

    if (draggingToken) {
      const { col, row } = snapToGrid(x - dragOffset.x, y - dragOffset.y);
      setState(prev => ({
        ...prev,
        tokens: prev.tokens.map(t => t.id === draggingToken ? { ...t, col, row } : t),
      }));
    } else if (tool === 'measure' && measureStart) {
      const { col, row } = snapToGrid(x, y);
      setMeasureEnd({ col, row });
    } else if (isDrawing && currentStroke) {
      setCurrentStroke(prev => ({
        ...prev,
        points: [...prev.points, { x, y }],
      }));
    } else if (isPanning && panStart) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      if (bgImage) {
        patch({ bgOffset: { x: bgOffset.x + dx, y: bgOffset.y + dy } });
      }
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggingToken, dragOffset, tool, measureStart, isDrawing, currentStroke, isPanning, panStart, canvasXY, snapToGrid, bgImage, bgOffset, patch]);

  const handleMouseUp = useCallback(() => {
    if (draggingToken) {
      // Broadcast token move to players
      if (isHost && sendBattleMapTokenMove) {
        const moved = tokensRef.current.find(t => t.id === draggingToken);
        if (moved) {
          sendBattleMapTokenMove({ token_id: moved.id, col: moved.col, row: moved.row });
        }
      }
      setDraggingToken(null);
    }
    if (isDrawing && currentStroke) {
      const newDrawings = [...drawings, currentStroke];
      patch({ drawings: newDrawings });
      setCurrentStroke(null);
      setIsDrawing(false);
      // Broadcast drawing update to players
      if (isHost && sendBattleMapDrawingUpdate) {
        sendBattleMapDrawingUpdate({ drawings: newDrawings });
      }
    }
    if (isPanning) { setIsPanning(false); setPanStart(null); }
  }, [draggingToken, isDrawing, currentStroke, isPanning, drawings, patch, isHost, sendBattleMapTokenMove, sendBattleMapDrawingUpdate]);

  /* ── Right-click context menu ── */
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const { x, y } = canvasXY(e);
    const tok = hitToken(x, y);
    if (tok) {
      setContextMenu({ tokenId: tok.id, x: e.clientX, y: e.clientY });
    } else {
      setContextMenu(null);
    }
  }, [canvasXY, hitToken]);

  /* ── Scroll to zoom bg (non-passive to allow preventDefault) ── */
  const bgImageRef = useRef(bgImage);
  const bgScaleRef = useRef(bgScale);
  bgImageRef.current = bgImage;
  bgScaleRef.current = bgScale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e) => {
      if (bgImageRef.current) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newScale = Math.max(0.1, Math.min(5, bgScaleRef.current + delta));
        setState(prev => ({ ...prev, bgScale: newScale }));
      }
    };
    canvas.addEventListener('wheel', handler, { passive: false });
    return () => canvas.removeEventListener('wheel', handler);
  }, []);

  /* ── Add token ── */
  const addToken = useCallback((name, color, size) => {
    const id = uid();
    // Find first empty cell, spiraling outward from center
    let col = Math.floor(gridW / 2), row = Math.floor(gridH / 2);
    const occupied = new Set(tokens.map(t => `${t.col},${t.row}`));
    if (occupied.has(`${col},${row}`)) {
      const maxRadius = Math.max(gridW, gridH);
      let found = false;
      for (let radius = 1; radius <= maxRadius && !found; radius++) {
        for (let dr = -radius; dr <= radius && !found; dr++) {
          for (let dc = -radius; dc <= radius && !found; dc++) {
            if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue; // only perimeter
            const c = Math.floor(gridW / 2) + dc;
            const r = Math.floor(gridH / 2) + dr;
            if (c >= 0 && c < gridW && r >= 0 && r < gridH && !occupied.has(`${c},${r}`)) {
              col = c; row = r; found = true;
            }
          }
        }
      }
    }
    patch({ tokens: [...tokens, { id, name, color, size, col, row, condition: 'none' }] });
  }, [gridW, gridH, tokens, patch]);

  const addPartyPresets = useCallback(() => {
    const newTokens = PARTY_PRESETS.map((p, i) => ({
      id: uid(), name: p.name, color: p.color, size: 'medium',
      col: Math.floor(gridW / 2) - 2 + i, row: Math.floor(gridH / 2), condition: 'none',
    }));
    patch({ tokens: [...tokens, ...newTokens] });
  }, [gridW, gridH, tokens, patch]);

  /* ── Context menu actions ── */
  const ctxToken = contextMenu ? tokens.find(t => t.id === contextMenu.tokenId) : null;

  const removeToken = useCallback((id) => {
    patch({ tokens: tokens.filter(t => t.id !== id) });
    setContextMenu(null);
  }, [tokens, patch]);

  const changeTokenColor = useCallback((id, color) => {
    patch({ tokens: tokens.map(t => t.id === id ? { ...t, color } : t) });
  }, [tokens, patch]);

  const changeTokenSize = useCallback((id, size) => {
    patch({ tokens: tokens.map(t => t.id === id ? { ...t, size } : t) });
  }, [tokens, patch]);

  const changeTokenCondition = useCallback((id, condition) => {
    patch({ tokens: tokens.map(t => t.id === id ? { ...t, condition } : t) });
  }, [tokens, patch]);

  /* ── Background image upload ── */
  const handleBgUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      patch({ bgImage: ev.target.result, bgOffset: { x: 0, y: 0 }, bgScale: 1 });
    };
    reader.readAsDataURL(file);
  }, [patch]);

  /* ── Reset ── */
  const resetAll = useCallback(() => {
    setState(defaultState());
  }, []);

  /* ── Zoom controls ── */
  const zoomIn = () => patch({ cellPx: Math.min(80, cellPx + 4) });
  const zoomOut = () => patch({ cellPx: Math.max(16, cellPx - 4) });

  /* ── Close context menu on outside click ── */
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [contextMenu]);

  /* ── Render ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', fontFamily: 'var(--font-ui)' }}>
      {/* ── Top Toolbar ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 14px',
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        alignItems: 'center',
      }}>
        {/* Tool selection */}
        <TBtn icon={MousePointer} label="Select" active={tool === 'select'} onClick={() => { setTool('select'); setMeasureStart(null); setMeasureEnd(null); }} />
        <TBtn icon={Ruler} label="Measure" active={tool === 'measure'} onClick={() => { setTool('measure'); setMeasureStart(null); setMeasureEnd(null); }} />
        <TBtn icon={Eye} label="Fog of War" active={tool === 'fog'} onClick={() => setTool('fog')} />
        <TBtn icon={Pencil} label="Draw" active={tool === 'draw'} onClick={() => setTool('draw')} />
        <TBtn icon={Eraser} label="Erase" active={tool === 'erase'} onClick={() => setTool('erase')} />
        <TBtn icon={Move} label="Pan Image" active={tool === 'pan'} onClick={() => setTool('pan')} />

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

        {/* Draw color */}
        {tool === 'draw' && (
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {DRAW_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setDrawColor(c)}
                style={{
                  width: 16, height: 16, borderRadius: 3, background: c,
                  border: drawColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}

        {/* Add tokens */}
        <div style={{ position: 'relative' }}>
          <TBtn icon={Plus} label="Add Token" onClick={() => setShowAddToken(!showAddToken)} />
          {showAddToken && (
            <div
              style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 100,
                background: '#0d0d18', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: 12, width: 220,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>New Token</div>
              <input
                type="text"
                placeholder="Name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={20}
                style={{
                  width: '100%', padding: '5px 8px', borderRadius: 5,
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                  color: '#fff', fontSize: 11, fontFamily: 'var(--font-ui)', marginBottom: 6,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 3, marginBottom: 6, flexWrap: 'wrap' }}>
                {TOKEN_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setNewColor(c.hex)}
                    title={c.name}
                    style={{
                      width: 20, height: 20, borderRadius: 4, background: c.hex,
                      border: newColor === c.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <select
                value={newSize}
                onChange={e => setNewSize(e.target.value)}
                style={{
                  width: '100%', padding: '4px 6px', borderRadius: 5,
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                  color: '#fff', fontSize: 11, fontFamily: 'var(--font-ui)', marginBottom: 8,
                  outline: 'none',
                }}
              >
                {Object.keys(SIZE_MAP).map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} ({SIZE_MAP[s]} sq)</option>
                ))}
              </select>
              <button
                onClick={() => { if (newName.trim()) { addToken(newName.trim(), newColor, newSize); setNewName(''); setShowAddToken(false); } }}
                disabled={!newName.trim()}
                style={{
                  width: '100%', padding: '5px 0', borderRadius: 5,
                  background: newName.trim() ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: newName.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontSize: 11, fontFamily: 'var(--font-ui)', cursor: newName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Place Token
              </button>
            </div>
          )}
        </div>

        <TBtn icon={Users} label="Add Party" onClick={addPartyPresets} />

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

        {/* Background upload */}
        <TBtn icon={Image} label="Background" onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgUpload} />
        {bgImage && (
          <TBtn icon={Trash2} label="Remove BG" small onClick={() => patch({ bgImage: null })} />
        )}

        {/* Grid config */}
        <div style={{ position: 'relative' }}>
          <TBtn icon={Grid3X3} onClick={() => setShowGridConfig(!showGridConfig)}>
            <span style={{ fontSize: 10 }}>{gridW}x{gridH}</span>
            <ChevronDown size={10} />
          </TBtn>
          {showGridConfig && (
            <div
              style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 100,
                background: '#0d0d18', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: 12, width: 190,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 600 }}>Grid Settings</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 30 }}>W</label>
                <input type="range" min={10} max={40} value={gridW}
                  onChange={e => patch({ gridW: +e.target.value })}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#fff', width: 20, textAlign: 'right' }}>{gridW}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 30 }}>H</label>
                <input type="range" min={10} max={40} value={gridH}
                  onChange={e => patch({ gridH: +e.target.value })}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#fff', width: 20, textAlign: 'right' }}>{gridH}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <button
                  onClick={() => patch({ hexMode: false })}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: 5, fontSize: 10,
                    background: !hexMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  <Square size={10} /> Square
                </button>
                <button
                  onClick={() => patch({ hexMode: true })}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: 5, fontSize: 10,
                    background: hexMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  <Hexagon size={10} /> Hex
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zoom */}
        <TBtn icon={ZoomOut} small onClick={zoomOut} />
        <TBtn icon={ZoomIn} small onClick={zoomIn} />

        <div style={{ flex: 1 }} />

        {/* Sync to Players (DM only) */}
        {isHost && sendBattleMapSync && (
          <TBtn icon={Radio} label="Sync to Players" small onClick={() => {
            sendBattleMapSync({
              tokens, fog, gridW, gridH, cellPx, hexMode, drawings,
            });
          }} style={{ color: '#c9a84c', borderColor: 'rgba(201,168,76,0.25)' }} />
        )}

        {/* Clear fog */}
        {Object.values(fog).some(Boolean) && (
          <TBtn icon={EyeOff} label="Clear Fog" small onClick={() => {
            patch({ fog: {} });
            if (isHost && sendBattleMapFogUpdate) {
              sendBattleMapFogUpdate({ fog: {} });
            }
          }} />
        )}

        {/* Reset */}
        <TBtn icon={RotateCcw} label="Reset All" small onClick={() => {
          resetAll();
          if (isHost && sendBattleMapClear) {
            sendBattleMapClear();
          }
        }}
          style={{ color: 'rgba(239,68,68,0.7)', borderColor: 'rgba(239,68,68,0.15)' }} />
      </div>

      {/* ── Canvas area ── */}
      <div
        ref={wrapRef}
        style={{
          flex: 1, overflow: 'auto', position: 'relative',
          background: '#04040b',
          cursor: tool === 'pan' ? 'grab' : tool === 'measure' ? 'crosshair' : tool === 'draw' ? 'crosshair' : tool === 'erase' ? 'crosshair' : tool === 'fog' ? 'pointer' : 'default',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: canvasW,
            height: canvasH,
            display: 'block',
            margin: '0 auto',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
        />
      </div>

      {/* ── Right-click context menu ── */}
      {contextMenu && ctxToken && (
        <div
          style={{
            position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 1000,
            background: '#0d0d18', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: 6, minWidth: 170,
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
            {ctxToken.name}
          </div>

          {/* Color change */}
          <div style={{ padding: '4px 10px', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Color</div>
          <div style={{ display: 'flex', gap: 3, padding: '0 10px', marginBottom: 6, flexWrap: 'wrap' }}>
            {TOKEN_COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => { changeTokenColor(ctxToken.id, c.hex); setContextMenu(null); }}
                style={{
                  width: 16, height: 16, borderRadius: 3, background: c.hex,
                  border: ctxToken.color === c.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Size */}
          <div style={{ padding: '4px 10px', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Size</div>
          <div style={{ display: 'flex', gap: 3, padding: '0 10px', marginBottom: 6, flexWrap: 'wrap' }}>
            {Object.keys(SIZE_MAP).map(s => (
              <button
                key={s}
                onClick={() => { changeTokenSize(ctxToken.id, s); setContextMenu(null); }}
                style={{
                  padding: '2px 6px', borderRadius: 4, fontSize: 9,
                  background: ctxToken.size === s ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: ctxToken.size === s ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}
              >
                {s.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Condition */}
          <div style={{ padding: '4px 10px', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Condition</div>
          <div style={{ display: 'flex', gap: 3, padding: '0 10px', marginBottom: 6, flexWrap: 'wrap' }}>
            {Object.entries(CONDITION_COLORS).map(([cond, color]) => (
              <button
                key={cond}
                onClick={() => { changeTokenCondition(ctxToken.id, cond); setContextMenu(null); }}
                title={cond}
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: color === 'transparent' ? 'rgba(255,255,255,0.06)' : color,
                  border: ctxToken.condition === cond ? '2px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer', opacity: color === 'transparent' ? 0.5 : 1,
                }}
              />
            ))}
          </div>

          {/* Remove */}
          <button
            onClick={() => removeToken(ctxToken.id)}
            style={{
              width: '100%', padding: '5px 10px', borderRadius: 5,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
              color: '#ef4444', fontSize: 11, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-ui)',
            }}
          >
            <Trash2 size={12} /> Remove Token
          </button>
        </div>
      )}
    </div>
  );
}
