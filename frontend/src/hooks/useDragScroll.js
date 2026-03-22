import { useEffect, useRef, useCallback } from 'react';

/**
 * Enables click-and-drag scrolling on a scrollable element.
 * Pass an existing ref to the scrollable container.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useDragScroll(ref);
 *   <div ref={ref} style={{ overflowY: 'auto' }}>...</div>
 */
export default function useDragScroll(elRef) {
  const state = useRef({ isDown: false, startY: 0, scrollTop: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const tag = e.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
    if (e.target.closest('button, a, input, textarea, select, [role="button"], [contenteditable]')) return;

    const el = elRef.current;
    if (!el) return;

    state.current.isDown = true;
    state.current.startY = e.pageY;
    state.current.scrollTop = el.scrollTop;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, [elRef]);

  const onMouseMove = useCallback((e) => {
    if (!state.current.isDown) return;
    const el = elRef.current;
    if (!el) return;

    const dy = e.pageY - state.current.startY;
    el.scrollTop = state.current.scrollTop - dy;
  }, [elRef]);

  const onMouseUp = useCallback(() => {
    state.current.isDown = false;
    const el = elRef.current;
    if (el) {
      el.style.cursor = '';
      el.style.userSelect = '';
    }
  }, [elRef]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [elRef, onMouseDown, onMouseMove, onMouseUp]);
}
