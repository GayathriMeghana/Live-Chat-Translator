//import axios from 'axios';
//
//const API_BASE = 'http://localhost:8000/api';
//
//export const register = (data) => axios.post(`${API_BASE}/user/register`, data);
//export const login = (data) => axios.post(`${API_BASE}/user/login`, data);
//export const getUser = (id) => axios.get(`${API_BASE}/user/${id}`);
//export const sendMessage = (data) => axios.post(`${API_BASE}/message/send`, data);
//export const getChatHistory = (senderId, receiverId) =>
//  axios.get(`${API_BASE}/message/history?senderId=${senderId}&receiverId=${receiverId}`);



//
//// src/services/api.js
//import axios from 'axios';
//
//const API = axios.create({
//  baseURL: 'http://localhost:8000/api'
//});
//
//// Add JWT token to headers for protected routes
//API.interceptors.request.use(config => {
//  const token = localStorage.getItem('token');
//  if (token) {
//    config.headers.Authorization = `Bearer ${token}`;
//  }
//  return config;
//});
//
//// ✅ API methods
//export const register = (data) => API.post('/auth/register', data);
//export const login = (data) => API.post('/auth/login', data);
//
//export const getUser = (id) => API.get(`/user/${id}`);
//export const getProfile = () => API.get('/user/profile');
//export const updateProfile = (data) => API.put('/user/update', data);
//
//export const sendMessage = (data) => API.post('/message/send', data);
//export const getChatHistory = (senderId, receiverId) =>
//  API.get(`/message/history?senderId=${senderId}&receiverId=${receiverId}`);
//
//export const getOtherUsers = (id) => API.get(`/user/others/${id}`);
//export const translate = (text, from, to) =>
//  API.post(`/message/translate?text=${text}&from=${from}&to=${to}`);




// src/services/api.js

// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Set Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ API Functions using the `api` instance

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getUserProfile = () => api.get('/user/profile');
export const updateUser = (data) => api.put('/user/update', data);
export const deleteUser = () => api.delete('/user/delete');
// ✅ Correct: No userId required, token is auto-included via interceptor
export const getOtherUsers = () => api.get(`/user/others`);

export const sendMessage = (data) => api.post('/message/send', data);
export const getChatHistory = (senderId, receiverId) =>
  api.get(`/message/history?senderId=${senderId}&receiverId=${receiverId}`);

export const editMessage = (messageId, originalText) =>
  api.put(`/message/edit/${messageId}`, { originalText });

export const translateMessage = (text, from, to) =>
  api.post(`/message/translate?text=${text}&from=${from}&to=${to}`);
