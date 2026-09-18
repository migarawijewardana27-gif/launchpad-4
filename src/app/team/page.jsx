"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedinIn, FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './Team.css';

const eventManagers = [
  { id: 'em-1', name: 'Devmi', role: 'Event Manager', description: "Taking charge of the project's event management with a sharp eye and a self-proclaimed talent for perfection.", image: '/oc/devmi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#', email: '#' } },
  { id: 'em-2', name: 'Vihangi', role: 'Event Manager', description: "Armed with boundless energy, ready to map out seamless event logistics with incredible focus and precision.", image: '/oc/vihangi.png', links: { linkedin: '#', whatsapp: '#', instagram: '#', email: '#' } },
  { id: 'em-3', name: 'Jayashni', role: 'Event Manager', description: "A magnet for solving problems, ready to pivot that talent into spotting challenges and ensuring absolute success.", image: '/oc/jayashni.png', links: { linkedin: '#', whatsapp: '#', instagram: '#', email: '#' } },
];

const teamHierarchy = [
  {
    tierName: "Organizing Committee President",
    members: [
      { id: 'ocp-1', name: 'Thrinayani Selvanathan', role: 'OCP', description: "Stepping up as OCP! Ready to channel spontaneous creativity into planning an unforgettable, surprise-filled experience for everyone.", image: '/oc/thrinayani.png', links: { linkedin: 'https://www.linkedin.com/in/thrinayanis/', whatsapp: 'https://wa.me/94779680928', instagram: 'https://www.instagram.com/inayeux/', email: 'thrinayaniselvanathan@aiesec.net' } }
    ]
  },
  {
    tierName: "Partnership Development",
    members: [
      { id: 'pd-1', name: 'Gayathmie Gunarathne', role: 'OCVP Partnership Dev', description: "Bringing sharp tactics from the IT function, ready to secure big wins and rock-solid corporate partnerships for the project.", image: '/oc/gayathmie.png', links: { linkedin: 'https://www.linkedin.com/in/gayathmie-gunarathne-890622275?utm_source=share_via&utm_content=profile&utm_medium=member_android', whatsapp: 'https://wa.me/94706074100', instagram: 'https://www.instagram.com/___gaya__mie___?igsi=cmZnOHlpcWtsZ3Fz', email: 'gayathmie.gunarathne@aiesec.net' } },
      { id: 'pd-2', name: 'Sangeethma Perera', role: 'OCVP Partnership Dev', description: "Channeling a superpower of overthinking into analyzing every detail, making sure our partnerships are completely flawless.", image: '/oc/sangeethma.png', links: { linkedin: 'https://www.linkedin.com/in/sangeethma-perera-948108290/', whatsapp: 'https://wa.me/94702787523', instagram: 'https://www.instagram.com/sangeethma_/?utm_source=ig_web_button_share_sheet', email: 'sangeethmaperera@aiesec.net' } },
      { id: 'pd-3', name: 'Tuvini Ranchagoda', role: 'OCVP Partnership Dev', description: "Masterminding seamless operations and always ready to turn unexpected challenges into huge opportunities.", image: '/oc/tuvini.png', links: { linkedin: 'https://www.linkedin.com/in/tuvini-ranchagoda-891a63332?utm_source=share_via&utm_content=profile&utm_medium=member_android', whatsapp: 'https://wa.me/94764679438', instagram: 'https://www.instagram.com/tuvini_ranchagoda/?utm_source=ig_web_button_share_sheet', email: 'tuviniranchagoda@aiesec.net' } }
    ]
  },
  {
    tierName: "Public Relations",
    members: [
      { id: 'pr-1', name: 'Ashrath Rumie', role: 'OCVP Public Relations', description: "Stepping up to handle PR! Armed with brilliant communication skills and a passion for networking.", image: '/oc/ashrath.png', links: { linkedin: 'https://www.linkedin.com/in/ashrath-rumie-29261826b?utm_source=share_via&utm_content=profile&utm_medium=member_ios', whatsapp: 'https://wa.me/94762191023', instagram: 'https://www.instagram.com/ashrath.rumie?igsi=MXNvcHI2aGtzM3JyMQ==', email: 'ashrath2025@gmail.com' } },
      { id: 'pr-2', name: 'Savandi Liyanayapa', role: 'OCVP Public Relations', description: "Ready to keep everyone engaged, talking, and smiling all day long while promoting the LaunchPad brand.", image: '/oc/savandi.png', links: { linkedin: 'https://www.linkedin.com/in/savandi-liyanayapa-31ba86310?utm_source=share_via&utm_content=profile&utm_medium=member_ios', whatsapp: 'https://wa.me/94711496849', instagram: 'https://www.instagram.com/savandii_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==', email: 'savandisanulya@aiesec.net' } }
    ]
  },
  {
    tierName: "Delegates",
    members: [
      { id: 'del-1', name: 'Pumuthu Weerakoon', role: 'OCVP Delegates', description: "Dedicated to ensuring the delegates have the time of their lives with an unforgettable and smooth experience.", image: '/oc/pumuthu.png', links: { linkedin: 'https://www.linkedin.com/in/pumuthu-weerakoon?utm_source=share_via&utm_content=profile&utm_medium=member_ios', whatsapp: 'https://wa.me/94761020132', instagram: 'https://www.instagram.com/pumuthunimaya?igsi=MWRyam1hMnpjYnIxMA%3D%3D&utm_source=qr', email: 'pumuthunimaya@aiesec.net' } },
      { id: 'del-2', name: 'Sahanya Herath', role: 'OCVP Delegates', description: "Bringing endless enthusiasm to the delegate experience, ready to answer questions and keep the energy high.", image: '/oc/sahanya.png', links: { linkedin: 'https://www.linkedin.com/in/sahanya-herath-97a260311?utm_source=share_via&utm_content=profile&utm_medium=member_ios', whatsapp: 'https://wa.me/94773979334', instagram: 'https://www.instagram.com/justt.ssiya?igsi=NnQ1a240MWp2dzU0&utm_source=qr', email: 'sahanyaherath@aiesec.net' } },
      { id: 'del-3', name: 'Sidangana Inimankada', role: 'OCVP Delegates', description: "Focused on delegate satisfaction and ready to tackle any obstacles that come our way during the sessions.", image: '/oc/sidangana.png', links: { linkedin: 'http://www.linkedin.com/in/sidangana-inimankada', whatsapp: 'https://wa.me/94712442125', instagram: 'https://www.instagram.com/sidangana_h?igsi=OXd0MHp3Z2xqZmk5&utm_source=qr', email: 'sidanganainimankada@aiesec.net' } }
    ]
  },
  {
    tierName: "Events",
    members: [
      { id: 'evt-1', name: 'Fathima Afsha', role: 'OCVP Events', description: "Planning the core events of LaunchPad 4.0 with meticulous attention to detail and a flair for the dramatic.", image: '/oc/afsha.png', links: { linkedin: 'https://www.linkedin.com/in/fathima-afsha', whatsapp: 'https://wa.me/94772568368', instagram: 'https://www.instagram.com/_fathima.afsha_?igsi=MTY3NjE0eHN5bjdoYQ==', email: 'fathimaafsha@aiesec.net' } },
      { id: 'evt-2', name: 'Dinithi Muthukumarana', role: 'OCVP Events', description: "A creative powerhouse ready to brainstorm brilliant event designs that will leave a lasting impact.", image: '/oc/dinithi.png', links: { linkedin: 'https://www.linkedin.com/in/dinithi-muthukumarana-636594348?utm_source=share_via&utm_content=profile&utm_medium=member_ios', whatsapp: 'https://wa.me/94704982264', instagram: 'https://www.instagram.com/dinithi.m_7?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==', email: 'dinithimuthu@aiesec.net' } }
    ]
  },
  {
    tierName: "Marketing",
    members: [
      { id: 'mkt-1', name: 'Disen Sathnidu', role: 'OCVP Marketing', description: "Fueled by a passion for the project and ready to keep the team's marketing energy buzzing with brilliant posts.", image: '/oc/disen.png', links: { linkedin: 'https://www.linkedin.com/in/disen-sathnidu-19a8b52b0?utm_source=share_via&utm_content=profile&utm_medium=member_android', whatsapp: 'https://wa.me/94764761285', instagram: 'https://www.instagram.com/itssathnidu?igsi=ZmFoeXFycTU1d3Zu', email: 'disensathnidu@aiesec.net' } },
      { id: 'mkt-2', name: 'Sanistha', role: 'OCVP Marketing', description: "Bringing out-of-the-box ideas to our digital campaigns and ensuring LaunchPad is seen everywhere.", image: '/oc/sanistha.png', links: { linkedin: '#', whatsapp: '#', instagram: '#', email: '#' } },
      { id: 'mkt-3', name: 'Shalomi Liyanaarachchi', role: 'OCVP Marketing', description: "Mastering the algorithm and ready to skyrocket our engagement metrics with perfectly timed content.", image: '/oc/shalomi.png', links: { linkedin: '#', whatsapp: 'https://wa.me/94763938393', instagram: 'https://www.instagram.com/shalomiii_/?utm_source=ig_web_button_share_sheet', email: 'shalomiaiesec04@gmail.com' } }
    ]
  },
  {
    tierName: "Logistics",
    members: [
      { id: 'log-1', name: 'Abiram Mathivathanan', role: 'OCVP Logistics', description: "Masterminding the backend operations, ensuring that all physical and technical requirements are flawlessly met.", image: '/oc/abiram.png', links: { linkedin: 'https://www.linkedin.com/in/abiram-mathivathanan-788790206', whatsapp: 'https://wa.me/94741293233', instagram: 'https://www.instagram.com/_abi._.ram_?igsi=MXFiZDA5dzdmYXg=', email: 'abirammathi@aiesec.net' } },
      { id: 'log-2', name: 'Chanula Fernando', role: 'OCVP Logistics', description: "Mapping out seamless event logistics with the exact same focus and precision used to win strategy games.", image: '/oc/chanula.png', links: { linkedin: 'https://www.linkedin.com/in/chanula-fernando-813b75310', whatsapp: 'https://wa.me/94702455817', instagram: 'https://www.instagram.com/chanula333?igsi=anMzbXN1Z2l5ZWdq', email: 'chanulafernando@aiesec.net' } }
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
              alt="LaunchPad Logo" 
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
            {member.links.whatsapp && member.links.whatsapp !== '#' && <a href={member.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon"><FaWhatsapp /></a>}
            {member.links.instagram && member.links.instagram !== '#' && <a href={member.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><FaInstagram /></a>}
            {member.links.linkedin && member.links.linkedin !== '#' && <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon"><FaLinkedinIn /></a>}
            {member.links.email && member.links.email !== '#' && <a href={`mailto:${member.links.email}`} aria-label="Email" className="social-icon"><FaEnvelope /></a>}
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
            The Force Behind <span className="highlight-text">LaunchPad</span>
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
