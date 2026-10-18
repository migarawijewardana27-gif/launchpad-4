"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, ZoomIn, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { SIZES, MAX_QTY_PER_LINE, TSHIRT } from '../../lib/products';
import './Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const [counts, setCounts] = useState({});
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => e.key === 'Escape' && setZoomed(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const setCount = (s, n) => setCounts((c) => ({ ...c, [s]: n }));
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const summary = SIZES.filter((s) => counts[s]).map((s) => `${counts[s]}× ${s}`).join(' · ');

  const handleAdd = () => {
    if (!totalCount) return;
    SIZES.forEach((s) => counts[s] && addToCart(TSHIRT, s, counts[s]));
    setCounts({});
  };

  return (
    <div className="page-wrapper shop-page">
      <section className="section-header center-align full-screen-hero shop-hero theme-red">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="merch-badge">EXCLUSIVE MERCHANDISE</div>
          <h1>Gear Up For The Future.</h1>
          <p className="max-w-md mx-auto">
            Take a piece of LaunchPad 4.0 home with you. Pre-order your exclusive T-shirt now.
          </p>
        </motion.div>
      </section>

      <section className="section-padding theme-red">
        <div className="container shop-container">
          <motion.div
            className="product-card tshirt-card glass-panel"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              className="product-image-wrapper tshirt-image-btn"
              onClick={() => setZoomed(true)}
              aria-label="Enlarge T-shirt image"
            >
              <img src={TSHIRT.image} alt={TSHIRT.name} className="product-image" />
              <span className="zoom-hint"><ZoomIn size={16} /> Tap the image to enlarge</span>
            </button>

            <div className="product-info">
              <h3>{TSHIRT.name}</h3>
              <p className="product-material">Baby Pique Cotton</p>
              <p className="product-desc">{TSHIRT.description}</p>

              <div className="size-picker" role="group" aria-label="Sizes">
                <span className="option-label">Tap a size to add one — tap again for more</span>
                <div className="size-options">
                  {SIZES.map((s) => (
                    <div key={s} className="size-chip">
                      <button
                        type="button"
                        className={`size-btn ${counts[s] ? 'selected' : ''}`}
                        aria-label={`Add one ${s}${counts[s] ? ` (${counts[s]} selected)` : ''}`}
                        onClick={() => setCount(s, Math.min(MAX_QTY_PER_LINE, (counts[s] || 0) + 1))}
                      >
                        {s}
                      </button>
                      {counts[s] > 0 && (
                        <>
                          <span className="size-badge">{counts[s]}</span>
                          <button type="button" className="size-undo" aria-label={`Remove one ${s}`} onClick={() => setCount(s, counts[s] - 1)}>
                            <Minus size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-footer">
                <span className="product-price">
                  LKR {TSHIRT.price * totalCount}
                  {totalCount > 0 && <small className="order-summary">{summary}</small>}
                </span>
                <button className="btn btn-primary add-to-cart-btn" onClick={handleAdd} disabled={!totalCount}>
                  <ShoppingCart size={18} /> {totalCount ? `Add ${totalCount} to Cart` : 'Select sizes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setZoomed(false)}>
              <X size={24} />
            </button>
            <motion.img
              src={TSHIRT.image}
              alt={TSHIRT.name}
              className="lightbox-img"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
