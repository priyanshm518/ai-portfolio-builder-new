import React, { createContext, useState, useContext, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createPortfolio = useCallback(async (data) => {
    if (!currentUser) throw new Error('Auth required');
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'portfolios'), {
        ...data,
        userId: currentUser.id,
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      const newPortfolio = { _id: docRef.id, ...data, createdAt: new Date().toISOString() };
      setPortfolios(prev => [newPortfolio, ...prev]);
      return newPortfolio;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally { setLoading(false); }
  }, [currentUser]);

  const getPortfolios = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'portfolios'),
        where('userId', '==', currentUser.id),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({
        _id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt
      }));
      setPortfolios(list);
    } catch (err) {
      setError('Failed to fetch portfolios');
    } finally { setLoading(false); }
  }, [currentUser]);

  const getPortfolioById = (id) => portfolios.find(p => p._id === id) || null;

  const deletePortfolio = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      setPortfolios(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete');
      throw err;
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{
      portfolios, loading, error,
      createPortfolio, getPortfolios, getPortfolioById, deletePortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}