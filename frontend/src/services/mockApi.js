// Dati iniziali di esempio per i parcheggi di Brescia
let parkings = [
  {
    id: 1,
    name: "Parcheggio Vittoria",
    address: "Piazza della Vittoria, Brescia",
    totalSpots: 100,
    freeSpots: 42,
    co2: 150, // Risparmio stimato in grammi
    hourlyRate: 1.40 // €/ora
  },
  {
    id: 2,
    name: "Parcheggio Arnaldo",
    address: "Piazzale Arnaldo, Brescia",
    totalSpots: 80,
    freeSpots: 5,
    co2: 120,
    hourlyRate: 1.90
  },
  {
    id: 3,
    name: "Parcheggio Stazione",
    address: "Viale della Stazione, Brescia",
    totalSpots: 1,
    freeSpots: 1,
    co2: 200,
    hourlyRate: 1.10
  },
  {
    id: 4,
    name: "Parcheggio Brescia Due",
    address: "Via Brescia Due, Brescia",
    totalSpots: 60,
    freeSpots: 25,
    co2: 90,
    hourlyRate: 0.80
  }
];

// Array per memorizzare le prenotazioni effettuate durante la sessione
let bookings = [];

// ===== FUNZIONI HELPER (ESTERNE) =====
// Converte stringa orario "HH:MM" in minuti totali dal giorno
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Controlla se due intervalli temporali si sovrappongono
// Formula: due intervalli si sovrappongono se start1 < end2 AND start2 < end1
const intervalsOverlap = (interval1, interval2) => {
  return interval1.start < interval2.end && interval2.start < interval1.end;
};
// ===== FINE FUNZIONI HELPER =====

export const mockApi = {
  // --- GESTIONE PARCHEGGI ---
  
  // Ottiene tutti i parcheggi
  getParkings: () => {
    return [...parkings];
  },

  // --- GESTIONE PRENOTAZIONI (User Role) ---

  // Crea una nuova prenotazione
  createBooking: (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Math.floor(Math.random() * 10000), // ID univoco finto
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);

    return newBooking;
  },

  // Recupera le prenotazioni di uno specifico utente
  getBookingsByUser: (userId) => {
    return bookings.filter(b => b.userId === userId);
  },

  // Calcola i posti disponibili per un parcheggio in una data specifica
  // Se viene fornito un orario, calcola i posti considerando la scadenza delle prenotazioni a quell'orario
  getAvailableSpotsForDate: (parkingId, date, time = null) => {
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return 0;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Se time è fornito, convertilo in minuti per il controllo futuro
    let targetHour = currentHour;
    let targetMinute = currentMinute;
    
    if (time) {
      const [hour, minute] = time.split(':').map(Number);
      targetHour = hour;
      targetMinute = minute;
    }

    const bookingsForDate = bookings.filter(b => {
      if (b.parkingId !== parkingId || b.date !== date || b.status !== 'active') {
        return false;
      }

      // Se è una data nel futuro, la prenotazione è sempre attiva
      if (date > today) {
        return true;
      }

      // Se è oggi, controlla se la prenotazione sarà scaduta all'orario target
      if (date === today) {
        const [bookingHour, bookingMinute] = b.time.split(':').map(Number);
        const bookingDuration = b.duration || 1;
        
        // Calcola la fine della prenotazione + 15 minuti buffer
        let endHour = bookingHour + bookingDuration;
        let endMinute = bookingMinute + 15; // buffer di 15 minuti

        // Gestisci l'overflow dei minuti
        if (endMinute >= 60) {
          endHour += Math.floor(endMinute / 60);
          endMinute = endMinute % 60;
        }

        // Gestisci l'overflow delle ore
        if (endHour >= 24) {
          return false; // La prenotazione era per oggi e è scaduta ieri
        }

        // Confronta con l'orario target (attuale o specificato)
        const targetTotalMinutes = targetHour * 60 + targetMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        // Se l'orario target è prima della fine, la prenotazione è ancora attiva
        return targetTotalMinutes < endTotalMinutes;
      }

      // Se è una data nel passato, la prenotazione è scaduta
      return false;
    });

    return parking.totalSpots - bookingsForDate.length;
  },

  // Calcola i posti disponibili per un parcheggio in una data e orario specifici
  // Considera la DURATA delle prenotazioni per la sovrapposizione cronologica
  getAvailableSpotsForDateTime: (parkingId, date, time, duration = 1) => {
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return 0;

    // Converte l'orario richiesto in minuti
    const requestedStartMinutes = time ? timeToMinutes(time) : 0;
    const requestedEndMinutes = requestedStartMinutes + (duration * 60);

    // Crea l'intervallo temporale della prenotazione richiesta
    const requestedInterval = {
      start: requestedStartMinutes,
      end: requestedEndMinutes
    };

    // Filtra le prenotazioni attive per il parcheggio e la data
    const bookingsForDate = bookings.filter(b => 
      b.parkingId === parkingId && 
      b.date === date &&
      b.status === 'active'
    );

    // Conta quante prenotazioni si sovrappongono cronologicamente
    const overlappingBookings = bookingsForDate.filter(b => {
      const bookingStartMinutes = timeToMinutes(b.time);
      const bookingDuration = b.duration || 1; // Default 1 ora
      // Aggiungi 15 minuti di buffer di pulizia/cambio dopo ogni prenotazione
      const bookingEndMinutes = bookingStartMinutes + (bookingDuration * 60) + 15;

      const bookingInterval = {
        start: bookingStartMinutes,
        end: bookingEndMinutes
      };

      return intervalsOverlap(requestedInterval, bookingInterval);
    });

    return Math.max(0, parking.totalSpots - overlappingBookings.length);
  },

  // Cancella una prenotazione
  deleteBooking: (bookingId) => {
    bookings = bookings.filter(b => b.id !== bookingId);
    return { success: true };
  },

  // --- FUNZIONI PER ADMIN (Utili per i tuoi colleghi) ---

  getStats: () => {
    return {
      totalBookings: bookings.length,
      mostUsedParking: parkings[0].name, // Semplificazione
      totalCo2Saved: bookings.length * 150 // Calcolo finto basato sulle prenotazioni
    };
  }
};