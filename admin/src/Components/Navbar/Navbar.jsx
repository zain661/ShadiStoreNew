// import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/logo (3).png';
import navProfile from '../../assets/nav-profile.svg';

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src={navlogo} alt="" className="nav-logo" />
            <img src={navProfile} alt="" className="nav-profile" />
        </div>
    );
}

export default Navbar;
