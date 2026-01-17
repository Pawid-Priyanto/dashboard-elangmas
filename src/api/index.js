// import axios from 'axios';

// const api = axios.create({
//   // URL ini diambil dari domain Vercel Backend Anda
//   baseURL: 'https://api-elangmas.vercel.app/api', 
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  // Vite akan membaca VITE_API_URL dari .env saat build
  // Jika tidak ada (misal di lokal), dia akan fallback ke localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;