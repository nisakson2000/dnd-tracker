import { invoke } from '@tauri-apps/api/core';

function send(level, message, context) {
  invoke('frontend_log', {
    level,
    message: String(message),
    context: context ? String(context) : null,
  }).catch(() => {});
}

export const logger = {
  error: (message, context) => send('error', message, context),
  warn: (message, context) => send('warn', message, context),
  info: (message, context) => send('info', message, context),
};

export function installGlobalErrorCapture() {
  const originalError = console.error;
  console.error = (...args) => {
    originalError.apply(console, args);
    const message = args.map(a =>
      a instanceof Error ? `${a.message}\n${a.stack}` : String(a)
    ).join(' ');
    send('error', message, 'console.error');
  };

  window.addEventListener('error', (event) => {
    const msg = event.error
      ? `${event.error.message}\n${event.error.stack}`
      : event.message;
    send('error', msg, `${event.filename}:${event.lineno}:${event.colno}`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error
      ? `${reason.message}\n${reason.stack}`
      : String(reason);
    send('error', `Unhandled Promise rejection: ${msg}`, 'unhandledrejection');
  });
}
