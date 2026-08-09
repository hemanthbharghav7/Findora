/**
 * authService.js
 * --------------
 * Authentication API calls for Findora.
 * All functions call the Express /api/auth routes via the shared Axios instance.
 *
 * Future responsibilities:
 *  - register(userData)         → POST /api/auth/register
 *  - login(credentials)         → POST /api/auth/login
 *  - logout()                   → POST /api/auth/logout  (or clear local token)
 *  - getMe()                    → GET  /api/auth/me  (fetch current user profile)
 *
 * Each function should return the response data and handle errors
 * by throwing them so the calling component/context can display messages.
 */

import api from './api';

// TODO: Implement actual API calls

export const register = async (userData) => {
  // TODO: const response = await api.post('/auth/register', userData);
  // TODO: return response.data;
};

export const login = async (credentials) => {
  // TODO: const response = await api.post('/auth/login', credentials);
  // TODO: return response.data;
};

export const logout = async () => {
  // TODO: localStorage.removeItem('findora_token');
};

export const getMe = async () => {
  // TODO: const response = await api.get('/auth/me');
  // TODO: return response.data;
};
