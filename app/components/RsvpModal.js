'use client';

export default function RsvpModal({ type, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target.id === 'rsvp-modal-overlay') {
      onClose();
    }
  };

  const isSuccess = type === 'success';

  return (
    <div
      id="rsvp-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13,59,52,0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: '1.5rem',
          maxWidth: '380px',
          width: '100%',
          padding: '3rem 2rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
          animation: 'modalIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Status Icon */}
        <div
          id="modal-icon-ring"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: isSuccess ? 'rgba(27, 107, 95, 0.1)' : 'rgba(220, 38, 38, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          {isSuccess ? (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ width: '32px', color: 'var(--teal-dark)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ width: '32px', color: '#dc2626' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Modal Title */}
        <h3
          style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: '3.5rem',
            color: isSuccess ? 'var(--teal-dark)' : '#dc2626',
            marginBottom: '.5rem',
          }}
        >
          {isSuccess ? 'Thank You!' : 'Oops!'}
        </h3>

        {/* Modal message */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: 'var(--text-mid)',
            marginBottom: '2rem',
          }}
        >
          {isSuccess
            ? "We can't wait to celebrate with you by the holy Ganga!"
            : 'There was an error submitting your RSVP. Please try again.'}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: 'var(--teal-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem 3rem',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '.7rem',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            width: '100%',
            transition: 'all .2s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
