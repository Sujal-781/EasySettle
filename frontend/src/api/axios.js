import axios from 'axios';

const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const baseURL = process.env.REACT_APP_API_BASE_URL && validateURL(process.env.REACT_APP_API_BASE_URL) 
    ? process.env.REACT_APP_API_BASE_URL 
    : 'https://localhost:8080';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;