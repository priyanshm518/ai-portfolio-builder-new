// Mock API service for development without a backend
const mockDB = {
  users: JSON.parse(localStorage.getItem('mockUsers') || '[]'),
  portfolios: JSON.parse(localStorage.getItem('mockPortfolios') || '[]')
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate token
const generateToken = (user) => {
  return btoa(JSON.stringify({ id: user.id, email: user.email }));
};

// Create proper error objects
const createError = (status, message) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message }
  };
  return error;
};

const mockApi = {
  async post(url, data) {
    await delay(800);

    // Sign Up
    if (url === '/auth/signup') {
      const { email, password, name } = data;
      
      if (mockDB.users.find(u => u.email === email)) {
        throw createError(400, 'User already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        createdAt: new Date().toISOString()
      };

      mockDB.users.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockDB.users));

      return {
        data: {
          token: generateToken(newUser),
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
          }
        }
      };
    }

    // Login
    if (url === '/auth/login') {
      const { email, password } = data;
      const user = mockDB.users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw createError(401, 'Invalid email or password');
      }

      return {
        data: {
          token: generateToken(user),
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      };
    }

    // Generate Portfolio
    if (url === '/portfolio/generate') {
      const newPortfolio = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        isSelected: false
      };

      mockDB.portfolios.push(newPortfolio);
      localStorage.setItem('mockPortfolios', JSON.stringify(mockDB.portfolios));

      return {
        data: {
          portfolio: newPortfolio,
          message: 'Portfolio created successfully'
        }
      };
    }

    throw createError(404, 'Endpoint not found');
  },

  async get(url) {
    await delay(500);

    // Get current user
    if (url === '/auth/me') {
      const token = localStorage.getItem('token');
      if (!token) {
        throw createError(401, 'Not authenticated');
      }

      try {
        const decoded = JSON.parse(atob(token));
        const user = mockDB.users.find(u => u.id === decoded.id);
        
        if (!user) {
          throw createError(401, 'User not found');
        }

        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
          }
        };
      } catch (err) {
        throw createError(401, 'Invalid token');
      }
    }

    // Get user portfolios
    if (url === '/portfolio/user-portfolios') {
      return {
        data: {
          portfolios: mockDB.portfolios
        }
      };
    }

    // Get single portfolio
    const portfolioMatch = url.match(/^\/portfolio\/(.+)$/);
    if (portfolioMatch) {
      const portfolioId = portfolioMatch[1];
      const portfolio = mockDB.portfolios.find(p => p._id === portfolioId);
      
      if (!portfolio) {
        throw createError(404, 'Portfolio not found');
      }

      return {
        data: { portfolio }
      };
    }

    throw createError(404, 'Endpoint not found');
  },

  async put(url) {
    await delay(500);

    // Select best portfolio
    const selectMatch = url.match(/^\/portfolio\/(.+)\/select$/);
    if (selectMatch) {
      const portfolioId = selectMatch[1];
      const portfolioIndex = mockDB.portfolios.findIndex(p => p._id === portfolioId);
      
      if (portfolioIndex === -1) {
        throw createError(404, 'Portfolio not found');
      }

      // Deselect all portfolios
      mockDB.portfolios.forEach(p => p.isSelected = false);
      // Select the chosen one
      mockDB.portfolios[portfolioIndex].isSelected = true;
      
      localStorage.setItem('mockPortfolios', JSON.stringify(mockDB.portfolios));

      return {
        data: {
          portfolio: mockDB.portfolios[portfolioIndex],
          message: 'Portfolio selected successfully'
        }
      };
    }

    throw createError(404, 'Endpoint not found');
  }
};

export default mockApi;