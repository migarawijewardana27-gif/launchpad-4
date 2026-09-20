"use client";

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* LEFT: Brand Column */}
          <div className="footer-brand">
            <img src="/icon white.png" alt="LaunchPad Icon" className="footer-brand-icon" />
            <p className="footer-tagline-text">
              Empowering Sri Lanka's youth for the global stage.
            </p>
            <p className="footer-sub-brand">A Project by AIESEC in USJ</p>
          </div>

          {/* CENTER: Quick Links */}
          <div>
            <div className="footer-col-title">Navigate</div>
            <div className="footer-nav-col">
              <Link href="/">Home</Link>
              <Link href="/legacy">Legacy</Link>
              <Link href="/team">Team</Link>
              <span style={{ cursor: 'not-allowed', opacity: 0.5 }} title="Coming Soon">
                Event <Lock size={11} style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>

          {/* RIGHT: More Links */}
          <div>
            <div className="footer-col-title">More</div>
            <div className="footer-nav-col">
              <Link href="/updates">Updates</Link>
              <span style={{ cursor: 'not-allowed', opacity: 0.5 }} title="Coming Soon">
                Shop <Lock size={11} style={{ marginLeft: '2px' }} />
              </span>
              <Link href="/register">Register Now</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LaunchPad 4.0 by AIESEC. All rights reserved.</p>
          <p>Made with ❤️ by AIESEC in USJ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
