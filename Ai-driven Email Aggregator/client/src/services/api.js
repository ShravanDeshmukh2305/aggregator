import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = {
      message: error.response?.data?.error || 'Request failed',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(errorData);
  }
);

export default api;