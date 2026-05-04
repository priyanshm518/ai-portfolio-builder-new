import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Landing.css';

function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>🚀 Create Stunning Portfolios with AI</h1>
        <p>
          Let our AI build professional portfolios tailored to your skills and experience.
          Choose from multiple designs and pick the one that suits you best.
        </p>
        {!currentUser && (
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        )}
        {currentUser && (
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/create-portfolio" className="btn-secondary">
              Create New Portfolio
            </Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered Generation</h3>
          <p>Our AI analyzes your profile and creates personalized portfolios tailored to your industry</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Multiple Designs</h3>
          <p>Get 3 different portfolio designs and choose your favorite one that matches your style</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✏️</div>
          <h3>Easy Customization</h3>
          <p>Modify and adjust your portfolio with our intuitive multi-step form editor</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Responsive Design</h3>
          <p>Your portfolio looks great on all devices - desktop, tablet, and mobile</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure & Private</h3>
          <p>Your data is encrypted and protected with industry-standard security measures</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📤</div>
          <h3>Export & Share</h3>
          <p>Download your portfolio as PDF or share it with a custom link</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;