import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartSlideOver from './CartSlideOver';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems, setIsCartOpen, getCartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Ceylinco Life', path: '/ceylinco-life' },
    { name: 'Legacy', path: '/legacy' },
    { name: 'Team', path: '/team' },
    { name: 'Event', path: '/event' },
    { name: 'Shop', path: '/shop' },
  ];

  const isLightPage = location.pathname === '/register' || location.pathname === '/checkout';
  const shouldBeLight = isScrolled || isLightPage;

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${shouldBeLight ? 'light-mode' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <img 
              src={shouldBeLight ? "/icon red.png" : "/icon white.png"} 
              alt="LaunchPad Icon" 
              className="nav-brand-icon" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="nav-links desktop-only">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="nav-actions desktop-only">
            {cartItems.length > 0 && (
              <button className="cart-nav-btn" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={22} />
                <span className="cart-badge">{getCartCount()}</span>
              </button>
            )}
            <Link to="/register" className="btn btn-primary nav-cta">
              Register Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {cartItems.length > 0 && (
            <button className="mobile-cart-btn" onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}>
              <ShoppingCart size={22} /> View Cart ({getCartCount()})
            </button>
          )}
          <Link to="/register" className="btn btn-primary mobile-nav-cta">
            Register Now
          </Link>
        </div>
      </nav>
      <CartSlideOver />
    </>
  );
};

export default Navbar;
