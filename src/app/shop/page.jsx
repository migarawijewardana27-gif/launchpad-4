"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Shop.css';

const MERCH_ITEMS = [
  {
    id: 'combo',
    name: 'The Ultimate Combo',
    price: 2200,
    description: 'Get the T-Shirt, Wrist Band, and Tote Bag together at a discounted price! The complete LaunchPad 4.0 delegate experience.',
    image: '/logo only.png'
  },
  {
    id: 'tshirt',
    name: 'LaunchPad 4.0 Signature T-Shirt',
    price: 1500,
    description: 'Premium cotton t-shirt featuring the exclusive LaunchPad 4.0 futuristic branding.',
    image: '/White Logo.png'
  },
  {
    id: 'wristband',
    name: 'Official Wrist Band',
    price: 300,
    description: 'Glow-in-the-dark silicone wrist band to commemorate the event.',
    image: '/icon white.png'
  },
  {
    id: 'totebag',
    name: 'LaunchPad Tote Bag',
    price: 800,
    description: 'Eco-friendly canvas tote bag with the corporate simulation emblem.',
    image: '/White Logo with Title Partner Border 3x.png'
  }
];

const Shop = () => {
  const { addToCart } = useCart();

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
            Take a piece of LaunchPad 4.0 home with you. Pre-order your exclusive merchandise now.
          </p>
        </motion.div>
      </section>

      <section className="section-padding theme-red">
        <div className="container shop-container">
          <div className="shop-grid">
          {MERCH_ITEMS.map((item, index) => (
            <motion.div 
              key={item.id} 
              className={`product-card glass-panel ${item.id === 'combo' ? 'combo-card' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="product-image-wrapper">
                {/* Temporary placeholder layout until real images are provided */}
                <div className="placeholder-bg"></div>
                <img src={item.image} alt={item.name} className="product-image" />
                {item.id === 'combo' && <div className="discount-tag">Save LKR 400!</div>}
              </div>
              
              <div className="product-info">
                <h3>{item.name}</h3>
                <p className="product-desc">{item.description}</p>
                <div className="product-footer">
                  <span className="product-price">LKR {item.price}</span>
                  <button 
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart size={18} /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
