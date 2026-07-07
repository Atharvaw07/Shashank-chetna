'use client';

import { useEffect, useRef } from 'react';

export default function EventsSection({ lang }) {
  const videoRefs = useRef([]);
  const blankSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

  useEffect(() => {
    const activeVideos = videoRefs.current.filter(Boolean);
    if (activeVideos.length === 0) return;

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const video = e.target;
            if (e.isIntersecting) {
              if (video.readyState >= 2) {
                video.play().catch(() => {});
              } else {
                const playOnReady = () => {
                  video.play().catch(() => {});
                  video.removeEventListener('canplay', playOnReady);
                };
                video.addEventListener('canplay', playOnReady);
              }
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1 }
      );

      activeVideos.forEach((v) => observer.observe(v));
    } else {
      activeVideos.forEach((v) => {
        if (v.readyState >= 2) {
          v.play().catch(() => {});
        } else {
          v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true });
        }
      });
    }

    return () => {
      if (observer) {
        activeVideos.forEach((v) => observer.unobserve(v));
      }
    };
  }, []);

  return (
    <section id="events-section">
      <div className="tc reveal" style={{ marginBottom: '1rem' }}>
        <span className="sec-label">
          {lang === 'hi' ? 'उत्सव का आग़ाज़' : 'The Celebrations Unfold'}
        </span>
        <h2 className="sec-heading">
          {lang === 'hi' ? 'पावन रस्में' : 'Sacred Ceremonies'}
        </h2>
      </div>

      {/* DAY 1 */}
      <h3 className="day-header teal-day reveal">
        {lang === 'hi'
          ? 'पहला दिन  ·  04 दिसंबर 2026  ·  शुक्रवार'
          : 'Day 1  ·  December 04, 2026  ·  Friday'}
      </h3>

      {/* Event 1 — Haldi & Mehndi */}
      <div className="event-block reveal">
        <div className="evt-video">
          <img
            data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/haldi.avif"
            src={blankSvg}
            alt="Haldi & Mehndi"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1.25rem' }}
          />
        </div>
        <div className="evt-card">
          <div className="evt-info">
            <span className="evt-name">
              {lang === 'hi' ? 'हल्दी & मेहंदी रस्म' : 'Haldi & Mehndi Ceremony'}
            </span>
            <span className="evt-tagline">
              {lang === 'hi'
                ? 'हल्दी की खुशबू और मेहंदी की रंगत — उत्सव का आग़ाज़ हो!'
                : 'Drenched in turmeric yellow, adorned in henna green — let the celebrations begin!'}
            </span>
            <span className="evt-time">
              {lang === 'hi' ? 'सुबह 11:00 बजे से' : '11:00 AM onwards'}
            </span>
          </div>
        </div>
      </div>

      {/* Event 2 — Engagement & Sangeet */}
      <div className="event-block reveal">
        <div className="evt-video">
          <video
            ref={(el) => (videoRefs.current[0] = el)}
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            preload="none"
          >
            <source
              data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Events/Best%20Event%20Cards%20-%20Invite%20Vibes%20%20(3).mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="evt-card teal">
          <div className="evt-info">
            <span className="evt-name">
              {lang === 'hi' ? 'सगाई & संगीत' : 'Ring Ceremony & Sangeet'}
            </span>
            <span className="evt-tagline">
              {lang === 'hi'
                ? 'दो अंगूठियाँ, एक वादा और सितारों तले नृत्य की रात।'
                : 'Two rings, one promise, and a night of dance and celebration under the stars.'}
            </span>
            <span className="evt-time">
              {lang === 'hi' ? 'शाम 7:30 बजे से' : '7:30 PM onwards'}
            </span>
          </div>
        </div>
      </div>

      {/* DAY 2 */}
      <h3 className="day-header teal-day reveal" style={{ marginTop: '4rem' }}>
        {lang === 'hi'
          ? 'दूसरा दिन  ·  05amp; दिसंबर 2026  ·  शनिवार'
          : 'Day 2  ·  December 05, 2026  ·  Saturday'}
      </h3>

      {/* Event 3 — Baarat Procession */}
      <div className="event-block reveal">
        <div className="evt-video">
          <img
            data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/bharat.avif"
            src={blankSvg}
            alt="Baarat Procession"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1.25rem' }}
          />
        </div>
        <div className="evt-card teal">
          <div className="evt-info">
            <span className="evt-name">
              {lang === 'hi' ? 'बारात' : 'Baarat Procession'}
            </span>
            <span className="evt-tagline">
              {lang === 'hi' ? 'ढोल बजाओ, दूल्हा आ रहा है!' : 'Turn up the dhol, the groom is on his way!'}
            </span>
            <span className="evt-time">
              {lang === 'hi' ? 'सुबह 11:00 बजे से' : '11:00 AM onwards'}
            </span>
          </div>
        </div>
      </div>

      {/* Event 4 — Wedding Ceremony */}
      <div className="event-block reveal" style={{ marginTop: '2rem' }}>
        <div className="evt-video">
          <video
            ref={(el) => (videoRefs.current[1] = el)}
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            preload="none"
          >
            <source
              data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/wedding.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div
          className="evt-card teal"
          style={{
            border: '2px solid var(--gold)',
            boxShadow: 'var(--shadow), 0 0 0 4px rgba(201, 168, 76, 0.12)',
          }}
        >
          <div className="evt-info" style={{ padding: '2rem' }}>
            <span
              className="evt-name"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 3rem)', color: 'var(--gold)' }}
            >
              {lang === 'hi' ? 'विवाह संस्कार' : 'Wedding Ceremony'}
            </span>
            {lang === 'hi' ? (
              <span
                className="evt-tagline"
                style={{ fontSize: '1.05rem' }}
                dangerouslySetInnerHTML={{
                  __html: `"सप्तपदी साक्षी, प्रेम अनंत।"<br><em style="font-size: .9rem; color: var(--text-mid)">सात पवित्र फेरे, गंगा की साक्षी, अनंत प्रेम।</em>`,
                }}
              />
            ) : (
              <span
                className="evt-tagline"
                style={{ fontSize: '1.05rem' }}
                dangerouslySetInnerHTML={{
                  __html: `"सप्तपदी साक्षी, प्रेम अनंत।"<br><em style="font-size: .9rem; color: var(--text-mid)">Seven sacred steps around the holy fire, with the Ganga as our witness.</em>`,
                }}
              />
            )}
            <span
              className="evt-time"
              style={{ color: 'var(--gold)', fontSize: '.75rem', letterSpacing: '.25em' }}
            >
              {lang === 'hi' ? 'दोपहर 1:30 बजे से' : '1:30 PM onwards'}
            </span>
          </div>
        </div>
      </div>

      {/* Event 5 — Reception */}
      <div className="event-block reveal" style={{ marginTop: '2rem' }}>
        <div className="evt-video">
          <img
            data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/reception.avif"
            src={blankSvg}
            alt="Reception"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1.25rem' }}
          />
        </div>
        <div className="evt-card">
          <div className="evt-info">
            <span className="evt-name" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)' }}>
              {lang === 'hi' ? 'विवाह स्वागत समारोह' : 'Wedding Reception'}
            </span>
            <span className="evt-tagline">
              {lang === 'hi'
                ? 'पति-पत्नी के रूप में पहली शाम — प्रेम, हँसी और दावत के साथ।'
                : 'Celebrate our first evening as husband and wife with love, laughter, and dinner.'}
            </span>
            <span className="evt-time">
              {lang === 'hi' ? 'शाम 7:30 बजे से' : '7:30 PM onwards'}
            </span>
          </div>
        </div>
      </div>

      {/* DAY 3 */}
      <h3 className="day-header reveal" style={{ marginTop: '4rem' }}>
        {lang === 'hi'
          ? 'तीसरा दिन  ·  06 दिसंबर 2026  ·  रविवार'
          : 'Day 3  ·  December 06, 2026  ·  Sunday'}
      </h3>

      {/* Event 6 — Vidaai */}
      <div className="event-block reveal">
        <div className="evt-video">
          <img
            data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/compressed/vidhai.avif"
            src={blankSvg}
            alt="Vidaai"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1.25rem' }}
          />
        </div>
        <div className="evt-card">
          <div className="evt-info">
            <span className="evt-name">{lang === 'hi' ? 'विदाई' : 'Vidaai'}</span>
            <span className="evt-tagline">
              {lang === 'hi'
                ? 'बेटी की विदाई — एक नये जीवन की मीठी-कड़वी शुरुआत।'
                : 'She leaves as a daughter and begins a new journey as a wife.'}
            </span>
            <span className="evt-time">{lang === 'hi' ? 'सुबह 9:00 बजे' : '9:00 AM'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
