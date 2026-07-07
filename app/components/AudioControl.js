'use client';

import { useEffect } from 'react';

export default function AudioControl({ audioRef, musicWanted, setMusicWanted }) {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicWanted) {
      audio.muted = false;
      audio.play().catch(() => {
        // Suppress initial block warnings from browsers
      });
    } else {
      audio.pause();
    }
  }, [musicWanted, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (musicWanted) audio.pause();
      } else {
        if (musicWanted) audio.play().catch(() => {});
      }
    };

    const handleFocus = () => {
      if (musicWanted) audio.play().catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handleFocus);
    };
  }, [musicWanted, audioRef]);

  const toggleAudio = () => {
    setMusicWanted(!musicWanted);
  };

  return (
    <button id="audio-btn" title="Toggle music" onClick={toggleAudio}>
      {musicWanted ? (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ width: '20px', height: '20px', color: 'var(--teal-dark)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ) : (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ width: '20px', height: '20px', color: 'var(--teal-dark)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      )}
    </button>
  );
}
