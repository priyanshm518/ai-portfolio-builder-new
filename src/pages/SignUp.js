import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const [particles] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 4 + 2, speed: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3, delay: Math.random() * 5
    }))
  );
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    } else {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'At least 8 characters required';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Need uppercase, lowercase & number';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 && validateForm()) { setStep(2); return; }
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;
    if (score <= 2) return { width: '33%', color: '#dc3545', label: 'Weak' };
    if (score <= 3) return { width: '66%', color: '#ffc107', label: 'Medium' };
    return { width: '100%', color: '#28a745', label: 'Strong' };
  };

  const strength = formData.password ? getPasswordStrength(formData.password) : null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="auth-page">
      {/* Dynamic Background */}
      <div className="auth-bg">
        <div 
          className="auth-mouse-glow"
          style={{ left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%` }}
        ></div>
        {particles.map(p => (
          <div key={p.id} className="auth-particle"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, opacity: p.opacity, animationDuration: `${p.speed * 3}s`, animationDelay: `${p.delay}s` }}
          ></div>
        ))}
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      {/* Card */}
      <div 
        className="auth-card"
        style={{ transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 3}deg) rotateX(${(0.5 - mousePos.y) * 3}deg)` }}
      >
        <div className="auth-card-header">
          <div className="auth-logo"><span className="auth-logo-inner">🤖</span></div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Step {step} of 2</p>
        </div>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`auth-step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {errors.general && (
          <div className="auth-error"><span className="auth-error-icon">⚠️</span><span>{errors.general}</span></div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className={errors.name ? 'error' : ''} placeholder="John Doe" />
                </div>
                {errors.name && <span className="auth-error-text">{errors.name}</span>}
              </div>
              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={errors.email ? 'error' : ''} placeholder="your@email.com" />
                </div>
                {errors.email && <span className="auth-error-text">{errors.email}</span>}
              </div>
            </>
          ) : (
            <>
              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} className={errors.password ? 'error' : ''} placeholder="Min 8 characters" />
                  <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
                </div>
                {strength && (
                  <div className="auth-strength">
                    <div className="auth-strength-bar"><div className="auth-strength-fill" style={{ width: strength.width, background: strength.color }}></div></div>
                    <span style={{ color: strength.color, fontSize: '0.75rem' }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <span className="auth-error-text">{errors.password}</span>}
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className={errors.confirmPassword ? 'error' : ''} placeholder="Re-enter password" />
                </div>
                {errors.confirmPassword && <span className="auth-error-text">{errors.confirmPassword}</span>}
              </div>
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <><span className="auth-spinner"></span> Creating...</> : step === 1 ? <>Next <span className="auth-btn-arrow">→</span></> : <>Create Account <span className="auth-btn-arrow">→</span></>}
          </button>
          {step === 2 && (
            <button type="button" className="auth-btn auth-btn-back" onClick={() => setStep(1)}>← Back</button>
          )}
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;