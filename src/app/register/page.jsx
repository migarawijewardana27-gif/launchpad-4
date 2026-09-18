"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Loader, Upload } from 'lucide-react';
import { submitFormData, uploadFile } from '../../services/supabaseService';
import './Registration.css';

const MEMORY_IMAGES = [
  "/images all/DSC02817.jpg",
  "/images all/DSC02821.jpg",
  "/images all/DSC02825.jpg",
  "/images all/DSC02827.jpg",
  "/images all/DSC02828.jpg",
  "/images all/DSC02830.jpg",
  "/images all/DSC02832.jpg",
  "/images all/DSC02837.jpg",
  "/images all/DSC02840.jpg",
  "/images all/DSC02842.jpg",
  "/images all/DSC02843.jpg",
  "/images all/DSC02849.jpg",
  "/images all/DSC02860.jpg",
  "/images all/DSC02861.jpg",
  "/images all/DSC02863.jpg"
];

const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    ambassadorCode: '',
    isAiesecer: '',
    currentStatus: '',

    // Step 2: Background
    university: '',
    academicYear: '',
    school: '',
    planningToPursue: '',
    gradYear: '',
    currentlyLooking: '',
    jobRole: '',
    industry: '',
    experienceYears: '',
    highestEducation: '',
    opportunityLookingFor: '',
    employmentStatus: '',
    preferredCareerArea: '',

    // Step 3: Interests
    businessSector: [],
    itSector: [],
    educationSector: [],
    engineeringSector: [],
    gainingFromLaunchpad: [],

    // Step 4: Opportunities
    opportunityType: [],
    partnerInfo: '',
    availability: '',

    // Step 5: Profile
    cvConsideration: '',
    privacyPolicy: false,
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'privacyPolicy') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => {
          const arr = prev[name];
          if (checked) {
            return { ...prev, [name]: [...arr, value] };
          } else {
            return { ...prev, [name]: arr.filter(item => item !== value) };
          }
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFileName(e.target.files[0].name);
      setCvFile(e.target.files[0]);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.whatsapp) newErrors.whatsapp = 'WhatsApp is required';
    if (!formData.isAiesecer) newErrors.isAiesecer = 'Please select Yes or No';
    if (!formData.currentStatus) newErrors.currentStatus = 'Please select your status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Light validation for step 2 based on status
    const newErrors = {};
    if (formData.currentStatus === 'Undergraduate') {
      if (!formData.university) newErrors.university = 'Required';
      if (!formData.academicYear) newErrors.academicYear = 'Required';
    } else if (formData.currentStatus === 'School Student') {
      if (!formData.school) newErrors.school = 'Required';
    } else if (formData.currentStatus === 'Graduate') {
      if (!formData.university) newErrors.university = 'Required';
      if (!formData.gradYear) newErrors.gradYear = 'Required';
    } else if (formData.currentStatus === 'Employed') {
      if (!formData.jobRole) newErrors.jobRole = 'Required';
    } else if (formData.currentStatus === 'Unemployed') {
      if (!formData.highestEducation) newErrors.highestEducation = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};
    if (!formData.privacyPolicy) newErrors.privacyPolicy = 'You must agree to the privacy policy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep5()) return;
    
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      let cvUrl = null;
      if (cvFile) {
        cvUrl = await uploadFile(cvFile, 'cvs');
      }

      const finalData = {
        ...formData,
        cvUrl
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Backend registration failed');
      }

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

  // UI Helpers
  const renderRadio = (name, value, label) => (
    <label className="radio-label">
      <input type="radio" name={name} value={value} checked={formData[name] === value} onChange={handleChange} />
      <span>{label}</span>
    </label>
  );

  const renderCheckbox = (name, value, label) => (
    <label className="checkbox-label">
      <input type="checkbox" name={name} value={value} checked={formData[name]?.includes(value)} onChange={handleChange} />
      <span>{label}</span>
    </label>
  );

  if (isSubmitted) {
    return (
      <div className="page-wrapper form-page center-content theme-red">
        <motion.div 
          className="success-message glass-panel"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
            <CheckCircle size={80} className="success-icon" />
          </motion.div>
          <h2>Registration Successful!</h2>
          <p>You have successfully registered for LaunchPad 4.0. Keep an eye on your email for further instructions and updates.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper form-page theme-red">
      <div className="container">
        <div className="registration-split-panel glass-panel">
          
          {/* Left Column: Branding and Stepper */}
          <div className="split-left">
            <div className="memory-scroller-container">
              <div className="memory-scroller-track">
                {[...MEMORY_IMAGES, ...MEMORY_IMAGES].map((src, i) => (
                  <img key={i} src={src} className="memory-image" alt="Memory" loading="lazy" />
                ))}
              </div>
            </div>
            <div className="left-content">
              <img src="/White Logo.png" alt="Launchpad 4.0 Logo" className="reg-logo" />
              <h2>Step Into<br/>The Future.</h2>
              <p className="reg-subtitle">Join the most anticipated corporate simulation event of the year.</p>
              
              <div className="modern-stepper">
                {['Personal Info', 'Background', 'Interests', 'Opportunities', 'Profile'].map((label, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`step-node ${step >= idx + 1 ? 'active' : ''} ${step > idx + 1 ? 'completed' : ''}`}>
                      <div className="node-circle">{idx + 1}</div>
                      <span className="node-label">{label}</span>
                    </div>
                    {idx < 4 && (
                      <div className="step-line">
                        <motion.div className="line-fill" initial={{ height: 0 }} animate={{ height: step > idx + 1 ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form Area */}
          <div className="split-right">
            <div className="form-content-area custom-scrollbar">
              <h3 className="step-title">
                {step === 1 && "Personal Information"}
                {step === 2 && "Academic & Professional Background"}
                {step === 3 && "Career Interests"}
                {step === 4 && "Discover Opportunities"}
                {step === 5 && "Build Your Profile"}
              </h3>
              
              <AnimatePresence mode="wait">
                {/* STEP 1: PERSONAL */}
                {step === 1 && (
                  <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    <div className="form-row">
                      <div className="form-group modern-input-group">
                        <input type="text" name="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} />
                        <label>First Name *</label>
                        {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                      </div>
                      <div className="form-group modern-input-group">
                        <input type="text" name="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} />
                        <label>Last Name *</label>
                        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group modern-input-group">
                        <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
                        <label>Email Address *</label>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>
                      <div className="form-group modern-input-group">
                        <input type="tel" name="whatsapp" placeholder=" " value={formData.whatsapp} onChange={handleChange} />
                        <label>WhatsApp Number (+94...) *</label>
                        {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
                      </div>
                    </div>
                    <div className="form-group modern-input-group">
                      <input type="text" name="ambassadorCode" placeholder=" " value={formData.ambassadorCode} onChange={handleChange} />
                      <label>Delegate Ambassador Code (Optional)</label>
                    </div>
                    <div className="form-group modern-radio-group">
                      <label className="static-label">Are you an AIESECer? *</label>
                      <div className="radio-options">
                        {renderRadio('isAiesecer', 'Yes', 'Yes')}
                        {renderRadio('isAiesecer', 'No', 'No')}
                      </div>
                      {errors.isAiesecer && <span className="error-text">{errors.isAiesecer}</span>}
                    </div>
                    <div className="form-group modern-select-group">
                      <label className="static-label">What best describes your current status? *</label>
                      <select name="currentStatus" value={formData.currentStatus} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Employed">Employed</option>
                        <option value="Unemployed">Unemployed / Seeking</option>
                        <option value="School Student">School Student</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.currentStatus && <span className="error-text">{errors.currentStatus}</span>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BACKGROUND (DYNAMIC) */}
                {step === 2 && (
                  <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    
                    {formData.currentStatus === 'Undergraduate' && (
                      <>
                        <div className="form-group modern-input-group">
                          <input type="text" name="university" placeholder=" " value={formData.university} onChange={handleChange} />
                          <label>Your University *</label>
                          {errors.university && <span className="error-text">{errors.university}</span>}
                        </div>
                        <div className="form-group modern-radio-group">
                          <label className="static-label">Academic Year *</label>
                          <div className="radio-options">
                            {renderRadio('academicYear', '1st Year', '1st Year')}
                            {renderRadio('academicYear', '2nd Year', '2nd Year')}
                            {renderRadio('academicYear', '3rd Year', '3rd Year')}
                            {renderRadio('academicYear', '4th Year', '4th Year')}
                          </div>
                          {errors.academicYear && <span className="error-text">{errors.academicYear}</span>}
                        </div>
                      </>
                    )}

                    {formData.currentStatus === 'School Student' && (
                      <>
                        <div className="form-group modern-input-group">
                          <input type="text" name="school" placeholder=" " value={formData.school} onChange={handleChange} />
                          <label>Most Recent School / Educational Institution *</label>
                          {errors.school && <span className="error-text">{errors.school}</span>}
                        </div>
                        <div className="form-group modern-select-group">
                          <label className="static-label">What are you currently planning to pursue?</label>
                          <select name="planningToPursue" value={formData.planningToPursue} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="University">University Education</option>
                            <option value="Professional Qualifications">Professional Qualifications</option>
                            <option value="Employment">Employment</option>
                            <option value="Entrepreneurship">Entrepreneurship</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </>
                    )}

                    {formData.currentStatus === 'Graduate' && (
                      <>
                        <div className="form-group modern-input-group">
                          <input type="text" name="university" placeholder=" " value={formData.university} onChange={handleChange} />
                          <label>University / Higher Educational Institution *</label>
                          {errors.university && <span className="error-text">{errors.university}</span>}
                        </div>
                        <div className="form-group modern-input-group">
                          <input type="text" name="gradYear" placeholder=" " value={formData.gradYear} onChange={handleChange} />
                          <label>Year of Graduation *</label>
                          {errors.gradYear && <span className="error-text">{errors.gradYear}</span>}
                        </div>
                        <div className="form-group modern-radio-group">
                          <label className="static-label">Are you currently looking for career opportunities?</label>
                          <div className="radio-options">
                            {renderRadio('currentlyLooking', 'Yes', 'Yes')}
                            {renderRadio('currentlyLooking', 'No', 'No')}
                          </div>
                        </div>
                      </>
                    )}

                    {formData.currentStatus === 'Employed' && (
                      <>
                        <div className="form-group modern-input-group">
                          <input type="text" name="jobRole" placeholder=" " value={formData.jobRole} onChange={handleChange} />
                          <label>Current Job Role / Position *</label>
                          {errors.jobRole && <span className="error-text">{errors.jobRole}</span>}
                        </div>
                        <div className="form-group modern-input-group">
                          <input type="text" name="industry" placeholder=" " value={formData.industry} onChange={handleChange} />
                          <label>Current Industry / Sector</label>
                        </div>
                        <div className="form-group modern-radio-group">
                          <label className="static-label">Years of Professional Experience</label>
                          <div className="radio-options">
                            {renderRadio('experienceYears', 'Less than 1', 'Less than 1')}
                            {renderRadio('experienceYears', '1-2 years', '1-2 years')}
                            {renderRadio('experienceYears', '3-5 years', '3-5 years')}
                            {renderRadio('experienceYears', '5+ years', '5+ years')}
                          </div>
                        </div>
                      </>
                    )}

                    {(formData.currentStatus === 'Unemployed' || formData.currentStatus === 'Other') && (
                      <>
                        <div className="form-group modern-select-group">
                          <label className="static-label">Highest Level of Education Completed *</label>
                          <select name="highestEducation" value={formData.highestEducation} onChange={handleChange}>
                            <option value="">Select Education</option>
                            <option value="O/L">O/L</option>
                            <option value="A/L">A/L</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Undergraduate Degree">Undergraduate Degree</option>
                            <option value="Master's Degree">Master's Degree</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.highestEducation && <span className="error-text">{errors.highestEducation}</span>}
                        </div>
                        <div className="form-group modern-radio-group">
                          <label className="static-label">What type of opportunity are you currently looking for?</label>
                          <div className="radio-options">
                            {renderRadio('opportunityLookingFor', 'Internship', 'Internship')}
                            {renderRadio('opportunityLookingFor', 'Full-time', 'Full-time')}
                            {renderRadio('opportunityLookingFor', 'Part-time', 'Part-time')}
                            {renderRadio('opportunityLookingFor', 'Other', 'Other')}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="form-group modern-select-group">
                      <label className="static-label">Preferred Career Area (General)</label>
                      <select name="preferredCareerArea" value={formData.preferredCareerArea} onChange={handleChange}>
                        <option value="">Select Area</option>
                        <option value="Business">Business Sector</option>
                        <option value="IT">IT Sector</option>
                        <option value="Education">Education Sector</option>
                        <option value="Engineering">Engineering Sector</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </motion.div>
                )}

                {/* STEP 3: INTERESTS */}
                {step === 3 && (
                  <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    <p className="step-desc">Select specific areas of interest within the following sectors:</p>
                    
                    <div className="checkbox-grid-group">
                      <label className="static-label">Business Sector</label>
                      <div className="checkbox-grid">
                        {renderCheckbox('businessSector', 'Marketing', 'Marketing')}
                        {renderCheckbox('businessSector', 'Human Resources', 'HR')}
                        {renderCheckbox('businessSector', 'Business Admin', 'Business Admin')}
                        {renderCheckbox('businessSector', 'Finance', 'Finance')}
                        {renderCheckbox('businessSector', 'Business Dev', 'Business Dev')}
                      </div>
                    </div>

                    <div className="checkbox-grid-group">
                      <label className="static-label">IT Sector</label>
                      <div className="checkbox-grid">
                        {renderCheckbox('itSector', 'Software Dev', 'Software Dev')}
                        {renderCheckbox('itSector', 'Data Science', 'Data Science & AI')}
                        {renderCheckbox('itSector', 'Cybersecurity', 'Cybersecurity')}
                        {renderCheckbox('itSector', 'UI/UX', 'UI/UX Design')}
                      </div>
                    </div>

                    <div className="checkbox-grid-group">
                      <label className="static-label">What are you most interested in gaining from LaunchPad 4.0?</label>
                      <div className="checkbox-grid">
                        {renderCheckbox('gainingFromLaunchpad', 'Career Guidance', 'Career Guidance')}
                        {renderCheckbox('gainingFromLaunchpad', 'Industry Insights', 'Industry Insights')}
                        {renderCheckbox('gainingFromLaunchpad', 'Internships', 'Internships')}
                        {renderCheckbox('gainingFromLaunchpad', 'Networking', 'Networking')}
                        {renderCheckbox('gainingFromLaunchpad', 'Mentorship', 'Mentorship')}
                        {renderCheckbox('gainingFromLaunchpad', 'CV Dev', 'CV Development')}
                        {renderCheckbox('gainingFromLaunchpad', 'Interview Prep', 'Interview Prep')}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: OPPORTUNITIES */}
                {step === 4 && (
                  <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    
                    <div className="form-group modern-radio-group">
                      <label className="static-label">What type of opportunities are you interested in?</label>
                      <div className="checkbox-grid">
                        {renderCheckbox('opportunityType', 'Local', 'Local Internships')}
                        {renderCheckbox('opportunityType', 'International', 'International Internships')}
                      </div>
                    </div>

                    <div className="form-group modern-radio-group">
                      <label className="static-label">Would you be interested in receiving information about career opportunities from our partner companies?</label>
                      <div className="radio-options vertical-radio">
                        {renderRadio('partnerInfo', 'Yes', 'Yes, I am interested')}
                        {renderRadio('partnerInfo', 'Maybe', 'Maybe, I would like to know more')}
                        {renderRadio('partnerInfo', 'No', 'No, not at this time')}
                      </div>
                    </div>

                    <div className="form-group modern-radio-group">
                      <label className="static-label">When would you ideally be available to begin an internship or career opportunity?</label>
                      <div className="radio-options vertical-radio">
                        {renderRadio('availability', 'Immediately', 'Immediately')}
                        {renderRadio('availability', '1-3 months', 'Within 1-3 months')}
                        {renderRadio('availability', 'After graduation', 'After graduation')}
                        {renderRadio('availability', 'Not looking', 'I am not currently looking')}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: PROFILE */}
                {step === 5 && (
                  <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="form-step-wrapper">
                    
                    <div className="form-group modern-radio-group">
                      <label className="static-label">Would you like your CV to be considered for relevant opportunities from our partner companies?</label>
                      <div className="radio-options">
                        {renderRadio('cvConsideration', 'Yes', 'Yes')}
                        {renderRadio('cvConsideration', 'No', 'No')}
                      </div>
                    </div>

                    <div className="receipt-upload-box">
                      <label className="static-label">Upload Your CV (PDF)</label>
                      <input type="file" id="cv-upload" accept=".pdf" onChange={handleFileChange} />
                      <label htmlFor="cv-upload" className="upload-label">
                        <Upload size={32} className="upload-icon" />
                        <span className="upload-text">
                          {cvFileName ? cvFileName : 'Click to Upload CV'}
                        </span>
                        <span className="upload-subtext">PDF format preferred</span>
                      </label>
                    </div>

                    <div className="privacy-policy-box">
                      <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                        <input type="checkbox" name="privacyPolicy" checked={formData.privacyPolicy} onChange={handleChange} />
                        <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                          Privacy Policy * <br/>
                          I have read and agree to AIESEC in Sri Lanka's Privacy Policy.
                        </span>
                      </label>
                      {errors.privacyPolicy && <span className="error-text">{errors.privacyPolicy}</span>}
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
              
              {step < 5 ? (
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
                      'Complete Registration'
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
