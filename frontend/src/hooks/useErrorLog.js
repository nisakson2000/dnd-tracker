import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_ERRORS = 200;

/* ─── Session context (module-level, shared across all consumers) ─── */
let _sessionContext = {
  section: null,
  characterId: null,
  characterName: null,
  characterClass: null,
  characterLevel: null,
  characterRace: null,
};

export function setErrorContext(patch) {
  Object.assign(_sessionContext, patch);
}

/* ─── Rolling error count this session ─── */
let _sessionErrorCount = 0;

/* ─── Duplicate suppression ─── */
const DEDUP_WINDOW_MS = 60_000;
const _fingerprints = new Map(); // fingerprint -> { count, firstSeen, lastSeen }

function normalizeMessage(msg) {
  if (!msg) return '';
  return msg
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z?/g, '<TIMESTAMP>')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<UUID>')
    .replace(/\b\d{10,}\b/g, '<ID>')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeFingerprint(entry) {
  return `${entry.type}::${normalizeMessage(entry.message)}`;
}

/* ─── Console noise patterns ─── */
const NOISE_PATTERNS = [
  /Each child in a list should have a unique "key" prop/,
  /Warning: React does not recognize the `\w+` prop/,
  /Warning: validateDOMNesting/,
  /Warning: Unknown prop `\w+`/,
  /Download the React DevTools/,
  /Warning: Can't perform a React state update on an unmounted component/,
  /Warning: Cannot update a component/,
];

function isNoise(msg) {
  return NOISE_PATTERNS.some((pat) => pat.test(msg));
}

/* ─── Global console.error interceptor (installed once) ─── */
let _interceptorInstalled = false;
let _pushErrorGlobal = null; // will be set by first hook instance

const _origConsoleError = console.error;

function installConsoleInterceptor() {
  if (_interceptorInstalled) return;
  _interceptorInstalled = true;

  console.error = (...args) => {
    _origConsoleError.apply(console, args);

    if (!_pushErrorGlobal) return;

    // Build message from args
    const msg = args
      .map((a) => {
        if (a instanceof Error) return a.message;
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a); } catch { return String(a); }
      })
      .join(' ');

    const errorObj = args.find((a) => a instanceof Error);
    const type = isNoise(msg) ? 'react_warning' : 'console_error';

    _pushErrorGlobal({
      type,
      source: 'console.error',
      message: msg,
      stack: errorObj?.stack || '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: { ..._sessionContext },
      screen: {
        width: screen.width,
        height: screen.height,
        dpr: window.devicePixelRatio,
      },
      sessionErrorIndex: ++_sessionErrorCount,
    });
  };
}

/**
 * Global error catcher — captures unhandled errors and promise rejections,
 * plus console.error calls. Returns a log array and helpers.
 */
export function useErrorLog() {
  const [errors, setErrors] = useState([]);
  const errorsRef = useRef([]);

  const pushError = useCallback((entry) => {
    // ── Duplicate suppression ──
    const fp = makeFingerprint(entry);
    const now = Date.now();
    const existing = _fingerprints.get(fp);
    if (existing && now - existing.lastSeen < DEDUP_WINDOW_MS) {
      existing.count += 1;
      existing.lastSeen = now;
      // Update the first matching error in the list with new count
      errorsRef.current = errorsRef.current.map((e) => {
        if (e._fingerprint === fp) {
          return {
            ...e,
            _dupCount: existing.count,
            _dupFirstSeen: existing.firstSeen,
            _dupLastSeen: now,
          };
        }
        return e;
      });
      setErrors([...errorsRef.current]);
      return null;
    }

    // New unique error
    _fingerprints.set(fp, { count: 1, firstSeen: now, lastSeen: now });

    const item = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      _fingerprint: fp,
      _dupCount: 1,
      _dupFirstSeen: now,
      _dupLastSeen: now,
      ...entry,
    };
    errorsRef.current = [item, ...errorsRef.current].slice(0, MAX_ERRORS);
    setErrors([...errorsRef.current]);
    return item;
  }, []);

  const clearErrors = useCallback(() => {
    errorsRef.current = [];
    _fingerprints.clear();
    setErrors([]);
  }, []);

  // Register global pushError so console interceptor can use it
  useEffect(() => {
    _pushErrorGlobal = pushError;
    installConsoleInterceptor();
  }, [pushError]);

  // Window error & unhandled rejection handlers
  useEffect(() => {
    const handleError = (event) => {
      _sessionErrorCount++;
      pushError({
        type: 'error',
        source: 'window.onerror',
        message: event.message || 'Unknown error',
        filename: event.filename || '',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        stack: event.error?.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: { ..._sessionContext },
        screen: {
          width: screen.width,
          height: screen.height,
          dpr: window.devicePixelRatio,
        },
        sessionErrorIndex: _sessionErrorCount,
      });
    };

    const handleRejection = (event) => {
      _sessionErrorCount++;
      const reason = event.reason;
      pushError({
        type: 'unhandled_rejection',
        source: 'unhandledrejection',
        message: reason?.message || String(reason) || 'Unhandled promise rejection',
        stack: reason?.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: { ..._sessionContext },
        screen: {
          width: screen.width,
          height: screen.height,
          dpr: window.devicePixelRatio,
        },
        sessionErrorIndex: _sessionErrorCount,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pushError]);

  return { errors, pushError, clearErrors };
}
