import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../contexts/PortfolioContext';
import '../styles/PortfolioPreview.css';

function PortfolioPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPortfolioById } = usePortfolio();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const loadPortfolio = useCallback(async () => {
    try {
      const data = await getPortfolioById(id);
      setPortfolio(data);
    } catch (error) {
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [id, getPortfolioById]);

  useEffect(() => {
    loadPortfolio();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadPortfolio]);

  useEffect(() => {
    if (portfolio?.title) {
      let i = 0;
      const text = portfolio.title;
      const typing = setInterval(() => {
        if (i < text.length) {
          setTypedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 50);
      return () => clearInterval(typing);
    }
  }, [portfolio?.title]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 100);
    
    // Detect active section
    const sections = ['hero', 'about', 'experience', 'skills', 'education', 'projects'];
    for (const section of sections.reverse()) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/portfolio/${id}`;
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="portfolio-loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-large">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h2>Building Your Portfolio</h2>
          <div className="loading-bar-container">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="portfolio-error-screen">
        <div className="error-content">
          <div className="error-icon">🔍</div>
          <h2>Portfolio Not Found</h2>
          <p>This portfolio doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const designStyle = {
    primary: portfolio.preferences?.primaryColor || '#667eea',
    secondary: portfolio.preferences?.secondaryColor || '#764ba2',
    style: portfolio.preferences?.style || 'modern'
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    ...(portfolio.experience?.length > 0 ? [{ id: 'experience', label: 'Experience', icon: '💼' }] : []),
    ...(portfolio.skills?.length > 0 ? [{ id: 'skills', label: 'Skills', icon: '🛠️' }] : []),
    ...(portfolio.education?.length > 0 ? [{ id: 'education', label: 'Education', icon: '🎓' }] : []),
    ...(portfolio.projects?.length > 0 ? [{ id: 'projects', label: 'Projects', icon: '🚀' }] : []),
  ];

  return (
    <div className="portfolio-live" style={{ '--primary': designStyle.primary, '--secondary': designStyle.secondary }}>
      {/* Top Navigation Bar */}
      <header className={`pl-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="pl-nav-container">
          <div className="pl-nav-logo" onClick={() => scrollToSection('hero')}>
            <span className="logo-dot"></span>
            {portfolio.fullName?.split(' ')[0]}
          </div>
          
          <nav className={`pl-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`pl-nav-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pl-nav-actions">
            <button onClick={() => setShowShareModal(true)} className="pl-btn-share">
              <span>🔗</span> Share
            </button>
            <button onClick={() => navigate('/dashboard')} className="pl-btn-back">
              ← Dashboard
            </button>
            <button 
              className={`pl-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pl-hero" id="hero">
        <div className="pl-hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="hero-floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                fontSize: `${1 + Math.random() * 2}rem`,
                opacity: 0.1 + Math.random() * 0.2
              }}
            >
              {['✦', '◆', '◈', '◇', '⬡', '△', '□', '○'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
        
        <div className="pl-hero-content">
          <div className="hero-avatar-container">
            <div className="hero-avatar-ring"></div>
            <div className="hero-avatar-circle">
              <span className="hero-avatar-text">
                {portfolio.fullName?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          
          <h1 className="hero-name-animated">
            {portfolio.fullName?.split('').map((char, i) => (
              <span key={i} className="name-char" style={{ animationDelay: `${i * 0.05}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          
          <div className="hero-title-container">
            <span className="typing-cursor">|</span>
            <p className="hero-title-text">{typedText}</p>
          </div>
          
          <div className="hero-contact-row">
            {portfolio.email && (
              <a href={`mailto:${portfolio.email}`} className="hero-contact-item">
                <span className="contact-icon">✉️</span>
                <span>{portfolio.email}</span>
              </a>
            )}
            {portfolio.phone && (
              <a href={`tel:${portfolio.phone}`} className="hero-contact-item">
                <span className="contact-icon">📱</span>
                <span>{portfolio.phone}</span>
              </a>
            )}
          </div>
          
          <div className="hero-social-row">
            {portfolio.socialLinks?.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-btn">
                <span>💼</span> LinkedIn
              </a>
            )}
            {portfolio.socialLinks?.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hero-social-btn">
                <span>💻</span> GitHub
              </a>
            )}
            {portfolio.socialLinks?.twitter && (
              <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hero-social-btn">
                <span>🐦</span> Twitter
              </a>
            )}
            {portfolio.socialLinks?.website && (
              <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hero-social-btn">
                <span>🌐</span> Website
              </a>
            )}
          </div>
        </div>
        
        <div className="scroll-down-indicator" onClick={() => scrollToSection('about')}>
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* About Section */}
      <section className="pl-section about-section" id="about">
        <div className="pl-section-container">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-heading">About Me</h2>
            <div className="section-line"></div>
          </div>
          <div className="about-content">
            <p className="about-description">{portfolio.summary}</p>
            {portfolio.languages?.length > 0 && (
              <div className="about-extras">
                <h4>🌍 Languages</h4>
                <div className="lang-tags">
                  {portfolio.languages.map((lang, i) => (
                    <span key={i} className="lang-tag">{lang}</span>
                  ))}
                </div>
              </div>
            )}
            {portfolio.certifications?.length > 0 && (
              <div className="about-extras">
                <h4>📜 Certifications</h4>
                <div className="cert-list">
                  {portfolio.certifications.map((cert, i) => (
                    <div key={i} className="cert-badge">
                      <strong>{cert.name}</strong>
                      <span>{cert.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {portfolio.experience && portfolio.experience.length > 0 && (
        <section className="pl-section experience-section" id="experience">
          <div className="pl-section-container">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-heading">Experience</h2>
              <div className="section-line"></div>
            </div>
            <div className="timeline-vertical">
              {portfolio.experience.map((exp, index) => (
                <div key={index} className="timeline-node" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                    {index < portfolio.experience.length - 1 && <div className="marker-line"></div>}
                  </div>
                  <div className="timeline-panel">
                    <div className="panel-header">
                      <h3>{exp.position}</h3>
                      <span className="panel-company">{exp.company}</span>
                    </div>
                    <p className="panel-period">
                      {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    {exp.location && <p className="panel-location">📍 {exp.location}</p>}
                    {exp.description && <p className="panel-description">{exp.description}</p>}
                    {exp.highlights?.filter(h => h).length > 0 && (
                      <ul className="panel-highlights">
                        {exp.highlights.filter(h => h).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {portfolio.skills && portfolio.skills.length > 0 && (
        <section className="pl-section skills-section" id="skills">
          <div className="pl-section-container">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-heading">Skills</h2>
              <div className="section-line"></div>
            </div>
            <div className="skills-masonry">
              {portfolio.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`skill-tile ${hoveredSkill === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="skill-tile-inner">
                    <span className="skill-tile-icon">{getSkillIcon(skill)}</span>
                    <span className="skill-tile-name">{skill}</span>
                    <div className="skill-tile-bar">
                      <div 
                        className="skill-tile-fill" 
                        style={{ width: `${65 + Math.random() * 35}%` }}
                      ></div>
                    </div>
                    <div className="skill-tile-glow"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {portfolio.education && portfolio.education.length > 0 && (
        <section className="pl-section education-section" id="education">
          <div className="pl-section-container">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-heading">Education</h2>
              <div className="section-line"></div>
            </div>
            <div className="education-masonry">
              {portfolio.education.map((edu, index) => (
                <div key={index} className="edu-card">
                  <div className="edu-card-top">
                    <div className="edu-icon-circle">🎓</div>
                    <div className="edu-year-badge">
                      {edu.startDate ? new Date(edu.startDate + '-01').getFullYear() : ''}
                      {edu.endDate ? ` - ${new Date(edu.endDate + '-01').getFullYear()}` : ''}
                    </div>
                  </div>
                  <h3>{edu.degree}</h3>
                  <p className="edu-field">{edu.field}</p>
                  <p className="edu-school">{edu.school}</p>
                  {edu.location && <p className="edu-location">📍 {edu.location}</p>}
                  {edu.gpa && <span className="edu-gpa-badge">GPA: {edu.gpa}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {portfolio.projects && portfolio.projects.length > 0 && (
        <section className="pl-section projects-section" id="projects">
          <div className="pl-section-container">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-heading">Projects</h2>
              <div className="section-line"></div>
            </div>
            <div className="projects-showcase">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="project-showcase-card">
                  <div className="project-card-top">
                    <h3>{project.name}</h3>
                    <div className="project-card-links">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="proj-link-btn">
                          🔗 Live
                        </a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="proj-link-btn">
                          💻 Code
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="project-card-desc">{project.description}</p>
                  {project.technologies?.length > 0 && (
                    <div className="project-tech-stack">
                      {project.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="tech-chip">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pl-footer">
        <div className="pl-footer-content">
          <div className="footer-brand">
            <span className="logo-dot"></span>
            {portfolio.fullName}
          </div>
          <div className="footer-links">
            {navItems.filter(item => item.id !== 'hero').map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="footer-link">
                {item.label}
              </button>
            ))}
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {portfolio.fullName}. All rights reserved.</p>
            <p className="footer-credit">Built with ❤️ using AI Portfolio Builder</p>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <div className="pl-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pl-modal-close" onClick={() => setShowShareModal(false)}>✕</button>
            <div className="modal-icon">🔗</div>
            <h2>Share Your Portfolio</h2>
            <p>Copy the link below to share your portfolio</p>
            <div className="modal-link-box">
              <input 
                type="text" 
                value={`${window.location.origin}/portfolio/${id}`} 
                readOnly 
              />
              <button onClick={copyShareLink} className="modal-copy-btn">
                {copySuccess ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className="modal-divider">
              <span>or share on</span>
            </div>
            <div className="modal-socials">
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/portfolio/${id}`)}
                className="modal-social-btn linkedin"
              >
                LinkedIn
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.origin}/portfolio/${id}&text=Check out my portfolio!`)}
                className="modal-social-btn twitter"
              >
                Twitter
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=Check out my portfolio: ${window.location.origin}/portfolio/${id}`)}
                className="modal-social-btn whatsapp"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getSkillIcon(skill) {
  const icons = {
    'react': '⚛️', 'node': '🟢', 'python': '🐍', 'javascript': '💛',
    'typescript': '🔷', 'java': '☕', 'docker': '🐳', 'aws': '☁️',
    'css': '🎨', 'html': '📄', 'mongodb': '🍃', 'postgresql': '🐘',
    'sql': '🗄️', 'git': '📦', 'figma': '🖌️', 'vue': '💚',
    'angular': '🔴', 'php': '🐘', 'ruby': '💎', 'go': '🔵',
    'rust': '🦀', 'swift': '🍎', 'kotlin': '💜', 'flutter': '🦋',
    'redis': '🔴', 'graphql': '◈', 'firebase': '🔥', 'sass': '💅',
    'webpack': '📦', 'linux': '🐧', 'kubernetes': '☸️'
  };
  const lower = skill.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lower.includes(key)) return icon;
  }
  return '⚡';
}

export default PortfolioPreview;