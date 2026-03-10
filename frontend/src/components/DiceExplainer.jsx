import { useState, useRef, useEffect } from 'react';

const DICE_INFO = {
  d4: 'Four-sided die (pyramid shape). Range: 1–4. Average: 2.5',
  d6: 'Six-sided die (standard cube). Range: 1–6. Average: 3.5',
  d8: 'Eight-sided die. Range: 1–8. Average: 4.5',
  d10: 'Ten-sided die. Range: 1–10. Average: 5.5',
  d12: 'Twelve-sided die. Range: 1–12. Average: 6.5',
  d20: 'Twenty-sided die — the most important die in D&D. Used for attacks, saves, and skill checks. Range: 1–20',
  d100: 'Percentile die (two d10s). Range: 1–100. Used for random tables',
};

function parseDice(notation) {
  const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
  if (!match) return null;
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const bonus = parseInt(match[3] || '0');
  const dieKey = `d${sides}`;
  const avg = count * ((sides + 1) / 2) + bonus;
  return { count, sides, bonus, dieKey, avg: Math.round(avg * 10) / 10, info: DICE_INFO[dieKey] };
}

export default function DiceExplainer({ notation }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const parsed = parseDice(notation);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!parsed) return <span className="font-mono text-amber-200/70">{notation}</span>;

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="font-mono text-amber-300/80 hover:text-amber-200 underline decoration-dotted underline-offset-2 cursor-help transition-colors"
      >
        {notation}
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs text-amber-100 bg-[#1a1825] border border-gold/30 rounded-lg shadow-xl leading-relaxed">
          <div className="font-semibold text-amber-200 mb-1">{notation}</div>
          <div className="text-amber-100/70 mb-1">
            Roll {parsed.count === 1 ? 'one' : parsed.count} {parsed.dieKey}
            {parsed.count > 1 ? 's' : ''}
            {parsed.bonus !== 0 ? ` ${parsed.bonus > 0 ? '+' : ''}${parsed.bonus}` : ''}
          </div>
          <div className="text-amber-100/50">Average: {parsed.avg}</div>
          {parsed.info && <div className="text-amber-100/40 mt-1 border-t border-gold/10 pt-1">{parsed.info}</div>}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gold/30" />
        </div>
      )}
    </span>
  );
}
