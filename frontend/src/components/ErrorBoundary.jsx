import { Component, forwardRef } from 'react';

const ERROR_LOG_KEY = 'codex-error-log';
const STATE_BACKUP_KEY = 'codex-error-boundary-state-backup';
const MAX_LOGGED_ERRORS = 10;

/** Save an error entry to the persistent error log in localStorage */
function logErrorToStorage(label, error, errorInfo) {
  try {
    const existing = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
    const entry = {
      label: label || 'Unknown',
      message: error?.message || String(error),
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    const updated = [entry, ...existing].slice(0, MAX_LOGGED_ERRORS);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be full or unavailable — silently ignore
  }
}

/** Read the error log from localStorage */
export function getErrorLog() {
  try {
    return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Clear the error log */
export function clearErrorLog() {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
  } catch {
    // ignore
  }
}

/** Save a state snapshot to localStorage for crash recovery */
function saveStateBackup(label, snapshot) {
  try {
    const backups = JSON.parse(localStorage.getItem(STATE_BACKUP_KEY) || '{}');
    backups[label || 'default'] = {
      snapshot,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STATE_BACKUP_KEY, JSON.stringify(backups));
  } catch {
    // ignore
  }
}

/** Retrieve a state backup for crash recovery */
export function getStateBackup(label) {
  try {
    const backups = JSON.parse(localStorage.getItem(STATE_BACKUP_KEY) || '{}');
    return backups[label || 'default'] || null;
  } catch {
    return null;
  }
}

/** Clear a specific state backup */
export function clearStateBackup(label) {
  try {
    const backups = JSON.parse(localStorage.getItem(STATE_BACKUP_KEY) || '{}');
    delete backups[label || 'default'];
    localStorage.setItem(STATE_BACKUP_KEY, JSON.stringify(backups));
  } catch {
    // ignore
  }
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const label = this.props.label || 'Component';
    console.error(`[ErrorBoundary] ${label} crashed:`, error, errorInfo);

    // Log error to persistent storage
    logErrorToStorage(label, error, errorInfo);

    // Save state backup for crash recovery
    if (this.props.stateSnapshot) {
      saveStateBackup(label, this.props.stateSnapshot);
    }

    this.setState({ errorInfo });
  }

  handleRetry = () => {
    // If custom onRetry provided, call it first
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    this.setState({ hasError: false, error: null, errorInfo: null, copied: false });
  };

  handleCopyReport = async () => {
    const { error, errorInfo } = this.state;
    const label = this.props.label || 'Component';
    const report = [
      `--- The Codex Error Report ---`,
      `Component: ${label}`,
      `Time: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `Error: ${error?.message || String(error)}`,
      ``,
      `Stack Trace:`,
      error?.stack || '(none)',
      ``,
      `Component Stack:`,
      errorInfo?.componentStack || '(none)',
      ``,
      `User Agent: ${navigator.userAgent}`,
      `Screen: ${screen.width}x${screen.height} @${window.devicePixelRatio}x`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // Fallback: select a text area
      const textarea = document.createElement('textarea');
      textarea.value = report;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
          textAlign: 'center',
          minHeight: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <div style={{
            fontSize: 13,
            color: 'rgba(239,68,68,0.8)',
            fontFamily: 'var(--font-heading, Cinzel, serif)',
            fontWeight: 600,
          }}>
            {this.props.label || 'Panel'} encountered an error
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
            maxWidth: 300,
          }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
              }}
            >
              Retry
            </button>
            <button
              onClick={this.handleCopyReport}
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                background: 'rgba(168,85,247,0.12)',
                border: '1px solid rgba(168,85,247,0.25)',
                color: this.state.copied ? '#86efac' : '#c4b5fd',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
                transition: 'color 0.2s',
              }}
            >
              {this.state.copied ? 'Copied!' : 'Report Issue'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Higher-order component wrapper for ErrorBoundary.
 * Usage: export default withErrorBoundary(MyComponent, 'MyComponent');
 */
export function withErrorBoundary(WrappedComponent, label) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Wrapped = forwardRef((props, ref) => (
    <ErrorBoundary label={label || displayName}>
      <WrappedComponent ref={ref} {...props} />
    </ErrorBoundary>
  ));

  Wrapped.displayName = `withErrorBoundary(${displayName})`;
  return Wrapped;
}
