import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../contexts/PortfolioContext';
import '../styles/SelectPortfolio.css';

function SelectPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPortfolioById, selectBestPortfolio } = usePortfolio();
  const [portfolioData, setPortfolioData] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compareList, setCompareList] = useState([]);

  // Fix: Memoize loadPortfolio
  const loadPortfolio = useCallback(async () => {
    try {
      const data = await getPortfolioById(id);
      setPortfolioData(data);
      const designVariations = generateDesignVariations(data);
      setVariations(designVariations);
    } catch (error) {
      setError('Failed to load portfolio variations. Please try again.');
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  }, [id, getPortfolioById]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const generateDesignVariations = (data) => {
    return [
      {
        id: 1,
        style: 'Modern Professional',
        description: 'Clean, contemporary design with a focus on readability and impact',
        colorScheme: {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4a90e2'
        },
        layout: 'split-screen',
        features: ['Bold typography', 'Gradient accents', 'Skills visualization', 'Timeline layout'],
        preview: {
          header: 'gradient',
          sections: 'card-based',
          navigation: 'sticky'
        }
      },
      {
        id: 2,
        style: 'Classic Elegance',
        description: 'Traditional professional layout with sophisticated styling',
        colorScheme: {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#e74c3c'
        },
        layout: 'single-column',
        features: ['Serif typography', 'Subtle shadows', 'Traditional sections', 'PDF-optimized'],
        preview: {
          header: 'solid',
          sections: 'separated',
          navigation: 'top'
        }
      },
      {
        id: 3,
        style: 'Creative Portfolio',
        description: 'Bold, eye-catching design for creative professionals',
        colorScheme: {
          primary: '#e74c3c',
          secondary: '#f39c12',
          accent: '#3498db'
        },
        layout: 'masonry-grid',
        features: ['Animated elements', 'Grid layout', 'Portfolio showcase', 'Interactive sections'],
        preview: {
          header: 'hero-image',
          sections: 'masonry',
          navigation: 'side'
        }
      }
    ];
  };

  const handleSelect = async (index) => {
    setSelectedIndex(index);
    try {
      await selectBestPortfolio(id);
      setTimeout(() => {
        navigate(`/portfolio/${id}`);
      }, 2000);
    } catch (error) {
      setError('Failed to select portfolio. Please try again.');
      setSelectedIndex(null);
    }
  };

  const handleCompare = (index) => {
    if (compareList.includes(index)) {
      setCompareList(compareList.filter(i => i !== index));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, index]);
      }
    }
  };

  const resetComparison = () => {
    setCompareList([]);
    setComparing(false);
  };

  if (loading) {
    return (
      <div className="select-portfolio">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h2>Generating Portfolio Designs...</h2>
            <p>Our AI is creating unique designs based on your profile</p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="select-portfolio">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={loadPortfolio} className="btn-primary">
            Try Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="select-portfolio">
      <div className="select-header">
        <h1>Choose Your Perfect Portfolio Design</h1>
        <p className="subtitle">
          Our AI has analyzed your profile and generated 3 unique designs. 
          Select the one that best represents your professional brand!
        </p>
        
        <div className="action-buttons">
          <button 
            onClick={() => setComparing(!comparing)} 
            className={`btn-secondary ${comparing ? 'active' : ''}`}
          >
            {comparing ? 'Exit Compare Mode' : '🔍 Compare Designs'}
          </button>
          {compareList.length > 0 && (
            <button onClick={resetComparison} className="btn-secondary">
              Reset Comparison
            </button>
          )}
        </div>

        {comparing && (
          <div className="compare-instructions">
            <p>Click on 2 designs to compare them side by side ({compareList.length}/2 selected)</p>
          </div>
        )}
      </div>
      
      <div className={`variations-grid ${comparing ? 'comparing-mode' : ''}`}>
        {variations.map((variation, index) => (
          <div 
            key={variation.id}
            className={`variation-card ${
              selectedIndex === index ? 'selected' : ''
            } ${
              compareList.includes(index) ? 'comparing' : ''
            } ${
              comparing && !compareList.includes(index) && compareList.length >= 2 ? 'dimmed' : ''
            }`}
            onClick={() => {
              if (comparing) {
                handleCompare(index);
              }
            }}
          >
            <div className="variation-preview-wrapper">
              <div 
                className="variation-preview"
                style={{
                  background: `linear-gradient(135deg, ${variation.colorScheme.primary}, ${variation.colorScheme.secondary})`
                }}
              >
                <div className="preview-content">
                  <div className="preview-badge">{variation.style}</div>
                  <h3>{portfolioData?.title || 'Professional Portfolio'}</h3>
                  <p className="preview-name">{portfolioData?.fullName}</p>
                  
                  <div className="preview-mockup">
                    <div className={`mockup-header ${variation.preview.header}`}>
                      <div className="mockup-avatar"></div>
                      <div className="mockup-title"></div>
                    </div>
                    <div className={`mockup-body ${variation.preview.sections}`}>
                      <div className="mockup-section">
                        <div className="mockup-line long"></div>
                        <div className="mockup-line medium"></div>
                        <div className="mockup-line short"></div>
                      </div>
                      <div className="mockup-section">
                        <div className="mockup-line medium"></div>
                        <div className="mockup-line long"></div>
                        <div className="mockup-line short"></div>
                      </div>
                      <div className="mockup-section">
                        <div className="mockup-line short"></div>
                        <div className="mockup-line long"></div>
                        <div className="mockup-line medium"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="variation-info">
              <div className="variation-header">
                <h3>Design {index + 1}: {variation.style}</h3>
                {compareList.includes(index) && (
                  <span className="compare-badge">Selected for Compare</span>
                )}
              </div>
              <p className="variation-description">{variation.description}</p>
              
              <div className="variation-features">
                <h4>Key Features</h4>
                <ul>
                  {variation.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="color-palette">
                <h4>Color Palette</h4>
                <div className="color-swatches">
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: variation.colorScheme.primary }}
                    title="Primary Color"
                  ></div>
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: variation.colorScheme.secondary }}
                    title="Secondary Color"
                  ></div>
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: variation.colorScheme.accent }}
                    title="Accent Color"
                  ></div>
                </div>
              </div>
              
              <div className="variation-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(index);
                  }}
                  className={`btn-primary btn-select ${
                    selectedIndex === index ? 'selected-btn' : ''
                  }`}
                  disabled={selectedIndex !== null}
                >
                  {selectedIndex === index ? (
                    <>
                      <span className="checkmark">✓</span>
                      Selected!
                    </>
                  ) : selectedIndex !== null ? (
                    'Processing...'
                  ) : (
                    'Select This Design'
                  )}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/portfolio/${id}?preview=${index + 1}`);
                  }}
                  className="btn-secondary btn-preview"
                >
                  👁️ Preview Full
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-animation">
              <div className="checkmark-circle">
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
            <h2>Excellent Choice! 🎉</h2>
            <p>Your portfolio is being prepared...</p>
            <div className="loading-bar">
              <div className="loading-fill"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectPortfolio;