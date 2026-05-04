import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreatePortfolio from './pages/CreatePortfolio';
import PortfolioPreview from './pages/PortfolioPreview';
import SelectPortfolio from './pages/SelectPortfolio';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  // Hide navbar on live portfolio preview page
  const hideNavbar = location.pathname.startsWith('/portfolio/') && !location.pathname.includes('select');
  
  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/create-portfolio" element={
          <PrivateRoute>
            <CreatePortfolio />
          </PrivateRoute>
        } />
        <Route path="/portfolio/:id" element={
          <PrivateRoute>
            <PortfolioPreview />
          </PrivateRoute>
        } />
        <Route path="/select-portfolio/:id" element={
          <PrivateRoute>
            <SelectPortfolio />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;