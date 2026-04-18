import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiTarget, FiBookOpen, FiAward } from 'react-icons/fi';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const stats = dashboard?.progress || {};

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {dashboard?.user?.name}! 👋</h1>
        <p>Keep up the excellent progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon streak"><FiTrendingUp /></div>
          <div className="stat-content">
            <h3>Streak</h3>
            <p className="stat-value">{stats.streakCount || 0}</p>
            <p className="stat-label">days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon xp"><FiAward /></div>
          <div className="stat-content">
            <h3>Total XP</h3>
            <p className="stat-value">{stats.totalXP || 0}</p>
            <p className="stat-label">points</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon lessons"><FiBookOpen /></div>
          <div className="stat-content">
            <h3>Sessions</h3>
            <p className="stat-value">{stats.chatSessions || 0}</p>
            <p className="stat-label">completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon target"><FiTarget /></div>
          <div className="stat-content">
            <h3>Level</h3>
            <p className="stat-value">{dashboard?.user?.proficiency || 'N/A'}</p>
            <p className="stat-label">proficiency</p>
          </div>
        </div>
      </div>

      <div className="daily-plan-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/daily-plan" className="action-btn daily">📅 Daily Plan</a>
          <a href="/chat" className="action-btn chat">💬 Chat</a>
          <a href="/vocabulary" className="action-btn vocab">📚 Vocabulary</a>
          <a href="/prompts" className="action-btn prompts">⚙️ Prompts</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;