import React, { useState, useContext, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { AuthContext } from '../../context/AuthContext';

const BookingForm = ({ parking, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [duration, setDuration] = useState('1');
  const [availableSpots, setAvailableSpots] = useState(null);
  const [dateTimeError, setDateTimeError] = useState('');

  // Polling ogni 30 secondi per ricalcolare i posti disponibili (per prenotazioni scadute)
  useEffect(() => {
    if (!date) return;

    const interval = setInterval(() => {
      // Ricalcola i posti disponibili, passando anche l'orario se selezionato
      let time = null;
      if (hour !== '' && minute !== '') {
        time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      const spots = mockApi.getAvailableSpotsForDate(parking.id, date, time);
      setAvailableSpots(spots);
    }, 30000);

    return () => clearInterval(interval);
  }, [date, hour, minute, parking.id]);

  // Calcola il prezzo della prenotazione
  const calculatePrice = () => {
    return (parseFloat(duration) * parking.hourlyRate).toFixed(2);
  };

  // Ottiene la data odierna in formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Ottiene l'ora corrente
  const getCurrentHour = () => new Date().getHours();
  const getCurrentMinute = () => new Date().getMinutes();

  // Verifica se la data/ora selezionata è valida (non nel passato)
  const isValidDateTime = (selectedDate, selectedHour, selectedMinute) => {
    const today = getTodayDate();
    const currentHour = getCurrentHour();
    const currentMinute = getCurrentMinute();

    // Se la data è nel passato
    if (selectedDate < today) {
      return false;
    }

    // Se è oggi, controlla se l'orario è nel passato
    if (selectedDate === today) {
      const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      if (selectedTimeInMinutes <= currentTimeInMinutes) {
        return false;
      }
    }

    return true;
  };

  const updateAvailableSpots = (selectedDate, selectedHour, selectedMinute) => {
    // Resetta l'errore
    setDateTimeError('');

    if (selectedDate) {
      const today = getTodayDate();
      
      // Se la data è nel passato
      if (selectedDate < today) {
        setDateTimeError('Non puoi prenotare per una data passata');
        setAvailableSpots(null);
        return;
      }

      // Se è oggi e abbiamo selezionato anche l'ora, controlla se è nel passato
      if (selectedDate === today && selectedHour !== '' && selectedMinute !== '') {
        const currentHour = getCurrentHour();
        const currentMinute = getCurrentMinute();
        const selectedTimeInMinutes = parseInt(selectedHour) * 60 + parseInt(selectedMinute);
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        if (selectedTimeInMinutes <= currentTimeInMinutes) {
          setDateTimeError('Non puoi prenotare per un orario già trascorso');
          setAvailableSpots(null);
          return;
        }
      }

      // Se la data è valida, mostra i posti disponibili
      // Passa anche l'orario se disponibile per considerare la scadenza delle prenotazioni
      let time = null;
      if (selectedHour !== '' && selectedMinute !== '') {
        time = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      }
      const spots = mockApi.getAvailableSpotsForDate(parking.id, selectedDate, time);
      setAvailableSpots(spots);
    } else {
      setAvailableSpots(null);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setHour('');
    setMinute('');
    updateAvailableSpots(newDate, '', '');
  };

  const handleHourChange = (e) => {
    setHour(e.target.value);
    updateAvailableSpots(date, e.target.value, minute);
  };

  const handleMinuteChange = (e) => {
    setMinute(e.target.value);
    updateAvailableSpots(date, hour, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const uniqueCode = `BS-${parking.id}-${Date.now().toString().slice(-4)}`;
    const price = calculatePrice();

    const newBooking = {
      userId: user.id,
      parkingId: parking.id,
      parkingName: parking.name,
      date: date,
      time: time,
      duration: parseInt(duration),
      price: parseFloat(price),
      code: uniqueCode,
      status: 'active'
    };

    mockApi.createBooking(newBooking);
    alert(`Prenotazione confermata! Il tuo codice è: ${uniqueCode}\nTotale: €${price}`);
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
              min={getTodayDate()}
              value={date} 
              onChange={handleDateChange} 
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
                  onChange={handleHourChange} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Ora</option>
                  {[...Array(24)].map((_, i) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    // Se è oggi, non mostrare ore che sono già passate
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
                  onChange={handleMinuteChange} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Min</option>
                  {[0, 15, 30, 45].map((m) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    const currentMinute = getCurrentMinute();
                    // Se è oggi e l'ora è quella corrente, non mostrare minuti che sono già passati
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

          {!dateTimeError && availableSpots !== null && (
            <div className={`p-3 rounded-md ${availableSpots > 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              {availableSpots > 0 ? (
                <p className="text-green-400 text-sm font-medium">
                  ✓ Posti disponibili: <strong>{availableSpots}</strong>
                </p>
              ) : (
                <p className="text-red-400 text-sm font-medium">
                  ✗ Nessun posto disponibile in questa data/orario
                </p>
              )}
            </div>
          )}

          {!dateTimeError && date && hour !== '' && minute !== '' && duration && (
            <div className="p-4 rounded-md bg-lib-secondary border border-lib-border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-tertiary">Tariffa oraria:</span>
                  <span className="text-primary font-semibold">€{parking.hourlyRate.toFixed(2)}/ora</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tertiary">Durata:</span>
                  <span className="text-primary font-semibold">{duration} {duration === '1' ? 'ora' : 'ore'}</span>
                </div>
                <div className="border-t border-lib-border pt-2 flex justify-between">
                  <span className="text-primary font-bold">Totale:</span>
                  <span className="text-green-400 font-bold text-lg">€{calculatePrice()}</span>
                </div>
              </div>
            </div>
          )}
          
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
              disabled={availableSpots === 0 || availableSpots === null || dateTimeError !== ''}
              className={`px-4 py-2 rounded-md shadow-sm transition-colors ${
                availableSpots === null || availableSpots === 0 || dateTimeError !== ''
                  ? 'bg-lib-secondary text-tertiary cursor-not-allowed'
                  : 'bg-lib-primary text-on-primary hover:opacity-90'
              }`}
            >
              {dateTimeError && 'Data/Orario non valido'}
              {!dateTimeError && availableSpots === 0 && 'Completo'}
              {!dateTimeError && availableSpots !== 0 && availableSpots !== null && 'Conferma Prenotazione'}
              {!dateTimeError && availableSpots === null && 'Seleziona data e orario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;