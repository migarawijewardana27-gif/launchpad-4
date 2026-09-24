"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartSlideOver from './CartSlideOver';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
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
  }, [pathname]);

  const aboutLinks = [
    { name: 'Legacy', path: '/legacy' },
    { name: 'Team', path: '/team' },
  ];

  const isLightPage = pathname === '/register' || pathname === '/checkout';
  const shouldBeLight = isScrolled || isLightPage;

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${shouldBeLight ? 'light-mode' : ''}`}>
        <div className="container nav-container">
          <Link href="/" className="nav-logo">
            <img 
              src="/icon white.png" 
              alt="LaunchPad Icon" 
              className="nav-brand-icon" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="nav-links desktop-only">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
            
            <Link href="/legacy" className={`nav-link ${pathname === '/legacy' ? 'active' : ''}`}>Legacy</Link>
            <Link href="/team" className={`nav-link ${pathname === '/team' ? 'active' : ''}`}>Team</Link>
            <span className="nav-link" style={{ cursor: 'not-allowed', opacity: 0.6, display: 'inline-flex', alignItems: 'center' }} title="Coming Soon">
              Event <Lock size={14} style={{ marginLeft: '4px' }} />
            </span>
            {/* Updates link hidden */}
            <span className="nav-link" style={{ cursor: 'not-allowed', opacity: 0.6, display: 'inline-flex', alignItems: 'center' }} title="Coming Soon">
              Shop <Lock size={14} style={{ marginLeft: '4px' }} />
            </span>
          </div>
          
          <div className="nav-actions desktop-only">
            {cartItems.length > 0 && (
              <button className="cart-nav-btn" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={22} />
                <span className="cart-badge">{getCartCount()}</span>
              </button>
            )}
            <Link href="/register" className="btn btn-primary nav-cta">
              Register Now
            </Link>
            <Link href="/ambassadors" className="btn btn-secondary nav-cta">
              Become an Ambassador
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
          <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          
          <Link href="/legacy" className={`mobile-nav-link ${pathname === '/legacy' ? 'active' : ''}`}>Legacy</Link>
          <Link href="/team" className={`mobile-nav-link ${pathname === '/team' ? 'active' : ''}`}>Team</Link>
          <span className="mobile-nav-link" style={{ cursor: 'not-allowed', opacity: 0.6, display: 'flex', alignItems: 'center' }} title="Coming Soon">
            Event <Lock size={16} style={{ marginLeft: '6px' }} />
          </span>
          {/* Updates link hidden */}
          <span className="mobile-nav-link" style={{ cursor: 'not-allowed', opacity: 0.6, display: 'flex', alignItems: 'center' }} title="Coming Soon">
            Shop <Lock size={16} style={{ marginLeft: '6px' }} />
          </span>
          {cartItems.length > 0 && (
            <button className="mobile-cart-btn" onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}>
              <ShoppingCart size={22} /> View Cart ({getCartCount()})
            </button>
          )}
          <Link href="/register" className="btn btn-primary mobile-nav-cta">
            Register Now
          </Link>
          <Link href="/ambassadors" className="btn btn-secondary mobile-nav-cta">
            Become an Ambassador
          </Link>
        </div>
      </nav>
      <CartSlideOver />
    </>
  );
};

export default Navbar;
