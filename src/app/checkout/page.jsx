"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, ArrowLeft, Loader, Copy, Check, Mail, ShieldCheck, ShoppingBag } from 'lucide-react';
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
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [verify, setVerify] = useState({ step: 'idle', token: '', proof: '', code: '', error: '', busy: false });

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitted) {
      router.push('/shop');
    }
  }, [cartItems, router, isSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') setVerify({ step: 'idle', token: '', proof: '', code: '', error: '', busy: false });
  };

  const patchVerify = (p) => setVerify((v) => ({ ...v, ...p }));

  const postJson = async (url, data) => {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
    return result;
  };

  const sendCode = async () => {
    patchVerify({ busy: true, error: '' });
    try {
      const { token } = await postJson('/api/orders/verify-email', { email: formData.email });
      patchVerify({ step: 'code', token, code: '', busy: false });
    } catch (err) {
      patchVerify({ error: err.message, busy: false });
    }
  };

  const confirmCode = async () => {
    patchVerify({ busy: true, error: '' });
    try {
      const { proof } = await postJson('/api/orders/verify-email/confirm', { email: formData.email, code: verify.code, token: verify.token });
      patchVerify({ step: 'verified', proof, busy: false });
    } catch (err) {
      patchVerify({ error: err.message, busy: false });
    }
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
    if (verify.step !== 'verified') {
      setSubmitError('Please verify your email address first.');
      return;
    }
    if (cartItems.length > 0) {
      setSubmitError('');
      setIsSubmitting(true);
      
      try {
        const body = new FormData();
        body.append('fullName', formData.fullName);
        body.append('email', formData.email);
        body.append('phone', formData.phone);
        body.append('emailProof', verify.proof);
        body.append('items', JSON.stringify(cartItems.map(({ size, quantity }) => ({ size, quantity }))));
        body.append('receipt', fileToUpload);

        const res = await fetch('/api/orders', { method: 'POST', body });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.error || 'Failed to submit order.');

        setOrderCode(result.orderCode);
        setReceipt({ items: cartItems, total: getCartTotal(), email: formData.email, name: formData.fullName });
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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (isSubmitted) {
    const steps = [
      { icon: ShieldCheck, title: 'We verify your transfer', text: 'Our team checks your bank receipt against the amount.' },
      { icon: Mail, title: 'Confirmation email', text: `We'll email ${receipt?.email || 'you'} as soon as it's verified.` },
      { icon: ShoppingBag, title: 'Collect your T-shirt', text: 'Show your order ID when you pick it up at the event.' },
    ];
    return (
      <div className="page-wrapper order-page theme-red">
        <motion.div
          className="order-card glass-panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="order-check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={44} />
          </motion.div>
          <h2 className="order-heading">Order received{receipt?.name ? `, ${receipt.name.split(' ')[0]}` : ''}!</h2>
          <p className="order-sub">Thanks for pre-ordering. Your bank transfer is now awaiting verification.</p>

          <div className="order-code-box">
            <span className="order-code-label">Order ID</span>
            <div className="order-code-row">
              <strong>{orderCode}</strong>
              <button type="button" className="order-copy-btn" onClick={copyCode} aria-label="Copy order ID">
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {receipt && (
            <div className="order-items">
              {receipt.items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <span><b>{item.quantity}×</b> {item.name} <em>({item.size})</em></span>
                  <span>LKR {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="order-item-row order-total">
                <span>Total paid</span>
                <span>LKR {receipt.total}</span>
              </div>
            </div>
          )}

          <ol className="order-steps">
            {steps.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="order-step-icon"><Icon size={18} /></span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </li>
            ))}
          </ol>

          <div className="order-actions">
            <button className="btn btn-primary" onClick={() => router.push('/shop')}>Order more</button>
            <button className="btn order-secondary" onClick={() => router.push('/')}>Return Home</button>
          </div>
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
              <p>Please transfer the exact Grand Total to the bank account below, using the bank reference shown, and upload the receipt in the form.</p>
              
              <div className="bank-info-grid">
                <div className="bank-info-item">
                  <span>Account Name</span>
                  <strong>H. U. W. Rajapaksha</strong>
                </div>
                <div className="bank-info-item">
                  <span>Bank</span>
                  <strong>Hatton National Bank</strong>
                </div>
                <div className="bank-info-item">
                  <span>Branch</span>
                  <strong>Dehiwala</strong>
                </div>
                <div className="bank-info-item highlight">
                  <span>Account Number</span>
                  <strong>093020297046</strong>
                </div>
              </div>

              <div className="bank-reference">
                <span>Bank Reference</span>
                <strong>[Your Name]-LP</strong>
                <small>Use your first name followed by -LP, e.g. <b>Abiram-LP</b></small>
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
              
              <div className="email-verify">
                <div className="form-group modern-input-group">
                  <input type="email" name="email" placeholder=" " required value={formData.email} onChange={handleChange} readOnly={verify.step === 'verified'} />
                  <label>Email Address</label>
                </div>
                {verify.step === 'verified' ? (
                  <span className="verify-ok"><Check size={16} /> Email verified</span>
                ) : (
                  <>
                    {verify.step === 'idle' && (
                      <button type="button" className="verify-btn" onClick={sendCode} disabled={verify.busy || !formData.email}>
                        {verify.busy ? 'Sending…' : 'Send verification code'}
                      </button>
                    )}
                    {verify.step === 'code' && (
                      <div className="verify-code-row">
                        <input
                          className="verify-code-input"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit code"
                          value={verify.code}
                          onChange={(e) => patchVerify({ code: e.target.value.replace(/\D/g, '') })}
                        />
                        <button type="button" className="verify-btn" onClick={confirmCode} disabled={verify.busy || verify.code.length !== 6}>
                          {verify.busy ? 'Checking…' : 'Verify'}
                        </button>
                        <button type="button" className="verify-link" onClick={sendCode} disabled={verify.busy}>Resend</button>
                      </div>
                    )}
                    {verify.step === 'code' && <span className="verify-hint">We emailed a code to {formData.email}. Check your spam folder too.</span>}
                  </>
                )}
                {verify.error && <span className="error-text">{verify.error}</span>}
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
                  disabled={isSubmitting || verify.step !== 'verified'}
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
