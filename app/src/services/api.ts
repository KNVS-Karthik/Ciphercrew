import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ciphercrew-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getOnlineUsers: () =>
    api.get('/auth/online-users'),
};

// Messages API
export const messageAPI = {
  getMessages: (roomId: string, limit = 50, before?: string) =>
    api.get(`/messages/${roomId}?limit=${limit}${before ? `&before=${before}` : ''}`),
  
  sendMessage: (roomId: string, content: string, type = 'text', replyTo?: string) =>
    api.post(`/messages/${roomId}`, { content, type, replyTo }),
  
  addReaction: (messageId: string, emoji: string) =>
    api.post(`/messages/${messageId}/react`, { emoji }),
  
  deleteMessage: (messageId: string) =>
    api.delete(`/messages/${messageId}`),
};

// Rooms API
export const roomAPI = {
  getRooms: () =>
    api.get('/rooms'),
  
  createDM: (userId: string) =>
    api.post(`/rooms/dm/${userId}`),
  
  createGroup: (name: string, memberIds: string[], settings?: any) =>
    api.post('/rooms/group', { name, memberIds, settings }),
  
  updateSettings: (roomId: string, settings: any) =>
    api.patch(`/rooms/${roomId}/settings`, settings),
  
  addMember: (roomId: string, userId: string) =>
    api.post(`/rooms/${roomId}/members`, { userId }),
  
  leaveRoom: (roomId: string) =>
    api.post(`/rooms/${roomId}/leave`),
};

// Games API
export const gameAPI = {
  getActiveGames: () =>
    api.get('/games/active'),
  
  getGame: (gameId: string) =>
    api.get(`/games/${gameId}`),
  
  getTruthDareQuestions: (level: string, type: string) =>
    api.get(`/games/truth-dare/questions?level=${level}&type=${type}`),
  
  getMysteryCases: () =>
    api.get('/games/mystery-cases'),
  
  getMysteryCase: (caseId: string) =>
    api.get(`/games/mystery-cases/${caseId}`),
};

export default api;
