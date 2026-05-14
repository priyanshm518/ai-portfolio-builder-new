import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User'
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { id: result.user.uid, email: result.user.email, name };
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { id: result.user.uid, email: result.user.email, name: result.user.displayName || email.split('@')[0] };
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = { currentUser, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}