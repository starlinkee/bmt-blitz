const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', API_URL);

export { API_URL }; 