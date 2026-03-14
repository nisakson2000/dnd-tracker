import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke, Channel } from '@tauri-apps/api/core';

const SETUP_KEY = 'codex-ollama-setup-done';
const MODELS = ['llama3.2', 'phi3.5'];

/**
 * Auto-setup hook for Ollama on first launch.
 * Runs once per install: detects → installs → starts → pulls models.
 * Returns status for UI display.
 */
export function useOllamaAutoSetup() {
  const [stage, setStage] = useState('idle'); // idle | checking | installing | starting | pulling | ready | error | skipped
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0); // 0-100
  const [error, setError] = useState(null);
  const running = useRef(false);

  const runSetup = useCallback(async () => {
    if (running.current) return;
    running.current = true;

    try {
      // Check if already set up
      const alreadyDone = localStorage.getItem(SETUP_KEY);

      setStage('checking');
      setMessage('Checking AI setup...');

      const status = await invoke('ollama_setup_status');

      // If running with models, mark done
      if (status.running) {
        const hasAll = MODELS.every(m => (status.models || []).some(im => im.startsWith(m)));
        if (hasAll) {
          localStorage.setItem(SETUP_KEY, 'true');
          setStage('ready');
          setMessage('');
          return;
        }
      }

      // If already done setup before and Ollama exists, just try to start + pull missing
      if (alreadyDone && status.installed) {
        if (!status.running) {
          setStage('starting');
          setMessage('Starting Ollama...');
          try {
            await invoke('ollama_start');
            await waitForOllama();
          } catch {
            // Ollama might already be starting up from system tray
            await waitForOllama();
          }
        }
        await pullMissingModels(status.models || []);
        setStage('ready');
        return;
      }

      // If Ollama is installed but not running, start it
      if (status.installed && !status.running) {
        setStage('starting');
        setMessage('Starting Ollama...');
        try {
          await invoke('ollama_start');
        } catch { /* may already be starting */ }
        await waitForOllama();
        await pullMissingModels([]);
        localStorage.setItem(SETUP_KEY, 'true');
        setStage('ready');
        return;
      }

      // If Ollama is running but missing models
      if (status.running) {
        await pullMissingModels(status.models || []);
        localStorage.setItem(SETUP_KEY, 'true');
        setStage('ready');
        return;
      }

      // Not installed — auto-install
      setStage('installing');
      setMessage('Downloading & installing Ollama...');
      setProgress(0);

      const channel = new Channel();
      channel.onmessage = (p) => {
        setMessage(p.stage);
        setProgress(p.percent);
      };

      await invoke('ollama_auto_install', { onProgress: channel });

      // Wait for Ollama to be available after install
      setStage('starting');
      setMessage('Starting Ollama...');
      await waitForOllama(15); // give more time after fresh install

      // Pull models
      await pullMissingModels([]);

      localStorage.setItem(SETUP_KEY, 'true');
      setStage('ready');
      setMessage('AI ready!');
    } catch (err) {
      console.error('[ollama-setup]', err);
      setStage('error');
      setError(String(err));
      setMessage(`Setup failed: ${String(err).slice(0, 100)}`);
    } finally {
      running.current = false;
    }
  }, []);

  async function waitForOllama(maxRetries = 10) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const s = await invoke('ollama_setup_status');
        if (s.running) return;
      } catch { /* not ready yet */ }
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  async function pullMissingModels(installedModels) {
    for (const model of MODELS) {
      const hasIt = installedModels.some(m => m.startsWith(model));
      if (hasIt) continue;

      setStage('pulling');
      setMessage(`Downloading ${model} model...`);
      setProgress(0);

      const channel = new Channel();
      channel.onmessage = (p) => {
        if (p.total && p.completed) {
          const pct = Math.round((p.completed / p.total) * 100);
          setProgress(pct);
          setMessage(`Downloading ${model}: ${pct}%`);
        } else if (p.status) {
          setMessage(`${model}: ${p.status}`);
        }
      };

      try {
        await invoke('ollama_pull', { model, onProgress: channel });
      } catch (err) {
        console.error(`[ollama-setup] Failed to pull ${model}:`, err);
        // Continue with other models even if one fails
      }
    }
  }

  // Run on mount
  useEffect(() => { runSetup(); }, [runSetup]);

  return { stage, message, progress, error, retry: runSetup };
}
