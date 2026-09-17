"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Award, Quote } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import './CeylincoLife.css';

const BenefitCard = ({ icon: Icon, title, desc, delay, isDark }) => (
  <motion.div
    className={`benefit-card glass-panel ${isDark ? 'dark-card' : ''}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(211, 47, 47, 0.15)' }}
  >
    <div className="benefit-icon">
      <Icon size={32} />
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);

const CeylincoLife = () => {
  return (
    <div className="page-wrapper ceylinco-page">

      {/* SECTION 1: Hero Section (Deep Garnet) */}
      <section className="ceylinco-hero theme-red">
        <div className="container">
          <motion.div
            className="ceylinco-hero-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="partnership-badge-glass">Title Partner</div>

            <div className="logo-lockup-glass">
              <img src="/White Logo.png" alt="LaunchPad 4.0 Logo" className="lockup-logo lp-logo" />
              <div className="lockup-divider"></div>
              <img src="/ceylinco.png" alt="Ceylinco Life Logo" className="lockup-logo ceylinco-logo" />
            </div>

            <p className="hero-subheadline-white">
              A partnership dedicated to empowering the next generation of leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Commitment Section (Pure White -> Dark Glassmorphism) */}
      <section className="commitment-section section-padding theme-red">
        <div className="container">
          <div className="commitment-asymmetric-grid">
            <motion.div
              className="commitment-card main-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Commitment to Youth Development</h2>
              <p>
                As the leading life insurance provider in Sri Lanka, Ceylinco Life has always been deeply invested in the future of our nation. By partnering with LaunchPad 4.0, Ceylinco Life aims to bridge the gap between academic education and the dynamic needs of the corporate world.
              </p>
            </motion.div>

            <motion.div
              className="commitment-card secondary-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card-icon-wrapper">
                <Shield size={40} className="apricot-icon" />
              </div>
              <p>
                This collaboration is more than just a sponsorship; it's a shared vision to nurture talent, foster leadership skills, and create meaningful opportunities for the youth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Leadership Message (Peachy Cream) */}
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
            </div>
            <div className="editorial-content">
              <div className="quote-icon-container">
                <Quote size={60} className="editorial-quote-icon" />
              </div>
              <blockquote>
                "A quote on AIESEC and Launchpad given by Mr. Chamath will be added here"
              </blockquote>
              <div className="author-details-new">
                <h4>Mr. Chamath Alwis</h4>
                <p>Assistant General Manager<br></br>Brand Development<br></br>Ceylinco Life Insurance Limited</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Opportunities Section (Dark Glassmorphism) */}
      <section className="opportunities-section section-padding theme-red">
        <div className="container">
          <motion.div
            className="section-header center-align"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Opportunities at LaunchPad 4.0</h2>
            <p className="max-w-md mx-auto">Discover how Ceylinco Life is adding immense value to your LaunchPad experience.</p>
          </motion.div>

          <div className="benefits-grid">
            <BenefitCard
              icon={TrendingUp}
              title="Career Fast-Tracking"
              desc="Exclusive fast-track interview opportunities for outstanding delegates at the career fair."
              delay={0.1}
              isDark={true}
            />
            <BenefitCard
              icon={Award}
              title="Mentorship Programs"
              desc="Connect with senior leadership from Ceylinco Life through dedicated mentorship circles."
              delay={0.2}
              isDark={true}
            />
            <BenefitCard
              icon={Shield}
              title="Skill Masterclasses"
              desc="Specialized sessions focused on financial literacy and personal branding in the corporate sector."
              delay={0.3}
              isDark={true}
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: Digital Footprint (Deep Garnet) */}
      <section className="digital-footprint-section section-padding theme-red">
        <div className="container">
          <motion.div
            className="footprint-content center-align"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-md">Connect with Ceylinco Life</h2>
            <p className="footprint-subtext mx-auto">
              Explore their initiatives, career opportunities, and stay updated with the latest news by following their official channels.
            </p>

            <div className="social-hub">
              <a href="https://www.ceylincolife.com/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaGlobe size={28} /></div>
                <span>Website</span>
              </a>
              <a href="https://www.linkedin.com/company/ceylinco-life/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaLinkedinIn size={28} /></div>
                <span>LinkedIn</span>
              </a>
              <a href="https://www.facebook.com/ceylincolife/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaFacebookF size={28} /></div>
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/ceylincolife/" target="_blank" rel="noopener noreferrer" className="hub-link">
                <div className="hub-icon-wrapper"><FaInstagram size={28} /></div>
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

