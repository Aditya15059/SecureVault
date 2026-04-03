import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Encrypt from './pages/Encrypt';
import Steganography from './pages/Steganography';
import Detection from './pages/Detection';
import Files from './pages/Files';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/encrypt" element={<Encrypt />} />
          <Route path="/steganography" element={<Steganography />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/files" element={<Files />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;