import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          
          {/* Icon Centerpiece */}
          <div className="footer-icon-wrapper">
            <img src="/icon white.png" alt="LaunchPad Icon" className="footer-icon" />
          </div>

          {/* Quick Links */}
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/ceylinco-life">Ceylinco Life</Link>
            <Link to="/legacy">Legacy</Link>
            <Link to="/team">Team</Link>
            <Link to="/event">Event</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/register">Register</Link>
          </nav>

          {/* Social Icons */}
          <div className="footer-socials">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp size={20} /></a>
          </div>

          {/* Powered By */}
          <div className="footer-powered">
            <img src="/powered by white.png" alt="Powered By LaunchPad" className="footer-powered-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>

        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LaunchPad 4.0 by AIESEC. All rights reserved.</p>
          <p className="footer-tagline">Made by AIESEC in USJ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
