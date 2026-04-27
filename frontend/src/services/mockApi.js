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
    const response = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        parking_lot_id: bookingData.parkingId,
        start_time: `${bookingData.date} ${bookingData.time}`,
        end_time: `${bookingData.date} ${bookingData.time}`,
        license_plate: bookingData.licensePlate
      })
    });
    if (!response.ok) throw new Error('Errore nella creazione della prenotazione');
    return await response.json();
  },

  updateBooking: async (id, bookingData) => {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        parking_lot_id: bookingData.parkingId,
        start_time: `${bookingData.date} ${bookingData.time}`,
        end_time: `${bookingData.date} ${bookingData.time}`,
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
        total_spots: parkingData.totalSpots,
        free_spots: parkingData.freeSpots,
        description: parkingData.description,
        address: parkingData.address,
        hourly_rate: parkingData.hourlyRate
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