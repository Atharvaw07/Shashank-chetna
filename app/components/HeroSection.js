'use client';

import { useEffect, useRef, useState } from 'react';
import { hydrateVideo } from '../lib/deferredMedia';

export default function HeroSection({ revealed }) {
  const videoRef = useRef(null);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [heroHeight, setHeroHeight] = useState('100vh');

  // Lock height on mobile to prevent address bar recalculation jitter
  useEffect(() => {
    let lastWidth = window.innerWidth;

    const lockHeight = () => {
      setHeroHeight(`${window.innerHeight}px`);
    };

    lockHeight();

    const handleResize = () => {
      // Recalculate only if width changes (e.g. orientation changes or desktop resizing)
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        lockHeight();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle playback exactly like ivorytheme
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !revealed) return;

    hydrateVideo(video);
    video.loop = false;

    const onEnded = () => {
      video.pause();
      setTimeout(() => setScrollVisible(true), 5000);
    };
    video.addEventListener('ended', onEnded);

    const startPlayback = () => {
      video.play().catch(() => {
        setScrollVisible(true);
      });
    };

    let onCanPlay;
    if (video.readyState >= 3) { // HTMLMediaElement.HAVE_FUTURE_DATA
      startPlayback();
    } else {
      onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        startPlayback();
      };
      video.addEventListener('canplay', onCanPlay);
    }

    return () => {
      video.removeEventListener('ended', onEnded);
      if (onCanPlay) video.removeEventListener('canplay', onCanPlay);
    };
  }, [revealed]);

  const scrollToFamily = () => {
    const familySection = document.getElementById('family-section');
    if (familySection) {
      familySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-video-section" style={{ height: heroHeight }}>
      <video
        id="hero-vid"
        ref={videoRef}
        muted
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="deny"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        preload="none"
      >
        <source
          data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/Hero%20(1).mp4"
          type="video/mp4"
        />
      </video>
      <button
        className={`scroll-indicator ${scrollVisible ? 'visible' : ''}`}
        id="hero-scroll-ind"
        onClick={scrollToFamily}
      >
        <span>Scroll Down</span>
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
