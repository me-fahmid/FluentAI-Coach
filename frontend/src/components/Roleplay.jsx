import React, { useState } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { aiAPI, dashboardAPI } from '../services/api';
import './Roleplay.css';

const Roleplay = () => {
  const [scenario, setScenario] = useState('');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const scenarios = [
    'Restaurant ordering',
    'Job interview',
    'Hotel check-in',
    'Shopping for clothes',
    'Doctor\'s appointment',
    'Airport check-in'
  ];

  const startScenario = (selectedScenario) => {
    setScenario(selectedScenario);
    setStarted(true);
    setResponse('');
    setInput('');
    setError('');
  };

  const submitResponse = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');

    try {
      const prompt = `Roleplay scenario: ${scenario}. User says: "${input}"`;
      const aiResponse = await aiAPI.startRoleplay(prompt);
      
      setResponse(aiResponse.data.response);
      setInput('');
      
      await dashboardAPI.updateProgress('roleplay', 30);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roleplay-container">
      <div className="roleplay-header">
        <h1>🎭 Roleplay Practice</h1>
        <p>Practice real-life English conversations</p>
      </div>

      {!started ? (
        <div className="scenarios-grid">
          {scenarios.map((s) => (
            <button
              key={s}
              className="scenario-card"
              onClick={() => startScenario(s)}
            >
              <span className="scenario-icon">
                {s === 'Restaurant ordering' && '🍽️'}
                {s === 'Job interview' && '💼'}
                {s === 'Hotel check-in' && '🏨'}
                {s === 'Shopping for clothes' && '👕'}
                {s === 'Doctor\'s appointment' && '⚕️'}
                {s === 'Airport check-in' && '✈️'}
              </span>
              <h3>{s}</h3>
            </button>
          ))}
        </div>
      ) : (
        <div className="roleplay-session">
          <div className="session-header">
            <h2>{scenario}</h2>
            <button
              className="btn-reset"
              onClick={() => { setStarted(false); setScenario(''); setResponse(''); }}
            >
              Choose Different Scenario
            </button>
          </div>

          {response && (
            <div className="ai-response">
              <div className="response-avatar">🎭</div>
              <div className="response-content">
                <p>{response}</p>
              </div>
            </div>
          )}

          <div className="input-section">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={loading}
              rows="4"
            />
            <button
              className="btn btn-primary"
              onClick={submitResponse}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spinning" /> Responding...
                </>
              ) : (
                <>
                  <FiSend /> Send Response
                </>
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default Roleplay;