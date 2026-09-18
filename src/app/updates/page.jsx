"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaPlay, FaPodcast, FaArrowRight } from 'react-icons/fa';
import SectionDivider from '../../components/SectionDivider';
import './Updates.css';

const Updates = () => {
  return (
    <div className="page-wrapper updates-page">

      {/* HERO — RED */}
      <section className="updates-hero full-screen-hero theme-red" style={{ minHeight: '60vh' }}>
        <div className="updates-hero-bg" />
        <div className="container center-align" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Stay In The Loop</div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
              Updates &amp; Content
            </h1>
            <p style={{ opacity: 0.85, maxWidth: '540px', margin: '0 auto' }}>
              Catch up on the latest announcements, flyers, podcasts, and series from LaunchPad 4.0. Follow our social hubs to never miss a beat.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider fillColor="#F8FAFC" />

      {/* SOCIAL HUB — WHITE */}
      <section className="social-hub-section section-padding theme-white">
        <div className="container">
          <div className="section-label">Follow Along</div>
          <h2>Our Social Hubs</h2>
          <p style={{ color: '#555', marginBottom: '3rem' }}>Connect with us across platforms for real-time updates.</p>
          <div className="social-cards-grid">
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card fb-event"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <FaFacebookF className="social-icon-large" />
              <div className="social-text-content">
                <h3>Event Page</h3>
                <p>Official LaunchPad 4.0 Facebook Event</p>
              </div>
              <FaArrowRight className="social-arrow" />
            </motion.a>

            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card ig-usj"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <FaInstagram className="social-icon-large" />
              <div className="social-text-content">
                <h3>AIESEC in USJ</h3>
                <p>Follow us on Instagram for daily updates</p>
              </div>
              <FaArrowRight className="social-arrow" />
            </motion.a>

            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card fb-sl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <FaFacebookF className="social-icon-large" />
              <div className="social-text-content">
                <h3>AIESEC in Sri Lanka</h3>
                <p>National updates and broad coverage</p>
              </div>
              <FaArrowRight className="social-arrow" />
            </motion.a>
          </div>
        </div>
      </section>

      <SectionDivider flip fillColor="#8B0000" />

      {/* CONTENT & RIBBON — 85/15 split, RED background */}
      <section className="content-ribbon-section theme-red">
        <div className="updates-layout-container">

          {/* LEFT: Main Content */}
          <div className="updates-main-content">
            <div className="content-section-inner">
              <div className="section-label">Latest Drops</div>
              <h2>Latest Content</h2>
              <p style={{ opacity: 0.8, marginBottom: '2.5rem' }}>Dive into our podcasts, interview series, and official flyers.</p>

              <div className="content-grid">

                <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <div className="content-media">
                    <div className="content-type-badge">Podcast</div>
                    <img src="/images carousel/memory-2.jpg" alt="Podcast Episode 1" />
                    <div className="content-media-overlay" />
                  </div>
                  <div className="content-details">
                    <h4>Ignite the Spark: Ep 1</h4>
                    <p>Join us as we discuss the corporate landscape and how undergraduates can prepare for it with leading industry experts.</p>
                    <a href="#" className="content-link"><FaPodcast /> Listen Now</a>
                  </div>
                </motion.div>

                <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="content-media">
                    <div className="content-type-badge">Series</div>
                    <img src="/images carousel/memory-4.jpg" alt="Video Series Episode 1" />
                    <div className="content-media-overlay" />
                  </div>
                  <div className="content-details">
                    <h4>Leadership Diaries</h4>
                    <p>A short video series highlighting the journey of past OCPs and how LaunchPad molded them into leaders.</p>
                    <a href="#" className="content-link"><FaPlay /> Watch Series</a>
                  </div>
                </motion.div>

                <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <div className="content-media">
                    <div className="content-type-badge">Announcement</div>
                    <img src="/images carousel/memory-7.jpg" alt="Announcement Flyer" />
                    <div className="content-media-overlay" />
                  </div>
                  <div className="content-details">
                    <h4>Registration Now Open!</h4>
                    <p>The moment you've been waiting for is finally here. Secure your spot at LaunchPad 4.0 before tickets run out.</p>
                    <a href="/register" className="content-link">Register Here <FaArrowRight /></a>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* RIGHT: Ribbon */}
          <aside className="updates-ribbon">
            <div className="ribbon-sticky-content">
              <span className="ribbon-new-badge">● NEW</span>
              <h3 className="ribbon-title">Latest</h3>
              <p className="ribbon-placeholder">Drop your content here!</p>
            </div>
          </aside>

        </div>
      </section>

    </div>
  );
};

export default Updates;
