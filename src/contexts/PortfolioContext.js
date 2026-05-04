import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPortfolio = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/portfolio/generate', userData);
      const newPortfolio = response.data.portfolio;
      setPortfolios(prev => [...prev, newPortfolio]);
      return newPortfolio;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create portfolio';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPortfolios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/portfolio/user-portfolios');
      setPortfolios(response.data.portfolios);
    } catch (err) {
      setError('Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const getPortfolioById = async (id) => {
    try {
      const response = await api.get(`/portfolio/${id}`);
      return response.data.portfolio;
    } catch (err) {
      setError('Failed to fetch portfolio');
      throw err;
    }
  };

  const selectBestPortfolio = async (portfolioId) => {
    try {
      const response = await api.put(`/portfolio/${portfolioId}/select`);
      return response.data.portfolio;
    } catch (err) {
      setError('Failed to select portfolio');
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      portfolios,
      loading,
      error,
      createPortfolio,
      getPortfolios,
      getPortfolioById,
      selectBestPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}