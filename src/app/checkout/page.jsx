"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, ArrowLeft, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { MAX_RECEIPT_BYTES } from '../../lib/orders';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [fileName, setFileName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitted) {
      router.push('/shop');
    }
  }, [cartItems, router, isSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RECEIPT_BYTES) {
      setSubmitError('Receipt is too large (max 4 MB).');
      e.target.value = '';
      return;
    }
    setSubmitError('');
    setFileName(file.name);
    setFileToUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      setSubmitError('');
      setIsSubmitting(true);
      
      try {
        const body = new FormData();
        body.append('fullName', formData.fullName);
        body.append('email', formData.email);
        body.append('phone', formData.phone);
        body.append('items', JSON.stringify(cartItems.map(({ size, quantity }) => ({ size, quantity }))));
        body.append('receipt', fileToUpload);

        const res = await fetch('/api/orders', { method: 'POST', body });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.error || 'Failed to submit order.');

        setOrderCode(result.orderCode);
        clearCart();
        setIsSubmitted(true);
      } catch (error) {
        console.error(error);
        setSubmitError(error.message || 'Failed to submit order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="page-wrapper center-content theme-red">
        <motion.div 
          className="success-message glass-panel"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={80} className="success-icon" />
          </motion.div>
          <h2>Order Received!</h2>
          <p>Your order ID is <strong>{orderCode}</strong>. We are manually reviewing your bank transfer receipt.</p>
          <p>You will receive a confirmation email shortly once verified.</p>
          <button className="btn btn-primary mt-4" onClick={() => router.push('/')}>
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper checkout-page theme-red">
      <div className="container">
        
        <button className="back-link" onClick={() => router.push('/shop')}>
          <ArrowLeft size={18} /> Back to Shop
        </button>

        <div className="checkout-split-panel glass-panel">
          {/* Left Column: Order Summary & Bank Details */}
          <div className="checkout-left">
            <h2 className="checkout-title">Order Summary</h2>
            
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <span className="checkout-item-qty">{item.quantity}x</span>
                    <span className="checkout-item-name">{item.name} ({item.size})</span>
                  </div>
                  <span className="checkout-item-price">LKR {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="checkout-total-row">
                <span>Grand Total</span>
                <span className="checkout-grand-total">LKR {getCartTotal()}</span>
              </div>
            </div>

            <div className="bank-details-box">
              <h3>Bank Transfer Instructions</h3>
              <p>Please transfer the exact Grand Total to the bank account below and upload the receipt in the form.</p>
              
              <div className="bank-info-grid">
                <div className="bank-info-item">
                  <span>Account Name</span>
                  <strong>M.Abiram</strong>
                </div>
                <div className="bank-info-item">
                  <span>Bank</span>
                  <strong>Peoples Bank</strong>
                </div>
                <div className="bank-info-item">
                  <span>Branch</span>
                  <strong>Kandy</strong>
                </div>
                <div className="bank-info-item highlight">
                  <span>Account Number</span>
                  <strong>003200100121866</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: User Details & Receipt Upload */}
          <div className="checkout-right">
            <h2 className="checkout-title">Billing & Receipt</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group modern-input-group">
                <input type="text" name="fullName" placeholder=" " required value={formData.fullName} onChange={handleChange} />
                <label>Full Name</label>
              </div>
              
              <div className="form-group modern-input-group">
                <input type="email" name="email" placeholder=" " required value={formData.email} onChange={handleChange} />
                <label>Email Address</label>
              </div>

              <div className="form-group modern-input-group">
                <input type="tel" name="phone" placeholder=" " required value={formData.phone} onChange={handleChange} />
                <label>Phone Number</label>
              </div>

              <div className="receipt-upload-box">
                <input type="file" id="receipt-upload" accept="image/*,.pdf" onChange={handleFileChange} required />
                <label htmlFor="receipt-upload" className="upload-label">
                  <Upload size={32} className="upload-icon" />
                  <span className="upload-text">
                    {fileName ? fileName : 'Click to Upload Transfer Receipt'}
                  </span>
                  <span className="upload-subtext">Supports JPG, PNG, PDF (max 4 MB)</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary checkout-submit-btn pulse-btn"
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader className="spin" size={18} /> Processing...
                    </span>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
                {submitError && <span className="error-text" style={{ marginTop: '8px' }}>{submitError}</span>}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
