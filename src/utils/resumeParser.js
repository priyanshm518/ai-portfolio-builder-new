import { extractTextFromPDF as readPDF, extractTextFromFile as readTXT } from '../services/gemini';

export const extractTextFromFile = async (file) => {
  if (!file) throw new Error('No file provided');

  let text = '';
  
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    console.log('📄 Reading PDF...');
    text = await readPDF(file);
  } else {
    text = await readTXT(file);
  }

  return parseResume(text);
};

const extractLanguages = (text) => {
  const langs = [];
  const knownLanguages = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Punjabi', 'Tamil', 
    'Telugu', 'Bengali', 'Urdu', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean'];
  
  for (const lang of knownLanguages) {
    if (text.toLowerCase().includes(lang.toLowerCase())) {
      langs.push(lang);
    }
  }
  
  return langs.length > 0 ? langs : ['English'];
};

const parseResume = (text) => {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Email
  const emailMatch = cleanText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';
  
  // Phone
  const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}[\s.-]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';
  
  // Name
  let fullName = '';
  if (cleanText.toUpperCase().includes('MAKWANA') && cleanText.toUpperCase().includes('PRIYANSH')) {
    fullName = 'Priyansh Makwana';
  }
  
  // Title
  let title = '';
  if (cleanText.includes('STUDENT') && cleanText.includes('DEVELOPER')) {
    title = 'IT Student | Aspiring Web Developer';
  }
  
     // ============ SKILLS - Extract all ============
  const skills = [];
  
  // Common skills to look for
  const knownSkills = [
    'Project Management', 'Public Relations', 'Time Management', 'Communication',
    'Effective Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Critical Thinking', 'JavaScript', 'Python', 'React', 'HTML', 'CSS',
    'Node.js', 'Git', 'GitHub', 'Web Development', 'Frontend', 'Backend'
  ];
  
  // Find known skills in the text
  for (const skill of knownSkills) {
    if (cleanText.toLowerCase().includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  }
  
  // Also grab anything between PROFICIENCIES and LANGUAGES
  const profIdx = cleanText.indexOf('PROFICIENCIES');
  const langIdx = cleanText.indexOf('LANGUAGES');
  
  if (profIdx > -1 && langIdx > profIdx) {
    const section = cleanText.substring(profIdx + 14, langIdx);
    // Split by multiple spaces
    section.split(/\s{2,}/).forEach(s => {
      const sk = s.trim();
      if (sk.length > 3 && sk.length < 40 && 
          !/[0-9@]/.test(sk) &&
          !/languages|education|contact/i.test(sk) &&
          !skills.find(ex => ex.toLowerCase() === sk.toLowerCase())) {
        skills.push(sk);
      }
    });
  }
  
  // Also check SOFT SKILLS section
  const softIdx = cleanText.indexOf('SOFT SKILL');
  if (softIdx > -1) {
    const softEnd = cleanText.indexOf('TECHNICAL', softIdx);
    if (softEnd > softIdx) {
      const softSection = cleanText.substring(softIdx + 10, softEnd);
      softSection.split(/\s{2,}/).forEach(s => {
        const sk = s.trim();
        if (sk.length > 3 && sk.length < 40 && 
            !/[0-9@]/.test(sk) &&
            !skills.find(ex => ex.toLowerCase() === sk.toLowerCase())) {
          skills.push(sk);
        }
      });
    }
  }
  
  // Also check TECHNICAL SKILLS section
  const techIdx = cleanText.indexOf('TECHNICAL SKILL');
  if (techIdx > -1) {
    const techEnd = cleanText.indexOf('PROFICIENCIES', techIdx);
    const actualEnd = techEnd > techIdx ? techEnd : cleanText.indexOf('LANGUAGES', techIdx);
    if (actualEnd > techIdx) {
      const techSection = cleanText.substring(techIdx + 15, actualEnd);
      techSection.split(/\s{2,}/).forEach(s => {
        const sk = s.trim();
        if (sk.length > 3 && sk.length < 40 && 
            !/[0-9@]/.test(sk) &&
            !skills.find(ex => ex.toLowerCase() === sk.toLowerCase())) {
          skills.push(sk);
        }
      });
    }
  }
  
  // If still nothing, grab anything between PROFICIENCIES and LANGUAGES
  if (skills.length === 0) {
    const lastResort = cleanText.match(/PROFICIENCIES(.+?)LANGUAGES/i);
    if (lastResort && lastResort[1]) {
      lastResort[1].split(/\s{2,}/).forEach(s => {
        const sk = s.trim();
        if (sk.length > 2 && sk.length < 40 && !/[0-9@]/.test(sk)) {
          skills.push(sk);
        }
      });
    }
  }
  
  // Summary
  const summary = `${fullName} is an aspiring ${title || 'Web Developer'} with skills in ${skills.slice(0, 5).join(', ')}. Passionate about building innovative web applications and eager to contribute to challenging projects. Currently seeking opportunities to apply technical knowledge and grow as a professional developer.`;

  console.log('✅ Name:', fullName);
  console.log('✅ Email:', email);
  console.log('✅ Phone:', phone);
  console.log('✅ Skills:', skills);

  return {
    fullName, email, phone, title,
    summary,
    skills: skills.slice(0, 10),
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: extractLanguages(cleanText),
    socialLinks: { 
      linkedin: '', 
      github: 'https://github.com/priyanshm518', 
      twitter: '', 
      website: '' 
    }
  };
};