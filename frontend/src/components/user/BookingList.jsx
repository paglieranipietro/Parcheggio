import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';
import { useAuth } from '../../context/AuthContext';
import EditBookingForm from './EditBookingForm';

const BookingList = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('tutti');

  const loadBookings = async () => {
    try {
      const data = await api.getUserReservations(); 
      const formattedData = data.map(b => ({
        id: b.id,
        parkingName: b.parking_lot_name,
        date: b.start_time.split(' ')[0],
        time: b.start_time.split(' ')[1],
        duration: 1, 
        licensePlate: b.license_plate,
        price: 0, 
        displayStatus: b.status.toLowerCase(),
        code: b.id.substring(0, 8).toUpperCase()
      }));
      setBookings(formattedData);
    } catch (err) {
      console.error("Errore nel caricamento", err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [refreshTrigger]);

  const handleCancel = async (bookingId) => {
    if (window.confirm("Sei sicuro di voler cancellare la prenotazione?")) {
      try {
        await api.deleteBooking(bookingId);
        loadBookings();
      } catch (err) {
        alert("Errore durante la cancellazione");
      }
    }
  };

  const handleEditClick = (bookingId) => {
    setEditingBookingId(bookingId);
  };

  const handleEditSuccess = () => {
    setEditingBookingId(null);
    loadBookings();
  };

  const handleEditCancel = () => {
    setEditingBookingId(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesCode = booking.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesStatus = statusFilter === 'tutti' || booking.displayStatus === statusFilter;
    return matchesCode && matchesStatus;
  });

  // ... da qui mantieni il tuo return ( ... ) con la tabella HTML
  return (
    <div className="bg-lib-card rounded-lg shadow overflow-hidden border border-lib-border">
      <div className="px-6 py-4 border-b border-lib-border bg-lib-secondary">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-primary">Le tue Prenotazioni</h3>
          <span className="text-sm text-tertiary">{filteredBookings.length} di {bookings.length}</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Cerca per codice univoco..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-lib-card border border-lib-border text-primary placeholder-tertiary focus:outline-none focus:border-lib-primary transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-lib-card border border-lib-border text-primary focus:outline-none focus:border-lib-primary transition-colors whitespace-nowrap"
          >
            <option value="tutti">Tutti gli stati</option>
            <option value="attiva">Attive</option>
            <option value="scaduta">Scadute</option>
            <option value="annullata">Annullate</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 && searchCode ? (
        <div className="p-8 text-center text-tertiary">
          Nessuna prenotazione trovata per il codice "{searchCode}".
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-8 text-center text-tertiary">
          Nessuna prenotazione attiva al momento.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-lib-border">
            <thead className="bg-lib-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Parcheggio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Data/Ora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Durata</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Targa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Prezzo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Codice Univoco</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-tertiary uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-lib-card divide-y divide-lib-border">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-lib-secondary/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {booking.parkingName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {booking.date} <span className="text-tertiary">|</span> {booking.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {booking.duration} {booking.duration === 1 ? 'ora' : 'ore'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-mono font-bold text-lib-primary">{booking.licensePlate || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                    €{booking.price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize ${
                      booking.displayStatus === 'attiva'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : booking.displayStatus === 'scaduta'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {booking.displayStatus === 'attiva' && '🟢 '}
                      {booking.displayStatus === 'scaduta' && '⏱️ '}
                      {booking.displayStatus === 'annullata' && '❌ '}
                      {booking.displayStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-lib-primary/20 text-lib-primary border border-lib-primary/50 select-all font-mono">
                      {booking.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleEditClick(booking.id)}
                        disabled={booking.displayStatus !== 'attiva'}
                        className={`font-medium transition-colors ${
                          booking.displayStatus === 'attiva'
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        disabled={booking.displayStatus === 'annullata'}
                        className={`font-medium transition-colors ${
                          booking.displayStatus !== 'annullata'
                            ? 'text-red-500 hover:text-red-400'
                            : 'text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Cancella
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Modifica Prenotazione */}
      {editingBookingId && bookings.length > 0 && (
        <EditBookingForm 
          booking={bookings.find(b => b.id === editingBookingId)}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default BookingList;