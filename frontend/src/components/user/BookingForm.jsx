import React, { useState, useContext } from 'react';
import { mockApi } from '../../services/mockApi';
import { AuthContext } from '../../context/AuthContext';

const BookingForm = ({ parking, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const uniqueCode = `BS-${parking.id}-${Date.now().toString().slice(-4)}`;

    const newBooking = {
      userId: user.id,
      parkingId: parking.id,
      parkingName: parking.name,
      date: date,
      time: time,
      code: uniqueCode,
      status: 'active'
    };

    mockApi.createBooking(newBooking);
    alert(`Prenotazione confermata! Il tuo codice è: ${uniqueCode}`);
    onSuccess();
  };

  return (
    // Overlay scuro che copre tutto lo schermo
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      {/* Contenuto del Modale */}
      <div className="bg-lib-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        <div className="bg-lib-primary px-6 py-4">
          <h3 className="text-lg font-bold text-primary">Prenota: {parking.name}</h3>
          <p className="text-primary text-sm opacity-90">Inserisci i dettagli del tuo arrivo</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Data</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Orario Arrivo</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <select 
                  required 
                  value={hour} 
                  onChange={(e) => setHour(e.target.value)} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select 
                  required 
                  value={minute} 
                  onChange={(e) => setMinute(e.target.value)} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent"
                >
                  {[0, 15, 30, 45].map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-lib-border">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 bg-lib-secondary text-primary border border-lib-border rounded-md hover:bg-lib-secondary/80 transition-colors"
            >
              Annulla
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-lib-primary text-on-primary rounded-md hover:opacity-90 shadow-sm transition-colors"
            >
              Conferma Prenotazione
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;