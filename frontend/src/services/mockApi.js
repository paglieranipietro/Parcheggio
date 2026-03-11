// Dati iniziali di esempio
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

// ===== FUNZIONI HELPER (ESTERNE) =====
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
  // --- GESTIONE PARCHEGGI ---
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

  // --- GESTIONE PRENOTAZIONI (User Role) ---
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

  getBookingsByUser: (userId) => {
    return bookings.filter(b => b.userId === userId);
  },

  getAvailableSpotsForDate: (parkingId, date, time = null) => {
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return 0;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let targetHour = currentHour;
    let targetMinute = currentMinute;

    if (time) {
      const [hour, minute] = time.split(':').map(Number);
      targetHour = hour;
      targetMinute = minute;
    }

    const bookingsForDate = bookings.filter(b => {
      if (b.parkingId !== parkingId || b.date !== date || b.status !== 'active') return false;
      if (date > today) return true;

      if (date === today) {
        const [bookingHour, bookingMinute] = b.time.split(':').map(Number);
        const bookingDuration = b.duration || 1;
        let endHour = bookingHour + bookingDuration;
        let endMinute = bookingMinute + 15;

        if (endMinute >= 60) {
          endHour += Math.floor(endMinute / 60);
          endMinute = endMinute % 60;
        }

        if (endHour >= 24) return false;

        const targetTotalMinutes = targetHour * 60 + targetMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        return targetTotalMinutes < endTotalMinutes;
      }
      return false;
    });

    return parking.totalSpots - bookingsForDate.length;
  },

  getAvailableSpotsForDateTime: (parkingId, date, time, duration = 1) => {
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return 0;

    const requestedStartMinutes = time ? timeToMinutes(time) : 0;
    const requestedEndMinutes = requestedStartMinutes + (duration * 60);

    const requestedInterval = { start: requestedStartMinutes, end: requestedEndMinutes };

    const bookingsForDate = bookings.filter(b => b.parkingId === parkingId && b.date === date && b.status === 'active');

    const overlappingBookings = bookingsForDate.filter(b => {
      const bookingStartMinutes = timeToMinutes(b.time);
      const bookingDuration = b.duration || 1;
      const bookingEndMinutes = bookingStartMinutes + (bookingDuration * 60) + 15;
      const bookingInterval = { start: bookingStartMinutes, end: bookingEndMinutes };
      return intervalsOverlap(requestedInterval, bookingInterval);
    });

    return Math.max(0, parking.totalSpots - overlappingBookings.length);
  },

  getBookingById: (bookingId) => bookings.find(b => b.id === bookingId),

  checkSlotAvailability: (parkingId, date, time, duration = 1, excludeBookingId = null) => {
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return 0;

    const requestedStartMinutes = time ? timeToMinutes(time) : 0;
    const requestedEndMinutes = requestedStartMinutes + (duration * 60);
    const requestedInterval = { start: requestedStartMinutes, end: requestedEndMinutes };

    const bookingsForDate = bookings.filter(b => b.parkingId === parkingId && b.date === date && b.status === 'active' && b.id !== excludeBookingId);

    const overlappingBookings = bookingsForDate.filter(b => {
      const bookingStartMinutes = timeToMinutes(b.time);
      const bookingDuration = b.duration || 1;
      const bookingEndMinutes = bookingStartMinutes + (bookingDuration * 60) + 15;
      const bookingInterval = { start: bookingStartMinutes, end: bookingEndMinutes };
      return intervalsOverlap(requestedInterval, bookingInterval);
    });

    return {
      available: overlappingBookings.length < parking.totalSpots,
      freeSpots: Math.max(0, parking.totalSpots - overlappingBookings.length),
      totalSpots: parking.totalSpots,
      occupiedSpots: overlappingBookings.length
    };
  },

  updateBooking: (bookingId, updateData) => {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return { success: false, error: 'Prenotazione non trovata' };

    const existingBooking = bookings[bookingIndex];

    if (updateData.date !== existingBooking.date || updateData.time !== existingBooking.time || updateData.duration !== existingBooking.duration) {
      const availability = mockApi.checkSlotAvailability(existingBooking.parkingId, updateData.date, updateData.time, updateData.duration, bookingId);
      if (!availability.available) {
        return { success: false, error: 'Slot non disponibile. Posti liberi: ' + availability.freeSpots + '/' + availability.totalSpots };
      }
    }

    bookings[bookingIndex] = { ...existingBooking, ...updateData, updatedAt: new Date().toISOString() };
    return { success: true, booking: bookings[bookingIndex] };
  },

  getBookingStatus: (booking) => {
    if (booking.status === 'cancelled') return 'annullata';

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    if (booking.date < today) return 'scaduta';

    if (booking.date === today) {
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

  deleteBooking: (bookingId) => {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return { success: false, error: 'Prenotazione non trovata' };
    bookings[bookingIndex].status = 'cancelled';
    return { success: true };
  }
};