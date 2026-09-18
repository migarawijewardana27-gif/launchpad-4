"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Award, Quote, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import SectionDivider from '../../components/SectionDivider';
import './CeylincoLife.css';

const BenefitCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    className="benefit-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(139, 0, 0, 0.15)' }}
  >
    <div className="benefit-icon">
      <Icon size={30} />
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);

const StatPill = ({ number, label }) => (
  <motion.div
    className="stat-pill"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </motion.div>
);

const CeylincoLife = () => {
  return (
    <div className="page-wrapper ceylinco-page">

      {/* SECTION 1: Cinematic Hero — RED with background */}
      <section className="ceylinco-hero theme-red">
        <div className="ceylinco-hero-bg-overlay" />
        <div className="container">
          <motion.div
            className="ceylinco-hero-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              Title Partner
            </div>
            <div className="logo-lockup-glass">
              <img src="/White Logo.png" alt="LaunchPad 4.0 Logo" className="lockup-logo lp-logo" />
              <div className="lockup-divider" />
              <img src="/ceylinco.png" alt="Ceylinco Life Logo" className="lockup-logo ceylinco-logo" />
            </div>
            <h1 className="hero-headline-cey">Empowering the Next Generation</h1>
            <p className="hero-subheadline-white">
              A partnership dedicated to bridging the gap between youth potential and the corporate world.
            </p>
            <div className="hero-stats-row">
              <StatPill number="50+" label="Years Legacy" />
              <StatPill number="1M+" label="Policyholders" />
              <StatPill number="3" label="Mentorship Circles" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Angled Divider into WHITE */}
      <SectionDivider fillColor="#F8FAFC" />

      {/* SECTION 2: Commitment — WHITE */}
      <section className="commitment-section section-padding theme-white">
        <div className="container">
          <div className="commitment-layout">
            <motion.div
              className="commitment-text-side"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="section-label">The Partnership</div>
              <h2>A Commitment to Youth Development</h2>
              <p>
                As the leading life insurance provider in Sri Lanka, Ceylinco Life has always been deeply invested in the future of our nation. By partnering with LaunchPad 4.0, they aim to bridge the gap between academic education and the dynamic needs of the corporate world.
              </p>
              <p>
                This collaboration is more than just a sponsorship — it's a shared vision to nurture talent, foster leadership, and create meaningful opportunities for the next generation.
              </p>
            </motion.div>

            <motion.div
              className="commitment-image-side"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="partner-media-grid">
                <div className="media-box primary-box">
                  <img src="/ceylinco/HQ.webp" alt="Ceylinco Life HQ" className="media-img" />
                </div>
                <div className="media-box secondary-box-1">
                  <img src="/ceylinco/P1.jpg" alt="Initiative 1" className="media-img" />
                </div>
                <div className="media-box secondary-box-2">
                  <img src="/ceylinco/P2.jpg" alt="Initiative 2" className="media-img" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Angled Divider into RED */}
      <SectionDivider flip fillColor="#8B0000" />

      {/* SECTION 3: Leadership Quote — RED */}
      <section className="leadership-message-section section-padding theme-red">
        <div className="container">
          <motion.div
            className="editorial-quote-block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="author-image-container">
              <img src="/ceylinco/Chamath.png" alt="Mr. Chamath Alwis" className="author-large-image" />
              <div className="author-image-caption">
                <h4>Mr. Chamath Alwis</h4>
                <p>AGM, Brand Development<br />Ceylinco Life</p>
              </div>
            </div>
            <div className="editorial-content">
              <div className="section-label">Leadership Speaks</div>
              <div className="quote-icon-container">
                <Quote size={56} className="editorial-quote-icon" />
              </div>
              <blockquote>
                "A quote on AIESEC and LaunchPad given by Mr. Chamath will be added here"
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Angled Divider into WHITE */}
      <SectionDivider fillColor="#F8FAFC" />

      {/* SECTION 4: Opportunities — WHITE */}
      <section className="opportunities-section section-padding theme-white">
        <div className="container">
          <motion.div
            className="center-align"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>What's In It For You</div>
            <h2>Opportunities at LaunchPad 4.0</h2>
            <p style={{ maxWidth: '560px', margin: '0 auto 4rem', color: '#555' }}>
              Discover how Ceylinco Life is adding immense value to your LaunchPad experience.
            </p>
          </motion.div>
          <div className="benefits-grid">
            <BenefitCard
              icon={TrendingUp}
              title="Career Fast-Tracking"
              desc="Exclusive fast-track interview opportunities for outstanding delegates at the career fair."
              delay={0.1}
            />
            <BenefitCard
              icon={Award}
              title="Mentorship Programs"
              desc="Connect with senior leadership from Ceylinco Life through dedicated mentorship circles."
              delay={0.2}
            />
            <BenefitCard
              icon={Shield}
              title="Skill Masterclasses"
              desc="Specialized sessions on financial literacy and personal branding in the corporate sector."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Angled Divider into RED */}
      <SectionDivider flip fillColor="#8B0000" />

      {/* SECTION 5: Connect — RED */}
      <section className="digital-footprint-section section-padding theme-red">
        <div className="container">
          <motion.div
            className="footprint-content center-align"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>Stay Connected</div>
            <h2>Connect with Ceylinco Life</h2>
            <p className="footprint-subtext mx-auto">
              Explore their initiatives, career opportunities, and stay updated with the latest news.
            </p>

            <div className="social-hub">
              <a href="https://www.ceylincolife.com/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaGlobe size={26} /></div>
                <span>Website</span>
              </a>
              <a href="https://www.linkedin.com/company/ceylinco-life/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaLinkedinIn size={26} /></div>
                <span>LinkedIn</span>
              </a>
              <a href="https://www.facebook.com/ceylincolife/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaFacebookF size={26} /></div>
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/ceylincolife/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaInstagram size={26} /></div>
                <span>Instagram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default CeylincoLife;
