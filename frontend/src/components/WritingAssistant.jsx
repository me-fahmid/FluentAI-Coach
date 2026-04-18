import React, { useState } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { aiAPI, dashboardAPI } from '../services/api';
import './WritingAssistant.css';

const WritingAssistant = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeWriting = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await aiAPI.analyzeWriting(text);
      setAnalysis(response.data.response);
      
      await dashboardAPI.updateProgress('writing', 25);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze writing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="writing-container">
      <div className="writing-header">
        <h1>✍️ Writing Assistant</h1>
        <p>Get AI feedback on your English writing</p>
      </div>

      <div className="writing-section">
        <h2>Your Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your English text here..."
          disabled={loading}
          rows="6"
          className="text-input"
        />

        <button
          className="btn btn-primary"
          onClick={analyzeWriting}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <FiRefreshCw className="spinning" /> Analyzing...
            </>
          ) : (
            <>
              <FiSend /> Analyze Writing
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="analysis-section">
          <h2>Analysis & Recommendations</h2>
          <div className="analysis-content">
            {analysis.split('\n').map((line, idx) => (
              <p key={idx} className="analysis-text">{line}</p>
            ))}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => { setText(''); setAnalysis(''); }}
          >
            Analyze Another Text
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default WritingAssistant;