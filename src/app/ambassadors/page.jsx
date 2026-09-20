"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaNetworkWired, FaTrophy, FaFileAlt, FaHandshake, FaIdBadge, FaStar } from 'react-icons/fa';
import SectionDivider from '../../components/SectionDivider';
import AmbassadorForm from '../../components/AmbassadorForm';
import './Ambassadors.css';

const Ambassadors = () => {
  return (
    <div className="page-wrapper ambassadors-page">

      {/* HERO SECTION — RED */}
      <section className="ambassadors-hero theme-red">
        <div className="ambassadors-hero-bg" />
        <div className="container center-align">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
              LaunchPad 4.0
            </div>
            <h1 className="ambassadors-hero-title">Ambassador Program</h1>
            <p className="ambassadors-hero-sub">
              Step into a central role at one of the year's most anticipated career development events. 
              A grassroots advocacy network open to both AIESECers and non-AIESECers.
            </p>
            <a href="#register" className="btn btn-primary pulse-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Claim Your Code
            </a>
          </motion.div>
        </div>
      </section>

      <SectionDivider fillColor="#F8FAFC" />

      {/* DETAILS SECTION — WHITE */}
      <section className="ambassador-details-section theme-white">
        <div className="container">
          <motion.div
            className="center-align"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>The Details</div>
            <h2>How It Works & What You Get</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: '#555' }}>
              By leveraging your personal network to bring delegates to Launchpad 4.0, you unlock direct career capital, high-level networking, and behind-the-scenes event access.
            </p>
          </motion.div>

          <div className="details-grid">
            
            {/* Left Column: How it Works */}
            <motion.div 
              className="details-column"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3>How It Works</h3>
              <div className="steps-container">
                <div className="step-box">
                  <div className="step-number">1</div>
                  <h4>Claim Your Code</h4>
                  <p>Sign up to become an official Launchpad 4.0 Ambassador and receive your unique registration tracking code.</p>
                </div>
                <div className="step-box">
                  <div className="step-number">2</div>
                  <h4>Activate Your Network</h4>
                  <p>Share your code with peers, university networks, and friends. When delegates register, they enter your code to support your campaign.</p>
                </div>
                <div className="step-box">
                  <div className="step-number">3</div>
                  <h4>Climb the Leaderboard</h4>
                  <p>Every finalized delegate registration tied to your code increases your ranking. Top-performing ambassadors will be officially recognized and rewarded.</p>
                </div>
              </div>
              
              <div className="mt-xl">
                <h3>Who Can Join?</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  This program is open to everyone. Whether you are an active AIESEC member or a driven non-AIESECer looking to expand your professional footprint, the Ambassador Program is built for you. If you are highly connected and want to elevate your personal brand alongside Launchpad 4.0, secure your code today.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Perks */}
            <motion.div 
              className="details-column"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3>Ambassador Perks & Career Capital</h3>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>This program is designed to reward your influence with tangible career and networking value.</p>
              
              <div className="perks-list">
                <div className="perk-item">
                  <div className="perk-icon-wrapper"><FaFileAlt size={22} /></div>
                  <div className="perk-content">
                    <h4>Priority CV Screening</h4>
                    <p>Get your resume pushed to the front of the line for opportunities with our corporate partners and sponsors.</p>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon-wrapper"><FaHandshake size={22} /></div>
                  <div className="perk-content">
                    <h4>High-Level Networking</h4>
                    <p>Gain premium access to industry experts, guest speakers, and top corporate leaders attending the event.</p>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon-wrapper"><FaIdBadge size={22} /></div>
                  <div className="perk-content">
                    <h4>Official Event-Day Status</h4>
                    <p>Receive an exclusive "Ambassador" tag for the event day, instantly signaling your leadership role to delegates and corporate partners.</p>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon-wrapper"><FaNetworkWired size={22} /></div>
                  <div className="perk-content">
                    <h4>Event Integration</h4>
                    <p>Go behind the scenes and volunteer during Launchpad 4.0 alongside the core AIESEC organizing committee.</p>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon-wrapper"><FaTrophy size={22} /></div>
                  <div className="perk-content">
                    <h4>Performance Rewards</h4>
                    <p>Unlock exclusive prizes and public recognition based on the total number of successful delegate registrations you secure.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionDivider flip fillColor="#8B0000" />

      {/* REGISTRATION FORM SECTION — RED */}
      <section id="register" className="registration-section theme-red">
        <div className="container">
          <motion.div 
            className="center-align mb-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>Join The Network</div>
            <h2>Ambassador Registration</h2>
            <p style={{ opacity: 0.85, maxWidth: '500px', margin: '0 auto' }}>
              Fill out the form below to claim your unique tracking code and officially join the LaunchPad 4.0 Ambassador network.
            </p>
          </motion.div>

          <motion.div 
            className="form-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <AmbassadorForm />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Ambassadors;
