import React, { useState, useEffect, useContext } from 'react';
import { mockApi } from '../../services/mockApi';
import { AuthContext } from '../../context/AuthContext';

const BookingList = ({ refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    const userBookings = mockApi.getBookingsByUser(user.id);
    setBookings(userBookings);
  }, [user.id, refreshTrigger]);

  const handleCancel = (bookingId) => {
    if (window.confirm("Sei sicuro di voler cancellare la prenotazione?")) {
      mockApi.deleteBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.code.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="bg-lib-card rounded-lg shadow overflow-hidden border border-lib-border">
      <div className="px-6 py-4 border-b border-lib-border bg-lib-secondary">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-primary">Le tue Prenotazioni</h3>
          <span className="text-sm text-tertiary">{filteredBookings.length} di {bookings.length}</span>
        </div>
        <input
          type="text"
          placeholder="Cerca per codice univoco..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-lib-card border border-lib-border text-primary placeholder-tertiary focus:outline-none focus:border-lib-primary transition-colors"
        />
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-lib-primary/20 text-lib-primary border border-lib-primary/50 select-all font-mono">
                      {booking.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Cancella
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;