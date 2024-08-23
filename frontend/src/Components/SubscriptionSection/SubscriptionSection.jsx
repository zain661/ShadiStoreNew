import React from 'react';
import './SubscriptionSection.css';
import insta1 from '../Assets/instaa-removebg-preview.png';
import insta2 from '../Assets/facebookIcon.png';
import tiktok from '../Assets/tiktok.png';
// import insta3 from '../Assets/insta1.jpg';
// import insta4 from '../Assets/insta1.jpg';
const SubscriptionSection = () => {
  return (
    <div className="subscription-container">
      <div className="subscription-content">
        <h2>
          اشترك في <span className="highlight">نشرتنا البريدية</span> وتلقّى
          أحدث الأخبار <span className="highlight">حول المنتجات الجديدة</span>
        </h2>
        <div className="subscription-form">
          <input type="email" placeholder="عنوان بريدك الالكتروني" />
          <button type="button">اشترك</button>
        </div>
      </div>
      <div className="instagram-content">
        <h2>تابعونا على الانستغرام والفيسبوك والتيكتوك</h2>
        <div className="instagram-images">
          <a
            href="https://www.instagram.com/shadi.embroidery.fashions?igsh=MXVyeDZramlybXJpbw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={insta1} alt="Instagram page" />
          </a>
          <a
            href="https://www.facebook.com/Shadi.Fashions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={insta2} alt="facebook page" />
          </a>
          <a
            href="https://www.facebook.com/Shadi.Fashions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktok} alt="tiktok page" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
