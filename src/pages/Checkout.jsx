import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { submitFormData, uploadFile } from '../services/firebaseService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [fileName, setFileName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitted) {
      navigate('/shop');
    }
  }, [cartItems, navigate, isSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      setSubmitError('');
      setIsSubmitting(true);
      
      try {
        let receiptUrl = null;
        if (fileToUpload) {
          receiptUrl = await uploadFile(fileToUpload, 'receipts');
        }

        await submitFormData('orders', {
          ...formData,
          items: cartItems,
          total: getCartTotal(),
          receiptUrl,
        });

        clearCart();
        setIsSubmitted(true);
      } catch (error) {
        console.error(error);
        setSubmitError('Failed to submit order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="page-wrapper center-content">
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
          <p>Thank you for your purchase. We are manually reviewing your bank transfer receipt.</p>
          <p>You will receive a confirmation email shortly once verified.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper checkout-page">
      <div className="container">
        
        <button className="back-link" onClick={() => navigate('/shop')}>
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
                    <span className="checkout-item-name">{item.name}</span>
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
                  <span>Bank Name</span>
                  <strong>Commercial Bank</strong>
                </div>
                <div className="bank-info-item">
                  <span>Branch</span>
                  <strong>Colombo 07</strong>
                </div>
                <div className="bank-info-item">
                  <span>Account Name</span>
                  <strong>AIESEC LaunchPad</strong>
                </div>
                <div className="bank-info-item highlight">
                  <span>Account Number</span>
                  <strong>1234 5678 9101</strong>
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

              <div className="form-group modern-input-group">
                <input type="text" name="address" placeholder=" " required value={formData.address} onChange={handleChange} />
                <label>Delivery / Pickup Address</label>
              </div>

              <div className="receipt-upload-box">
                <input type="file" id="receipt-upload" accept="image/*,.pdf" onChange={handleFileChange} required />
                <label htmlFor="receipt-upload" className="upload-label">
                  <Upload size={32} className="upload-icon" />
                  <span className="upload-text">
                    {fileName ? fileName : 'Click to Upload Transfer Receipt'}
                  </span>
                  <span className="upload-subtext">Supports JPG, PNG, PDF</span>
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
