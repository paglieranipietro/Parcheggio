import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';

const EditBookingForm = ({ booking, onSuccess, onCancel }) => {
  const [date, setDate] = useState(booking.date);
  const [hour, setHour] = useState(parseInt(booking.time.split(':')[0]));
  const [minute, setMinute] = useState(parseInt(booking.time.split(':')[1]));
  const [duration, setDuration] = useState(booking.duration.toString());
  const [availableSpots, setAvailableSpots] = useState(null);
  const [dateTimeError, setDateTimeError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ottiene la data odierna in formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Ottiene l'ora corrente
  const getCurrentHour = () => new Date().getHours();
  const getCurrentMinute = () => new Date().getMinutes();

  // Calcola il prezzo della prenotazione
  const calculatePrice = () => {
    const parking = mockApi.getParkings().find(p => p.id === booking.parkingId);
    if (!parking) return '0.00';
    return (parseFloat(duration) * parking.hourlyRate).toFixed(2);
  };

  // Aggiorna i posti disponibili quando cambiano data/ora/durata
  useEffect(() => {
    if (!date) {
      setAvailableSpots(null);
      return;
    }

    const today = getTodayDate();
    
    // Validazione data nel passato
    if (date < today) {
      setDateTimeError('Non puoi prenotare per una data passata');
      setAvailableSpots(null);
      return;
    }

    // Validazione orario nel passato (se è oggi)
    if (date === today && hour !== '' && minute !== '') {
      const currentHour = getCurrentHour();
      const currentMinute = getCurrentMinute();
      const selectedTimeInMinutes = parseInt(hour) * 60 + parseInt(minute);
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      if (selectedTimeInMinutes <= currentTimeInMinutes) {
        setDateTimeError('Non puoi prenotare per un orario già trascorso');
        setAvailableSpots(null);
        return;
      }
    }

    // Resetta l'errore e calcola i posti disponibili
    setDateTimeError('');
    const time = hour !== '' && minute !== '' 
      ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      : null;

    const availability = mockApi.checkSlotAvailability(
      booking.parkingId,
      date,
      time,
      parseFloat(duration),
      booking.id // Escludi questa prenotazione dal conteggio
    );
    setAvailableSpots(availability);
  }, [date, hour, minute, duration, booking.parkingId, booking.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dateTimeError) {
      alert('Correggi gli errori prima di continuare');
      return;
    }

    if (!availableSpots || !availableSpots.available) {
      alert('Lo slot selezionato non è disponibile');
      return;
    }

    setIsLoading(true);
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const price = calculatePrice();

    const result = mockApi.updateBooking(booking.id, {
      date,
      time,
      duration: parseInt(duration),
      price: parseFloat(price)
    });

    setIsLoading(false);

    if (result.success) {
      alert(`Prenotazione modificata con successo!\nNuovo totale: €${price}`);
      onSuccess();
    } else {
      setUpdateError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-lib-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        <div className="bg-lib-primary px-6 py-4">
          <h3 className="text-lg font-bold text-primary">Modifica Prenotazione</h3>
          <p className="text-primary text-sm opacity-90">{booking.parkingName}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Data</label>
            <input 
              type="date" 
              required 
              min={getTodayDate()}
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
                  disabled={!date}
                  value={hour} 
                  onChange={(e) => setHour(parseInt(e.target.value))} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Ora</option>
                  {[...Array(24)].map((_, i) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    if (date === today && i < currentHour) {
                      return null;
                    }
                    return (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex-1">
                <select 
                  required 
                  disabled={!date || hour === ''}
                  value={minute} 
                  onChange={(e) => setMinute(parseInt(e.target.value))} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Min</option>
                  {[0, 15, 30, 45].map((m) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    const currentMinute = getCurrentMinute();
                    if (date === today && hour == currentHour && m <= currentMinute) {
                      return null;
                    }
                    return (
                      <option key={m} value={m}>
                        {String(m).padStart(2, '0')}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Durata Prenotazione</label>
            <select 
              required 
              disabled={!date || hour === '' || minute === ''}
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((h) => (
                <option key={h} value={h}>
                  {h} {h === 1 ? 'ora' : 'ore'}
                </option>
              ))}
            </select>
          </div>

          {dateTimeError && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">⚠️ {dateTimeError}</p>
            </div>
          )}

          {updateError && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">⚠️ {updateError}</p>
            </div>
          )}

          {!dateTimeError && availableSpots !== null && !availableSpots.available && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">
                ✗ Slot non disponibile. Posti liberi: {availableSpots.freeSpots}/{availableSpots.totalSpots}
              </p>
            </div>
          )}

          <div className="bg-lib-secondary p-3 rounded-lg border border-lib-border">
            <div className="flex justify-between">
              <span className="text-tertiary">Prezzo:</span>
              <span className="font-bold text-green-400">€{calculatePrice()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-lib-secondary text-secondary border border-lib-border rounded-lg hover:bg-lib-secondary/80 transition-colors font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!availableSpots?.available || dateTimeError || isLoading}
              className="flex-1 px-4 py-2 bg-lib-primary text-white rounded-lg hover:bg-lib-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...Modificando' : 'Modifica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingForm;
