import React, { useState, useContext, useRef, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo (3).png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/dropdown_icon.png';

export default function Navbar() {
  const [menu, setMenu] = useState('shop');
  const [showSubmenu, setShowSubmenu] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
    window.location.replace('/');
  };

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const closeMenu = () => {
    menuRef.current.classList.remove('nav-menu-visible');
    document.querySelector('.nav-dropdown').classList.remove('open');
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="Logo" />
        </div>
        <img
          className="nav-dropdown"
          onClick={dropdown_toggle}
          src={nav_dropdown}
          alt=""
        />
        <ul ref={menuRef} className="nav-menu">
          <li
            onClick={() => {
              setMenu('shop');
              closeMenu();
            }}
          >
            <Link to="/" style={{ textDecoration: 'none' }}>
              الصفحة الرئيسية
            </Link>
            {menu === 'shop' ? <hr /> : <></>}
          </li>
          <li
            onMouseEnter={() => setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
          >
            <span>مطرزات</span>
            {showSubmenu && (
              <ul className="sub-menu">
                <li onClick={closeMenu}>
                  <Link to="/turath" style={{ textDecoration: 'none' }}>
                    أثواب تراثية
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/arek" style={{ textDecoration: 'none' }}>
                    أعراق تراثية
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/jacket" style={{ textDecoration: 'none' }}>
                    جكيتات مطرزة
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/girls" style={{ textDecoration: 'none' }}>
                    أثواب بناتية
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/accessories" style={{ textDecoration: 'none' }}>
                    اكسسوارات
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/shoes" style={{ textDecoration: 'none' }}>
                    أحذية
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/bride" style={{ textDecoration: 'none' }}>
                    عرايسي
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link to="/fashion" style={{ textDecoration: 'none' }}>
                    تطريز بأحدث الصيحات
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => {
              setMenu('womens');
              closeMenu();
            }}
          >
            <Link to="/womens" style={{ textDecoration: 'none' }}>
              ملابس نسائية
            </Link>
            {menu === 'womens' ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu('policy');
              closeMenu();
            }}
          >
            <Link to="/policy" style={{ textDecoration: 'none' }}>
              سياسة الترجيع والتبديل
            </Link>
            {menu === 'policy' ? <hr /> : <></>}
          </li>
        </ul>
        <div className="nav-login-cart">
          {isAuthenticated ? (
            <button onClick={handleLogout}>تسجيل خروج</button>
          ) : (
            <Link to="/login">
              <button>تسجيل دخول</button>
            </Link>
          )}
          {/* <Link to='/wishlist' className='nav-icon'>
            <img src={wishlist_icon} alt="Wishlist" className='wish' />
          </Link> */}
          <Link to="/cart" className="nav-icon" onClick={closeMenu}>
            <img src={cart_icon} alt="Cart" />
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
      <div className="line-design"></div>{' '}
      {/* Line placed directly under navbar */}
    </div>
  );
}
