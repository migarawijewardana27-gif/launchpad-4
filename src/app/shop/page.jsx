"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { SIZES, MAX_QTY_PER_LINE, TSHIRT } from '../../lib/products';
import './Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!size) return;
    addToCart(TSHIRT, size, quantity);
    setQuantity(1);
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
            <div className="product-image-wrapper">
              <div className="placeholder-bg"></div>
              <img src={TSHIRT.image} alt={TSHIRT.name} className="product-image" />
            </div>

            <div className="product-info">
              <h3>{TSHIRT.name}</h3>
              <p className="product-material">Baby Pique Cotton</p>
              <p className="product-desc">{TSHIRT.description}</p>

              <div className="size-picker" role="radiogroup" aria-label="Size">
                <span className="option-label">Size</span>
                <div className="size-options">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      className={`size-btn ${size === s ? 'selected' : ''}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="qty-picker">
                <span className="option-label">Quantity</span>
                <div className="qty-controls">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(MAX_QTY_PER_LINE, q + 1))}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="product-footer">
                <span className="product-price">LKR {TSHIRT.price * quantity}</span>
                <button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={handleAdd}
                  disabled={!size}
                >
                  <ShoppingCart size={18} /> {size ? 'Add to Cart' : 'Select a size'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
