import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ParkingList from '../components/user/ParkingList';
import BookingList from '../components/user/BookingList';
import BookingForm from '../components/user/BookingForm';
import AccountSettings from '../components/user/AccountSettings';
import ParkingMap from '../components/map/ParkingMap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [selectedParking, setSelectedParking] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshBookings, setRefreshBookings] = useState(0);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [focusParkingId, setFocusParkingId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        /**
         * Caricamento parallelo di parcheggi e prenotazioni.
         */
        const [parkingsData, userBookings] = await Promise.all([
          api.getParkingLots(),
          api.getUserReservations()
        ]);
        
        setParkings(parkingsData);
        
        // Formattazione dati sincronizzata con il database reale
        const formattedBookings = userBookings.map(b => {
          // 1. Traduzione stato DB -> UI per abilitare i tasti Azione
          let statusIta = 'sconosciuta';
          if (b.status === 'ACTIVE') statusIta = 'attiva';
          if (b.status === 'COMPLETED') statusIta = 'scaduta';
          if (b.status === 'CANCELLED') statusIta = 'annullata';

          // 2. Calcolo durata reale
          const start = new Date(b.start_time);
          const end = new Date(b.end_time);
          const durationHours = Math.round((end - start) / (1000 * 60 * 60)) || 1;

          return {
            ...b,
            parkingId: b.parking_lot_id,
            parkingName: b.parking_lot_name,
            date: b.start_time.split(' ')[0],
            // Mostriamo solo HH:mm togliendo i secondi
            time: b.start_time.split(' ')[1].substring(0, 5),
            duration: durationHours,
            price: parseFloat(b.price) || 0, // Prezzo reale dal DB
            displayStatus: statusIta,
            code: b.id.substring(0, 8).toUpperCase(),
            licensePlate: b.license_plate
          };
        });
        
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Errore sincronizzazione automatica:', error);
      }
    };
    
    // Primo caricamento immediato all'apertura
    loadData();

    // HEARTBEAT: Sincronizzazione automatica ogni 15 secondi
    // Mantiene aggiornati posti disponibili sulla mappa e stati prenotazioni
    const interval = setInterval(loadData, 15000); 
    
    // Cleanup per evitare memory leak quando l'utente esce dalla dashboard
    return () => clearInterval(interval);
  }, [user.id, refreshBookings]); // Scatta anche al cambio utente o refresh manuale

  const handleOpenBooking = (parking) => {
    setSelectedParking(parking);
  };

  const handleBookingSuccess = () => {
    setSelectedParking(null);
    setRefreshBookings(prev => prev + 1);
  };

  const handleCloseForm = () => {
    setSelectedParking(null);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleFocusOnParking = (parkingId) => {
    setFocusParkingId(parkingId);
    setTimeout(() => setFocusParkingId(null), 100);
  };

  return (
    <div className="min-h-screen bg-lib-dark flex flex-col">
      <Header title="Green Parking Brescia" user={user} onOpenSettings={handleOpenSettings} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gradient-to-r from-lib-primary to-lib-secondary rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 text-on-primary">Ciao, {user?.name}!</h2>
          <p className="opacity-90 text-on-primary">Gestisci le tue soste e contribuisci a una Brescia più verde e sostenibile.</p>
        </div>

        <section className="mb-10">
          <BookingList refreshTrigger={refreshBookings} />
        </section>

        <hr className="border-lib-border my-8" />

        <section>
          <h3 className="text-xl font-semibold text-primary mb-4">
            Parcheggi Disponibili a Brescia
          </h3>
          
          <div className="mb-8">
            <ParkingMap 
              parkings={parkings} 
              activeBookings={bookings.filter(b => b.status === 'ACTIVE')} 
              onSelectParking={handleOpenBooking} 
              onFullscreen={() => setIsMapFullscreen(true)}
              focusParkingId={focusParkingId}
            />
          </div>
          
          <ParkingList 
            onSelectParking={handleOpenBooking} 
            onFocusParking={handleFocusOnParking}
            refreshTrigger={refreshBookings} 
          />
        </section>

        {selectedParking && (
          <BookingForm 
            parking={selectedParking} 
            onSuccess={handleBookingSuccess} 
            onCancel={handleCloseForm}
          />
        )}

        {showSettings && (
          <AccountSettings onClose={() => setShowSettings(false)} />
        )}

        {isMapFullscreen && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 bg-lib-secondary border-b border-lib-border">
              <h2 className="text-xl font-bold text-primary">Mappa Parcheggi Brescia</h2>
              <button 
                onClick={() => setIsMapFullscreen(false)}
                className="text-2xl text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow">
              <ParkingMap parkings={parkings} onSelectParking={handleOpenBooking} isFullscreen={true} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;