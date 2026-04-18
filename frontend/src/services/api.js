import axios from 'axios';

const API_URL = "https://fluentai-coach.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password, proficiency) =>
    api.post('/auth/register', { name, email, password, proficiency }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  updateProgress: (type, xpEarned) =>
    api.post('/dashboard/progress', { type, xpEarned })
};

export const aiAPI = {
  generateDailyPlan: (userInput) =>
    api.post('/daily-plan/generate', { userInput }),
  sendChat: (userInput) =>
    api.post('/chat/send', { userInput }),
  startRoleplay: (userInput) =>
    api.post('/roleplay/start', { userInput }),
  analyzeWriting: (userInput) =>
    api.post('/writing/analyze', { userInput }),
  generateVocabularyQuiz: (userInput) =>
    api.post('/vocabulary/quiz', { userInput })
};

export const promptsAPI = {
  getPrompts: (type) =>
    api.get('/prompts', { params: { type } }),
  createPrompt: (name, type, content) =>
    api.post('/prompts', { name, type, content }),
  updatePrompt: (promptId, name, content) =>
    api.put(`/prompts/${promptId}`, { name, content }),
  deletePrompt: (promptId) =>
    api.delete(`/prompts/${promptId}`)
};

export default api;
