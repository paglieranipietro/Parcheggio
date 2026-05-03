import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EditBookingForm = ({ booking, onSuccess, onCancel }) => {
  const [date, setDate] = useState(booking.date);
  const [hour, setHour] = useState(parseInt(booking.time.split(':')[0]));
  const [minute, setMinute] = useState(parseInt(booking.time.split(':')[1]));
  const [duration, setDuration] = useState(booking.duration.toString());
  
  const [availableSpots, setAvailableSpots] = useState(null);
  const [dateTimeError, setDateTimeError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // NUOVO: Stato per salvare la tariffa oraria
  const [hourlyRate, setHourlyRate] = useState(0);

  // 1. Recuperiamo la tariffa oraria del parcheggio UNA SOLA VOLTA all'avvio
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const parkings = await api.getParkingLots();
        const parking = parkings.find(p => p.id === booking.parkingId);
        if (parking) {
          setHourlyRate(parking.hourly_rate || parking.hourlyRate || 0);
        }
      } catch (error) {
        console.error('Errore nel recupero tariffa:', error);
      }
    };
    fetchRate();
  }, [booking.parkingId]);

  // 2. Calcolo prezzo SINCRONO (senza async/await, non rompe più React!)
  const calculatePrice = () => {
    return (parseFloat(duration) * hourlyRate).toFixed(2);
  };

  // 3. Controllo Reale della disponibilità (Uguale a quello robusto del BookingForm)
  useEffect(() => {
    let isMounted = true;

    const checkAvailability = async () => {
      if (!date || hour === '' || minute === '' || !duration) {
        if (isMounted) setAvailableSpots(null);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      if (date < today) {
        if (isMounted) setDateTimeError('Non puoi prenotare per una data passata');
        return;
      }

      if (date === today) {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const selectedTimeInMinutes = parseInt(hour) * 60 + parseInt(minute);
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        if (selectedTimeInMinutes <= currentTimeInMinutes) {
          if (isMounted) setDateTimeError('Non puoi prenotare per un orario già trascorso');
          return;
        }
      }

      if (isMounted) setDateTimeError('');

      try {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        // Interroghiamo il database reale!
        const spots = await api.getAvailableSpotsForDateTime(
          booking.parkingId, 
          date, 
          time,
          parseFloat(duration)
        );
        if (isMounted) setAvailableSpots(spots);
      } catch (error) {
        console.error("Errore disponibilità:", error);
      }
    };

    checkAvailability();
  }, [date, hour, minute, duration, booking.parkingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateTimeError) {
      alert('Correggi gli errori prima di continuare');
      return;
    }

    if (!availableSpots || !availableSpots.available) {
      alert('Lo slot selezionato non è disponibile in questo orario');
      return;
    }

    setIsLoading(true);
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const finalPrice = calculatePrice();

    try {
      await api.updateBooking(booking.id, {
        parkingId: booking.parkingId,
        date,
        time,
        duration: parseInt(duration),
        price: parseFloat(finalPrice),
        licensePlate: booking.licensePlate
      });
      onSuccess(); // Chiude il form in automatico
    } catch (error) {
      setUpdateError(`Errore: ${error.message}`);
    } finally {
      setIsLoading(false);
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
              min={new Date().toISOString().split('T')[0]}
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
                    const today = new Date().toISOString().split('T')[0];
                    if (date === today && i < new Date().getHours()) return null;
                    return <option key={i} value={i}>{String(i).padStart(2, '0')}</option>;
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
                    const today = new Date().toISOString().split('T')[0];
                    if (date === today && hour === new Date().getHours() && m <= new Date().getMinutes()) return null;
                    return <option key={m} value={m}>{String(m).padStart(2, '0')}</option>;
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

          {/* Feedback Errori e Disponibilità */}
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

          {!dateTimeError && availableSpots !== null && (
            <div className={`p-3 rounded-md ${availableSpots.available ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              {availableSpots.available ? (
                <p className="text-green-400 text-sm font-medium">
                  ✓ Posti disponibili: <strong>{availableSpots.spots}/{availableSpots.total_spots}</strong>
                </p>
              ) : (
                <p className="text-red-400 text-sm font-medium">
                  ✗ Slot non disponibile in questo orario.
                </p>
              )}
            </div>
          )}

          <div className="bg-lib-secondary p-3 rounded-lg border border-lib-border">
            <div className="flex justify-between items-center">
              <span className="text-tertiary">Nuovo Prezzo:</span>
              <span className="font-bold text-green-400 text-lg">€{calculatePrice()}</span>
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
              className="flex-1 px-4 py-2 bg-lib-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvataggio...' : 'Conferma Modifica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingForm;