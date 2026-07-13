'use client';

import { useEffect, useRef } from 'react';

export default function FooterSection({ lang }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const sec = sectionRef.current;
    if (!cv || !sec) return;

    const ctx = cv.getContext('2d');
    let W = 0;
    let H = 0;
    let diyas = [];
    let stars = [];
    let streaks = [];
    let running = false;
    let rafId = null;
    let initialized = false;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initElements(dpr) {
      const count = Math.min(16, Math.max(9, Math.floor(W / dpr / 60)));
      diyas = [];
      for (let i = 0; i < count; i++) {
        diyas.push({
          x: Math.random() * W,
          y: H * 0.6 + Math.random() * H * 0.34,
          r: (5 + Math.random() * 5) * dpr,
          vx: (0.04 + Math.random() * 0.1) * dpr * (Math.random() < 0.5 ? -1 : 1),
          ph: Math.random() * Math.PI * 2,
          fl: 0.7 + Math.random() * 0.6,
        });
      }

      stars = Array.from({ length: 70 }, () => ({
        fx: Math.random(),
        fy: Math.random() * 0.4,
        r: 0.6 + Math.random() * 1.2,
        f: 0.5 + Math.random(),
        ph: Math.random() * 6.28,
      }));

      streaks = Array.from({ length: 6 }, () => ({
        fx: Math.random(),
        fy: 0.58 + Math.random() * 0.36,
        w: 0.08 + Math.random() * 0.12,
        sp: (0.02 + Math.random() * 0.05) * (Math.random() < 0.5 ? -1 : 1),
      }));
    }

    function size() {
      if (!sec || !cv) return;
      const dpr = window.devicePixelRatio || 1;
      const oldW = W;
      const newW = sec.offsetWidth * dpr;
      const newH = sec.offsetHeight * dpr;

      W = cv.width = newW;
      H = cv.height = newH;
      cv.style.width = sec.offsetWidth + 'px';
      cv.style.height = sec.offsetHeight + 'px';

      if (newW > 0 && newH > 0) {
        if (!initialized) {
          initElements(dpr);
          initialized = true;
        } else if (oldW > 0 && oldW !== newW) {
          // Adjust existing diyas x coordinate proportionally on resize
          diyas.forEach((d) => {
            d.x = (d.x / oldW) * newW;
          });
        }

        if (isReduced) {
          draw(0);
        }
      }
    }

    function draw(t) {
      if (!initialized) {
        size();
        if (!initialized) {
          // Retry later on next frame
          rafId = requestAnimationFrame(draw);
          return;
        }
      }

      ctx.clearRect(0, 0, W, H);
      const currentDpr = window.devicePixelRatio || 1;

      /* Twinkling stars */
      stars.forEach((s) => {
        const a = 0.22 + 0.5 * Math.abs(Math.sin((t / 2800) * s.f + s.ph));
        ctx.fillStyle = 'rgba(220, 235, 240, ' + a + ')';
        ctx.beginPath();
        ctx.arc(s.fx * W, s.fy * H, s.r * currentDpr, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Moonlit shimmer on water */
      streaks.forEach((st) => {
        st.fx += st.sp / 1200;
        if (st.fx > 1.2) st.fx = -0.2;
        if (st.fx < -0.2) st.fx = 1.2;
        const x = st.fx * W;
        const y = st.fy * H;
        const w = st.w * W;
        const gsh = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        gsh.addColorStop(0, 'rgba(127,179,191,0)');
        gsh.addColorStop(0.5, 'rgba(127,179,191,0.09)');
        gsh.addColorStop(1, 'rgba(127,179,191,0)');
        ctx.fillStyle = gsh;
        ctx.fillRect(x - w / 2, y - 1.2 * currentDpr, w, 2.4 * currentDpr);
      });

      /* Floating diyas */
      diyas.forEach((d) => {
        d.x += d.vx;
        if (d.x < -40) d.x = W + 40;
        if (d.x > W + 40) d.x = -40;
        const bob = Math.sin(t / 1800 + d.ph) * 2.5 * currentDpr;
        const y = d.y + bob;
        const flick = 0.8 + Math.sin((t / 220) * d.fl + d.ph) * 0.2;

        /* Glow halo */
        const g = ctx.createRadialGradient(d.x, y - d.r * 1.2, 0, d.x, y - d.r * 1.2, d.r * 5.5);
        g.addColorStop(0, 'rgba(255,196,92,' + 0.32 * flick + ')');
        g.addColorStop(1, 'rgba(255,196,92,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, y - d.r * 1.2, d.r * 5.5, 0, Math.PI * 2);
        ctx.fill();

        /* Leaf boat */
        ctx.fillStyle = 'rgba(94,58,32,0.95)';
        ctx.beginPath();
        ctx.ellipse(d.x, y, d.r * 1.7, d.r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();

        /* Flame */
        ctx.fillStyle = 'rgba(255,214,120,' + 0.95 * flick + ')';
        ctx.beginPath();
        ctx.moveTo(d.x, y - d.r * 2.4 * flick);
        ctx.quadraticCurveTo(d.x + d.r * 0.75, y - d.r * 0.9, d.x, y - d.r * 0.35);
        ctx.quadraticCurveTo(d.x - d.r * 0.75, y - d.r * 0.9, d.x, y - d.r * 2.4 * flick);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,230,' + 0.85 * flick + ')';
        ctx.beginPath();
        ctx.arc(d.x, y - d.r * 0.9, d.r * 0.32, 0, Math.PI * 2);
        ctx.fill();

        /* Reflection */
        ctx.fillStyle = 'rgba(255,196,92,' + 0.1 * flick + ')';
        ctx.beginPath();
        ctx.ellipse(d.x, y + d.r * 1.9, d.r * 1.3, d.r * 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      if (running) {
        rafId = requestAnimationFrame(draw);
      }
    }

    size();
    window.addEventListener('resize', size);

    if (isReduced) {
      running = false;
      // Draw static single frame
      draw(0);
      return;
    }

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              size();
              if (!running) {
                running = true;
                rafId = requestAnimationFrame(draw);
              }
            } else if (!e.isIntersecting && running) {
              running = false;
              if (rafId) cancelAnimationFrame(rafId);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(sec);
    } else {
      running = true;
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', size);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section id="footer-section" ref={sectionRef}>
      <canvas id="diya-canvas" ref={canvasRef} />

      {/* Ghat Silhouettes */}
      <svg
        className="ghat-sil"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path fill="#060F18" d="M0 150 V100 H70 V90 H140 V100 H210 V110 H280 V122 H360 V150 Z" />
        <path fill="#060F18" d="M1440 150 V104 H1380 V94 H1310 V104 H1240 V114 H1160 V126 H1080 V150 Z" />
        <g fill="#060F18">
          <path d="M420 150 V92 H436 L456 34 L476 92 H492 V150 Z" />
          <rect x="452" y="20" width="2.5" height="16" />
          <path d="M454 20 L470 26 L454 32 Z" fill="#8B7432" opacity=".85" />
          <path d="M980 150 V104 H992 L1006 62 L1020 104 H1032 V150 Z" />
        </g>
        <g fill="#E8B54A">
          <rect className="ghat-win" x="450" y="100" width="6" height="9" />
          <rect className="ghat-win w2" x="463" y="112" width="5" height="8" />
          <rect className="ghat-win w3" x="1002" y="112" width="5" height="8" />
          <rect className="ghat-win w2" x="150" y="102" width="5" height="7" />
          <rect className="ghat-win" x="1320" y="106" width="5" height="7" />
        </g>
      </svg>

      <div className="footer-inner tc reveal">
        <img src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/New/Om%20Sign.avif" alt="Om Sign" style={{ height: '40px', display: 'block', margin: '0 auto 1rem', opacity: 0.75 }} />
        
        {lang === 'hi' ? (
          <p
            className="footer-msg"
            dangerouslySetInnerHTML={{
              __html: `पवित्र वचनों, दोनों परिवारों के आशीर्वाद और गंगा माँ की दिव्य कृपा से — हम कृतज्ञ एवं आनंदित हृदय से अपने जीवन की नई यात्रा आरंभ करते हैं।<br><br>ऋषिकेश में आपके साथ यह मंगलमय पल मनाने की हमें बेसब्री से प्रतीक्षा है।`,
            }}
          />
        ) : (
          <p
            className="footer-msg"
            dangerouslySetInnerHTML={{
              __html: `Sealed with sacred vows, blessed by both families, and guided by divine grace beside the holy Ganga —<br>we begin our forever with grateful and joyful hearts.<br><br>We cannot wait to celebrate this beautiful chapter with you in Rishikesh.`,
            }}
          />
        )}

        <span className="footer-name">Shashank & Chetna</span>

        {/* Extended Family */}
        <div className="footer-family">
          <div className="family-block">
            <span className="family-block-title">
              {lang === 'hi' ? 'भाई & भाभी' : 'Brother & Sister-in-law'}
            </span>
            <p>Siddhant Chaturvedi &amp; Nupur Goel</p>
          </div>
          <div className="family-block">
            <span className="family-block-title">
              {lang === 'hi' ? 'चाचा & चाची (पिताजी की ओर से)' : 'Uncles & Aunties (Papa Side)'}
            </span>
            <p>
              Shri Ghanendra &amp; Smt. Seema Chaturvedi
              <br />
              Shri Mragendra &amp; Smt. Poonam Chaturvedi
              <br />
              Shri Yogendra &amp; Smt. Sarika Chaturvedi
              <br />
              Shri Mahendra &amp; Smt. Saloni Chaturvedi
            </p>
          </div>
          <div className="family-block">
            <span className="family-block-title">
              {lang === 'hi' ? 'बुआ & फूफा जी' : 'Bua & Fufa ji'}
            </span>
            <p>Shri Somendra Chaturvedi &amp; Smt. Madhu Chaturvedi</p>
          </div>
          <div className="family-block">
            <span className="family-block-title">
              {lang === 'hi' ? 'भाई-बहन (चचेरे)' : 'Cousins'}
            </span>
            <p>Kushagra, Prateek, Varad, Khushi, Yash, Manu, Shreya &amp; Viraj</p>
          </div>
        </div>

        {/* Designer Credit */}
        <div className="footer-credit" style={{ marginTop: '3.5rem' }}>
          MADE WITH <span style={{ color: '#e74c3c' }}>♥</span> BY{' '}
          <a
            href="https://www.instagram.com/invitevibes_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            @INVITEVIBES
          </a>
        </div>
      </div>
    </section>
  );
}
