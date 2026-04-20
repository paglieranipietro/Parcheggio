const BASE_URL = 'http://localhost:9080/~paglia/parcheggio/api/v1'; 

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Credenziali errate');
    return await response.json(); 
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Errore durante la registrazione');
    return await response.json();
  },

  getMe: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Sessione scaduta');
    return await response.json();
  },

  getParkingLots: async () => {
    const response = await fetch(`${BASE_URL}/parking-lots`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await response.json();
  },

  getUserReservations: async () => {
    const response = await fetch(`${BASE_URL}/reservations/user`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await response.json();
  },

  deleteBooking: async (id) => {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Errore nella cancellazione');
    return await response.json();
  }
};

export default api;