'use client';

export default function FamilySection({ lang }) {
  const blankSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

  return (
    <section id="family-section">
      {/* Top right overlapping lotus decoration */}
      <div className="decor-overlap right-align">
        <img
          data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Decorative%20lotus.png"
          src={blankSvg}
          alt=""
        />
      </div>

      <div className="family-card reveal">
        {/* Animated Ganesh ji Icon */}
        <img
          className="ganesh-icon"
          data-src="https://pub-1953a6673e864f3488c645252f75de98.r2.dev/July/Shashank%20%26%20Chetna%20-%20December/Ganesh%20ji%20Icon.png"
          src={blankSvg}
          alt="Shri Ganesh"
        />

        {/* Shloka */}
        <p className="shloka-text">
          ।। श्री गणेशाय नमः ।।
          <br />
          वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः ।
          <br />
          निर्विघ्नं कुरुमे देव, सर्व कार्येषु सर्वदा ।।
        </p>

        {/* Invitation Text */}
        {lang === 'hi' ? (
          <p
            className="invite-text"
            style={{ marginBottom: '1.5rem' }}
            dangerouslySetInnerHTML={{
              __html: `स्वर्गीय श्री रामकृष्ण चतुर्वेदी & स्वर्गीय श्रीमती कुंती चतुर्वेदी<br>स्व. श्रीमती जंत्रो देवी जैन & स्व. लाला लखीराम जैन<br>के दिव्य आशीर्वाद से<br><br>हम आपको सादर आमंत्रित करते हैं इस मंगलमय विवाह समारोह में`,
            }}
          />
        ) : (
          <p
            className="invite-text"
            style={{ marginBottom: '1.5rem' }}
            dangerouslySetInnerHTML={{
              __html: `With the divine blessings of<br>Late Shri Ram Krishna Chaturvedi &amp; Late Smt. Kunti Chaturvedi<br>Lt. Smt. Jantro Devi Jain &amp; Lt. Lala Lakhi Ram Jain<br><br>We request the honour of your gracious presence at the wedding celebrations of`,
            }}
          />
        )}

        {/* Groom Profile */}
        <span className="couple-name name-shimmer">Shashank</span>
        <span className="parent-sub" id="groom-parent">
          {lang === 'hi'
            ? 'पुत्र: कौशलेन्द्र चतुर्वेदी & राश्मी चतुर्वेदी'
            : 'Son of Kaushalendra Chaturvedi & Rashmi Chaturvedi'}
        </span>

        {/* Ampersand Divider */}
        <div className="amp-row">
          <div className="amp-line"></div>
          <span className="amp">&</span>
          <div className="amp-line"></div>
        </div>

        {/* Bride Profile */}
        <span className="couple-name name-shimmer">Chetna</span>
        <span className="parent-sub" id="bride-parent">
          {lang === 'hi'
            ? 'पुत्री: स्व. श्री सुरिंदर कुमार जैन & श्रीमती कुसुम जैन'
            : 'Daughter of Lt. Sh. Surinder Kumar Jain & Smt. Kusum Jain'}
        </span>
      </div>
    </section>
  );
}
