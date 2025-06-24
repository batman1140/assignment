import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  createUser: (userData) => api.post('/users', userData),
  getUsers: () => api.get('/users'),
};

export const groupService = {
  createGroup: (groupData) => api.post('/groups', groupData),
  getGroups: () => api.get('/groups'),
  getGroup: (groupId) => api.get(`/groups/${groupId}`),
  getGroupBalances: (groupId) => api.get(`/groups/${groupId}/balances`),
  addExpense: (groupId, expenseData) => api.post(`/groups/${groupId}/expenses`, expenseData),
  getExpenses: (groupId) => api.get(`/groups/${groupId}/expenses`),
};

export default api;