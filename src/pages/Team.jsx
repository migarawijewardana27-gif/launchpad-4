import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import './Team.css';

// Generate Dummy Data
const generateMembers = (count, rolePrefix) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${rolePrefix}-${i + 1}`,
    name: 'Name Placeholder',
    role: `OCVP Position ${i + 1}`,
    image: '/person.png',
    links: {
      linkedin: '#',
      whatsapp: '#',
      facebook: '#',
      instagram: '#'
    }
  }));
};

const eventManagers = [
  { id: 'em-1', name: 'Name Placeholder', role: 'Event Manager', image: '/person.png', links: { linkedin: '#', whatsapp: '#', facebook: '#', instagram: '#' } },
  { id: 'em-2', name: 'Name Placeholder', role: 'Event Manager', image: '/person.png', links: { linkedin: '#', whatsapp: '#', facebook: '#', instagram: '#' } },
  { id: 'em-3', name: 'Name Placeholder', role: 'Event Manager', image: '/person.png', links: { linkedin: '#', whatsapp: '#', facebook: '#', instagram: '#' } },
];

const organizingCommittee = generateMembers(15, 'OC');

const TeamCard = ({ member, index }) => {
  return (
    <motion.div 
      className="team-card-spotlight glass-panel"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
    >
      <div className="card-image-wrapper">
        <img src="/icon white.png" alt="Background Icon" className="team-background-icon" />
        <img src={member.image} alt={member.name} className="team-image" />
      </div>
      
      <div className="card-info-wrapper">
        <div className="card-info">
          <h3>{member.name}</h3>
          <p className="role">{member.role}</p>
        </div>
        
        <div className="social-tray">
          <a href={member.links.linkedin} aria-label="LinkedIn" className="social-icon"><FaLinkedinIn /></a>
          <a href={member.links.whatsapp} aria-label="WhatsApp" className="social-icon"><FaWhatsapp /></a>
          <a href={member.links.facebook} aria-label="Facebook" className="social-icon"><FaFacebookF /></a>
          <a href={member.links.instagram} aria-label="Instagram" className="social-icon"><FaInstagram /></a>
        </div>
      </div>
    </motion.div>
  );
};

const Team = () => {
  return (
    <div className="page-wrapper team-page">
      <div className="container">
        <motion.div 
          className="section-header center-align full-screen-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Meet the Force</h1>
          <p className="max-w-md mx-auto">The visionary Event Managers and passionate Organizing Committee bringing LaunchPad 4.0 to life. Scroll down to meet them.</p>
        </motion.div>

        <div className="team-hierarchy-section">
          <div className="team-tier">
            <h2 className="tier-title">Event Managers</h2>
            <div className="team-grid event-managers-grid">
              {eventManagers.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>

          <div className="team-tier">
            <h2 className="tier-title">Organizing Committee</h2>
            <div className="team-grid oc-grid">
              {organizingCommittee.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
