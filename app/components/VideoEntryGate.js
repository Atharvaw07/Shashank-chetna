'use client';

import { useEffect, useState, useRef } from 'react';

export default function VideoEntryGate({ onPlayStart, onReveal }) {
  const [bufferReady, setBufferReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const gateRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setBufferReady(true);
      // Seek to first frame so the video (envelope) is shown in the background
      if (video.currentTime === 0) {
        video.currentTime = 0.001;
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);

    // Trigger load
    video.load();

    if (video.readyState >= 2) {
      handleCanPlay();
    }

    // Safety timeout in case load takes too long
    const safety = setTimeout(() => {
      setBufferReady(true);
    }, 4000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      clearTimeout(safety);
    };
  }, []);

  const triggerReveal = () => {
    if (revealed) return;
    setRevealed(true);

    if (gateRef.current) {
      gateRef.current.classList.add('fade-out');
    }

    // Delay unmounting to let the 1.5s CSS opacity fade-out complete smoothly
    setTimeout(() => {
      onReveal();
    }, 1500);
  };

  const handleGateClick = async () => {
    if (!bufferReady || revealed) return;

    const video = videoRef.current;
    if (!video) {
      triggerReveal();
      return;
    }

    if (!playing) {
      setPlaying(true);
      onPlayStart(); // Play the background audio

      // Play the entry envelope video unmuted
      video.muted = false;
      video.currentTime = 0;
      try {
        await video.play();
      } catch (err) {
        // Fallback to muted autoplay if unmuted is blocked by browser rules
        video.muted = true;
        video.play().catch(() => { });
      }
    } else {
      // Second tap while playing skips the video and reveals the main content
      triggerReveal();
    }
  };

  return (
    <div
      id="entry-gate"
      ref={gateRef}
      className={bufferReady ? 'entry-gate--ready' : 'entry-gate--buffering'}
      onClick={handleGateClick}
      style={{
        cursor: bufferReady ? 'pointer' : 'wait',
        transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      {/* Background Video (acting as the card front / envelope visual) */}
      <video
        id="entry-video"
        ref={videoRef}
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onEnded={triggerReveal}
        onError={triggerReveal}
        style={{
          opacity: bufferReady ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <source
          src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/Best%20Entry%20Video%20(9)%20(1).mp4"
          type="video/mp4"
        />
      </video>

      {/* Loading Overlay */}
      <div id="entry-loader" className={bufferReady ? 'hide' : ''}>
        <div className="loader-ring"></div>
        <div className="loader-names">Shashank & Chetna</div>
        <div className="loader-sub">loading your invitation</div>
      </div>
    </div>
  );
}
