'use client';

import { useEffect, useRef, useState } from 'react';

export default function SangamSection() {
  const containerRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [isArmed, setIsArmed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = [
      'तू भागीरथी सी चंचल, मैं अलकनंदा सा शांत प्रिये,',
      'जब संगम हो हमारा, तू बने गंगा और मैं तेरा घाट प्रिये।',
    ];

    function getGraphemes(str) {
      if (typeof window !== 'undefined' && window.Intl && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(str), (s) => s.segment);
      }
      return Array.from(str);
    }

    let isTyping = false;

    function startTyping() {
      if (isTyping) return;
      isTyping = true;
      setIsArmed(true);

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        setTypedText(lines.join('\n'));
        setIsDone(true);
        return;
      }

      let lineIdx = 0;
      let graphemeIdx = 0;
      const parsedLines = lines.map(getGraphemes);
      let currentResult = '';

      function tick() {
        if (lineIdx >= parsedLines.length) {
          setIsDone(true);
          return;
        }

        const char = parsedLines[lineIdx][graphemeIdx];
        currentResult += char;
        setTypedText(currentResult);

        graphemeIdx++;
        let delay = 60;
        if (char === ',' || char === '।') {
          delay = 440; // pause at punctuation
        }

        if (graphemeIdx >= parsedLines[lineIdx].length) {
          lineIdx++;
          graphemeIdx = 0;
          if (lineIdx < parsedLines.length) {
            currentResult += '\n';
            delay = 720; // delay between lines
          }
        }

        setTimeout(tick, delay);
      }

      setTimeout(tick, 600);
    }

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              startTyping();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(container);
    } else {
      startTyping();
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section id="sangam-section" ref={containerRef}>
      <div className="sangam-scene">
        <svg
          viewBox="0 0 800 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Main organic water turbulence */}
            <filter id="waterDeep" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="turbulence" baseFrequency="0.012 0.025" numOctaves="4" seed="11" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* Gentler version for soft edges */}
            <filter id="waterSoft" x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="turbulence" baseFrequency="0.018 0.038" numOctaves="3" seed="4" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="7" />
            </filter>
            {/* Fast surface churn near confluence */}
            <filter id="waterTurb" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="3" seed="7" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="9" />
            </filter>
            {/* Rocky terrain grain */}
            <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" result="a" />
              <feComposite in="a" in2="SourceGraphic" operator="over" />
            </filter>
            {/* Denser grain for very close rock detail */}
            <filter id="grainHeavy" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.14 0" result="a" />
              <feComposite in="a" in2="SourceGraphic" operator="over" />
            </filter>
            {/* Soft blur for glow effects */}
            <filter id="softBlur">
              <feGaussianBlur stdDeviation="1.8" />
            </filter>
            {/* Medium blur for atmospheric haze */}
            <filter id="medBlur">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            {/* Big blur for volumetric light shafts */}
            <filter id="bigBlur">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            {/* Diya glow */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
            {/* Warm golden glow for sun */}
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Shadow for buildings/temple */}
            <filter id="dropShadow">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#1a1008" floodOpacity="0.4" />
            </filter>

            {/* ===== WATER GRADIENTS ===== */}
            <linearGradient id="wBhagirathi" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0" stopColor="#4DBFA0" />
              <stop offset="0.3" stopColor="#3AAD8C" />
              <stop offset="0.65" stopColor="#2C9D7E" />
              <stop offset="1" stopColor="#22897A" />
            </linearGradient>
            <linearGradient id="wAlaknanda" x1="1" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="#1A7A6E" />
              <stop offset="0.4" stopColor="#1E8878" />
              <stop offset="0.8" stopColor="#24917F" />
              <stop offset="1" stopColor="#29977E" />
            </linearGradient>
            <linearGradient id="wGanga" x1="0" y1="0" x2="0.12" y2="1">
              <stop offset="0" stopColor="#2B9F85" />
              <stop offset="0.4" stopColor="#1E8878" />
              <stop offset="0.8" stopColor="#177068" />
              <stop offset="1" stopColor="#0E5E5A" />
            </linearGradient>
            <linearGradient id="wMixZone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3AAD8C" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#28977E" stopOpacity="0.6" />
              <stop offset="1" stopColor="#1A7A6E" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="wDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0A3830" stopOpacity="0" />
              <stop offset="1" stopColor="#0A3830" stopOpacity="0.32" />
            </linearGradient>

            {/* ===== TERRAIN GRADIENTS ===== */}
            <linearGradient id="rock" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#4E4A46" />
              <stop offset="0.4" stopColor="#37332F" />
              <stop offset="1" stopColor="#201E1C" />
            </linearGradient>
            <linearGradient id="rockWet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3A3632" />
              <stop offset="1" stopColor="#1A1816" />
            </linearGradient>
            <linearGradient id="rockLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#726C65" />
              <stop offset="1" stopColor="#4A4440" />
            </linearGradient>
            <linearGradient id="rockFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5C5650" />
              <stop offset="0.5" stopColor="#3E3A36" />
              <stop offset="1" stopColor="#2A2826" />
            </linearGradient>
            <linearGradient id="cliffShadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1A1816" stopOpacity="0" />
              <stop offset="1" stopColor="#1A1816" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="ghat" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="#C8926E" />
              <stop offset="0.5" stopColor="#B47858" />
              <stop offset="1" stopColor="#9A6040" />
            </linearGradient>
            <linearGradient id="ghatShadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2A1810" stopOpacity="0" />
              <stop offset="1" stopColor="#2A1810" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="stoneStep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D4C4A8" />
              <stop offset="1" stopColor="#A89070" />
            </linearGradient>

            {/* ===== SKY & ATMOSPHERE ===== */}
            <linearGradient id="sky" x1="0" y1="0" x2="0.1" y2="1">
              <stop offset="0" stopColor="#F5E8C8" />
              <stop offset="0.15" stopColor="#EED5A0" />
              <stop offset="0.4" stopColor="#D4C08A" />
              <stop offset="1" stopColor="#B8A876" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sunHalo" cx="0.5" cy="0" r="0.55">
              <stop offset="0" stopColor="#FFE5A0" stopOpacity="0.22" />
              <stop offset="0.5" stopColor="#F0C870" stopOpacity="0.08" />
              <stop offset="1" stopColor="#F0C870" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lightShaft" cx="0.42" cy="0.06" r="0.6">
              <stop offset="0" stopColor="#FDECC0" stopOpacity="0.18" />
              <stop offset="0.6" stopColor="#F5D890" stopOpacity="0.04" />
              <stop offset="1" stopColor="#F5D890" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sunOnWater" cx="0.5" cy="0.3" r="0.5">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="0.5" stopColor="#DFFFEF" stopOpacity="0.05" />
              <stop offset="1" stopColor="#DFFFEF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ivoryFadeTop" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#FAF7F2" stopOpacity="0" />
              <stop offset="0.7" stopColor="#FAF7F2" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FAF7F2" />
            </linearGradient>
            <linearGradient id="ivoryFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FAF7F2" stopOpacity="0" />
              <stop offset="0.6" stopColor="#FAF7F2" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FAF7F2" />
            </linearGradient>

            {/* ===== WATER SURFACE SPARKLE ===== */}
            <pattern id="sparklePattern" x="0" y="0" width="80" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="20" cy="18" rx="8" ry="1.2" fill="#FFFFFF" opacity="0.18" className="glint" />
              <ellipse cx="58" cy="38" rx="6" ry="0.9" fill="#FFFFFF" opacity="0.12" className="glint g2" />
              <ellipse cx="36" cy="52" rx="10" ry="1.4" fill="#FFFFFF" opacity="0.14" className="glint g3" />
            </pattern>

            <filter id="foamTurb" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.08 0.14" numOctaves="2" seed="3" result="n" />
              <feColorMatrix
                in="n"
                type="matrix"
                values="0 0 0 0 0.94  0 0 0 0 0.97  0 0 0 0 0.95  0 0 0 0.35 -0.05"
                result="foam"
              />
              <feComposite in="foam" in2="SourceGraphic" operator="in" />
            </filter>

            <clipPath id="sceneClip">
              <rect width="800" height="900" />
            </clipPath>
          </defs>

          <g clipPath="url(#sceneClip)">
            <rect x="0" y="0" width="800" height="160" fill="url(#sky)" opacity="0.55" />
            <rect x="0" y="0" width="800" height="900" fill="url(#sunHalo)" />
            <rect x="0" y="0" width="800" height="900" fill="url(#lightShaft)" />

            {/* Alaknanda body */}
            <rect width="800" height="900" fill="url(#wAlaknanda)" />

            {/* Bhagirathi mass */}
            <g filter="url(#waterDeep)">
              <path
                fill="url(#wBhagirathi)"
                d="M-20 -20 L 332 -20 C 342 88, 358 198, 374 298 C 388 370, 352 468, 298 568 C 246 666, 198 778, 170 920 L -20 920 Z"
              >
                <animate
                  attributeName="d"
                  dur="20s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                  values="
