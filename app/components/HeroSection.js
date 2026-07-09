'use client';

import { useEffect, useRef, useState } from 'react';

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

  // Setup basic video properties and timers on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS Safari: set src directly on video element — some iOS versions don't
    // reliably pick up the src from a <source> child element, especially when
    // hidden. Do this on mount so it preloads during the entry gate!
    const source = video.querySelector('source');
    if (source && source.src && !video.src) {
      video.src = source.src;
      video.load();
    }

    const handleEnded = () => {
      video.pause();
      setTimeout(() => {
        setScrollVisible(true);
      }, 5000); // 5 seconds after video done
    };

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setTimeout(() => {
          setScrollVisible(true);
        }, video.duration * 1000 + 5000);
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Handle playback once entry gate is opened
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !revealed) return;

    const tryPlay = () => {
      // Wrap in try/catch — iOS throws DOMException if seek happens before
      // the video has loaded enough data (readyState < HAVE_METADATA)
      if (video.currentTime === 0) {
        try { video.currentTime = 0.001; } catch (_) {}
      }
      video.play().catch(() => {
        setScrollVisible(true);
      });
    };

    // Wait for canplay OR loadeddata (iOS fires loadeddata before canplay).
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
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
        preload="auto"
      >
        <source
          src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/Hero%20(1).mp4"
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
