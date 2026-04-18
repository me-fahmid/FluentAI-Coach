import React, { useState } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { aiAPI, dashboardAPI } from '../services/api';
import './DailyPlan.css';

const DailyPlan = () => {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setPlan('');

    try {
      const response = await aiAPI.generateDailyPlan('Generate my daily English immersion plan');
      setPlan(response.data.response);
      await dashboardAPI.updateProgress('daily-plan', 50);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate daily plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-plan-container">
      <div className="daily-plan-header">
        <h1>📅 Daily Plan Generator</h1>
        <p>Get a personalized English learning plan every day</p>
      </div>

      <div className="daily-plan-card">
        {!plan ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>Ready to learn?</h2>
            <p>Generate your daily English learning plan with phrases, vocabulary, grammar, and exercises.</p>
            <button
              className="btn btn-primary btn-large"
              onClick={generatePlan}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spinning" /> Generating...
                </>
              ) : (
                <>
                  <FiSend /> Generate Daily Plan
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="plan-content">
            <div className="plan-display">
              {plan.split('\n').map((line, idx) => (
                <p key={idx} className="plan-text">{line}</p>
              ))}
            </div>

            <button className="btn btn-secondary" onClick={generatePlan} disabled={loading}>
              {loading ? 'Generating...' : 'Generate New Plan'}
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default DailyPlan;