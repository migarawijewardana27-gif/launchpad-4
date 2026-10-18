"use client";

import React, { createContext, useState, useContext } from 'react';
import { MAX_QTY_PER_LINE } from '../lib/products';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // A cart line is a product in one size; its id is `${product.id}-${size}`.
  const addToCart = (product, size, quantity = 1) => {
    const lineId = `${product.id}-${size}`;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === lineId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === lineId
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QTY_PER_LINE) }
            : item
        );
      }
      return [...prevItems, { ...product, id: lineId, productId: product.id, size, quantity: Math.min(quantity, MAX_QTY_PER_LINE) }];
    });
    setIsCartOpen(true); // Auto-open cart when item added
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) => 
      prevItems.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.min(Math.max(newQty, 1), MAX_QTY_PER_LINE) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
