let parkings = [
  { id: 1, name: "Parcheggio Vittoria", address: "Piazza della Vittoria, Brescia", totalSpots: 100, freeSpots: 42, co2: 150, hourlyRate: 1.40 },
  { id: 2, name: "Parcheggio Arnaldo", address: "Piazzale Arnaldo, Brescia", totalSpots: 80, freeSpots: 5, co2: 120, hourlyRate: 1.90 },
  { id: 3, name: "Parcheggio Stazione", address: "Viale della Stazione, Brescia", totalSpots: 50, freeSpots: 10, co2: 200, hourlyRate: 1.10 },
  { id: 4, name: "Parcheggio Brescia Due", address: "Via Brescia Due, Brescia", totalSpots: 60, freeSpots: 25, co2: 90, hourlyRate: 0.80 }
];

let bookings = [];

const USERS = [
  { id: 1, email: "admin@brescia.it", password: "password123", role: "admin", name: "Responsabile Brescia" },
  { id: 2, email: "studente@gmail.com", password: "user2026", role: "user", name: "Mario Rossi" },
];

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const intervalsOverlap = (interval1, interval2) => {
  return interval1.start < interval2.end && interval2.start < interval1.end;
};

const generateUniqueCode = () => {
  return 'GRN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const loginRequest = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find((u) => u.email === email && u.password === password);
      if (user) resolve({ status: 200, data: user });
      else reject({ status: 401, message: "Credenziali non valide" });
    }, 800);
  });
};

export const registerRequest = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = USERS.find((u) => u.email === email);
      if (existing) reject({ status: 409, message: "Email già registrata" });
      else {
        const newUser = { id: USERS.length + 1, name, email, password, role: "user" };
        USERS.push(newUser);
        resolve({ status: 201, data: newUser });
      }
    }, 800);
  });
};

export const mockApi = {
  getParkings: () => [...parkings],

  addParking: (newParking) => {
    const parking = { ...newParking, id: Date.now() };
    parkings.push(parking);
    return parking;
  },

  updateParking: (id, updateData) => {
    const index = parkings.findIndex(p => p.id === id);
    if (index !== -1) {
      parkings[index] = { ...parkings[index], ...updateData };
      return { success: true, parking: parkings[index] };
    }
    return { success: false, error: "Parcheggio non trovato" };
  },

  deleteParking: (id) => {
    parkings = parkings.filter(p => p.id !== id);
    return { success: true };
  },

  getAdminStats: () => {
    const totalSavedCo2 = bookings.reduce((acc, curr) => acc + (curr.co2Saved || 150), 0);
    return {
      totalBookings: bookings.length,
      activeParkings: parkings.length,
      totalCo2Saved: totalSavedCo2
    };
  },

  createBooking: (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Math.floor(Math.random() * 10000),
      uniqueCode: generateUniqueCode(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    bookings.push(newBooking);
    return newBooking;
  },

  getBookingsByUser: (userId) => bookings.filter(b => b.userId === userId),

  getBookingStatus: (booking) => {
    if (booking.status === 'cancelled') return 'annullata';
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    if (booking.date < today) return 'scaduta';

    if (booking.date === today && booking.time) {
      const [bookingHour, bookingMinute] = booking.time.split(':').map(Number);
      const bookingDuration = booking.duration || 1;
      const bookingStartMinutes = bookingHour * 60 + bookingMinute;
      const bookingEndMinutes = bookingStartMinutes + (bookingDuration * 60) + 15;

      if (currentTotalMinutes >= bookingEndMinutes) return 'scaduta';
    }
    return 'attiva';
  },

  getBookingsByUserWithStatus: (userId) => {
    const userBookings = bookings.filter(b => b.userId === userId);
    return userBookings.map(booking => ({
      ...booking,
      displayStatus: mockApi.getBookingStatus(booking)
    }));
  },

  getBookingById: (bookingId) => bookings.find(b => b.id === bookingId),

  updateBooking: (bookingId, updateData) => {
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return { success: false, error: 'Prenotazione non trovata' };

    bookings[index] = { ...bookings[index], ...updateData, updatedAt: new Date().toISOString() };
    return { success: true, booking: bookings[index] };
  },

  deleteBooking: (bookingId) => {
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return { success: false, error: 'Prenotazione non trovata' };
    bookings[index].status = 'cancelled';
    return { success: true };
  }
};