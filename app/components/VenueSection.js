'use client';

import { useEffect, useRef } from 'react';

export default function VenueSection({ lang }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 2) {
      handleCanPlay();
    }

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (video.readyState >= 2) {
                video.play().catch(() => {});
              }
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(video);
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (observer) {
        observer.unobserve(video);
      }
    };
  }, []);

  return (
    <section id="venue-section" className="reveal tc">
      <span className="sec-label">
        {lang === 'hi' ? 'विवाह स्थल' : 'The Wedding Destination'}
      </span>
      <h2 className="sec-heading">
        {lang === 'hi' ? 'जहाँ शुरू होगा एक नया सफ़र' : 'Where Forever Begins'}
      </h2>
      <div className="venue-wrap">
        <div className="venue-img-box">
          <video
            id="venue-video"
            ref={videoRef}
            muted
            playsInline
            webkit-playsinline="true"
            loop
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            preload="none"
          >
            <source
              data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/July_Shashank%20%26%20Chetna%20-%20December_Venue%20(1)%20(1).mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.3rem',
            color: 'var(--teal-dark)',
            marginBottom: '.5rem',
            fontWeight: 600,
          }}
        >
          DLS Divine River Resort and Spa
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            color: 'var(--text-mid)',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          Rishikesh, Uttarakhand
        </p>
        <a
          href="https://maps.google.com/?q=DLS+Divine+River+Resort+and+Spa+Mohan+Chatti+Rishikesh"
          target="_blank"
          rel="noopener noreferrer"
          className="maps-btn"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>{lang === 'hi' ? 'नक्शे पर देखें' : 'View on Maps'}</span>
        </a>
      </div>
    </section>
  );
}
