import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const { portfolios, loading, getPortfolios } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    getPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'selected' && portfolio.isSelected) ||
      (activeFilter === 'recent' && isRecent(portfolio.createdAt));
    
    const matchesSearch = portfolio.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const isRecent = (date) => {
    const created = new Date(date);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60 * 24) <= 7;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleDeletePortfolio = (e, portfolioId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      console.log('Delete portfolio:', portfolioId);
    }
  };

  return (
    <div className="dashboard">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <span className="greeting">{getGreeting()}, {currentUser?.name}! 👋</span>
            <h1>Your Portfolio Dashboard</h1>
            <p>Create, manage, and showcase your professional portfolios with AI</p>
          </div>
          <div className="welcome-stats">
            <div className="quick-stat">
              <div className="stat-circle">
                <span className="stat-number">{portfolios.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="quick-stat">
              <div className="stat-circle">
                <span className="stat-number">{portfolios.filter(p => p.isSelected).length}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
          </div>
        </div>
        <Link to="/create-portfolio" className="create-btn">
          <span className="create-icon">+</span>
          <span>Create New Portfolio</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card card-purple">
          <div className="stat-card-icon">📁</div>
          <div className="stat-card-content">
            <h3>{portfolios.length}</h3>
            <p>Total Portfolios</p>
          </div>
          <div className="stat-card-bg"></div>
        </div>
        <div className="stat-card card-blue">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-content">
            <h3>{portfolios.filter(p => p.isSelected).length}</h3>
            <p>Selected</p>
          </div>
          <div className="stat-card-bg"></div>
        </div>
        <div className="stat-card card-green">
          <div className="stat-card-icon">🆕</div>
          <div className="stat-card-content">
            <h3>{portfolios.filter(p => isRecent(p.createdAt)).length}</h3>
            <p>This Week</p>
          </div>
          <div className="stat-card-bg"></div>
        </div>
        <div className="stat-card card-orange">
          <div className="stat-card-icon">🎨</div>
          <div className="stat-card-content">
            <h3>{new Set(portfolios.map(p => p.preferences?.style)).size}</h3>
            <p>Styles Used</p>
          </div>
          <div className="stat-card-bg"></div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'selected' ? 'active' : ''}`}
            onClick={() => setActiveFilter('selected')}
          >
            Selected
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recent')}
          >
            Recent
          </button>
        </div>

        <div className="search-view-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search portfolios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ▦
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Grid/List */}
      {loading ? (
        <div className="loading-section">
          <div className="loading-animation">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p>Loading your portfolios...</p>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {searchTerm ? '🔍' : '📄'}
          </div>
          <h2>{searchTerm ? 'No Results Found' : 'No Portfolios Yet'}</h2>
          <p>
            {searchTerm 
              ? `No portfolios matching "${searchTerm}"` 
              : 'Create your first AI-powered portfolio and showcase your professional skills!'}
          </p>
          {!searchTerm && (
            <Link to="/create-portfolio" className="create-first-btn">
              <span className="btn-icon">✨</span>
              Create Your First Portfolio
            </Link>
          )}
        </div>
      ) : (
        <div className={`portfolio-container ${viewMode}`}>
          {filteredPortfolios.map((portfolio, index) => (
            <Link 
              to={`/portfolio/${portfolio._id}`}
              key={portfolio._id} 
              className="portfolio-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="portfolio-card-enhanced">
                <div className="portfolio-card-preview">
                  <div className="preview-gradient"></div>
                  <div className="preview-content">
                    <div className="preview-avatar">
                      {portfolio.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <h3 className="preview-title">{portfolio.title || 'Untitled'}</h3>
                    <p className="preview-name">{portfolio.fullName}</p>
                  </div>
                  {portfolio.isSelected && (
                    <div className="selected-ribbon">
                      <span>⭐ Selected</span>
                    </div>
                  )}
                </div>

                <div className="portfolio-card-info">
                  <div className="portfolio-meta">
                    <span className="meta-date">
                      📅 {new Date(portfolio.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {portfolio.experience && (
                      <span className="meta-exp">
                        💼 {portfolio.experience.length} exp
                      </span>
                    )}
                  </div>

                  {portfolio.skills && portfolio.skills.length > 0 && (
                    <div className="portfolio-skills">
                      {portfolio.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                      {portfolio.skills.length > 3 && (
                        <span className="skill-tag more">+{portfolio.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="portfolio-actions">
                    <span className="view-portfolio">
                      View Portfolio
                      <span className="arrow">→</span>
                    </span>
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDeletePortfolio(e, portfolio._id)}
                      title="Delete Portfolio"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Tips Section */}
      {portfolios.length > 0 && (
        <div className="tips-section">
          <h3>💡 Pro Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🎨</span>
              <p>Try different design styles to see which one fits your profile best</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <p>Keep your portfolio updated with latest experience and skills</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🔗</span>
              <p>Share your portfolio link on LinkedIn and other social platforms</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;