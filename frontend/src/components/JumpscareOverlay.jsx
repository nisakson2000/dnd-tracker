import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * JumpscareOverlay — Easter egg that shows a popup image
 * at random intervals, playing Hava Nagila that continues where it left off.
 *
 * Image: /jumpscare.jpg  (drop any image here to swap it)
 * Audio: /hava-nagila.mp3
 */
export default function JumpscareOverlay() {
  const [visible, setVisible] = useState(false);
  const audioRef = useRef(null);
  const audioReady = useRef(false);
  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Create audio element once, unlock on first user interaction
  useEffect(() => {
    const audio = new Audio();
    audio.src = '/hava-nagila.mp3';
    audio.loop = true;
    audio.volume = 1.0;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Browsers block autoplay until user interacts — unlock audio on first click
    const unlock = () => {
      if (!audioReady.current && audioRef.current) {
        // Play and immediately pause to unlock the audio context
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioReady.current = true;
        }).catch(() => {});
      }
    };

    document.addEventListener('click', unlock, { once: false });
    document.addEventListener('keydown', unlock, { once: false });

    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const trigger = useCallback(() => {
    setVisible(true);
    // Play audio from where it left off
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    // Hide after 2 seconds
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      if (audioRef.current) {
        audioRef.current.pause();
        // Don't reset currentTime — song continues next time
      }
    }, 2000);
  }, []);

  // Random timer: fires every 3-15 minutes
  useEffect(() => {
    const scheduleNext = () => {
      const delay = (Math.random() * 12 + 3) * 60 * 1000;
      timerRef.current = setTimeout(() => {
        trigger();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [trigger]);

  // Random button click trigger — 25% chance on any button click
  useEffect(() => {
    const handleClick = (e) => {
      if (visible) return;
      const isButton = e.target.tagName === 'BUTTON' || e.target.closest('button');
      if (isButton && Math.random() < 0.25) {
        trigger();
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [visible, trigger]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.9)',
        animation: 'jumpscare-flash 0.15s ease-out',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <img
          src="/jumpscare.jpg"
          alt=""
          style={{
            width: '70vw',
            height: '65vh',
            objectFit: 'contain',
            animation: 'jumpscare-shake 0.3s ease-in-out infinite',
            borderRadius: '12px',
            boxShadow: '0 0 100px rgba(255,0,0,0.5)',
          }}
        />
        <div style={{
          fontSize: '48px',
          fontWeight: 900,
          color: '#ff0000',
          textShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)',
          fontFamily: 'Impact, Arial Black, sans-serif',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          animation: 'jumpscare-shake 0.3s ease-in-out infinite',
        }}>
          YOU HAVE BEEN FENTANYAHU
        </div>
      </div>
      <style>{`
        @keyframes jumpscare-flash {
          0% { opacity: 0; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes jumpscare-shake {
          0%, 100% { transform: rotate(-1deg) scale(1.02); }
          50% { transform: rotate(1deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
