import axios from 'axios';

const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: validateURL(baseURL) ? baseURL : 'https://your-production-url.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;