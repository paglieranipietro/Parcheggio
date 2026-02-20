// Dati iniziali di esempio per i parcheggi di Brescia
let parkings = [
  {
    id: 1,
    name: "Parcheggio Vittoria",
    address: "Piazza della Vittoria, Brescia",
    totalSpots: 100,
    freeSpots: 42,
    co2: 150 // Risparmio stimato in grammi
  },
  {
    id: 2,
    name: "Parcheggio Arnaldo",
    address: "Piazzale Arnaldo, Brescia",
    totalSpots: 80,
    freeSpots: 5,
    co2: 120
  },
  {
    id: 3,
    name: "Parcheggio Stazione",
    address: "Viale della Stazione, Brescia",
    totalSpots: 150,
    freeSpots: 0,
    co2: 200
  },
  {
    id: 4,
    name: "Parcheggio Brescia Due",
    address: "Via Brescia Due, Brescia",
    totalSpots: 60,
    freeSpots: 25,
    co2: 90
  }
];

// Array per memorizzare le prenotazioni effettuate durante la sessione
let bookings = [];

export const mockApi = {
  // --- GESTIONE PARCHEGGI ---
  
  // Ottiene tutti i parcheggi
  getParkings: () => {
    return [...parkings];
  },

  // --- GESTIONE PRENOTAZIONI (User Role) ---

  // Crea una nuova prenotazione e aggiorna i posti liberi
  createBooking: (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Math.floor(Math.random() * 10000), // ID univoco finto
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);

    // Simuliamo la riduzione dei posti liberi nel parcheggio selezionato
    parkings = parkings.map(p => 
      p.id === bookingData.parkingId 
        ? { ...p, freeSpots: p.freeSpots - 1 } 
        : p
    );

    return newBooking;
  },

  // Recupera le prenotazioni di uno specifico utente
  getBookingsByUser: (userId) => {
    return bookings.filter(b => b.userId === userId);
  },

  // Cancella una prenotazione e ripristina il posto auto
  deleteBooking: (bookingId) => {
    const bookingToDelete = bookings.find(b => b.id === bookingId);
    
    if (bookingToDelete) {
      // Ripristiniamo il posto nel parcheggio
      parkings = parkings.map(p => 
        p.id === bookingToDelete.parkingId 
          ? { ...p, freeSpots: p.freeSpots + 1 } 
          : p
      );
      
      // Rimuoviamo la prenotazione dall'array
      bookings = bookings.filter(b => b.id !== bookingId);
    }
    
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