"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaPlay, FaPodcast, FaArrowRight } from 'react-icons/fa';
import './Updates.css';

const Updates = () => {
  return (
    <div className="page-wrapper updates-page">
      {/* Hero Section */}
      <section className="updates-hero full-screen-hero theme-red" style={{ position: 'relative' }}>
        <div className="container center-align">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title text-white" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Updates & Content</h1>
            <p className="max-w-md mx-auto legacy-intro-para">
              Catch up on the latest announcements, flyers, podcasts, and series from LaunchPad 4.0. Follow our social hubs to never miss a beat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Hub */}
      <section className="social-hub-section theme-red">
        <div className="container">
          <div className="social-cards-grid">
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-card fb-event"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaFacebookF className="social-icon-large" />
              <div className="social-text-content">
                <h3>Event Page</h3>
                <p>Official LaunchPad 4.0 Facebook Event</p>
              </div>
            </motion.a>

            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-card ig-usj"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaInstagram className="social-icon-large" />
              <div className="social-text-content">
                <h3>AIESEC in USJ</h3>
                <p>Follow us on Instagram for daily updates</p>
              </div>
            </motion.a>

            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-card fb-sl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaFacebookF className="social-icon-large" />
              <div className="social-text-content">
                <h3>AIESEC in Sri Lanka</h3>
                <p>National updates and broad coverage</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Content & Podcasts */}
      <section className="content-section section-padding theme-red">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Latest Content</h2>
            <p>Dive into our podcasts, interview series, and official flyers.</p>
          </motion.div>

          <div className="content-grid">
            
            {/* Podcast Example */}
            <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="content-media">
                <div className="content-type-badge">Podcast</div>
                <img src="/images carousel/memory-2.jpg" alt="Podcast Episode 1" />
              </div>
              <div className="content-details">
                <h4>Ignite the Spark: Ep 1</h4>
                <p>Join us as we discuss the corporate landscape and how undergraduates can prepare for it with leading industry experts.</p>
                <a href="#" className="content-link"><FaPodcast /> Listen Now</a>
              </div>
            </motion.div>

            {/* Video Series Example */}
            <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="content-media">
                <div className="content-type-badge">Series</div>
                <img src="/images carousel/memory-4.jpg" alt="Video Series Episode 1" />
              </div>
              <div className="content-details">
                <h4>Leadership Diaries</h4>
                <p>A short video series highlighting the journey of past OCPs and how LaunchPad molded them into leaders.</p>
                <a href="#" className="content-link"><FaPlay /> Watch Series</a>
              </div>
            </motion.div>

            {/* Flyer / Announcement Example */}
            <motion.div className="content-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="content-media">
                <div className="content-type-badge">Announcement</div>
                <img src="/images carousel/memory-7.jpg" alt="Announcement Flyer" />
              </div>
              <div className="content-details">
                <h4>Registration Now Open!</h4>
                <p>The moment you've been waiting for is finally here. Secure your spot at LaunchPad 4.0 before tickets run out.</p>
                <a href="/register" className="content-link">Register Here <FaArrowRight /></a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Updates;
