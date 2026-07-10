'use client';

import { useState, useEffect, useRef } from 'react';
import { beginDeferredMediaLoad } from './lib/deferredMedia';
import VideoEntryGate from './components/VideoEntryGate';
import AudioControl from './components/AudioControl';
import Petals from './components/Petals';
import HeroSection from './components/HeroSection';
import FamilySection from './components/FamilySection';
import CountdownSection from './components/CountdownSection';
import StorySection from './components/StorySection';
import VenueSection from './components/VenueSection';
import EventsSection from './components/EventsSection';
import SangamSection from './components/SangamSection';
import RSVPSection from './components/RSVPSection';
import FooterSection from './components/FooterSection';
import RsvpModal from './components/RsvpModal';

export default function WeddingPage() {
  const [lang, setLang] = useState('en');
  const [revealed, setRevealed] = useState(false);
  const [musicWanted, setMusicWanted] = useState(false);
  const [modalType, setModalType] = useState(null); // 'success' | 'error' | null
  const audioRef = useRef(null);

  // Sync translation to document elements
  useEffect(() => {
    document.body.classList.toggle('lang-hi', lang === 'hi');
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  // Sync body scroll lock on Entry Gate
  useEffect(() => {
    if (!revealed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [revealed]);

  // Scroll reveal Intersection Observer
  useEffect(() => {
    if (!revealed) return;

    const items = document.querySelectorAll('.reveal:not(.revealed)');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [revealed]);

  // Global right click disable for video/media hardening
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'VIDEO' || e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handlePlayStart = () => {
    setMusicWanted(true);
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
    // Start sequential downloading of rest of media files in the background!
    // delay this slightly to let the first video stream without network contention
    setTimeout(() => {
      beginDeferredMediaLoad();
    }, 5000);
  };

  const handleReveal = () => {
    setRevealed(true);
    // Double protection trigger
    setTimeout(() => {
      beginDeferredMediaLoad();
    }, 5000);
  };

  return (
    <>
      {/* Background Audio */}
      <audio
        id="bg-audio"
        ref={audioRef}
        loop
        preload="auto"
        src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/June/Ajay%20%26%20Himani%20-%20Gunveen/Sunehra%20-%20Lost%20Stories.mp3"
      />

      {/* Entry Gate overlay */}
      <VideoEntryGate onPlayStart={handlePlayStart} onReveal={handleReveal} />

      {/* Main content layer, rendered but visually hidden behind the gate */}
      <div id="main-content" className={revealed ? 'visible' : ''} aria-hidden={!revealed}>
        {/* Floating Petals Canvas */}
        {revealed && <Petals />}

        {/* Audio Toggle Button */}
        <AudioControl
          audioRef={audioRef}
          musicWanted={musicWanted}
          setMusicWanted={setMusicWanted}
        />

        {/* Language Pill */}
        <div id="lang-pill" title="Switch language">
          <span
            id="lang-en"
            className={`lang-opt en-opt ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </span>
          <div className="lang-divider"></div>
          <span
            id="lang-hi"
            className={`lang-opt hi-opt ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => setLang('hi')}
          >
            हिं
          </span>
        </div>

        {/* Fixed Side Border Decorations */}
        <div className="decor-left">
          <img
            src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Decorative%20elements%20(1).png"
            alt=""
          />
        </div>
        <div className="decor-right">
          <img
            src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Decorative%20elements%20(2).png"
            alt=""
          />
        </div>

        {/* Sections */}
        <HeroSection revealed={revealed} preloadHero={musicWanted} />
        <FamilySection lang={lang} />
        <CountdownSection lang={lang} />
        <StorySection lang={lang} />
        <VenueSection lang={lang} />
        <EventsSection lang={lang} />
        <SangamSection />
        <RSVPSection lang={lang} setModalType={setModalType} />
        <FooterSection lang={lang} />

        {/* RSVP modal overlay */}
        {modalType && (
          <RsvpModal type={modalType} onClose={() => setModalType(null)} />
        )}
      </div>
    </>
  );
}
