"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import './Legacy.css';

const LegacyEventSection = ({ version, title, date, location, description, aftermovieUrl, quote, ocpName, photos, index, isFirst }) => {
  const isEven = index % 2 === 0;
  
  return (
    <section className={`section-padding ${isEven ? 'theme-white' : 'theme-red'}`}>
      <div className="container">
        <motion.div 
          className={`legacy-event-section ${isEven ? 'layout-normal' : 'layout-flipped'}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
      <div className="legacy-event-content glass-panel">
        <div className="legacy-event-header">
          <div className="legacy-badge" style={isFirst ? { display: 'inline-flex', alignItems: 'center', padding: '6px 16px' } : {}}>
            {isFirst ? <img src="/icon white.png" alt="Launchpad Icon" style={{ height: '20px', objectFit: 'contain' }} /> : version}
          </div>
          <h2>{title}</h2>
          <div className="legacy-meta">
            {date && <span className="meta-item"><Calendar size={16} /> {date}</span>}
            {location && <span className="meta-item"><MapPin size={16} /> {location}</span>}
          </div>
        </div>

        <div className="legacy-event-text">
          <p className="legacy-description">{description}</p>
          
          {quote && (
            <div className="ocp-quote-block">
              <p className="ocp-quote-text">"{quote}"</p>
              <p className="ocp-name">— {ocpName}, OCP {isFirst ? 'Launchpad' : `Launchpad ${version}`}</p>
            </div>
          )}
        </div>
      </div>

      <div className="legacy-event-media">
        {aftermovieUrl && (
          <div className="youtube-embed-container">
            <iframe 
              src={aftermovieUrl} 
              title={`${title} Aftermovie`}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        )}

        {photos && photos.length > 0 && (
          <div className="legacy-photo-grid">
            {photos.map((photo, i) => (
              <div key={i} className="legacy-photo-wrapper">
                <img src={photo} alt={`Launchpad ${version} Highlight ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          )}
        </div>
      </motion.div>
      </div>
    </section>
  );
};

const legacyHeroImages = [
  '/images carousel/memory-5.jpg',
  '/images carousel/memory-8.jpg',
  '/images carousel/memory-12.jpg',
  '/images carousel/memory-15.jpg',
  '/images carousel/memory-19.jpg'
];

const Legacy = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % legacyHeroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper legacy-page">
      <section className="legacy-hero full-screen-hero theme-red" style={{ position: 'relative' }}>
        
        <div className="legacy-slideshow-container">
          {legacyHeroImages.map((src, index) => (
            <div 
              key={src}
              className={`legacy-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="legacy-slideshow-overlay"></div>
        </div>
        <div className="container">
          <motion.div 
            className="section-header center-align"
            style={{ position: 'relative', zIndex: 2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo only.png" alt="Launchpad Logo" className="legacy-hero-logo" />
            <h1 style={{ color: 'white' }}>Our Legacy</h1>
            <p className="max-w-md mx-auto legacy-intro-para">
              Since its inception, LaunchPad has been a beacon of inspiration for thousands of youths across Sri Lanka. What started as a daring dream has evolved into a nationwide movement, equipping the next generation of leaders with the skills, network, and mindset to conquer their futures. Take a journey through our history.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="legacy-sections-container">
          <LegacyEventSection 
            index={0}
            version="3.0" 
            title="Continuing the Momentum"
            date="2024"
            location="TBA"
            description="LaunchPad 3.0 highlights and key moments will be featured here, building upon the massive success of the previous iterations and continuing to empower the future leaders of tomorrow."
            aftermovieUrl="https://www.youtube.com/embed/9PwS06duexc"
            quote="Launchpad 3.0 is going to be the pinnacle of youth development this year. We are ready."
            ocpName="OCP Name Placeholder"
            photos={[
              '/images carousel/memory-8.jpg',
              '/images carousel/memory-18.jpg'
            ]}
          />

          <LegacyEventSection 
            index={1}
            version="2.0" 
            title="Scaling New Heights"
            date="2023"
            location="Colombo"
            description="LaunchPad 2.0 introduced the highly anticipated Career Fair and an interactive quiz that tested and rewarded the brightest minds."
            aftermovieUrl="https://www.youtube.com/embed/gn-eoraTEGg"
            quote="Seeing the youths engage and unlock their potential at LaunchPad 2.0 was truly a career-defining moment for our entire committee."
            ocpName="OCP Name Placeholder"
            photos={[
              '/images carousel/memory-21.jpg',
              '/images carousel/memory-22.jpg',
              '/images carousel/memory-23.jpg'
            ]}
          />

          <LegacyEventSection 
            index={2}
            isFirst={true}
            version="" 
            title="Dare to Dream"
            date="July 27, 2023"
            location="PGIM Colombo"
            description="The inception of a movement. The first LaunchPad set the standard with insightful sessions from industry titans, sparking a wave of innovation among undergraduates."
            aftermovieUrl="https://www.youtube.com/embed/K0rW3LfPTHA"
            quote="LaunchPad was the spark that ignited a nationwide phenomenon. We dared to dream, and the youth answered."
            ocpName="OCP Name Placeholder"
            photos={[
              '/images carousel/memory-24.jpg',
              '/images carousel/memory-25.jpg'
            ]}
          />
        </div>
    </div>
  );
};

export default Legacy;
