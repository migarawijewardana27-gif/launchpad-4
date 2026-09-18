"use client";

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Lock } from 'lucide-react';
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
            <Link href="/">Home</Link>
            <Link href="/ceylinco-life">Ceylinco Life</Link>
            <Link href="/legacy">Legacy</Link>
            <Link href="/team">Team</Link>
            <span style={{ cursor: 'not-allowed', opacity: 0.6, display: 'inline-flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', margin: '0 1rem' }} title="Coming Soon">
              Event <Lock size={12} style={{ marginLeft: '4px' }} />
            </span>
            <Link href="/shop">Shop</Link>
            <Link href="/register">Register</Link>
          </nav>


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
