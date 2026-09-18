"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Target, Zap, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import SectionDivider from '../../components/SectionDivider';
import './Event.css';

const itineraryData = {
  'Morning Sessions': [
    { time: '08:30 AM', title: 'Registration & Welcome', desc: 'Check-in and collect your delegate passes.' },
    { time: '09:00 AM', title: 'Keynote Address', desc: 'Opening remarks by the Organizing Committee President and Chief Guest.' },
    { time: '10:15 AM', title: 'Industry Insights Panel', desc: 'Leading professionals discuss the future of the corporate landscape.' },
  ],
  'Workshops': [
    { time: '11:30 AM', title: 'Mastering the Interview', desc: 'Interactive session on personal branding and interview techniques.' },
    { time: '12:45 PM', title: 'Networking Lunch', desc: 'Connect with peers and industry representatives over lunch.' },
    { time: '01:45 PM', title: 'Leadership Masterclass', desc: 'Developing the skills needed to lead in a dynamic environment.' },
  ],
  'Career Fair': [
    { time: '03:00 PM', title: 'Career Fair Opens', desc: 'Explore opportunities with our partner companies.' },
    { time: '04:30 PM', title: 'Fast-Track Interviews', desc: 'On-the-spot interviews for selected delegates.' },
    { time: '06:00 PM', title: 'Closing Ceremony', desc: 'Wrap up and networking mixer.' },
  ]
};

const highlights = [
  { icon: Zap, label: 'Industry Panels', value: '5+' },
  { icon: Users, label: 'Expected Delegates', value: '500+' },
  { icon: Star, label: 'Partner Companies', value: '20+' },
  { icon: Target, label: 'Workshop Sessions', value: '8' },
];

const Event = () => {
  const [activeTab, setActiveTab] = useState('Morning Sessions');

  return (
    <div className="page-wrapper event-page">

      {/* HERO — RED with a cinematic overlay */}
      <section className="event-hero theme-red">
        <div className="event-hero-bg" />
        <div className="container center-align event-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
              LaunchPad 4.0
            </div>
            <h1 className="event-hero-title">The Main Event</h1>
            <p className="event-hero-sub">
              Everything you need to know about what's happening at LaunchPad 4.0.
            </p>
            <div className="event-coming-soon-badge">
              <Lock size={14} /> Details Dropping Soon
            </div>
          </motion.div>

          {/* Highlight Stats */}
          <motion.div
            className="event-highlights-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {highlights.map(({ icon: Icon, label, value }, i) => (
              <div key={i} className="event-highlight-pill">
                <Icon size={20} className="highlight-icon" />
                <span className="highlight-value">{value}</span>
                <span className="highlight-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider fillColor="#F8FAFC" />

      {/* ITINERARY — WHITE */}
      <section className="itinerary-section section-padding theme-white">
        <div className="container">
          <div className="section-label">Event Flow</div>
          <h2>Event Itinerary</h2>
          <p style={{ color: '#555', marginBottom: '2.5rem' }}>A jam-packed day of learning, networking, and opportunity.</p>

          <div className="tabs-container">
            {Object.keys(itineraryData).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="itinerary-list"
              >
                {itineraryData[activeTab].map((item, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="time-col">
                      <Clock size={16} className="time-icon" />
                      <span>{item.time}</span>
                    </div>
                    <div className="itinerary-connector">
                      <div className="connector-dot" />
                      {index < itineraryData[activeTab].length - 1 && <div className="connector-line" />}
                    </div>
                    <div className="details-col">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <SectionDivider flip fillColor="#8B0000" />

      {/* SPEAKERS — RED */}
      <section className="speakers-section section-padding theme-red">
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Industry Leaders</div>
          <h2 className="center-align">Distinguished Speakers</h2>
          <p className="center-align" style={{ marginBottom: '3rem', opacity: 0.8 }}>
            To be announced. Stay tuned for our lineup.
          </p>

          <div className="speakers-tba-grid">
            {[1,2,3,4].map((i) => (
              <motion.div
                key={i}
                className="speaker-tba-card glass-panel"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="tba-avatar">
                  <span>?</span>
                </div>
                <div className="tba-info">
                  <h4>To Be Announced</h4>
                  <p>Industry Expert</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider fillColor="#F8FAFC" />

      {/* CAREER FAIR MAP — WHITE */}
      <section className="map-section section-padding theme-white">
        <div className="container">
          <div className="section-label">Venue Layout</div>
          <h2>Career Fair Layout</h2>
          <p style={{ color: '#555', marginBottom: '3rem' }}>Navigate your way to success.</p>

          <div className="map-wrapper">
            <div className="map-visual">
              <div className="map-zone zone-1">
                <Users size={22} />
                <span>Registration</span>
              </div>
              <div className="map-zone zone-2">
                <Target size={22} />
                <span>Partner Stalls</span>
              </div>
              <div className="map-zone zone-3">
                <MapPin size={22} />
                <span>Networking Area</span>
              </div>
              <div className="map-zone zone-4">
                <span>Interview Rooms</span>
              </div>
            </div>

            <div className="map-legend">
              <h3>Zone Guide</h3>
              <ul>
                <li><span className="dot dot-1" /> Registration & Help Desk</li>
                <li><span className="dot dot-2" /> Corporate Partner Stalls</li>
                <li><span className="dot dot-3" /> Open Networking Area</li>
                <li><span className="dot dot-4" /> Private Interview Rooms</li>
              </ul>
              <div className="map-cta-note">
                <Lock size={14} />
                <span>Full venue map available on event day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider flip fillColor="#8B0000" />

      {/* REGISTER CTA — RED */}
      <section className="event-cta-section section-padding theme-red">
        <div className="container center-align">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>Don't Miss Out</div>
            <h2>Ready to LaunchPad?</h2>
            <p style={{ opacity: 0.85, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              Secure your delegate pass today and take the first step towards your future.
            </p>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
              Register Now
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Event;
