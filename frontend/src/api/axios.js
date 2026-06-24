import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Adding error handling for API requests
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API request error:', error);
        return Promise.reject(error);
    }
);

export default api;