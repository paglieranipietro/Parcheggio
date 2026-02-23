import React, { useState, useContext } from 'react';
import Header from '../components/layout/Header';
import ParkingList from '../components/user/ParkingList';
import BookingList from '../components/user/BookingList';
import BookingForm from '../components/user/BookingForm';
import AccountSettings from '../components/user/AccountSettings';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshBookings, setRefreshBookings] = useState(0);

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

  return (
    <div className="min-h-screen bg-lib-dark flex flex-col">
      <Header title="Green Parking Brescia" user={user} onOpenSettings={() => setShowSettings(true)} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intestazione Dashboard */}
        <div className="mb-8 bg-gradient-to-r from-lib-primary to-lib-secondary rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 text-on-primary">Benvenuto, {user?.name}!</h2>
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
          <ParkingList onSelectParking={handleOpenBooking} />
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
      </main>
    </div>
  );
};

export default UserDashboard;