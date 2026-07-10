'use client';

import { useState, useEffect } from 'react';

export default function CountdownSection({ lang }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: December 05, 2026
    const targetDate = new Date('2026-12-05T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  const labels = lang === 'hi' 
    ? { days: 'दिन', hours: 'घंटे', minutes: 'मिनट', seconds: 'सेकंड' }
    : { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' };

  return (
    <section id="countdown-section">
      <div className="cd-card reveal">
        <p className="cd-quote">
          {lang === 'hi' 
            ? 'दो दिलों का मिलन, एक नई शुरुआत' 
            : 'Two hearts, one beautiful journey'}
        </p>
        <span className="cd-script">
          {lang === 'hi' ? 'हमारा विवाह' : 'Our Wedding'}
        </span>
        <span className="cd-date">
          {lang === 'hi' ? '05 दिसंबर 2026' : '05 December 2026'}
        </span>
        
        <div className="cd-grid">
          <div className="cd-unit">
            <span className="cd-num">{timeLeft.days}</span>
            <span className="cd-lbl">{labels.days}</span>
          </div>
          <div className="cd-unit">
            <span className="cd-num">{timeLeft.hours}</span>
            <span className="cd-lbl">{labels.hours}</span>
          </div>
          <div className="cd-unit">
            <span className="cd-num">{timeLeft.minutes}</span>
            <span className="cd-lbl">{labels.minutes}</span>
          </div>
          <div className="cd-unit">
            <span className="cd-num">{timeLeft.seconds}</span>
            <span className="cd-lbl">{labels.seconds}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
