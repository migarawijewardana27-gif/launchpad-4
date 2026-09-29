"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Copy } from 'lucide-react';

const AmbassadorForm = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    currentStatus: '',
    organization: '',
    isAiesecer: '',
    aiesecEntity: '',
    otherEntity: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | { success: true, code: 'LPA001' } | { error: true }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/ambassador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSubmitStatus({ success: true, code: json.ambassadorCode });
      } else {
        setSubmitStatus({ error: true });
      }
    } catch {
      setSubmitStatus({ error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus?.success) {
    const handleCopy = () => {
      navigator.clipboard.writeText(submitStatus.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <motion.div
        className="form-success-message"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle size={56} className="success-icon" />
        <h3>You're In!</h3>
        <p>Welcome to the LaunchPad 4.0 Ambassador network. Your code is:</p>
        
        <div 
          className="code-display" 
          onClick={handleCopy}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', position: 'relative' }}
          title="Click to copy"
        >
          {submitStatus.code}
          <Copy size={20} style={{ opacity: 0.7 }} />
          <AnimatePresence>
            {copied && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', top: '-30px', background: '#333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="code-hint">Check your email for full details and next steps. Share this code with your network and start climbing the leaderboard!</p>
        
        <div className="whatsapp-prompt" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '8px', color: '#333' }}>
          <h3 style={{ color: '#16a34a', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Join the Ambassador WhatsApp Group</h3>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', opacity: 0.9 }}>
            Join the official group to receive exclusive updates, network with other ambassadors, and track leaderboard progress.
          </p>
          <a 
            href="https://chat.whatsapp.com/IQqZKmoWGuTGEgzEQa1LLc?mode=gi_t" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '4px', textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}
          >
            Join WhatsApp Group
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="ambassador-form-container">
      {submitStatus?.error && (
        <div className="form-error-banner">
          <AlertCircle size={18} />
          <span>Something went wrong. Please try again or contact us on WhatsApp.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ambassador-form">

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="amb-fullName">Full Name <span className="required">*</span></label>
          <input
            type="text"
            id="amb-fullName"
            name="fullName"
            className="form-control"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="amb-email">Email Address <span className="required">*</span></label>
          <input
            type="email"
            id="amb-email"
            name="email"
            className="form-control"
            placeholder="you@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* WhatsApp */}
        <div className="form-group">
          <label htmlFor="amb-whatsapp">WhatsApp Number <span className="required">*</span></label>
          <span className="help-text">Format: 7xxxxxxxx (without the leading 0 or country code)</span>
          <div className="input-with-prefix">
            <span className="input-prefix">+94</span>
            <input
              type="text"
              id="amb-whatsapp"
              name="whatsapp"
              className="form-control"
              placeholder="7xxxxxxxx"
              pattern="[0-9]{9}"
              title="9-digit number without country code"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Current Status */}
        <div className="form-group">
          <label>Current Status <span className="required">*</span></label>
          <div className="radio-group">
            {['School Student', 'School Leaver', 'Undergraduate', 'Employed'].map(status => (
              <label key={status} className="radio-label">
                <input type="radio" name="currentStatus" value={status} onChange={handleChange} required checked={formData.currentStatus === status} />
                <span className="radio-custom" />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* Organization */}
        <div className="form-group">
          <label htmlFor="amb-organization">School / University / Institute / Organization <span className="required">*</span></label>
          <input
            type="text"
            id="amb-organization"
            name="organization"
            className="form-control"
            placeholder="Your organization name"
            value={formData.organization}
            onChange={handleChange}
            required
          />
        </div>

        {/* Are you an AIESECer */}
        <div className="form-group">
          <label>Are you an AIESECer? <span className="required">*</span></label>
          <div className="radio-group row-group">
            {['Yes', 'No'].map(val => (
              <label key={val} className="radio-label">
                <input type="radio" name="isAiesecer" value={val} onChange={handleChange} required checked={formData.isAiesecer === val} />
                <span className="radio-custom" />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* AIESEC Entity - conditional */}
        <AnimatePresence>
          {formData.isAiesecer === 'Yes' && (
            <motion.div
              className="form-group conditional-group"
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <label>Your AIESEC Entity <span className="required">*</span></label>
              <div className="radio-group radio-grid">
                {['USJ', 'CC', 'CS', 'CN', 'SLIIT', 'NIBM', 'NSBM', 'Kandy', 'Ruhuna', 'Rajarata', 'Wayamba'].map(entity => (
                  <label key={entity} className="radio-label">
                    <input
                      type="radio"
                      name="aiesecEntity"
                      value={entity}
                      onChange={handleChange}
                      required={formData.isAiesecer === 'Yes'}
                      checked={formData.aiesecEntity === entity}
                    />
                    <span className="radio-custom" />
                    {entity}
                  </label>
                ))}
                {/* Other */}
                <label className="radio-label other-label">
                  <input
                    type="radio"
                    name="aiesecEntity"
                    value="Other"
                    onChange={handleChange}
                    checked={formData.aiesecEntity === 'Other'}
                  />
                  <span className="radio-custom" />
                  Other:
                  <input
                    type="text"
                    name="otherEntity"
                    className="form-control inline-input"
                    placeholder="Specify entity"
                    value={formData.otherEntity}
                    onChange={handleChange}
                    disabled={formData.aiesecEntity !== 'Other'}
                    required={formData.aiesecEntity === 'Other'}
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="form-submit-container">
          <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner" /> Registering...</>
            ) : (
              'Claim My Ambassador Code'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AmbassadorForm;
