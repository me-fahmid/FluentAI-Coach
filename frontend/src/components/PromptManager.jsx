import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { promptsAPI } from '../services/api';
import './PromptManager.css';

const PromptManager = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'conversation',
    content: ''
  });

  const promptTypes = ['daily-plan', 'conversation', 'roleplay', 'writing', 'vocabulary'];

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await promptsAPI.getPrompts();
      setPrompts(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await promptsAPI.updatePrompt(editingId, formData.name, formData.content);
      } else {
        await promptsAPI.createPrompt(formData.name, formData.type, formData.content);
      }

      setFormData({ name: '', type: 'conversation', content: '' });
      setEditingId(null);
      setShowForm(false);
      fetchPrompts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save prompt');
    }
  };

  const handleDelete = async (promptId) => {
    if (window.confirm('Delete this prompt?')) {
      try {
        await promptsAPI.deletePrompt(promptId);
        fetchPrompts();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete prompt');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', type: 'conversation', content: '' });
  };

  if (loading) return <div className="loading">Loading prompts...</div>;

  return (
    <div className="prompts-container">
      <div className="prompts-header">
        <h1>⚙️ Prompt Manager</h1>
        <p>Create and manage custom AI prompts</p>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> New Prompt
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="prompt-form-container">
          <div className="form-card">
            <h2>{editingId ? 'Edit Prompt' : 'Create New Prompt'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Prompt Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My Custom Prompt"
                  required
                />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label>Prompt Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {promptTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Prompt Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your prompt content here..."
                  rows="8"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Prompt' : 'Create Prompt'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="prompts-list">
        {prompts.length === 0 ? (
          <div className="empty-message">
            <p>No prompts yet. Create your first custom prompt!</p>
          </div>
        ) : (
          prompts.map(prompt => (
            <div key={prompt._id} className="prompt-card">
              <div className="prompt-header">
                <div>
                  <h3>{prompt.name}</h3>
                  <p className="prompt-type">{prompt.type} {prompt.isDefault && '(Default)'}</p>
                </div>
                <div className="prompt-actions">
                  {!prompt.isDefault && (
                    <>
                      <button
                        className="btn-icon edit"
                        onClick={() => {
                          setFormData({ name: prompt.name, type: prompt.type, content: prompt.content });
                          setEditingId(prompt._id);
                          setShowForm(true);
                        }}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(prompt._id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="prompt-content">{prompt.content.substring(0, 200)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromptManager;