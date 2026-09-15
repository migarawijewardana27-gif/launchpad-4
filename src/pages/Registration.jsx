import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { submitFormData } from '../services/firebaseService';
import './Registration.css';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    degree: '',
    gradYear: '',
    interests: '',
    howDidYouHear: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.university) newErrors.university = 'Institution/University is required';
    if (!formData.degree) newErrors.degree = 'Field of Study/Degree is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      await submitFormData('registrations', formData);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError('Failed to submit registration. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  if (isSubmitted) {
    return (
      <div className="page-wrapper form-page center-content">
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
          <h2>Registration Successful!</h2>
          <p>You have successfully registered for LaunchPad 4.0. Keep an eye on your email for further instructions and updates.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper form-page">
      <div className="container">
        <div className="registration-split-panel glass-panel">
          
          {/* Left Column: Branding and Stepper */}
          <div className="split-left">
            <div className="left-content">
              <img src="/White Logo.png" alt="Launchpad 4.0 Logo" className="reg-logo" />
              <h2>Step Into<br/>The Future.</h2>
              <p className="reg-subtitle">Join the most anticipated corporate simulation event of the year.</p>
              
              <div className="modern-stepper">
                <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="node-circle">1</div>
                  <span className="node-label">Personal Info</span>
                </div>
                <div className="step-line">
                  <motion.div className="line-fill" initial={{ height: 0 }} animate={{ height: step > 1 ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                </div>
                
                <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                  <div className="node-circle">2</div>
                  <span className="node-label">Education</span>
                </div>
                <div className="step-line">
                  <motion.div className="line-fill" initial={{ height: 0 }} animate={{ height: step > 2 ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                </div>
                
                <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
                  <div className="node-circle">3</div>
                  <span className="node-label">Interests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Area */}
          <div className="split-right">
            <div className="form-content-area">
              <h3 className="step-title">
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Your educational background"}
                {step === 3 && "Your areas of interest"}
              </h3>
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    <div className="form-row">
                      <div className="form-group modern-input-group">
                        <input type="text" name="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} />
                        <label>First Name</label>
                        {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                      </div>
                      <div className="form-group modern-input-group">
                        <input type="text" name="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} />
                        <label>Last Name</label>
                        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group modern-input-group">
                        <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
                        <label>Email Address</label>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>
                      <div className="form-group modern-input-group">
                        <input type="tel" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
                        <label>Phone Number</label>
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    <div className="form-group modern-input-group">
                      <input type="text" name="university" placeholder=" " value={formData.university} onChange={handleChange} />
                      <label>Institution / University</label>
                      {errors.university && <span className="error-text">{errors.university}</span>}
                    </div>
                    <div className="form-group modern-input-group">
                      <input type="text" name="degree" placeholder=" " value={formData.degree} onChange={handleChange} />
                      <label>Field of Study / Degree</label>
                      {errors.degree && <span className="error-text">{errors.degree}</span>}
                    </div>
                    <div className="form-group modern-select-group">
                      <label className="static-label">Expected Graduation Year</label>
                      <select name="gradYear" value={formData.gradYear} onChange={handleChange}>
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    <div className="form-group modern-select-group">
                      <label className="static-label">Areas of Interest</label>
                      <select name="interests" value={formData.interests} onChange={handleChange}>
                        <option value="">Select Interest</option>
                        <option value="IT/Tech">IT & Technology</option>
                        <option value="Marketing">Marketing & Sales</option>
                        <option value="Finance">Finance & Accounting</option>
                        <option value="HR">Human Resources</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group modern-select-group">
                      <label className="static-label">How did you hear about LaunchPad 4.0?</label>
                      <select name="howDidYouHear" value={formData.howDidYouHear} onChange={handleChange}>
                        <option value="">Select Option</option>
                        <option value="SocialMedia">Social Media</option>
                        <option value="University">University Network</option>
                        <option value="Friend">Friend / Colleague</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="form-actions-modern">
              {step > 1 ? (
                <button type="button" className="btn btn-secondary form-btn outline-btn" onClick={handlePrev}>
                  <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back
                </button>
              ) : (
                <div className="spacer"></div>
              )}
              
              {step < 3 ? (
                <button type="button" className="btn btn-primary form-btn modern-glow-btn" onClick={handleNext}>
                  Next <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              ) : (
                <div className="submit-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-primary form-btn modern-glow-btn pulse-btn" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader className="spin" size={18} /> Submitting...
                      </span>
                    ) : (
                      'Complete'
                    )}
                  </button>
                  {submitError && <span className="error-text" style={{ marginTop: '8px' }}>{submitError}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
