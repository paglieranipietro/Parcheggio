import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ParkingList from '../components/user/ParkingList';
import BookingList from '../components/user/BookingList';
import BookingForm from '../components/user/BookingForm';
import AccountSettings from '../components/user/AccountSettings';
import ParkingMap from '../components/map/ParkingMap';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';

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
    const data = mockApi.getParkings();
    setParkings(data);
    
    // Carica le prenotazioni dell'utente
    const userBookings = mockApi.getBookingsByUserWithStatus(user.id);
    setBookings(userBookings);
  }, [user.id, refreshBookings]);

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
    // Reset dopo 100ms per permettere l'effetto di nuovo
    setTimeout(() => setFocusParkingId(null), 100);
  };

  return (
    <div className="min-h-screen bg-lib-dark flex flex-col">
      <Header title="Green Parking Brescia" user={user} onOpenSettings={handleOpenSettings} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intestazione Dashboard */}
        <div className="mb-8 bg-gradient-to-r from-lib-primary to-lib-secondary rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 text-on-primary">Ciao, {user?.name}!</h2>
          <p className="opacity-90 text-on-primary">Gestisci le tue soste e contribuisci a una Brescia più verde e sostenibile.</p>
        </div>

        {/* Sezione Prenotazioni Attive */}
        <section className="mb-10">
          <BookingList refreshTrigger={refreshBookings} />
        </section>

        {/* Separatore visivo */}
        <hr className="border-lib-border my-8" />

        {/* Sezione Ricerca Parcheggio */}
        <section>
          <h3 className="text-xl font-semibold text-primary mb-4">
            Parcheggi Disponibili a Brescia
          </h3>
          
          {/* Mappa */}
          <div className="mb-8">
            <ParkingMap 
              parkings={parkings} 
              activeBookings={bookings.filter(b => b.displayStatus === 'attiva')}
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

        {/* Modale */}
        {selectedParking && (
          <BookingForm 
            parking={selectedParking} 
            onSuccess={handleBookingSuccess} 
            onCancel={handleCloseForm}
          />
        )}

        {/* Impostazioni Account */}
        {showSettings && (
          <AccountSettings onClose={() => setShowSettings(false)} />
        )}

        {/* Modale Mappa Fullscreen */}
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