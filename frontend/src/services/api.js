import axios from 'axios';
import { API_BASE_URL } from '../app/config';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Basic 401 handling — extend with refresh-token flow when the backend
// refresh endpoint (POST /auth/refresh) is wired up.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(err);
  }
);

export default api;
