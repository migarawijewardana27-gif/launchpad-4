"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, ZoomIn, X, Ruler } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { SIZES, MAX_QTY_PER_LINE, TSHIRT } from '../../lib/products';
import './Shop.css';

const SIZE_CHART = [
  { size: 'XS', chest: 18, length: 24.5 },
  { size: 'S', chest: 19, length: 25.5 },
  { size: 'M', chest: 20, length: 26.5 },
  { size: 'L', chest: 21, length: 27.5 },
  { size: 'XL', chest: 22, length: 28.5 },
  { size: '2XL', chest: 23, length: 29.5 },
  { size: '3XL', chest: 24, length: 30.5 },
];

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
              <p className="product-price-tag">LKR {TSHIRT.price.toLocaleString('en-US')}</p>
              <h3>{TSHIRT.name}</h3>
              <p className="product-material">Baby Pique Cotton</p>
              <p className="product-desc">{TSHIRT.description}</p>

              <div className="size-picker" role="group" aria-label="Sizes">
                <div className="size-picker-head">
                  <span className="option-label">Tap a size to add one — tap again for more</span>
                  <a href="#size-guide" className="size-guide-link"><Ruler size={14} /> Size guide</a>
                </div>
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

          <motion.div
            id="size-guide"
            className="size-chart glass-panel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="size-chart-head">
              <h3>T-Shirt Size Guide</h3>
              <p>All sizes are in <strong>inches</strong> · ±0.5 in may vary</p>
            </div>
            <div className="size-chart-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col"><span className="sr-only">Measurement</span></th>
                    {SIZE_CHART.map((r) => <th key={r.size} scope="col" className={counts[r.size] ? 'is-picked' : ''}>{r.size}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Chest</th>
                    {SIZE_CHART.map((r) => <td key={r.size} className={counts[r.size] ? 'is-picked' : ''}>{r.chest}</td>)}
                  </tr>
                  <tr>
                    <th scope="row">Length</th>
                    {SIZE_CHART.map((r) => <td key={r.size} className={counts[r.size] ? 'is-picked' : ''}>{r.length}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="size-chart-note">Chest is measured flat across the chest; length from the top of the shoulder to the hem. Sizes you've picked are highlighted.</p>
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
