/**
 * api.js
 * ------
 * Shared Axios instance for Findora's frontend HTTP layer.
 *
 * Future responsibilities:
 *  - Configure baseURL to point at the Express backend (e.g. http://localhost:5000/api)
 *  - Attach JWT token from localStorage to every request via request interceptors
 *  - Handle 401 Unauthorized responses globally (auto-logout) via response interceptors
 *  - Set default headers (Content-Type: application/json)
 *
 * Usage:
 *   import api from './api';
 *   const data = await api.get('/cases');
 */

import axios from 'axios';

// Use Render backend URL in production, else local server
const BASE_URL = import.meta.env.PROD 
  ? 'https://findora-twaq.onrender.com/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// TODO: Attach Authorization header with JWT token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('findora_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// --- Response Interceptor ---
// TODO: Handle global error responses (e.g. 401, 500)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) { /* logout user */ }
//     return Promise.reject(error);
//   }
// );

export default api;
