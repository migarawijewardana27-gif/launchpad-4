import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Map, Users, Target } from 'lucide-react';
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

const speakers = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'CEO, TechNova', bio: 'With over 20 years in the tech industry, Dr. Jenkins leads innovation at TechNova. She is passionate about mentoring young leaders.', image: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=8B0000&color=fff&size=200' },
  { id: 2, name: 'Marcus Sterling', role: 'Head of HR, GlobalCorp', bio: 'Marcus specializes in talent acquisition and organizational behavior. He brings invaluable insights into what top companies look for.', image: 'https://ui-avatars.com/api/?name=Marcus+Sterling&background=D32F2F&color=fff&size=200' },
  { id: 3, name: 'Elena Rodriguez', role: 'Founder, Startup Hub', bio: 'A serial entrepreneur, Elena has successfully scaled three startups. She focuses on agile leadership and growth strategies.', image: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=FF6B6B&color=fff&size=200' },
  { id: 4, name: 'David Chen', role: 'Director of Marketing, BrandPro', bio: 'David is a visionary marketer who has redefined digital branding. He shares strategies for personal and corporate branding.', image: 'https://ui-avatars.com/api/?name=David+Chen&background=FCA17D&color=fff&size=200' },
];

const FlipCard = ({ speaker }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={speaker.image} alt={speaker.name} />
          <div className="front-info">
            <h3>{speaker.name}</h3>
            <p>{speaker.role}</p>
          </div>
        </div>
        <div className="flip-card-back glass-panel">
          <h3>{speaker.name}</h3>
          <p className="bio">{speaker.bio}</p>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const [activeTab, setActiveTab] = useState('Morning Sessions');

  return (
    <div className="page-wrapper event-page">
      {/* Hero Section for Event */}
      <section className="event-hero full-screen-hero theme-red">
        <div className="container">
          <motion.div 
            className="section-header center-align"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>The Main Event</h1>
            <p className="max-w-md mx-auto">Everything you need to know about what's happening at LaunchPad 4.0.</p>
          </motion.div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className="itinerary-section section-padding theme-white">
        <div className="container">
          <h2>Event Itinerary</h2>
          
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

          <div className="tab-content glass-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="itinerary-list"
              >
                {itineraryData[activeTab].map((item, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="time-col">
                      <Clock size={20} className="time-icon" />
                      <span>{item.time}</span>
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

      {/* Speakers Section */}
      <section className="speakers-section section-padding theme-red">
        <div className="container">
          <div className="section-header">
            <h2>Distinguished Speakers</h2>
            <p>Learn from the best minds in the industry.</p>
          </div>
          
          <div className="speakers-grid">
            {speakers.map((speaker) => (
              <FlipCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      {/* Career Fair Map */}
      <section className="map-section section-padding theme-white">
        <div className="container">
          <div className="section-header">
            <h2>Career Fair Layout</h2>
            <p>Navigate your way to success.</p>
          </div>
          
          <div className="map-container glass-panel">
            <div className="map-visual">
              {/* Abstract Map Representation */}
              <div className="map-zone zone-1"><Users size={24}/><span>Registration</span></div>
              <div className="map-zone zone-2"><Target size={24}/><span>Partner Stalls</span></div>
              <div className="map-zone zone-3"><Map size={24}/><span>Networking Area</span></div>
              <div className="map-zone zone-4"><span>Interview Rooms</span></div>
            </div>
            <div className="map-legend">
              <h3>Zones</h3>
              <ul>
                <li><span className="dot dot-1"></span> Registration & Help Desk</li>
                <li><span className="dot dot-2"></span> Corporate Partner Stalls</li>
                <li><span className="dot dot-3"></span> Open Networking Area</li>
                <li><span className="dot dot-4"></span> Private Interview Rooms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Event;
