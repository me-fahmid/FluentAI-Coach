import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';
import Register from './Register';
import Dashboard from '../components/Dashboard';
import ChatInterface from '../components/ChatInterface';
import DailyPlan from '../components/DailyPlan';
import Roleplay from '../components/Roleplay';
import WritingAssistant from '../components/WritingAssistant';
import VocabularyTrainer from '../components/VocabularyTrainer';
import PromptManager from '../components/PromptManager';
import Sidebar from '../components/Sidebar';
import './App.css';

function App() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading FluentAI Coach...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={logout} user={user} />
            <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/daily-plan" element={<DailyPlan />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/roleplay" element={<Roleplay />} />
                <Route path="/writing" element={<WritingAssistant />} />
                <Route path="/vocabulary" element={<VocabularyTrainer />} />
                <Route path="/prompts" element={<PromptManager />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onLogin={login} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;