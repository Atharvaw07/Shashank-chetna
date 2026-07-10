'use client';

export default function StorySection({ lang }) {
  return (
    <section id="story-section">
      <div className="story-wrap reveal">
        <span className="sec-label">
          {lang === 'hi' ? 'हमारी कहानी' : 'Our Story'}
        </span>
        <h2 className="sec-heading">
          {lang === 'hi' ? 'जहाँ से शुरू हुई कहानी' : 'Where Forever Began'}
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.15rem',
            lineHeight: 1.75,
            color: 'var(--text-mid)',
            margin: '1.5rem auto 1rem',
            maxWidth: '520px',
            padding: '0 1rem',
          }}
        >
          {lang === 'hi'
            ? 'हमारी यात्रा न्यूज़ीलैंड के दक्षिणी आकाश के नीचे शुरू हुई। बर्फ से ढकी पर्वतमालाओं से लेकर शांत प्रशांत तटों तक, हमारा प्रेम खिला। अब हम गंगा के पवित्र तट पर घर वापस अपने जीवन का अगला कदम उठाते हैं।'
            : 'Our journey started under the breathtaking southern skies of New Zealand. From the majestic snow-capped peaks to the tranquil Pacific shores, our love blossomed in the Land of the Long White Cloud. Now, we take the next step of our adventure back home by the holy banks of the Ganga.'}
        </p>

        {/* New Zealand Constellation Element */}
        <div className="nz-element">
          <svg
            viewBox="0 0 100 100"
            className="nz-stars"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Southern Cross Stars */}
            <circle cx="50" cy="15" r="3" fill="var(--gold)" />
            <circle cx="20" cy="50" r="3.5" fill="var(--gold)" />
            <circle cx="80" cy="45" r="3" fill="var(--gold)" />
            <circle cx="53" cy="85" r="4" fill="var(--gold)" />
            <circle cx="62" cy="58" r="1.5" fill="var(--gold)" />
            {/* Constellation lines */}
            <line
              x1="50"
              y1="15"
              x2="53"
              y2="85"
              stroke="var(--gold-pale)"
              strokeDasharray="2 2"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <line
              x1="20"
              y1="50"
              x2="80"
              y2="45"
              stroke="var(--gold-pale)"
              strokeDasharray="2 2"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </svg>
          <span className="nz-label">
            {lang === 'hi'
              ? 'NZ · जहाँ हमारी कहानी शुरू हुई'
              : 'NZ · Where Our Story Started'}
          </span>
        </div>

        <div className="swiper-video-box">
          <video
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
              data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Swiper%20video%20(2)%20(1).mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}
