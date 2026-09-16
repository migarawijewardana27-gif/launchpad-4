import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import './Team.css';

const eventManagers = [
  { id: 'em-1', name: 'Devmi', role: 'Event Manager', description: "Taking charge of the project's event management with a sharp eye and a self-proclaimed talent for perfection.", image: '/oc/devmi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
  { id: 'em-2', name: 'Vihangi', role: 'Event Manager', description: "Armed with boundless energy, ready to map out seamless event logistics with incredible focus and precision.", image: '/oc/vihangi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
  { id: 'em-3', name: 'Jayashni', role: 'Event Manager', description: "A magnet for solving problems, ready to pivot that talent into spotting challenges and ensuring absolute success.", image: '/oc/jayashni.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
];

const teamHierarchy = [
  {
    tierName: "Organizing Committee President",
    members: [
      { id: 'ocp-1', name: 'Thrinayani', role: 'OCP', description: "Stepping up as OCP! Ready to channel spontaneous creativity into planning an unforgettable, surprise-filled experience for everyone.", image: '/oc/thrinayani.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Partnership Development",
    members: [
      { id: 'pd-1', name: 'Gayathmie', role: 'OCVP Partnership Dev', description: "Bringing sharp tactics from the IT function, ready to secure big wins and rock-solid corporate partnerships for the project.", image: '/oc/gayathmie.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'pd-2', name: 'Sangeethma', role: 'OCVP Partnership Dev', description: "Channeling a superpower of overthinking into analyzing every detail, making sure our partnerships are completely flawless.", image: '/oc/sangeethma.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'pd-3', name: 'Tuvini', role: 'OCVP Partnership Dev', description: "Masterminding seamless operations and always ready to turn unexpected challenges into huge opportunities.", image: '/oc/tuvini.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Public Relations",
    members: [
      { id: 'pr-1', name: 'Ashrath', role: 'OCVP Public Relations', description: "Stepping up to handle PR! Armed with brilliant communication skills and a passion for networking.", image: '/oc/ashrath.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'pr-2', name: 'Savandi', role: 'OCVP Public Relations', description: "Ready to keep everyone engaged, talking, and smiling all day long while promoting the Launchpad brand.", image: '/oc/savandi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Delegates",
    members: [
      { id: 'del-1', name: 'Pumuthu', role: 'OCVP Delegates', description: "Dedicated to ensuring the delegates have the time of their lives with an unforgettable and smooth experience.", image: '/oc/pumuthu.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'del-2', name: 'Sahanya', role: 'OCVP Delegates', description: "Bringing endless enthusiasm to the delegate experience, ready to answer questions and keep the energy high.", image: '/oc/sahanya.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'del-3', name: 'Sidangana', role: 'OCVP Delegates', description: "Focused on delegate satisfaction and ready to tackle any obstacles that come our way during the sessions.", image: '/oc/sidangana.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Events",
    members: [
      { id: 'evt-1', name: 'Afsha', role: 'OCVP Events', description: "Planning the core events of Launchpad 4.0 with meticulous attention to detail and a flair for the dramatic.", image: '/oc/afsha.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'evt-2', name: 'Dinithi', role: 'OCVP Events', description: "A creative powerhouse ready to brainstorm brilliant event designs that will leave a lasting impact.", image: '/oc/dinithi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Marketing",
    members: [
      { id: 'mkt-1', name: 'Disen', role: 'OCVP Marketing', description: "Fueled by a passion for the project and ready to keep the team's marketing energy buzzing with brilliant posts.", image: '/oc/disen.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'mkt-2', name: 'Sanistha', role: 'OCVP Marketing', description: "Bringing out-of-the-box ideas to our digital campaigns and ensuring Launchpad is seen everywhere.", image: '/oc/sanistha.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'mkt-3', name: 'Shalomi', role: 'OCVP Marketing', description: "Mastering the algorithm and ready to skyrocket our engagement metrics with perfectly timed content.", image: '/oc/shalomi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  },
  {
    tierName: "Logistics",
    members: [
      { id: 'log-1', name: 'Abiram', role: 'OCVP Logistics', description: "Masterminding the backend operations, ensuring that all physical and technical requirements are flawlessly met.", image: '/oc/abiram.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } },
      { id: 'log-2', name: 'Chanula', role: 'OCVP Logistics', description: "Mapping out seamless event logistics with the exact same focus and precision used to win strategy games.", image: '/oc/chanula.png', links: { linkedin: '#', whatsapp: '#', instagram: '#' } }
    ]
  }
];

const allTiers = [
  { tierName: "Event Managers", members: eventManagers },
  ...teamHierarchy
];

const SquareGridCard = ({ member, index }) => {
  // Generate different logo layouts based on index
  const variant = index % 4;
  
  let logos = [];
  if (variant === 0) {
    logos = [
      { size: '130%', top: '-15%', left: '-25%', rotate: '15deg' }
    ];
  } else if (variant === 1) {
    logos = [
      { size: '70%', top: '5%', right: '-15%', rotate: '-25deg' },
      { size: '50%', bottom: '10%', left: '-10%', rotate: '10deg' }
    ];
  } else if (variant === 2) {
    logos = [
      { size: '100%', bottom: '-20%', right: '-10%', rotate: '-10deg' }
    ];
  } else if (variant === 3) {
    logos = [
      { size: '80%', top: '-10%', left: '15%', rotate: '45deg' },
      { size: '60%', bottom: '-15%', right: '10%', rotate: '-30deg' }
    ];
  }

  return (
    <div className="square-card">
      <div className="card-image-wrapper">
        <div className="logo-background">
          {logos.map((style, i) => (
            <img 
              key={i}
              src="/icon white.png" 
              alt="Launchpad Logo" 
              className="dynamic-logo"
              style={{
                width: style.size,
                top: style.top || 'auto',
                bottom: style.bottom || 'auto',
                left: style.left || 'auto',
                right: style.right || 'auto',
                transform: `rotate(${style.rotate})`
              }}
            />
          ))}
        </div>
        <img src={member.image} alt={member.name} className="square-image" />
      </div>
      
      <div className="card-details-wrapper">
        <div className="card-details-content">
          <h3 className="member-name-large">{member.name}</h3>
          <p className="member-role-highlight">{member.role}</p>
          <p className="member-desc-elegant">{member.description}</p>
          <div className="social-tray-inline center-align">
            <a href={member.links.whatsapp} aria-label="WhatsApp" className="social-icon"><FaWhatsapp /></a>
            <a href={member.links.instagram} aria-label="Instagram" className="social-icon"><FaInstagram /></a>
            <a href={member.links.linkedin} aria-label="LinkedIn" className="social-icon"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const [activeTab, setActiveTab] = useState(allTiers[0].tierName);
  
  const activeTierData = allTiers.find(t => t.tierName === activeTab);

  return (
    <div className="page-wrapper team-page theme-red" style={{ paddingTop: '100px' }}>
      
      <div className="container">
        <div className="team-revamp-header">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="revamp-title"
          >
            The Force Behind <span className="highlight-text">Launchpad</span>
          </motion.h1>
          
          <motion.div 
            className="team-tabs-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {allTiers.map((tier) => (
              <button 
                key={tier.tierName}
                className={`team-tab-button ${activeTab === tier.tierName ? 'active' : ''}`}
                onClick={() => setActiveTab(tier.tierName)}
              >
                {tier.tierName}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="square-grid-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="square-grid-container"
          >
            {activeTierData.members.map((member, index) => (
              <SquareGridCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
};

export default Team;
