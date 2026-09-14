import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import ScrollProgress from './components/ScrollProgress';
import FloatingParticles from './components/FloatingParticles';
import BackToTop from './components/BackToTop';

// Pages
import Home from './pages/Home';
import CeylincoLife from './pages/CeylincoLife';
import Legacy from './pages/Legacy';
import Team from './pages/Team';
import Registration from './pages/Registration';
import Event from './pages/Event';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div {...pageTransition}><Home /></motion.div>} />
        <Route path="/ceylinco-life" element={<motion.div {...pageTransition}><CeylincoLife /></motion.div>} />
        <Route path="/legacy" element={<motion.div {...pageTransition}><Legacy /></motion.div>} />
        <Route path="/team" element={<motion.div {...pageTransition}><Team /></motion.div>} />
        <Route path="/register" element={<motion.div {...pageTransition}><Registration /></motion.div>} />
        <Route path="/event" element={<motion.div {...pageTransition}><Event /></motion.div>} />
        <Route path="/shop" element={<motion.div {...pageTransition}><Shop /></motion.div>} />
        <Route path="/checkout" element={<motion.div {...pageTransition}><Checkout /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollProgress />
        <PageLoader />
        <FloatingParticles />
        <Navbar />
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <AnimatedRoutes />
        </main>
        <Footer />
        <BackToTop />
      </Router>
    </CartProvider>
  );
}

export default App;
