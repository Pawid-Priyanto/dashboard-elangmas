import axios from 'axios';

const api = axios.create({
  // URL ini diambil dari domain Vercel Backend Anda
  baseURL: 'https://api-elangmas.vercel.app/api', 
});

export default api;