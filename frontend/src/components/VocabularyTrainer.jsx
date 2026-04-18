import React, { useState } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { aiAPI, dashboardAPI } from '../services/api';
import './VocabularyTrainer.css';

const VocabularyTrainer = () => {
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('start');

  const startVocabularyQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz('');

    try {
      const response = await aiAPI.generateVocabularyQuiz('Start vocabulary quiz with 5 advanced words');
      setQuiz(response.data.response);
      setStage('quiz');
      
      await dashboardAPI.updateProgress('vocabulary', 40);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await aiAPI.generateVocabularyQuiz(`Quiz: ${quiz}\n\nMy answer: ${answer}`);
      setFeedback(response.data.response);
      setStage('feedback');
      setAnswer('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get feedback');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await aiAPI.generateVocabularyQuiz('Next vocabulary question');
      setQuiz(response.data.response);
      setStage('quiz');
      setAnswer('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate next question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vocabulary-container">
      <div className="vocabulary-header">
        <h1>📚 Vocabulary Trainer</h1>
        <p>Learn advanced English words with interactive quizzes</p>
      </div>

      {stage === 'start' && (
        <div className="vocabulary-card">
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h2>Build Your Vocabulary</h2>
            <p>Take interactive quizzes with 5 advanced words at a time.</p>
            <button
              className="btn btn-primary btn-large"
              onClick={startVocabularyQuiz}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spinning" /> Generating...
                </>
              ) : (
                <>
                  <FiSend /> Start Vocabulary Quiz
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {stage === 'quiz' && (
        <div className="vocabulary-card">
          <div className="quiz-content">
            <div className="quiz-display">
              {quiz.split('\n').map((line, idx) => (
                <p key={idx} className="quiz-text">{line}</p>
              ))}
            </div>

            <div className="answer-section">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                disabled={loading}
                rows="4"
              />
              <button
                className="btn btn-primary"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="spinning" /> Checking...
                  </>
                ) : (
                  <>
                    <FiSend /> Submit Answer
                  </>
                )}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {stage === 'feedback' && (
        <div className="vocabulary-card">
          <div className="feedback-content">
            <div className="feedback-display">
              {feedback.split('\n').map((line, idx) => (
                <p key={idx} className="feedback-text">{line}</p>
              ))}
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={nextQuestion} disabled={loading}>
                {loading ? 'Generating...' : 'Next Question'}
              </button>
              <button className="btn btn-secondary" onClick={() => { setStage('start'); setQuiz(''); setFeedback(''); }}>
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyTrainer;