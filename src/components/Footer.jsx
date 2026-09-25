"use client";

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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
            <p className="footer-sub-brand">A Project by AIESEC in University of Sri Jayewardenepura</p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/AIESECLK" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <FaFacebookF size={18} />
              </a>
              <a href="https://www.instagram.com/aiesecinsrilanka/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="https://x.com/AIESEClk" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="X (Twitter)">
                <FaXTwitter size={18} />
              </a>
              <a href="https://www.linkedin.com/company/aieseclk/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <FaLinkedinIn size={18} />
              </a>
            </div>
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
              <Link href="/ambassadors">Register as an Ambassador</Link>
              <span style={{ cursor: 'not-allowed', opacity: 0.5 }} title="Coming Soon">
                Shop <Lock size={11} style={{ marginLeft: '2px' }} />
              </span>
              <Link href="/register">Register Now</Link>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; All rights reserved.</p>
          <p>Made with ❤️ by AIESEC in University of Sri Jayewardenepura</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