M-20 -20 L 332 -20 C 342 88, 358 198, 374 298 C 388 370, 352 468, 298 568 C 246 666, 198 778, 170 920 L -20 920 Z;
M-20 -20 L 332 -20 C 350 94, 350 206, 382 304 C 398 374, 344 474, 306 574 C 254 670, 190 776, 178 920 L -20 920 Z;
M-20 -20 L 332 -20 C 336 82, 352 192, 366 294 C 378 366, 348 464, 292 564 C 238 662, 192 776, 162 920 L -20 920 Z;
M-20 -20 L 332 -20 C 342 88, 358 198, 374 298 C 388 370, 352 468, 298 568 C 246 666, 198 778, 170 920 L -20 920 Z"
                />
              </path>
            </g>

            {/* Ganga overlay */}
            <rect y="380" width="800" height="520" fill="url(#wGanga)" opacity="0.48" />

            {/* Subsurface depth shadow */}
            <rect width="800" height="900" fill="url(#wDepth)" opacity="0.8" />

            {/* Sunlight on water */}
            <rect width="800" height="900" fill="url(#sunOnWater)" />

            {/* MIXING ZONE */}
            <g filter="url(#waterSoft)" opacity="0.6">
              <path
                d="M 332 -20 C 342 88, 358 198, 374 298 C 388 370, 352 468, 298 568 C 246 666, 198 778, 170 920"
                fill="none"
                stroke="url(#wMixZone)"
                strokeWidth="40"
                filter="url(#medBlur)"
              />
            </g>
            <g filter="url(#waterSoft)" opacity="0.45">
              <path
                d="M 334 -20 C 344 88, 360 198, 376 298 C 390 370, 354 468, 300 568 C 248 666, 200 778, 172 920"
                fill="none"
                stroke="#5EC0A0"
                strokeWidth="14"
                filter="url(#softBlur)"
              />
            </g>

            {/* Foam streaks along the mixing line */}
            <g fill="none" stroke="#D8F5EA" strokeLinecap="round" opacity="0.5">
              <path className="shimmer-fast" d="M 366 -10 C 372 50, 378 110, 374 180" strokeWidth="3.5" />
              <path className="shimmer-fast f2" d="M 358 50 C 368 130, 374 210, 370 290" strokeWidth="2.8" />
              <path className="shimmer-fast f3" d="M 342 130 C 354 200, 364 280, 356 360" strokeWidth="2.5" />
              <path className="shimmer-fast" d="M 325 240 C 330 310, 328 380, 318 450" strokeWidth="2.5" />
              <path className="shimmer-fast f2" d="M 304 360 C 296 430, 284 510, 274 590" strokeWidth="2.2" />
              <path className="shimmer-fast f3" d="M 280 490 C 264 560, 246 640, 230 720" strokeWidth="2" />
            </g>

            {/* Main current arcs — Bhagirathi side */}
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" filter="url(#waterSoft)">
              <path className="shimmer" d="M  68 110 C 140 168, 188 240, 202 328" strokeWidth="2.2" opacity="0.22" />
              <path className="shimmer s2" d="M 110 200 C 174 262, 210 340, 218 424" strokeWidth="1.8" opacity="0.18" />
              <path className="shimmer s4" d="M  42 310 C  88 370, 112 440, 120 520" strokeWidth="1.6" opacity="0.16" />
              <path className="shimmer s3" d="M 148 460 C 196 516, 224 582, 228 652" strokeWidth="1.6" opacity="0.16" />
              <path className="shimmer" d="M  90 580 C 148 634, 180 700, 188 770" strokeWidth="1.5" opacity="0.14" />
              <path className="shimmer s5" d="M 220 660 C 262 720, 286 784, 288 850" strokeWidth="1.5" opacity="0.14" />
            </g>

            {/* Main current arcs — Alaknanda side */}
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" filter="url(#waterSoft)">
              <path className="shimmer s2" d="M 620 108 C 572 196, 562 292, 592 382" strokeWidth="2.2" opacity="0.19" />
              <path className="shimmer" d="M 680 180 C 640 270, 634 366, 658 452" strokeWidth="1.8" opacity="0.16" />
              <path className="shimmer s3" d="M 742 260 C 710 350, 706 446, 728 530" strokeWidth="1.6" opacity="0.14" />
              <path className="shimmer s4" d="M 608 320 C 590 410, 592 498, 614 578" strokeWidth="1.6" opacity="0.15" />
              <path className="shimmer s5" d="M 664 440 C 656 530, 658 618, 672 700" strokeWidth="1.5" opacity="0.13" />
              <path className="shimmer" d="M 724 560 C 720 648, 722 736, 734 818" strokeWidth="1.4" opacity="0.12" />
            </g>

            {/* Cross-river eddies below confluence */}
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" filter="url(#waterSoft)">
              <path className="shimmer s3" d="M 142 630 C 242 668, 352 682, 462 670" strokeWidth="1.8" opacity="0.16" />
              <path className="shimmer s2" d="M 200 730 C 310 770, 426 782, 538 770" strokeWidth="1.6" opacity="0.14" />
              <path className="shimmer" d="M 310 820 C 414 854, 518 860, 612 850" strokeWidth="1.5" opacity="0.12" />
            </g>

            {/* Micro chop */}
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" opacity="0.12">
              <path className="shimmer-fast f2" d="M 60 160 C 80 168, 100 164, 120 170" strokeWidth="1.2" />
              <path className="shimmer-fast f3" d="M 180 220 C 198 228, 212 224, 232 230" strokeWidth="1.1" />
              <path className="shimmer-fast" d="M 500 180 C 522 188, 540 184, 558 190" strokeWidth="1.2" />
              <path className="shimmer-fast f2" d="M 650 280 C 668 288, 682 284, 700 290" strokeWidth="1.1" />
              <path className="shimmer-fast f3" d="M 420 480 C 442 488, 460 484, 480 490" strokeWidth="1.1" />
              <path className="shimmer-fast" d="M 100 560 C 120 568, 138 564, 158 570" strokeWidth="1.0" />
              <path className="shimmer-fast f2" d="M 600 640 C 622 648, 640 644, 658 650" strokeWidth="1.0" />
              <path className="shimmer-fast f3" d="M 240 750 C 262 758, 280 754, 300 760" strokeWidth="1.0" />
            </g>

            {/* Drifting surface flecks */}
            <g fill="#FFFFFF">
              <ellipse cx="140" cy="300" rx="16" ry="2.2" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -22;18 64" dur="9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.25;.25;0" keyTimes="0;.2;.7;1" dur="9s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="230" cy="420" rx="11" ry="1.7" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -18;12 58" dur="11s" begin="-4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.22;.22;0" keyTimes="0;.2;.7;1" dur="11s" begin="-4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="520" cy="200" rx="13" ry="2.1" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="-6 -18;-16 62" dur="10s" begin="-7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.22;.22;0" keyTimes="0;.2;.7;1" dur="10s" begin="-7s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="640" cy="330" rx="15" ry="2.2" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="-4 -22;-12 66" dur="12s" begin="-2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.24;.24;0" keyTimes="0;.2;.7;1" dur="12s" begin="-2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="420" cy="540" rx="17" ry="2.3" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -24;6 70" dur="9.5s" begin="-5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.26;.26;0" keyTimes="0;.2;.7;1" dur="9.5s" begin="-5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="88" cy="480" rx="11" ry="1.7" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -17;12 54" dur="8.5s" begin="-3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.21;.21;0" keyTimes="0;.2;.7;1" dur="8.5s" begin="-3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="704" cy="480" rx="13" ry="2.0" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="-4 -19;-10 58" dur="11.5s" begin="-6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.22;.22;0" keyTimes="0;.2;.7;1" dur="11.5s" begin="-6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="334" cy="358" rx="10" ry="1.5" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -15;10 52" dur="9s" begin="-1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.20;.20;0" keyTimes="0;.2;.7;1" dur="9s" begin="-1.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="252" cy="700" rx="14" ry="2.0" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -21;10 64" dur="10s" begin="-2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.22;.22;0" keyTimes="0;.2;.7;1" dur="10s" begin="-2.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="562" cy="762" rx="15" ry="2.1" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -21;-6 66" dur="11s" begin="-6.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.22;.22;0" keyTimes="0;.2;.7;1" dur="11s" begin="-6.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="412" cy="822" rx="13" ry="1.9" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -19;6 58" dur="9.5s" begin="-4.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.20;.20;0" keyTimes="0;.2;.7;1" dur="9.5s" begin="-4.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="320" cy="580" rx="12" ry="1.8" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 -18;8 56" dur="8s" begin="-3.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.18;.18;0" keyTimes="0;.2;.7;1" dur="8s" begin="-3.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="480" cy="660" rx="14" ry="2.0" opacity="0">
                <animateTransform attributeName="transform" type="translate" values="2 -20;-4 60" dur="10.5s" begin="-7.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.20;.20;0" keyTimes="0;.2;.7;1" dur="10.5s" begin="-7.5s" repeatCount="indefinite" />
              </ellipse>
            </g>

            {/* Moving sunlight sheen */}
            <ellipse cx="220" cy="380" rx="280" ry="180" fill="#FFFFFF" opacity="0" filter="url(#bigBlur)">
              <animateTransform
                attributeName="transform"
                type="translate"
                dur="30s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                values="0 0;340 200;0 0"
              />
              <animate attributeName="opacity" values="0.04;0.11;0.04" dur="30s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="600" cy="280" rx="200" ry="140" fill="#FFFFFF" opacity="0" filter="url(#bigBlur)">
              <animateTransform
                attributeName="transform"
                type="translate"
                dur="24s"
                begin="-12s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                values="0 0;-160 180;0 0"
              />
              <animate attributeName="opacity" values="0.03;0.09;0.03" dur="24s" begin="-12s" repeatCount="indefinite" />
            </ellipse>

            {/* ROCKY BANKS — Left cliff */}
            <g filter="url(#grain)">
              <path d="M-10 -10 L 158 -10 C 136 28, 106 56, 68 76 C 38 92, 10 100, -10 102 Z" fill="url(#rock)" />
              <path d="M-10 -10 L 100 -10 C 86 18, 62 40, 36 54 C 18 62, 4 66, -10 68 Z" fill="url(#rockLight)" opacity="0.45" />
              <path
                d="M 68 76 C 46 88, 22 96, -10 102 L -10 68 C 4 66, 18 62, 36 54 C 52 68, 62 78, 68 76 Z"
                fill="#1A1816"
                opacity="0.35"
              />
            </g>
            <g filter="url(#grainHeavy)">
              <path d="M -10 86 C 8 92, 26 96, 42 96 C 52 96, 60 92, 68 86 L 36 86 Z" fill="url(#rockWet)" opacity="0.7" />
            </g>
            <g className="foam" fill="none" stroke="#D8F0E4" strokeLinecap="round" filter="url(#softBlur)">
              <path d="M 65 80 C 42 92, 18 100, -8 102" strokeWidth="4.5" opacity="0.65" />
              <path d="M 42 92 C 24 100, 8 106, -10 108" strokeWidth="2.5" opacity="0.4" />
            </g>

            {/* Main right cliff mass */}
            <g filter="url(#grain)">
              <path d="M 810 -10 L 552 -10 C 580 34, 620 68, 668 90 C 714 112, 766 122, 810 124 Z" fill="url(#rock)" />
              <path d="M 810 -10 L 638 -10 C 662 22, 696 48, 740 66 C 768 78, 792 84, 810 86 Z" fill="url(#rockLight)" opacity="0.42" />
              <path
                d="M 668 90 C 710 112, 762 122, 810 124 L 810 86 C 792 84, 768 78, 740 66 C 712 82, 688 88, 668 90 Z"
                fill="#1A1816"
                opacity="0.30"
              />
            </g>
            <g filter="url(#grainHeavy)">
              <path d="M 810 108 C 792 112, 772 114, 756 112 C 744 110, 736 106, 726 100 L 762 100 Z" fill="url(#rockWet)" opacity="0.65" />
            </g>
            <g className="foam" fill="none" stroke="#D8F0E4" strokeLinecap="round" filter="url(#softBlur)">
              <path d="M 670 94 C 714 114, 762 122, 806 124" strokeWidth="4.5" opacity="0.6" />
              <path d="M 692 106 C 734 124, 778 130, 810 132" strokeWidth="2.5" opacity="0.38" />
            </g>

            {/* Left mid-height rocky shore */}
            <g filter="url(#grain)">
              <path d="M-10 398 C 32 418, 62 452, 70 498 C 78 542, 64 592, 34 642 C 16 670, 2 692, -10 708 Z" fill="url(#rock)" />
              <path d="M-10 428 C 20 446, 42 476, 48 514 C 54 552, 44 592, 24 626 L -10 652 Z" fill="url(#rockLight)" opacity="0.38" />
              <path
                d="M-10 398 L -10 428 C 20 446, 42 476, 48 514 C 54 552, 44 592, 24 626 L -10 652 L -10 708 C 2 692, 16 670, 34 642 C 64 592, 78 542, 70 498 C 62 452, 32 418, -10 398 Z"
                fill="url(#cliffShadow)"
                opacity="0.25"
              />
            </g>
            <g filter="url(#grainHeavy)">
              <path d="M -10 398 C 10 404, 28 410, 42 414 C 52 416, 60 414, 68 410 L 44 406 Z" fill="url(#rockWet)" opacity="0.6" />
            </g>
            <g className="foam" fill="none" stroke="#D8F0E4" strokeLinecap="round" filter="url(#softBlur)">
              <path d="M 64 498 C 72 540, 58 592, 30 636" strokeWidth="4" opacity="0.6" />
            </g>

            {/* Right lower rocky edge */}
            <g filter="url(#grain)">
              <path
                d="M 810 558 C 780 578, 758 612, 752 654 C 746 696, 758 742, 784 786 C 794 802, 804 814, 810 824 Z"
                fill="url(#rock)"
                opacity="0.92"
              />
              <path
                d="M 810 588 C 788 606, 772 632, 768 666 C 764 700, 772 734, 792 762 L 810 784 Z"
                fill="url(#rockLight)"
                opacity="0.32"
              />
            </g>
            <g className="foam" fill="none" stroke="#D8F0E4" strokeLinecap="round" filter="url(#softBlur)">
              <path d="M 754 654 C 748 698, 760 742, 786 784" strokeWidth="4" opacity="0.52" />
            </g>

            {/* Rock striations */}
            <g fill="none" stroke="#1A1816" strokeWidth="0.8" strokeLinecap="round" opacity="0.18">
              <path d="M 20 10 C 50 14, 80 12, 110 8" />
              <path d="M 8 26 C 34 30, 58 28, 80 24" strokeWidth="0.7" />
              <path d="M 2 42 C 22 46, 42 44, 60 40" strokeWidth="0.6" />
              <path d="M 680 12 C 706 14, 736 12, 762 8" />
              <path d="M 700 26 C 724 30, 752 28, 776 22" strokeWidth="0.7" />
              <path d="M 714 40 C 736 44, 762 42, 788 38" strokeWidth="0.6" />
            </g>

            {/* Boulder scatter near waterline */}
            <g filter="url(#grainHeavy)" opacity="0.88">
              <ellipse cx="56" cy="88" rx="7" ry="4" fill="#2A2622" />
              <ellipse cx="76" cy="80" rx="5" ry="3" fill="#322E2A" />
              <ellipse cx="38" cy="96" rx="6" ry="3.5" fill="#242220" />
              <ellipse cx="688" cy="92" rx="7" ry="4" fill="#2A2622" />
              <ellipse cx="708" cy="84" rx="6" ry="3.5" fill="#322E2A" />
              <ellipse cx="670" cy="98" rx="5" ry="3" fill="#242220" />
              <ellipse cx="165" cy="390" rx="9" ry="5" fill="#2E2A26" opacity="0.5" />
              <ellipse cx="620" cy="380" rx="8" ry="4.5" fill="#2E2A26" opacity="0.45" />
            </g>

            {/* TEMPLE GHAT PROMONTORY */}
            <path
              d="M 316 150 C 320 200, 310 250, 295 300 C 280 348, 270 390, 275 430 C 280 460, 295 480, 310 500 L 330 500 C 316 480, 306 458, 304 430 C 300 390, 312 348, 326 300 C 340 250, 348 200, 344 150 Z"
              fill="#0A2820"
              opacity="0.22"
              filter="url(#medBlur)"
            />

            <g filter="url(#grain)">
              <path
                d="M 296 -10 L 524 -10 L 520 58 C 518 96, 504 132, 478 160 C 456 184, 434 202, 416 216 C 404 226, 398 234, 394 242 C 390 234, 382 224, 370 212 C 352 194, 332 174, 318 148 C 304 122, 300 90, 298 54 Z"
                fill="url(#rockFace)"
              />
              <path
                d="M 296 -10 L 298 54 C 300 90, 304 122, 318 148 C 332 174, 352 194, 370 212 C 358 202, 340 180, 324 154 C 308 126, 302 94, 300 58 L 300 -10 Z"
                fill="#1A1816"
                opacity="0.4"
              />
            </g>

            {/* Ghat sandstone surface */}
            <g filter="url(#grain)">
              <path
                d="M 308 -10 L 510 -10 L 506 52 C 504 84, 494 112, 474 134 L 346 134 C 328 110, 318 82, 316 50 Z"
                fill="url(#ghat)"
              />
              <path
                d="M 308 -10 L 510 -10 L 506 52 C 504 84, 494 112, 474 134 L 346 134 C 328 110, 318 82, 316 50 Z"
                fill="url(#ghatShadow)"
              />
            </g>

            <path
              d="M 308 -10 L 316 50 C 318 82, 328 110, 346 134 L 474 134 C 494 112, 504 84, 506 52 L 510 -10"
              fill="none"
              stroke="#E6D8BE"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Ghat step lines */}
            <g stroke="#7A5A38" strokeWidth="1.2" opacity="0.45">
              <line x1="326" y1="14" x2="494" y2="14" />
              <line x1="322" y1="38" x2="498" y2="38" />
              <line x1="330" y1="62" x2="490" y2="62" />
              <line x1="342" y1="86" x2="478" y2="86" />
              <line x1="354" y1="110" x2="466" y2="110" />
            </g>
            <g stroke="#4A2E1A" strokeWidth="2" opacity="0.22">
              <line x1="326" y1="16" x2="494" y2="16" />
              <line x1="322" y1="40" x2="498" y2="40" />
              <line x1="330" y1="64" x2="490" y2="64" />
              <line x1="342" y1="88" x2="478" y2="88" />
              <line x1="354" y1="112" x2="466" y2="112" />
            </g>
            <g stroke="#2A1E12" strokeWidth="0.8" opacity="0.30">
              <path d="M 380 20 L 382 38 L 378 56" />
              <path d="M 432 18 L 430 44 L 436 68" />
              <path d="M 460 30 L 462 52 L 458 76" />
              <path d="M 350 54 L 352 78 L 348 100" />
            </g>

            {/* Temples / buildings on the ghat */}
            <g filter="url(#dropShadow)">
              <rect x="348" y="-10" width="46" height="38" fill="#F0E8DA" />
              <polygon points="371,-10 358,10 384,10" fill="#D4B898" />
              <polygon points="371,-10 363,2 379,2" fill="#E8D4B8" />
              <path d="M 358 24 L 358 34 Q 371 28 384 34 L 384 24 Z" fill="#C8AA88" opacity="0.7" />
              <rect x="348" y="26" width="46" height="4" fill="#C8B090" opacity="0.7" />
            </g>
            <g filter="url(#dropShadow)">
              <rect x="400" y="-10" width="34" height="30" fill="#EAB8C4" />
              <polygon points="417,-10 405,6 429,6" fill="#C48898" />
              <polygon points="417,-10 410,-2 424,-2" fill="#D4A0AE" />
              <rect x="400" y="18" width="34" height="3" fill="#B89098" opacity="0.6" />
              <line x1="417" y1="-10" x2="417" y2="-18" stroke="#CC3333" strokeWidth="1.5" />
              <polygon points="417,-18 426,-14 417,-10" fill="#CC3333" />
            </g>
            <g filter="url(#dropShadow)">
              <rect x="438" y="-10" width="42" height="34" fill="#F2E2C8" />
              <polygon points="459,-10 447,8 471,8" fill="#D4B890" />
              <polygon points="459,-10 452,0 466,0" fill="#E6CC9E" />
              <rect x="438" y="22" width="42" height="3" fill="#C4A878" opacity="0.6" />
            </g>
            <line x1="408" y1="-10" x2="408" y2="-22" stroke="#B89098" strokeWidth="1.2" />
            <polygon points="408,-22 418,-17 408,-12" fill="#D04060" />
            <g fill="#D4A030" opacity="0.9">
              <circle cx="371" cy="-10" r="2.8" />
              <circle cx="459" cy="-10" r="2.4" />
            </g>

            {/* Staircase descending to water */}
            <g filter="url(#grain)">
              <path d="M 390 134 L 424 134 L 416 214 L 398 214 Z" fill="url(#stoneStep)" />
              <path d="M 390 134 L 398 134 L 400 214 L 390 210 Z" fill="#8A7A5C" opacity="0.4" />
              <path d="M 416 134 L 424 134 L 422 210 L 416 214 Z" fill="#A0906E" opacity="0.3" />
            </g>
            <g stroke="#8A7060" strokeWidth="1" opacity="0.75">
              <line x1="391" y1="144" x2="423" y2="144" />
              <line x1="392" y1="154" x2="422" y2="154" />
              <line x1="393" y1="164" x2="421" y2="164" />
              <line x1="394" y1="174" x2="420" y2="174" />
              <line x1="395" y1="184" x2="419" y2="184" />
              <line x1="396" y1="194" x2="418" y2="194" />
              <line x1="397" y1="204" x2="417" y2="204" />
            </g>
            <path d="M 394 214 L 420 214 L 424 260 L 390 260 Z" fill="#0A2820" opacity="0.12" filter="url(#softBlur)" />

            {/* Confluence rock tip */}
            <g filter="url(#grain)">
              <path d="M 358 216 C 358 198, 374 188, 405 188 C 436 188, 452 198, 452 216 C 452 242, 434 264, 405 274 C 376 264, 358 242, 358 216 Z" fill="#8A7A64" />
              <path d="M 366 216 C 366 202, 380 194, 405 194 C 430 194, 444 202, 444 216 C 444 238, 428 256, 405 265 C 382 256, 366 238, 366 216 Z" fill="#A8967E" opacity="0.82" />
              <path d="M 374 204 C 378 196, 390 192, 405 192 C 390 192, 378 196, 374 204 Z" fill="#C4B098" opacity="0.6" />
            </g>

            {/* Pilgrims on the promontory */}
            <g>
              <ellipse cx="386" cy="208" rx="3" ry="2.8" fill="#D9534F" />
              <ellipse cx="386" cy="214" rx="2.5" ry="4" fill="#F5F0E8" opacity="0.9" />
              <ellipse cx="396" cy="215" rx="2.8" ry="2.5" fill="#F0AD4E" />
              <ellipse cx="396" cy="222" rx="2.3" ry="3.8" fill="#EDE8DA" opacity="0.9" />
              <ellipse cx="406" cy="207" rx="3" ry="2.8" fill="#E8E4DA" />
              <ellipse cx="406" cy="213" rx="2.5" ry="4" fill="#5B8FBF" opacity="0.85" />
              <ellipse cx="414" cy="216" rx="2.8" ry="2.6" fill="#C4576E" />
              <ellipse cx="414" cy="222" rx="2.3" ry="3.8" fill="#D4CFC8" opacity="0.9" />
              <ellipse cx="400" cy="226" rx="3" ry="2.8" fill="#9A6FB8" />
              <ellipse cx="400" cy="232" rx="2.5" ry="4" fill="#F5EFE0" opacity="0.85" />
              <ellipse cx="408" cy="231" rx="2.8" ry="2.5" fill="#EFDFC2" />
              <ellipse cx="408" cy="238" rx="2.3" ry="3.8" fill="#7B9E60" opacity="0.85" />
              <ellipse cx="390" cy="232" rx="2.8" ry="2.6" fill="#E39A3B" />
              <ellipse cx="390" cy="238" rx="2.3" ry="3.8" fill="#F5F0E0" opacity="0.8" />
              <ellipse cx="418" cy="224" rx="2.8" ry="2.5" fill="#3A9E6F" />
              <ellipse cx="382" cy="220" rx="2.5" ry="2.4" fill="#C09060" />
              <ellipse cx="402" cy="244" rx="2.8" ry="2.5" fill="#D9534F" />
              <ellipse cx="412" cy="248" rx="2.5" ry="2.3" fill="#EDE7DB" />
              <ellipse cx="394" cy="242" rx="2.4" ry="2.2" fill="#7B9E60" />
              <ellipse cx="422" cy="240" rx="2.3" ry="2.2" fill="#F0C84E" />
              <ellipse cx="376" cy="226" rx="3.5" ry="2.2" fill="#C4576E" opacity="0.85" />
              <circle cx="404" cy="256" r="2.6" fill="#FF9E20" />
              <circle cx="380" cy="212" r="2.2" fill="#5B8FBF" />
              <circle cx="424" cy="208" r="2.2" fill="#D9534F" />
            </g>

            {/* CONFLUENCE — FOAM RING & RADIATING RIPPLES */}
            <g filter="url(#foamTurb)" opacity="0.7">
              <ellipse cx="405" cy="240" rx="40" ry="26" fill="#D8F4E8" />
            </g>
            <g className="foam" filter="url(#waterSoft)">
              <path
                d="M 350 222 C 344 254, 362 284, 405 298 C 448 284, 466 254, 460 222"
                fill="none"
                stroke="#F4FAF6"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.78"
              />
              <path
                d="M 338 202 C 330 248, 356 294, 405 312 C 454 294, 480 248, 472 202"
                fill="none"
                stroke="#E6F5EC"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.48"
              />
            </g>

            <g fill="none" stroke="#EFF9F2" strokeLinecap="round" filter="url(#waterSoft)">
              <path d="M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234" strokeWidth="2.8" opacity="0">
                <animate attributeName="opacity" values="0;.6;0" keyTimes="0;.3;1" dur="5.5s" repeatCount="indefinite" />
                <animate
                  attributeName="d"
                  values="
        M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234;
        M 350 226 C 344 262, 368 300, 405 314 C 442 300, 466 262, 460 226;
        M 332 216 C 324 266, 356 316, 405 334 C 454 316, 486 266, 478 216"
                  dur="5.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234" strokeWidth="2.4" opacity="0">
                <animate attributeName="opacity" values="0;.5;0" keyTimes="0;.3;1" dur="5.5s" begin="1.4s" repeatCount="indefinite" />
                <animate
                  attributeName="d"
                  values="
        M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234;
        M 350 226 C 344 262, 368 300, 405 314 C 442 300, 466 262, 460 226;
        M 332 216 C 324 266, 356 316, 405 334 C 454 316, 486 266, 478 216"
                  dur="5.5s"
                  begin="1.4s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234" strokeWidth="2" opacity="0">
                <animate attributeName="opacity" values="0;.38;0" keyTimes="0;.3;1" dur="5.5s" begin="2.8s" repeatCount="indefinite" />
                <animate
                  attributeName="d"
                  values="
        M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234;
        M 350 226 C 344 262, 368 300, 405 314 C 442 300, 466 262, 460 226;
        M 332 216 C 324 266, 356 316, 405 334 C 454 316, 486 266, 478 216"
                  dur="5.5s"
                  begin="2.8s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234" strokeWidth="1.6" opacity="0">
                <animate attributeName="opacity" values="0;.28;0" keyTimes="0;.3;1" dur="5.5s" begin="4.1s" repeatCount="indefinite" />
                <animate
                  attributeName="d"
                  values="
        M 366 234 C 362 260, 380 284, 405 294 C 430 284, 448 260, 444 234;
        M 350 226 C 344 262, 368 300, 405 314 C 442 300, 466 262, 460 226;
        M 332 216 C 324 266, 356 316, 405 334 C 454 316, 486 266, 478 216"
                  dur="5.5s"
                  begin="4.1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Downstream foam streaks */}
            <g fill="none" stroke="#E6F4EC" strokeLinecap="round" filter="url(#waterSoft)" opacity="0.55">
              <path className="shimmer-fast" d="M 385 304 C 378 346, 370 392, 358 438" strokeWidth="3" />
              <path className="shimmer-fast f2" d="M 406 310 C 408 356, 412 402, 418 450" strokeWidth="3" />
              <path className="shimmer-fast f3" d="M 398 316 C 396 364, 394 414, 390 464" strokeWidth="2.5" />
              <path className="shimmer-fast" d="M 372 298 C 364 338, 352 380, 338 422" strokeWidth="2" />
              <path className="shimmer-fast f2" d="M 426 302 C 432 344, 440 388, 450 432" strokeWidth="2" />
            </g>

            {/* ATMOSPHERIC HAZE LAYERS */}
            <ellipse cx="-10" cy="100" rx="80" ry="30" fill="#D4EEE8" opacity="0" filter="url(#medBlur)" className="haze">
              <animate attributeName="opacity" values="0.08;0.16;0.08" dur="18s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="810" cy="110" rx="80" ry="30" fill="#D0EAE4" opacity="0" filter="url(#medBlur)">
              <animate attributeName="opacity" values="0.06;0.13;0.06" dur="22s" begin="-10s" repeatCount="indefinite" />
              <animateTransform
                attributeName="transform"
                type="translate"
                dur="22s"
                begin="-10s"
                values="-10 0;10 0;-10 0"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Diyas & Boat */}
            <g opacity="0">
              <animateMotion dur="38s" repeatCount="indefinite" path="M 392 268 C 384 360, 372 470, 360 580 C 352 660, 346 750, 340 850" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.06;.88;1" dur="38s" repeatCount="indefinite" />
              <ellipse cx="0" cy="0" rx="5.5" ry="2.8" fill="#E07830" />
              <ellipse cx="0" cy="-0.8" rx="3.2" ry="1.5" fill="#F4B04E" />
              <ellipse cx="0" cy="-3.2" rx="1.4" ry="2.4" fill="#FFD873" filter="url(#glow)">
                <animate attributeName="opacity" values="1;.55;1;.75;1" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2.4;2.8;2.1;2.6;2.4" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="-3.5" rx="0.7" ry="1.4" fill="#FFFFFF" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.5;0.9;0.6;0.8" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="3.5" rx="5" ry="1.6" fill="#FFD873" opacity="0.20" filter="url(#glow)">
                <animate attributeName="opacity" values="0.20;0.12;0.22;0.14;0.20" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="-4.5" cy="1" rx="2" ry="0.9" fill="#F4A830" opacity="0.7" />
              <ellipse cx="4.5" cy="1" rx="2" ry="0.9" fill="#F4A830" opacity="0.7" />
            </g>

            <g opacity="0">
              <animateMotion dur="46s" begin="-16s" repeatCount="indefinite" path="M 416 272 C 428 366, 444 476, 456 586 C 464 666, 472 756, 482 856" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.06;.88;1" dur="46s" begin="-16s" repeatCount="indefinite" />
              <ellipse cx="0" cy="0" rx="4.8" ry="2.5" fill="#D97030" />
              <ellipse cx="0" cy="-0.7" rx="2.8" ry="1.3" fill="#F4B04E" />
              <ellipse cx="0" cy="-2.9" rx="1.2" ry="2.1" fill="#FFD873" filter="url(#glow)">
                <animate attributeName="opacity" values="1;.6;1;.78;1" dur="2.1s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2.1;2.6;1.9;2.4;2.1" dur="2.1s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="-3.2" rx="0.6" ry="1.2" fill="#FFFFFF" opacity="0.75">
                <animate attributeName="opacity" values="0.75;0.45;0.85;0.55;0.75" dur="2.1s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="3.2" rx="4.5" ry="1.4" fill="#FFD873" opacity="0.18" filter="url(#glow)">
                <animate attributeName="opacity" values="0.18;0.10;0.20;0.12;0.18" dur="2.1s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="-4" cy="0.8" rx="1.8" ry="0.8" fill="#F0A028" opacity="0.65" />
              <ellipse cx="4" cy="0.8" rx="1.8" ry="0.8" fill="#F0A028" opacity="0.65" />
            </g>

            <g opacity="0">
              <animateMotion dur="42s" begin="-30s" repeatCount="indefinite" path="M 402 276 C 400 372, 404 482, 410 592 C 414 672, 420 762, 428 860" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.06;.88;1" dur="42s" begin="-30s" repeatCount="indefinite" />
              <ellipse cx="0" cy="0" rx="5.2" ry="2.6" fill="#E07830" />
              <ellipse cx="0" cy="-0.7" rx="3" ry="1.4" fill="#F6BC5C" />
              <ellipse cx="0" cy="-3" rx="1.3" ry="2.2" fill="#FFE08A" filter="url(#glow)">
                <animate attributeName="opacity" values="1;.65;1;.6;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2.2;2.7;2.0;2.5;2.2" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="-3.4" rx="0.7" ry="1.3" fill="#FFFFFF" opacity="0.78">
                <animate attributeName="opacity" values="0.78;0.48;0.88;0.58;0.78" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="3.4" rx="5" ry="1.6" fill="#FFE08A" opacity="0.19" filter="url(#glow)">
                <animate attributeName="opacity" values="0.19;0.11;0.21;0.13;0.19" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="-4.8" cy="1" rx="2" ry="0.9" fill="#F4A428" opacity="0.68" />
              <ellipse cx="4.8" cy="1" rx="2" ry="0.9" fill="#F4A428" opacity="0.68" />
            </g>

            {/* Small wooden boat on Alaknanda */}
            <g opacity="0">
              <animateMotion
                dur="78s"
                begin="-25s"
                repeatCount="indefinite"
                rotate="auto"
                path="M 660 158 C 630 258, 606 368, 600 478 C 594 578, 602 698, 630 848"
              />
              <animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.05;.92;1" dur="78s" begin="-25s" repeatCount="indefinite" />
              <path d="M -28 -4 C -16 -2.5, -8 -1, 0 0 C -8 1, -16 2.5, -28 4" fill="none" stroke="#C8E8DC" strokeWidth="1.4" opacity="0.45" />
              <path d="M -12 0 C -10 -4, 10 -4, 14 0 C 10 4, -10 4, -12 0 Z" fill="#6B4A32" />
              <path d="M -9 0 C -8 -2.5, 8 -2.5, 11 0 C 8 2.5, -8 2.5, -9 0 Z" fill="#8A6244" />
              <circle cx="0" cy="-2.5" r="2" fill="#3A2A1C" />
              <path d="M -3 -1 L -8 2" stroke="#3A2A1C" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 3 -1 L 8 2" stroke="#3A2A1C" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="-6" cy="2" rx="3" ry="0.8" fill="#B8D8CC" opacity="0.3" />
            </g>

            {/* WATER LABELS */}
            <g fontFamily="Playfair Display, serif" fill="#FDFCF8">
              <text x="0" y="0" fontSize="28" fontStyle="italic" letterSpacing="1.8" opacity="0.88" transform="translate(140 275) rotate(-62)">
                Bhagirathi
                <animate attributeName="opacity" values="0.88;0.72;0.88" dur="12s" repeatCount="indefinite" />
              </text>
              <text x="0" y="0" fontSize="28" fontStyle="italic" letterSpacing="1.8" opacity="0.82" transform="translate(592 416) rotate(-62)">
                Alaknanda
                <animate attributeName="opacity" values="0.82;0.65;0.82" dur="15s" begin="-5s" repeatCount="indefinite" />
              </text>
              <text x="325" y="462" fontSize="34" letterSpacing="3.5" fill="#FDFCF8" opacity="0.15" filter="url(#softBlur)">
                Ganga
              </text>
              <text x="325" y="462" fontSize="34" letterSpacing="3.5" opacity="0.94">
                Ganga
              </text>
            </g>

            {/* PAGE FADE */}
            <rect x="0" y="0" width="800" height="42" fill="url(#ivoryFadeTop)" opacity="0.95" />
            <rect x="0" y="810" width="800" height="90" fill="url(#ivoryFade)" />
          </g>
        </svg>

        {/* Typed Shayari Layer */}
        <div className={`quote-overlay ${isArmed ? 'armed' : ''} ${isDone ? 'done' : ''}`} id="quoteOverlay">
          <div className="quote-diya" aria-hidden="true">
            <svg width="38" height="34" viewBox="0 0 38 34" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 22 C 9 28, 30 28, 32 22 C 27 24, 12 24, 7 22 Z" fill="#F0CE7E" />
              <path d="M 9 21 C 14 23, 26 23, 31 21" fill="none" stroke="#E8B84E" strokeWidth="0.8" opacity="0.7" />
              <path d="M19 18 C 16 13, 17 8, 19 5 C 21 8, 22 13, 19 18 Z" fill="#FFDF8E">
                <animate attributeName="opacity" values="1;.5;1;.7;1" dur="2.4s" repeatCount="indefinite" />
                <animate
                  attributeName="d"
                  values="M19 18 C 16 13, 17 8, 19 5 C 21 8, 22 13, 19 18 Z;M19 18 C 15 12, 16 7, 19 4 C 22 7, 23 12, 19 18 Z;M19 18 C 16 13, 17 8, 19 5 C 21 8, 22 13, 19 18 Z"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </path>
              <ellipse cx="19" cy="8" rx="1.2" ry="2.5" fill="#FFFFFF" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.8;0.4;0.7" dur="2.4s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>
          <div className="quote-text" id="quoteText">
            {typedText.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < typedText.split('\n').length - 1 && <br />}
              </span>
            ))}
            <span className={`cursor ${isDone ? 'done' : ''}`} id="quoteCursor"></span>
          </div>
          <div className="quote-attr" id="quoteAttr">
            — Shashank &amp; Chetna, 05 December 2026
          </div>
        </div>
      </div>
    </section>
  );
}
