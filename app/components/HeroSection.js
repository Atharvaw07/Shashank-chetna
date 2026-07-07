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

    const handleEnded = () => {
      video.pause();
      setScrollVisible(true);
    };

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setTimeout(() => {
          setScrollVisible(true);
        }, video.duration * 1000 + 200);
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Handle playback and observation once entry gate is opened
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !revealed) return;

    if (video.currentTime === 0) {
      video.currentTime = 0.001;
    }

    // Call play directly to ensure mobile browsers start downloading/rendering
    video.play().catch(() => {
      setScrollVisible(true);
    });

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (video.paused && video.currentTime < video.duration - 0.1) {
                video.play().catch(() => {});
              }
            } else {
              if (!video.paused) {
                video.pause();
              }
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(video);
    }

    return () => {
      if (observer) {
        observer.unobserve(video);
      }
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
