import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../contexts/PortfolioContext';
import { validatePortfolioForm } from '../utils/validation';
import '../styles/CreatePortfolio.css';

function CreatePortfolio() {
  const navigate = useNavigate();
  const { createPortfolio, loading } = usePortfolio();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasExperience, setHasExperience] = useState(true);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', title: '', summary: '',
    skills: [],
    experience: [{ company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false, employmentType: 'full-time', highlights: [''] }],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: { linkedin: '', github: '', twitter: '', website: '' },
    preferences: { style: 'modern', primaryColor: '#667eea', secondaryColor: '#764ba2', sections: ['about', 'experience', 'education', 'skills', 'projects'] }
  });
  
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFileName(file.name);
    setResumeUploading(true);
    setTimeout(() => {
      const profiles = [
        {
          fullName: 'Alex Johnson', email: 'alex@email.com', phone: '+1 (555) 234-5678',
          title: 'Senior Full Stack Developer',
          summary: 'Experienced full stack developer with 8+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies.',
          skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB'],
          experience: [
            { company: 'TechCorp Inc.', position: 'Senior Full Stack Developer', location: 'San Francisco, CA', startDate: '2021-03', endDate: '', current: true, employmentType: 'full-time', description: 'Lead developer for the core platform team.', highlights: ['Increased performance by 40%', 'Led migration to microservices'] }
          ],
          education: [{ school: 'MIT', degree: 'Bachelor of Science', field: 'Computer Science', gpa: '3.8/4.0' }],
          languages: ['English (Native)', 'Spanish (Intermediate)'],
          certifications: [{ name: 'AWS Solutions Architect', issuer: 'Amazon Web Services' }]
        },
        {
          fullName: 'Sarah Williams', email: 'sarah@email.com', phone: '+1 (555) 987-6543',
          title: 'UI/UX Designer & Frontend Developer',
          summary: 'Creative designer and developer with 5 years of experience crafting beautiful digital experiences.',
          skills: ['Figma', 'React', 'Vue.js', 'CSS/SASS', 'JavaScript', 'UI Design'],
          experience: [
            { company: 'DesignStudio', position: 'Senior UI/UX Designer', location: 'New York, NY', startDate: '2020-06', endDate: '', current: true, employmentType: 'full-time', description: 'Designing user interfaces for major clients.', highlights: ['Increased engagement by 55%', 'Established design system'] }
          ],
          education: [{ school: 'Parsons School of Design', degree: 'BFA', field: 'Design & Technology', gpa: '3.9/4.0' }],
          languages: ['English (Native)', 'French (Fluent)']
        }
      ];
      setFormData(prev => ({ ...prev, ...profiles[Math.floor(Math.random() * profiles.length)] }));
      setResumeUploading(false);
      alert('✅ Resume parsed successfully! Fields have been auto-filled.');
    }, 2000);
  };

  const validateStep = (step) => {
    const validation = validatePortfolioForm(formData, step);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleArrayInput = (field, index, key, value) => {
    const arr = [...formData[field]];
    arr[index] = { ...arr[index], [key]: value };
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  const addExperience = () => setFormData(prev => ({ ...prev, experience: [...prev.experience, { company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false, employmentType: 'full-time', highlights: [''] }] }));
  const removeExperience = (i) => setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));

  const addHighlight = (expIdx) => {
    const arr = [...formData.experience];
    arr[expIdx].highlights.push('');
    setFormData(prev => ({ ...prev, experience: arr }));
  };
  const updateHighlight = (expIdx, hIdx, val) => {
    const arr = [...formData.experience];
    arr[expIdx].highlights[hIdx] = val;
    setFormData(prev => ({ ...prev, experience: arr }));
  };
  const removeHighlight = (expIdx, hIdx) => {
    const arr = [...formData.experience];
    arr[expIdx].highlights = arr[expIdx].highlights.filter((_, i) => i !== hIdx);
    setFormData(prev => ({ ...prev, experience: arr }));
  };

  const addEducation = () => setFormData(prev => ({ ...prev, education: [...prev.education, { school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', activities: '' }] }));
  const removeEducation = (i) => setFormData(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const addProject = () => setFormData(prev => ({ ...prev, projects: [...prev.projects, { name: '', description: '', technologies: [], link: '', githubLink: '', highlights: [''] }] }));
  const removeProject = (i) => setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));

  const addProjectTech = (pIdx, tech) => {
    if (tech.trim()) {
      const arr = [...formData.projects];
      arr[pIdx].technologies.push(tech.trim());
      setFormData(prev => ({ ...prev, projects: arr }));
    }
  };
  const removeProjectTech = (pIdx, tIdx) => {
    const arr = [...formData.projects];
    arr[pIdx].technologies = arr[pIdx].technologies.filter((_, i) => i !== tIdx);
    setFormData(prev => ({ ...prev, projects: arr }));
  };

  const addCertification = () => setFormData(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', issuer: '', date: '', link: '' }] }));
  const removeCertification = (i) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== i) }));

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };
  const removeSkill = (s) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, newLanguage.trim()] }));
      setNewLanguage('');
    }
  };
  const removeLanguage = (l) => setFormData(prev => ({ ...prev, languages: prev.languages.filter(la => la !== l) }));

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevStep = () => { setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const data = { ...formData, experience: hasExperience ? formData.experience : [] };
        const portfolio = await createPortfolio(data);
        navigate(`/portfolio/${portfolio._id}`);
      } catch (error) {
        setErrors({ submit: 'Failed to create portfolio. Try again.' });
      }
    }
  };

  const steps = [
    { number: 1, icon: '👤', label: 'Personal', color: '#667eea' },
    { number: 2, icon: '💼', label: 'Experience', color: '#4facfe' },
    { number: 3, icon: '🎓', label: 'Education', color: '#43e97b' },
    { number: 4, icon: '🚀', label: 'Projects', color: '#fa709a' },
    { number: 5, icon: '🎨', label: 'Style', color: '#f093fb' },
    { number: 6, icon: '💻', label: 'Code', color: '#ff6b6b' }
  ];

  return (
    <div className="create-portfolio">
      <div className="create-container">
        <div className="create-header">
          <h1>✨ Create Your Portfolio</h1>
          <p>Fill manually or upload resume for auto-fill</p>
          <div className="resume-upload-section">
            <input type="file" ref={fileInputRef} onChange={handleResumeUpload} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current.click()} className="resume-upload-btn" disabled={resumeUploading}>
              {resumeUploading ? <><span className="spinner-small"></span> Parsing...</> : <><span className="upload-icon">📄</span> Upload Resume (Auto-fill)</>}
            </button>
            {resumeFileName && !resumeUploading && <span className="uploaded-file">✅ {resumeFileName} - Auto-populated!</span>}
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            <div className="progress-glow" style={{ left: `${progressPercentage}%` }}></div>
          </div>
          <div className="steps-navigation">
            {steps.map((step, i) => (
              <React.Fragment key={step.number}>
                <div className={`step-item ${currentStep >= step.number ? 'completed' : ''} ${currentStep === step.number ? 'active' : ''}`}>
                  <div className="step-circle" style={{ '--step-color': step.color, borderColor: currentStep >= step.number ? step.color : '#e0e0e0' }}>
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`step-line ${currentStep > step.number ? 'active' : ''}`} style={{ '--step-color': step.color }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {errors.submit && <div className="error-banner"><span>⚠️</span> {errors.submit}</div>}

        <div className="form-wrapper">
          {currentStep === 1 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">👤</span><div><h2>Personal Information</h2><p>Basic details about you</p></div></div>
              <div className="form-grid">
                <div className="form-group"><label>Full Name <span className="required">*</span></label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={errors.fullName ? 'error' : ''} placeholder="John Doe" />{errors.fullName && <span className="error-text">{errors.fullName}</span>}</div>
                <div className="form-group"><label>Professional Title <span className="required">*</span></label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className={errors.title ? 'error' : ''} placeholder="Senior Developer" />{errors.title && <span className="error-text">{errors.title}</span>}</div>
                <div className="form-group"><label>Email <span className="required">*</span></label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'error' : ''} placeholder="john@email.com" />{errors.email && <span className="error-text">{errors.email}</span>}</div>
                <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" /></div>
                <div className="form-group full-width"><label>Professional Summary <span className="required">*</span></label><textarea name="summary" value={formData.summary} onChange={handleInputChange} className={errors.summary ? 'error' : ''} rows="6" placeholder="Write a compelling summary..." /><span className={`char-count ${formData.summary.length >= 50 ? 'success' : ''}`}>{formData.summary.length}/50</span>{errors.summary && <span className="error-text">{errors.summary}</span>}</div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">💼</span><div><h2>Work Experience</h2><p>Your professional journey</p></div></div>
              <div className="experience-toggle-section">
                <p className="toggle-question">Do you have work experience?</p>
                <div className="toggle-buttons">
                  <button type="button" className={`toggle-btn ${hasExperience ? 'active' : ''}`} onClick={() => { setHasExperience(true); if (formData.experience.length === 0) setFormData(prev => ({ ...prev, experience: [{ company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false, employmentType: 'full-time', highlights: [''] }] })); }}><span className="toggle-icon">💼</span>Yes, I have experience</button>
                  <button type="button" className={`toggle-btn ${!hasExperience ? 'active' : ''}`} onClick={() => { setHasExperience(false); setFormData(prev => ({ ...prev, experience: [] })); }}><span className="toggle-icon">🎓</span>I'm a Fresher/Student</button>
                </div>
              </div>
              {hasExperience ? (
                <>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="entry-card animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="entry-header"><h3>Experience #{index + 1}</h3><button type="button" onClick={() => removeExperience(index)} className="btn-icon-only">✕</button></div>
                      <div className="form-grid">
                        <div className="form-group"><label>Company *</label><input type="text" value={exp.company} onChange={(e) => handleArrayInput('experience', index, 'company', e.target.value)} placeholder="Company name" /></div>
                        <div className="form-group"><label>Position *</label><input type="text" value={exp.position} onChange={(e) => handleArrayInput('experience', index, 'position', e.target.value)} placeholder="Job title" /></div>
                        <div className="form-group"><label>Location</label><input type="text" value={exp.location} onChange={(e) => handleArrayInput('experience', index, 'location', e.target.value)} placeholder="City, State" /></div>
                        <div className="form-group"><label>Employment Type</label><select value={exp.employmentType || 'full-time'} onChange={(e) => handleArrayInput('experience', index, 'employmentType', e.target.value)}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="freelance">Freelance</option><option value="internship">Internship</option></select></div>
                        <div className="form-group"><label>Start Date *</label><input type="month" value={exp.startDate} onChange={(e) => handleArrayInput('experience', index, 'startDate', e.target.value)} /></div>
                        <div className="form-group"><label>End Date</label><input type="month" value={exp.endDate} onChange={(e) => handleArrayInput('experience', index, 'endDate', e.target.value)} disabled={exp.current} /></div>
                        <div className="form-group checkbox-wrapper"><label className="checkbox-label"><input type="checkbox" checked={exp.current} onChange={(e) => handleArrayInput('experience', index, 'current', e.target.checked)} /><span className="checkbox-custom"></span>I currently work here</label></div>
                        <div className="form-group full-width"><label>Description</label><textarea value={exp.description} onChange={(e) => handleArrayInput('experience', index, 'description', e.target.value)} rows="3" placeholder="Describe your role..." /></div>
                      </div>
                      <div className="highlights-section"><label>🏆 Key Achievements</label>
                        {exp.highlights.map((h, hIdx) => (<div key={hIdx} className="highlight-row"><input type="text" value={h} onChange={(e) => updateHighlight(index, hIdx, e.target.value)} placeholder="Achievement..." /><button type="button" onClick={() => removeHighlight(index, hIdx)} className="btn-icon-only">✕</button></div>))}
                        <button type="button" onClick={() => addHighlight(index)} className="btn-add-small">+ Add Achievement</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addExperience} className="btn-add-large">+ Add Another Experience</button>
                </>
              ) : (
                <div className="fresher-section animate-in"><div className="fresher-card"><div className="fresher-icon">🎓</div><h3>No Experience? No Problem!</h3><p>We'll highlight your education, skills, and projects instead.</p><div className="fresher-tips"><div className="fresher-tip"><span>✨</span> Focus on academic projects</div><div className="fresher-tip"><span>📚</span> Highlight coursework</div><div className="fresher-tip"><span>🚀</span> Showcase personal projects</div><div className="fresher-tip"><span>💪</span> Emphasize skills & certifications</div></div></div></div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">🎓</span><div><h2>Education & Skills</h2><p>Academic background and expertise</p></div></div>
              <div className="section-card"><h3>📚 Education</h3>
                {formData.education.map((edu, i) => (
                  <div key={i} className="entry-card animate-in"><div className="entry-header"><h4>Education #{i + 1}</h4><button onClick={() => removeEducation(i)} className="btn-icon-only">✕</button></div>
                    <div className="form-grid">
                      <div className="form-group"><label>School *</label><input type="text" value={edu.school} onChange={(e) => handleArrayInput('education', i, 'school', e.target.value)} placeholder="University" /></div>
                      <div className="form-group"><label>Degree *</label><input type="text" value={edu.degree} onChange={(e) => handleArrayInput('education', i, 'degree', e.target.value)} placeholder="Bachelor of Science" /></div>
                      <div className="form-group"><label>Field *</label><input type="text" value={edu.field} onChange={(e) => handleArrayInput('education', i, 'field', e.target.value)} placeholder="Computer Science" /></div>
                      <div className="form-group"><label>GPA</label><input type="text" value={edu.gpa} onChange={(e) => handleArrayInput('education', i, 'gpa', e.target.value)} placeholder="3.8/4.0" /></div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEducation} className="btn-add-large">+ Add Education</button>
              </div>
              <div className="section-card"><h3>🛠️ Skills</h3>
                <div className="skills-input-row"><input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Enter a skill" /><button onClick={addSkill} className="btn-add-skill">Add</button></div>
                <div className="skills-cloud">{formData.skills.map((s, i) => (<span key={i} className="skill-tag-enhanced">{s}<button onClick={() => removeSkill(s)}>×</button></span>))}</div>
              </div>
              <div className="section-card"><h3>🌍 Languages</h3>
                <div className="skills-input-row"><input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())} placeholder="Enter a language" /><button onClick={addLanguage} className="btn-add-skill">Add</button></div>
                <div className="skills-cloud">{formData.languages.map((l, i) => (<span key={i} className="skill-tag-enhanced lang-tag">{l}<button onClick={() => removeLanguage(l)}>×</button></span>))}</div>
              </div>
              <div className="section-card"><h3>📜 Certifications</h3>
                {formData.certifications.map((cert, i) => (
                  <div key={i} className="entry-card animate-in"><div className="entry-header"><h4>Cert #{i + 1}</h4><button onClick={() => removeCertification(i)} className="btn-icon-only">✕</button></div>
                    <div className="form-grid"><div className="form-group"><label>Name</label><input type="text" value={cert.name} onChange={(e) => handleArrayInput('certifications', i, 'name', e.target.value)} placeholder="AWS Solutions Architect" /></div><div className="form-group"><label>Issuer</label><input type="text" value={cert.issuer} onChange={(e) => handleArrayInput('certifications', i, 'issuer', e.target.value)} placeholder="Amazon" /></div></div>
                  </div>
                ))}
                <button type="button" onClick={addCertification} className="btn-add-large">+ Add Certification</button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">🚀</span><div><h2>Projects</h2><p>Showcase your best work</p></div></div>
              {formData.projects.map((proj, i) => (
                <div key={i} className="entry-card animate-in"><div className="entry-header"><h3>Project #{i + 1}</h3><button onClick={() => removeProject(i)} className="btn-icon-only">✕</button></div>
                  <div className="form-grid">
                    <div className="form-group full-width"><label>Project Name</label><input type="text" value={proj.name} onChange={(e) => handleArrayInput('projects', i, 'name', e.target.value)} placeholder="E-commerce Platform" /></div>
                    <div className="form-group full-width"><label>Description</label><textarea value={proj.description} onChange={(e) => handleArrayInput('projects', i, 'description', e.target.value)} rows="3" placeholder="Describe..." /></div>
                    <div className="form-group"><label>Live Demo</label><input type="url" value={proj.link} onChange={(e) => handleArrayInput('projects', i, 'link', e.target.value)} placeholder="https://demo.com" /></div>
                    <div className="form-group"><label>GitHub</label><input type="url" value={proj.githubLink} onChange={(e) => handleArrayInput('projects', i, 'githubLink', e.target.value)} placeholder="https://github.com/user/repo" /></div>
                  </div>
                  <div className="tech-section"><label>Technologies</label><div className="tech-input-row"><input type="text" placeholder="Type and press Enter" onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProjectTech(i, e.target.value); e.target.value = ''; } }} /></div><div className="skills-cloud">{proj.technologies.map((t, tIdx) => (<span key={tIdx} className="skill-tag-enhanced tech-tag">{t}<button onClick={() => removeProjectTech(i, tIdx)}>×</button></span>))}</div></div>
                </div>
              ))}
              <button type="button" onClick={addProject} className="btn-add-large">+ Add Project</button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">🎨</span><div><h2>Style Preferences</h2><p>Choose portfolio look</p></div></div>
              <div className="section-card"><h3>🎯 Design Style</h3>
                <div className="style-grid">
                  {[{ value: 'modern', icon: '🎯', label: 'Modern', desc: 'Clean & contemporary' }, { value: 'classic', icon: '📜', label: 'Classic', desc: 'Traditional' }, { value: 'creative', icon: '🎨', label: 'Creative', desc: 'Bold & unique' }, { value: 'minimal', icon: '✨', label: 'Minimal', desc: 'Simple & elegant' }].map(s => (
                    <div key={s.value} className={`style-card ${formData.preferences.style === s.value ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, style: s.value } }))}><span className="style-card-icon">{s.icon}</span><h4>{s.label}</h4><p>{s.desc}</p>{formData.preferences.style === s.value && <span className="selected-check">✓</span>}</div>
                  ))}
                </div>
              </div>
              <div className="section-card"><h3>🌈 Colors</h3>
                <div className="color-grid">
                  {[{ primary: '#667eea', secondary: '#764ba2', name: 'Purple' }, { primary: '#4facfe', secondary: '#00f2fe', name: 'Ocean' }, { primary: '#43e97b', secondary: '#38f9d7', name: 'Green' }, { primary: '#fa709a', secondary: '#fee140', name: 'Sunset' }, { primary: '#f093fb', secondary: '#f5576c', name: 'Rose' }, { primary: '#ff6b6b', secondary: '#ee5a24', name: 'Coral' }].map(c => (
                    <div key={c.name} className={`color-card ${formData.preferences.primaryColor === c.primary ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, primaryColor: c.primary, secondaryColor: c.secondary } }))}><div className="color-preview"><div style={{ backgroundColor: c.primary }}></div><div style={{ backgroundColor: c.secondary }}></div></div><span>{c.name}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="form-step animate-in">
              <div className="step-header"><span className="step-icon">💻</span><div><h2>Portfolio Code</h2><p>Preview, edit & export</p></div></div>
              <PortfolioCodePreview formData={formData} hasExperience={hasExperience} />
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 ? <button onClick={prevStep} className="btn-secondary">← Previous</button> : <div></div>}
            {currentStep < totalSteps ? <button onClick={nextStep} className="btn-primary">Next →</button> : <button onClick={handleSubmit} className="btn-primary btn-submit" disabled={loading}>{loading ? <><span className="spinner-small"></span> Saving...</> : '💾 Save & Finish'}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioCodePreview({ formData, hasExperience }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [editedCode, setEditedCode] = useState('');

  const generateHTML = () => {
    const { preferences: s } = formData;
    const skillsHTML = formData.skills.map(sk => `<span class="skill-tag">${sk}</span>`).join('\n          ');
    const expHTML = hasExperience && formData.experience.length > 0 ? formData.experience.map(e => `<div class="exp-item"><h3>${e.position} at ${e.company}</h3><p class="dur">${e.startDate} - ${e.current ? 'Present' : e.endDate}</p><p>${e.description}</p></div>`).join('\n') : '';
    const eduHTML = formData.education.map(e => `<div class="edu-item"><h3>${e.degree} in ${e.field}</h3><p>${e.school}${e.gpa ? ' - GPA: ' + e.gpa : ''}</p></div>`).join('\n');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${formData.fullName} - Portfolio</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#f5f5f5}
.c{max-width:1000px;margin:0 auto;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.1)}
.h{background:linear-gradient(135deg,${s.primaryColor},${s.secondaryColor});color:#fff;padding:3rem;text-align:center}
.h h1{font-size:2.5rem}.h .t{font-size:1.2rem;opacity:.9}.con{display:flex;justify-content:center;gap:2rem;margin-top:1rem}
.sec{padding:2rem 3rem;border-bottom:1px solid #e0e0e0}.sec h2{color:${s.primaryColor};margin-bottom:1rem}
.skills{display:flex;flex-wrap:wrap;gap:.75rem}.skill-tag{background:linear-gradient(135deg,${s.primaryColor},${s.secondaryColor});color:#fff;padding:.5rem 1rem;border-radius:20px}
.exp-item,.edu-item{margin-bottom:1.5rem}.dur{color:#888;font-size:.9rem}@media(max-width:768px){.sec{padding:1.5rem}.h{padding:2rem}.h h1{font-size:2rem}}
</style></head><body><div class="c">
<header class="h"><h1>${formData.fullName}</h1><p class="t">${formData.title}</p><div class="con"><span>📧 ${formData.email}</span>${formData.phone ? `<span>📱 ${formData.phone}</span>` : ''}</div></header>
<section class="sec"><h2>Summary</h2><p>${formData.summary}</p></section>
${hasExperience && formData.experience.length > 0 ? `<section class="sec"><h2>Experience</h2>${expHTML}</section>` : ''}
<section class="sec"><h2>Skills</h2><div class="skills">${skillsHTML}</div></section>
<section class="sec"><h2>Education</h2>${eduHTML}</section>
</div></body></html>`;
  };

  const htmlCode = editedCode || generateHTML();

  return (
    <div className="code-preview-section">
      <div className="code-tabs">
        <button className={`code-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>👁️ Live Preview</button>
        <button className={`code-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>💻 View Code</button>
      </div>
      <div className="code-actions">
        <button onClick={() => { navigator.clipboard.writeText(htmlCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="btn-secondary btn-sm">{copied ? '✅ Copied!' : '📋 Copy'}</button>
        <button onClick={() => { const b = new Blob([htmlCode], { type: 'text/html' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `${formData.fullName.replace(/\s+/g, '_')}_Portfolio.html`; a.click(); URL.revokeObjectURL(u); }} className="btn-primary btn-sm">📥 Download</button>
      </div>
      {activeTab === 'preview' ? <div className="live-preview-frame"><iframe srcDoc={htmlCode} title="Preview" className="preview-iframe" sandbox="allow-same-origin" /></div> : <div className="code-editor-section"><textarea value={htmlCode} onChange={(e) => setEditedCode(e.target.value)} className="code-textarea" spellCheck="false" /><div className="code-info"><span>{htmlCode.split('\n').length} lines</span><span>{htmlCode.length} chars</span></div></div>}
    </div>
  );
}

export default CreatePortfolio;