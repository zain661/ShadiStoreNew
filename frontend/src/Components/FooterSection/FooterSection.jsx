import React from 'react';
import './FooterSection.css';
import { Link } from 'react-router-dom';
const FooterSection = () => {
  return (
    <div className="footer-container">
      <div className="footer-column">
        <h3>شادي للأزياء</h3>
        <p>معرض شادي للأزياء والمطرزات الفلسطينية يقدم جميع المنتجات والاعمال اليدوية من ملابس واكسسوارات وأحذية وحقائب.</p>
      </div>
      <div className="footer-column">
        <h3>الوصول السريع</h3>
        <ul>
          <li><Link to='/arak' style={{ textDecoration: 'none' }}>أعراق تراثية</Link></li>
          <li><Link to='/turath' style={{ textDecoration: 'none' }}>أثواب تراثية</Link></li>
          <li><Link to='/jacket' style={{ textDecoration: 'none' }}>جكيتات مطرزة</Link></li>
          <li><Link to='/girls' style={{ textDecoration: 'none' }}>أثواب بناتية</Link></li>
          <li><Link to='/accessories' style={{ textDecoration: 'none' }}>اكسسوارات</Link></li>
          <li><Link to='/shoes' style={{ textDecoration: 'none' }}>أحذية</Link></li>
          <li><Link to='/bride' style={{ textDecoration: 'none' }}>عرايسي</Link></li>
          <li><Link to='/fashion' style={{ textDecoration: 'none' }}>تطريز بأحدث الصيحات</Link></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>شادي للأزياء</h3>
        <ul>
          <li><Link to=''></Link></li>
          <li> تواصل معنا عبر الرقم الاتي:<br/> 00972-569483732</li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>السياسات</h3>
        <ul>
          <li><Link to='/policy'>سياسة الترجيع والتبديل</Link></li>
          {/* <li>الشحن</li>
          <li>الإرجاع</li>
          <li>سياسة الدفع</li> */}
        </ul>
      </div>
      <div className="footer-column">
        <h3>حسابي</h3>
        <ul>
          <li><Link to='/login' style={{ textDecoration: 'none' }}>تسجيل الدخول</Link></li>
          <li><Link to='/register' style={{ textDecoration: 'none' }}>إنشاء حساب</Link></li>
          <li><Link to='/cart' style={{ textDecoration: 'none' }}>سلة التسوق</Link></li>
          {/* <li>قائمة الرغبات</li>
          <li>تتبع الطلب</li>
          <li>تاريخ الطلبات</li> */}
        </ul>
      </div>
    </div>
  );
};

export default FooterSection;
