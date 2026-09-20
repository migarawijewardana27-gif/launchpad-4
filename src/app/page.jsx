"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Rocket, Users, Briefcase, ChevronDown, Eye } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaGlobe, FaFacebookF, FaYoutube } from 'react-icons/fa';
import StaggeredText from '../components/StaggeredText';
import SectionDivider from '../components/SectionDivider';
import './Home.css';

const heroImages = [
  '/hero-1.jpeg',
  '/hero-2.jpeg',
  '/hero-3.jpeg',
  '/hero-4.jpeg',
  '/hero-5.jpeg'
];

// Reusable 3D Flip Card for Core Pillars
const FlipCardPillar = ({ icon: Icon, title, delay }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="pillar-flip-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`pillar-flip-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="pillar-flip-front glass-panel">
          <Icon size={40} className="front-icon" />
          <h3>{title}</h3>
        </div>
        <div className="pillar-flip-back">
          <h3>{title}</h3>
          <p>Unlocking your potential in {title.toLowerCase()} for the global stage.</p>
        </div>
      </div>
    </motion.div>
  );
};

const memoryImages = Array.from({ length: 20 }, (_, i) => `/images carousel/memory-${i + 1}.jpg`);

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper home-page">

      {/* SECTION 1: Hero Area */}
      <section className="hero-section full-screen-hero relative-hero theme-red">

        {/* Background Slideshow */}
        <div className="hero-slideshow-container">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="hero-slideshow-overlay"></div>
        </div>

        <div className="container hero-container center-align">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-content-wrapper"
          >
            <div className="powered-by-hero">
              <img src="/powered by white.png" alt="Powered by LaunchPad" className="powered-by-logo-hero" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <h1 className="hero-title text-white">Beyond the blueprint</h1>
            <motion.div className="hero-cta-container">
              <Link href="/register" className="btn btn-primary pulse-btn">
                Register Now
              </Link>
              <Link href="/ambassadors" className="btn btn-secondary">
                Become an Ambassador
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Launching Soon Bar */}
        <motion.div
          className="hero-launching-soon glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="launching-text">
            SCROLL TO EXPLORE
            <ChevronDown className="scroll-icon" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: The Core Identity */}
      <section className="identity-section section-padding theme-white">
        <div className="container">
          <div className="identity-grid">
            <motion.div
              className="intro-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-label">About the Event</div>
              <h2>What is LaunchPad 4.0?</h2>
              <p>A premier career guidance program equipping and empowering Sri Lanka's youth for the global stage.</p>
            </motion.div>

            <div className="vision-mission-side-by-side">
              <motion.div
                className="identity-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(139,0,0,0.1)' }}
              >
                <Eye className="card-icon" style={{ color: 'var(--color-crimson-bold)' }} />
                <h3>Vision</h3>
                <p>Sri Lanka's youth being equipped, empowered, and ready to own the global stage.</p>
              </motion.div>

              <motion.div
                className="identity-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(139,0,0,0.1)' }}
              >
                <Target className="card-icon" style={{ color: 'var(--color-crimson-bold)' }} />
                <h3>Mission</h3>
                <p>To equip Sri Lanka's youth with the tools, mindset, and opportunities to elevate themselves, secure careers, share ideas, and connect with key partners.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider flip fillColor="#FFFFFF" />

      {/* SECTION 3: Core Pillars Grid */}
      <section className="pillars-section section-padding theme-red">
        <div className="container">
          <div className="center-align mb-lg">
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Stand For</div>
            <StaggeredText text="Core Pillars" className="" />
          </div>
          <div className="pillars-grid">
            <FlipCardPillar icon={Target} title="Career Exploration" delay={0.1} />
            <FlipCardPillar icon={Rocket} title="Skill Development" delay={0.2} />
            <FlipCardPillar icon={Users} title="Leadership Nurturing" delay={0.3} />
            <FlipCardPillar icon={Briefcase} title="Networking" delay={0.4} />
          </div>
        </div>
      </section>

      <SectionDivider fillColor="#FFFFFF" />

      {/* SECTION 4: LaunchPad 3.0 Aftermovie */}
      <section className="aftermovie-section section-padding theme-white">
        <div id="aftermovie" className="container center-align">
          <StaggeredText text="LaunchPad 3.0 Aftermovie" className="mb-md" />
          <div className="video-container-sleek">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9PwS06duexc?autoplay=1&mute=1&loop=1&playlist=9PwS06duexc"
              title="LaunchPad 3.0 Aftermovie"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* SECTION 5: Past Memories (Single Row 16:9 Infinite Marquee) */}
      <section className="gallery-section section-padding overflow-hidden theme-red">
        <div className="container">
          <StaggeredText text="Past Memories" className="center-align mb-lg" />
        </div>
        <div className="single-row-marquee">
          <div className="marquee-content-row">
            {/* Group 1 */}
            <div className="marquee-group-row">
              {memoryImages.map((src, index) => (
                <div key={`g1-${index}`} className="memory-card-16-9">
                  <img
                    src={src}
                    alt={`Memory ${index + 1}`}
                    className="memory-card-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="memory-placeholder-img" style={{ display: 'none' }}>
                    <span>Memory {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Group 2 (Duplicate for infinite loop) */}
            <div className="marquee-group-row">
              {memoryImages.map((src, index) => (
                <div key={`g2-${index}`} className="memory-card-16-9">
                  <img
                    src={src}
                    alt={`Memory ${index + 1}`}
                    className="memory-card-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="memory-placeholder-img" style={{ display: 'none' }}>
                    <span>Memory {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Title Partner Spotlight (Ceylinco Life) (Dark Theme) */}
      <section className="partner-spotlight section-padding theme-white">
        <div className="container">
          <div className="spotlight-content center-align">
            <h3 className="spotlight-badge">Title Partner</h3>
            <img src="/ceylinco.png" alt="Ceylinco Life" className="spotlight-logo" />
            <p className="spotlight-desc max-w-md mx-auto">
              Ceylinco Life is deeply committed to youth development in Sri Lanka. As the Title Partner for LaunchPad 4.0, they aim to bridge the gap between academic education and the dynamic needs of the corporate world, nurturing the next generation of leaders.
            </p>

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

            <div className="spotlight-actions mt-lg">
              <div className="social-links-row">
                <a href="#" target="_blank" rel="noopener noreferrer" className="circular-btn" aria-label="Website">
                  <FaGlobe size={20} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="circular-btn" aria-label="Facebook">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="circular-btn" aria-label="Instagram">
                  <FaInstagram size={20} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="circular-btn" aria-label="LinkedIn">
                  <FaLinkedinIn size={20} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="circular-btn" aria-label="YouTube">
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Contact the Team */}
      <section className="contact-section section-padding theme-red">
        <div className="container">
          <div className="center-align">
            <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
            <StaggeredText text="Contact The Team" className="mb-md" />
            <p style={{ marginBottom: '3rem', opacity: 0.8, fontSize: '1rem' }}>Any questions? Reach out to our team directly.</p>
          </div>
          <div className="contact-grid" style={{ marginBottom: '3rem' }}>
            {[
              { role: "Organizing Committee President", name: "Thrinayani Selvanathan", image: "/oc/thrinayani.png", whatsapp: "https://wa.me/94779680928", instagram: "https://www.instagram.com/inayeux/", linkedin: "https://www.linkedin.com/in/thrinayanis/" }
            ].map((member, i) => (
              <div key={`ocp-${i}`} className="contact-card">
                <div className="contact-pic-wrapper">
                  <img src={member.image} alt={member.name} className="contact-pic" />
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <div className="contact-socials">
                  {member.whatsapp && <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp size={18} /></a>}
                  {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={18} /></a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={18} /></a>}
                </div>
              </div>
            ))}
          </div>

          <div className="contact-grid">
            {[
              { role: "OCVP Delegates", name: "Pumuthu Weerakoon", image: "/oc/pumuthu.png", whatsapp: "https://wa.me/94761020132", instagram: "https://www.instagram.com/pumuthunimaya?igsi=MWRyam1hMnpjYnIxMA%3D%3D&utm_source=qr", linkedin: "https://www.linkedin.com/in/pumuthu-weerakoon?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { role: "OCVP Delegates", name: "Sahanya Herath", image: "/oc/sahanya.png", whatsapp: "https://wa.me/94773979334", instagram: "https://www.instagram.com/justt.ssiya?igsi=NnQ1a240MWp2dzU0&utm_source=qr", linkedin: "https://www.linkedin.com/in/sahanya-herath-97a260311?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { role: "OCVP Delegates", name: "Sidangana Inimankada", image: "/oc/sidangana.png", whatsapp: "https://wa.me/94712442125", instagram: "https://www.instagram.com/sidangana_h?igsi=OXd0MHp3Z2xqZmk5&utm_source=qr", linkedin: "http://www.linkedin.com/in/sidangana-inimankada" }
            ].map((member, i) => (
              <div key={`del-${i}`} className="contact-card">
                <div className="contact-pic-wrapper">
                  <img src={member.image} alt={member.name} className="contact-pic" />
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <div className="contact-socials">
                  {member.whatsapp && <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp size={18} /></a>}
                  {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={18} /></a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={18} /></a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
