import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

export default function HelpTooltip({ text, size = 14 }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const tooltipWidth = 256;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    // Keep within viewport
    if (left < 8) left = 8;
    if (left + tooltipWidth > window.innerWidth - 8) left = window.innerWidth - tooltipWidth - 8;
    setPos({
      top: rect.top - 8,
      left,
    });
  }, [open]);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="opacity-30 hover:opacity-70 focus:opacity-70 transition-opacity focus:outline-none text-amber-200/40"
        aria-label="Help"
      >
        <HelpCircle size={size} />
      </button>
      {open && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-[9999] w-64 px-3 py-2 text-xs text-amber-100 bg-[#1a1825] border border-gold/30 rounded-lg shadow-xl leading-relaxed"
          style={{
            top: pos.top,
            left: pos.left,
            transform: 'translateY(-100%)',
            pointerEvents: 'auto',
          }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gold/30" />
        </div>,
        document.body
      )}
    </span>
  );
}
