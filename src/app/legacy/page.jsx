"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './Legacy.css';

const RotatingComments = ({ comments }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!comments || comments.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % comments.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [comments]);

  if (!comments || comments.length === 0) return null;

  return (
    <div className="delegate-comments-block" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)' }}>
      <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-coral-glow)' }}>What Delegates Said</h4>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="comment-content"
        >
          <p className="comment-text" style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>"{comments[index].text}"</p>
          <p className="comment-author" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>— {comments[index].author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LegacyEventSection = ({ title, date, description, aftermovieUrl, comments, photos, index }) => {
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
      <div className="legacy-event-content glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="legacy-event-header">
          <h2>{title}</h2>
          <div className="legacy-meta">
            {date && <span className="meta-item"><Calendar size={14} /> {date}</span>}
          </div>
        </div>

        <div className="legacy-event-text">
          <p className="legacy-description">{description}</p>
          
          <RotatingComments comments={comments} />
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
                <img src={photo} alt={`LaunchPad Highlight ${i + 1}`} loading="lazy" />
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
            <img src="/logo only.png" alt="LaunchPad Logo" className="legacy-hero-logo" />
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
            title="Dare to Dream"
            date="2023"
            description="The inception of a movement. The first LaunchPad set the standard with insightful sessions from industry titans, sparking a wave of innovation among undergraduates."
            aftermovieUrl="https://www.youtube.com/embed/K0rW3LfPTHA"
            comments={[
              { text: "Being part of the very first edition was a privilege.", author: "Delegate K" },
              { text: "The speakers were incredibly inspiring and motivating.", author: "Delegate L" },
              { text: "It set a new standard for youth events in the country.", author: "Delegate M" },
              { text: "The beginning of something truly special and impactful.", author: "Delegate N" },
              { text: "An eye-opening experience that pushed me out of my comfort zone.", author: "Delegate O" }
            ]}
            photos={[
              '/images carousel/memory-24.jpg',
              '/images carousel/memory-25.jpg'
            ]}
          />

          <LegacyEventSection 
            index={1}
            title="Scaling New Heights"
            date="2024"
            description="Introduced the highly anticipated Career Fair and an interactive quiz that tested and rewarded the brightest minds."
            aftermovieUrl="https://www.youtube.com/embed/gn-eoraTEGg"
            comments={[
              { text: "The Career Fair opened doors I didn't even know existed.", author: "Delegate F" },
              { text: "I landed my dream internship thanks to the connections I made here.", author: "Delegate G" },
              { text: "The interactive quiz was so much fun and very challenging!", author: "Delegate H" },
              { text: "Everything was perfectly organized, from start to finish.", author: "Delegate I" },
              { text: "Met so many industry leaders and learned so much in one day.", author: "Delegate J" }
            ]}
            photos={[
              '/images carousel/memory-21.jpg',
              '/images carousel/memory-22.jpg',
              '/images carousel/memory-23.jpg'
            ]}
          />

          <LegacyEventSection 
            index={2}
            title="Continuing the Momentum"
            date="2025"
            description="LaunchPad highlights and key moments will be featured here, building upon the massive success of the previous iterations and continuing to empower the future leaders of tomorrow."
            aftermovieUrl="https://www.youtube.com/embed/9PwS06duexc"
            comments={[
              { text: "This year was an absolute game changer for me. The insights were phenomenal.", author: "Delegate A" },
              { text: "The network I built here will last a lifetime. Highly recommend to everyone.", author: "Delegate B" },
              { text: "A truly transformative experience that shaped my career path.", author: "Delegate C" },
              { text: "The sessions were engaging and the energy was just unmatched.", author: "Delegate D" },
              { text: "An unforgettable event. Looking forward to what comes next!", author: "Delegate E" }
            ]}
            photos={[
              '/images carousel/memory-8.jpg',
              '/images carousel/memory-18.jpg'
            ]}
          />
        </div>
    </div>
  );
};

export default Legacy;
