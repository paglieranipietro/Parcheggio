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
  },

  createBooking: async (bookingData) => {
    const start = new Date(`${bookingData.date}T${bookingData.time}`);
    const duration = bookingData.duration || 1;
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    const formatDb = (d) => d.toISOString().slice(0, 19).replace('T', ' ');

    const response = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        parking_lot_id: bookingData.parkingId,
        start_time: formatDb(start),
        end_time: formatDb(end),
        license_plate: bookingData.licensePlate
      })
    });
    if (!response.ok) throw new Error('Errore nella creazione della prenotazione');
    return await response.json();
  },

  updateBooking: async (id, bookingData) => {
    const start = new Date(`${bookingData.date}T${bookingData.time}`);
    const duration = bookingData.duration || 1;
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    const formatDb = (d) => d.toISOString().slice(0, 19).replace('T', ' ');

    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        parking_lot_id: bookingData.parkingId,
        start_time: formatDb(start),
        end_time: formatDb(end),
        license_plate: bookingData.licensePlate
      })
    });
    if (!response.ok) throw new Error('Errore nell\'aggiornamento della prenotazione');
    return await response.json();
  },

  checkSlotAvailability: async (parkingId, date, time, duration) => {
    try {
      const response = await fetch(
        `${BASE_URL}/parking-lots/${parkingId}/availability?date=${date}&time=${time}&duration=${duration}`,
        { method: 'GET', headers: getHeaders() }
      );
      if (response.ok) {
        return await response.json();
      }
      return { available: true, spots: 999 };
    } catch (error) {
      return { available: true, spots: 999 };
    }
  },

  getAvailableSpotsForDateTime: async (parkingId, date, time, duration) => {
    try {
      const response = await fetch(
        `${BASE_URL}/parking-lots/${parkingId}/available-spots?date=${date}&time=${time}&duration=${duration}`,
        { method: 'GET', headers: getHeaders() }
      );
      if (response.ok) {
        return await response.json();
      }
      return { available: true, spots: 999 };
    } catch (error) {
      return { available: true, spots: 999 };
    }
  },

  addParking: async (parkingData) => {
    const response = await fetch(`${BASE_URL}/parking-lots`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: parkingData.name,
        total_spots: parkingData.totalSpots || 100,
        address: parkingData.address || "Brescia Centro",
        // Mettiamo coordinate di default (Centro di Brescia) se il form non le ha
        lat: parkingData.lat || 45.5415,
        lng: parkingData.lng || 10.2160,
        hourly_rate: parkingData.hourlyRate || 1.50,
        co2: parkingData.co2 || 100
      })
    });
    if (!response.ok) throw new Error('Errore nell\'aggiunta del parcheggio');
    return await response.json();
  },

  deleteParking: async (id) => {
    const response = await fetch(`${BASE_URL}/parking-lots/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Errore nell\'eliminazione del parcheggio');
    return await response.json();
  },

  getBookingById: async (id) => {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Prenotazione non trovata');
    return await response.json();
  }
};

export default api;