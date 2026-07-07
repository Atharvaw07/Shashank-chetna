'use client';

import { useState } from 'react';

export default function RSVPSection({ lang, setModalType }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('2');
  const [message, setMessage] = useState('');
  const [selectedEvents, setSelectedEvents] = useState({
    evt1: true, // Haldi & Mehndi default checked
    evt2: false,
    evt3: false,
    evt4: false,
    evt5: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const eventMapping = {
    evt1: 'Haldi & Mehndi (Dec 4)',
    evt2: 'Ring Ceremony & Sangeet (Dec 4)',
    evt3: 'Mandap & Phere (Dec 5)',
    evt4: 'Wedding Reception (Dec 5)',
    evt5: 'Bidaai (Dec 6)',
  };

  const handleCheckboxChange = (key) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFormSubmit = async () => {
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedPhone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    const checkedEvents = Object.keys(selectedEvents)
      .filter((k) => selectedEvents[k])
      .map((k) => eventMapping[k]);

    if (checkedEvents.length === 0) {
      setErrorMsg('Please select at least one event.');
      return;
    }

    setLoading(true);

    const payload = {
      name: trimmedName,
      phone: trimmedPhone,
      city: trimmedCity,
      message: trimmedMsg,
      attending: 'yes',
      guestCount: guests,
      companions: '',
      attendingEvents: checkedEvents.join(', '),
      clientId: 'ShashankwedsChetna-wedding-2026',
    };

    try {
      const res = await fetch(
        'https://wedding-backend-production-54c0.up.railway.app/api/rsvp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (result.success === true) {
        setSuccess(true);
        setModalType('success');
      } else {
        setModalType('error');
      }
    } catch (err) {
      setModalType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp-section" className="tc reveal" style={{ position: 'relative' }}>
      {/* Decorative overlapping element */}
      <div className="decor-overlap left-align">
        <img
          src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Decorative%20elements%20(2).png"
          alt=""
        />
      </div>

      <span className="sec-label">
        {lang === 'hi' ? 'उत्सव में पधारें' : 'Join the Celebration'}
      </span>
      <h2 className="sec-heading">{lang === 'hi' ? 'शुभ सूचना' : 'RSVP'}</h2>

      <div className="rsvp-wrap">
        {!success ? (
          <div id="rsvp-form-inner">
            {/* Name */}
            <div className="rsvp-field">
              <label htmlFor="rsvp-name">
                {lang === 'hi' ? 'आपका पूरा नाम' : 'Your Full Name'}
              </label>
              <input
                type="text"
                id="rsvp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                autoComplete="name"
              />
            </div>

            {/* Phone */}
            <div className="rsvp-field">
              <label htmlFor="rsvp-phone">
                {lang === 'hi' ? 'फ़ोन / WhatsApp नंबर' : 'Phone / WhatsApp Number'}
              </label>
              <input
                type="tel"
                id="rsvp-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 (xxxx) xxx-xxx"
                autoComplete="tel"
              />
            </div>

            {/* City */}
            <div className="rsvp-field">
              <label htmlFor="rsvp-city">{lang === 'hi' ? 'शहर' : 'City'}</label>
              <input
                type="text"
                id="rsvp-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={lang === 'hi' ? 'आपका शहर' : 'Your city'}
                autoComplete="address-level2"
              />
            </div>

            {/* Guest count */}
            <div className="rsvp-field">
              <label htmlFor="rsvp-guests">
                {lang === 'hi' ? 'मेहमानों की संख्या' : 'Number of Guests'}
              </label>
              <select
                id="rsvp-guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">{lang === 'hi' ? '1 मेहमान' : '1 guest'}</option>
                <option value="2">{lang === 'hi' ? '2 मेहमान' : '2 guests'}</option>
                <option value="3">{lang === 'hi' ? '3 मेहमान' : '3 guests'}</option>
                <option value="4">{lang === 'hi' ? '4 मेहमान' : '4 guests'}</option>
                <option value="5+">{lang === 'hi' ? '5 या अधिक मेहमान' : '5 or more guests'}</option>
              </select>
            </div>

            {/* Events Attending */}
            <div className="rsvp-field">
              <label>
                {lang === 'hi'
                  ? 'आप किन कार्यक्रमों में शामिल होंगे'
                  : 'Events You Will Attend'}
              </label>
              <div className="evt-checks">
                <label className="evt-chk">
                  <input
                    type="checkbox"
                    checked={selectedEvents.evt1}
                    onChange={() => handleCheckboxChange('evt1')}
                  />
                  <span>
                    {lang === 'hi' ? 'हल्दी & मेहंदी — 04 दिसं. ✦' : 'Haldi & Mehndi — Dec 04 ✦'}
                  </span>
                </label>
                <label className="evt-chk">
                  <input
                    type="checkbox"
                    checked={selectedEvents.evt2}
                    onChange={() => handleCheckboxChange('evt2')}
                  />
                  <span>
                    {lang === 'hi'
                      ? 'सगाई & संगीत — 04 दिसं.'
                      : 'Ring Ceremony & Sangeet — Dec 04'}
                  </span>
                </label>
                <label className="evt-chk">
                  <input
                    type="checkbox"
                    checked={selectedEvents.evt3}
                    onChange={() => handleCheckboxChange('evt3')}
                  />
                  <span>
                    {lang === 'hi' ? 'मंडप & फेरे — 05 दिसं.' : 'Mandap & Phere — Dec 05'}
                  </span>
                </label>
                <label className="evt-chk">
                  <input
                    type="checkbox"
                    checked={selectedEvents.evt4}
                    onChange={() => handleCheckboxChange('evt4')}
                  />
                  <span>
                    {lang === 'hi' ? 'विवाह स्वागत — 05 दिसं.' : 'Wedding Reception — Dec 05'}
                  </span>
                </label>
                <label className="evt-chk">
                  <input
                    type="checkbox"
                    checked={selectedEvents.evt5}
                    onChange={() => handleCheckboxChange('evt5')}
                  />
                  <span>{lang === 'hi' ? 'विदाई — 06 दिसं.' : 'Bidaai — Dec 06'}</span>
                </label>
              </div>
            </div>

            {/* Message & Blessings */}
            <div className="rsvp-field" style={{ marginTop: '1rem' }}>
              <label htmlFor="rsvp-msg">
                {lang === 'hi' ? 'संदेश & आशीर्वाद (वैकल्पिक)' : 'Message & Blessings (Optional)'}
              </label>
              <textarea
                id="rsvp-msg"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'जोड़े को अपना आशीर्वाद और शुभकामनाएँ दें…'
                    : 'Send your heartfelt wishes to the couple…'
                }
              />
            </div>

            {/* Error Message display */}
            {errorMsg && (
              <div id="rsvp-error" style={{ display: 'block' }}>
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              className="rsvp-btn"
              id="rsvp-submit-btn"
              onClick={handleFormSubmit}
              disabled={loading}
            >
              <span>{loading ? 'Sending...' : (lang === 'hi' ? 'पुष्टि करें →' : 'Confirm RSVP →')}</span>
              {loading && (
                <svg
                  id="rsvp-btn-spinner"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}
                  className="spin"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" strokeOpacity="0.75" />
                </svg>
              )}
            </button>

            {/* Contacts Info */}
            <div className="rsvp-divider">
              {lang === 'hi' ? '— संपर्क विवरण —' : '— Contact Details —'}
            </div>
            <div className="contact-plain">
              <strong>
                {lang === 'hi' ? 'चतुर्वेदी परिवार की ओर से' : 'From the Chaturvedi Family'}
              </strong>
              <span>
                <strong style={{ display: 'inline', marginRight: '4px' }}>Shashank:</strong>
                +91 9654827147
              </span>
              <span>
                <strong style={{ display: 'inline', marginRight: '4px' }}>Kaushalendra Chaturvedi:</strong>
                +91 9406912127
              </span>
              <span>
                <strong style={{ display: 'inline', marginRight: '4px' }}>Rashmi Chaturvedi:</strong>
                +91 6263 279 009
              </span>
              <span>
                <strong style={{ display: 'inline', marginRight: '4px' }}>Siddhant Chaturvedi:</strong>
                +91 96195 81224
              </span>
            </div>
          </div>
        ) : (
          <div id="rsvp-success" style={{ display: 'block' }}>
            <span className="success-icon">🙏</span>
            <span className="success-title">
              {lang === 'hi' ? 'धन्यवाद!' : 'Dhanyavaad!'}
            </span>
            <p className="success-msg">
              {lang === 'hi'
                ? 'हम आभारी हैं। पवित्र गंगा के तट पर आपके साथ उत्सव मनाने की प्रतीक्षा है। परिवार जल्द ही संपर्क करेगा।'
                : 'We are so grateful and excited to celebrate with you by the holy Ganga. Our family will be in touch soon with all the details.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
