import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './PageLoader.css';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Trigger loader on every route change
    setIsLoading(true);

    // After a brief moment, start the kinetic zoom reveal
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Wait 0.6s before zooming

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="page-loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }} // Fade out the red background slightly after the zoom starts
        >
          <motion.div
            className="page-loader-logo-container"
            initial={{ x: 0, y: 0, opacity: 1 }}
            exit={{ 
              x: 1714, // 2000px * cos(31deg)
              y: -1030, // -2000px * sin(31deg)
              opacity: 0
            }}
            transition={{ 
              duration: 0.7, 
              ease: [0.7, 0, 0.3, 1] // Snappy kinetic curve
            }}
          >
            <img 
              src="/icon white.png" 
              alt="Launchpad Loading" 
              className="page-loader-logo" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
