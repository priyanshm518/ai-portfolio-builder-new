export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      number: hasNumber
    }
  };
};

export const validatePortfolioForm = (formData, step) => {
  const errors = {};
  
  switch(step) {
    case 1:
      if (!formData.fullName || formData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      }
      if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email address';
      }
      if (!formData.title) {
        errors.title = 'Professional title is required';
      }
      if (!formData.summary || formData.summary.length < 50) {
        errors.summary = 'Summary must be at least 50 characters';
      }
      break;
    
    case 2:
      // Experience is now optional - no validation required
      if (formData.experience && formData.experience.length > 0) {
        formData.experience.forEach((exp, index) => {
          if (exp.company || exp.position) {
            if (!exp.company) {
              errors[`experience_${index}`] = 'Company name is required';
            } else if (!exp.position) {
              errors[`experience_${index}`] = 'Position is required';
            }
          }
        });
      }
      break;
    
    case 3:
      if (!formData.skills || formData.skills.length === 0) {
        errors.skills = 'Add at least one skill';
      }
      if (!formData.education || formData.education.length === 0) {
        errors.education = 'Add at least one education entry';
      } else {
        formData.education.forEach((edu, index) => {
          if (!edu.school || !edu.degree || !edu.field) {
            errors[`education_${index}`] = 'School, degree, and field are required';
          }
        });
      }
      break;
    
    case 4:
      // Projects are optional
      break;
      
    default:
      break;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};  