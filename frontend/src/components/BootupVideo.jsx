import { useState, useRef } from 'react';

/**
 * Full-screen bootup video that plays once on app launch.
 * Click anywhere or wait for video to end to dismiss.
 */
export default function BootupVideo({ onDone }) {
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);

  const dismiss = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => onDone(), 600);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      <video
        ref={videoRef}
        src="/bootup.mp4"
        autoPlay
        playsInline
        onEnded={dismiss}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          background: '#000',
        }}
      />
    </div>
  );
}
