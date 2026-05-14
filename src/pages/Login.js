import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 5
    }))
  );
  const { login } = useAuth();
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
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

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
          style={{
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`
          }}
        ></div>
        
        {particles.map(p => (
          <div
            key={p.id}
            className="auth-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.speed * 3}s`,
              animationDelay: `${p.delay}s`
            }}
          ></div>
        ))}

        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      {/* Card */}
      <div 
        className="auth-card"
        style={{
          transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 3}deg) rotateX(${(0.5 - mousePos.y) * 3}deg)`
        }}
      >
        <div className="auth-card-header">
          <div className="auth-logo">
            <span className="auth-logo-inner">🤖</span>
          </div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue building</p>
        </div>

        {errors.general && (
          <div className="auth-error">
            <span className="auth-error-icon">⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="auth-error-text">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="auth-error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner"></span> Signing In...</>
            ) : (
              <>Sign In <span className="auth-btn-arrow">→</span></>
            )}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;