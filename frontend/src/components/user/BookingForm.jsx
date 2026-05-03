import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingForm = ({ parking, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [duration, setDuration] = useState('1');
  const [availableSpots, setAvailableSpots] = useState(null);
  /**
   * Contiene i dati di disponibilità dal database: {available, spots, total_spots}
   */
  const [dateTimeError, setDateTimeError] = useState('');
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);

  // Le targhe arrivano dall'AuthContext aggiornato, non serve ricaricarle!
  const licensePlates = user?.licensePlates || [];
  const selectedPlate = licensePlates.find(p => p.isSelected);

  // Ottiene la data odierna
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentHour = () => new Date().getHours();
  const getCurrentMinute = () => new Date().getMinutes();

  // Effettua la vera chiamata al backend (Sostituisce il vecchio polling parziale e l'updateAvailableSpots finto)
  useEffect(() => {
    let isMounted = true;

    const checkAvailability = async () => {
      // Non controllare se non abbiamo tutti i dati temporali
      if (!date || hour === '' || minute === '' || !duration) {
        if (isMounted) {
          setAvailableSpots(null);
          setDateTimeError('');
        }
        return;
      }

      const today = getTodayDate();
      
      // Controllo lato client per evitare chiamate inutili al DB
      if (date < today) {
        if (isMounted) setDateTimeError('Non puoi prenotare per una data passata');
        return;
      }

      if (date === today) {
        const selectedTimeInMinutes = parseInt(hour) * 60 + parseInt(minute);
        const currentTimeInMinutes = getCurrentHour() * 60 + getCurrentMinute();
        
        if (selectedTimeInMinutes <= currentTimeInMinutes) {
          if (isMounted) setDateTimeError('Non puoi prenotare per un orario già trascorso');
          return;
        }
      }

      // Se superiamo i controlli locali, chiediamo al Database!
      if (isMounted) {
        setDateTimeError('');
        setIsLoadingSpots(true);
      }

      try {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        // La nostra nuova magica rotta backend in azione
        const spots = await api.getAvailableSpotsForDateTime(
          parking.id, 
          date, 
          time,
          parseFloat(duration)
        );
        
        if (isMounted) {
          setAvailableSpots(spots); // spots = { available: true/false, spots: X, total_spots: Y }
        }
      } catch (error) {
        console.error("Errore verifica disponibilità:", error);
        if (isMounted) setDateTimeError('Impossibile verificare la disponibilità');
      } finally {
        if (isMounted) setIsLoadingSpots(false);
      }
    };

    checkAvailability();

    // Rimuoviamo il polling di 30 secondi che crea solo sovraccarico 
    // e facciamo scattare il controllo solo quando l'utente cambia parametri vitali.
  }, [date, hour, minute, duration, parking.id]);

  const calculatePrice = () => {
    // Gestione unificata di hourly_rate (DB snake_case) vs hourlyRate (frontend camelCase)
    const rate = parking.hourly_rate || parking.hourlyRate || 0;
    return (parseFloat(duration) * rate).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlate) {
      alert('⚠️ Errore: Devi selezionare una targa prima di prenotare.');
      return;
    }

    if (dateTimeError || !availableSpots || !availableSpots.available) {
      alert('Impossibile procedere: slot non disponibile o orario non valido.');
      return;
    }

    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const price = calculatePrice();

    const newBooking = {
      parkingId: parking.id,
      date: date,
      time: time,
      duration: parseInt(duration),
      price: parseFloat(price),
      licensePlate: selectedPlate.plate // Prende la targa dall'oggetto salvato nel db
    };

    try {
      await api.createBooking(newBooking);
      onSuccess();
    } catch (error) {
      alert(`Errore: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-lib-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        <div className="bg-lib-primary px-6 py-4">
          <h3 className="text-lg font-bold text-primary">Prenota: {parking.name}</h3>
          <p className="text-primary text-sm opacity-90">Inserisci i dettagli del tuo arrivo</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ... LA TUA SEZIONE TARGHE IDENTICA A PRIMA ... */}
          {!selectedPlate && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">⚠️ Devi selezionare una targa prima di prenotare. Accedi alle impostazioni per aggiungere una targa.</p>
            </div>
          )}

          {selectedPlate && (
            <div className="p-3 rounded-md bg-lib-primary/20 border border-lib-primary">
              <p className="text-tertiary text-xs mb-1">Targa selezionata:</p>
              <p className="text-lib-primary font-mono font-bold text-lg">{selectedPlate.plate}</p>
            </div>
          )}

          {/* ... I TUOI INPUT DI DATA E ORA IDENTICI A PRIMA ... */}
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
                  onChange={(e) => setHour(e.target.value)} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Ora</option>
                  {[...Array(24)].map((_, i) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    if (date === today && i < currentHour) return null;
                    return <option key={i} value={i}>{String(i).padStart(2, '0')}</option>;
                  })}
                </select>
              </div>
              <div className="flex-1">
                <select 
                  required 
                  disabled={!date || hour === ''}
                  value={minute} 
                  onChange={(e) => setMinute(e.target.value)} 
                  className="w-full bg-lib-secondary border border-lib-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-lib-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Min</option>
                  {[0, 15, 30, 45].map((m) => {
                    const today = getTodayDate();
                    const currentHour = getCurrentHour();
                    const currentMinute = getCurrentMinute();
                    if (date === today && hour == currentHour && m <= currentMinute) return null;
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

          {/* ... NUOVA SEZIONE FEEDBACK ... */}
          {dateTimeError && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">⚠️ {dateTimeError}</p>
            </div>
          )}

          {isLoadingSpots && !dateTimeError && (
            <div className="p-3 text-center text-tertiary text-sm animate-pulse">
              Verifica disponibilità in corso...
            </div>
          )}

          {!isLoadingSpots && !dateTimeError && availableSpots !== null && (
            <div className={`p-3 rounded-md ${availableSpots.available ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              {availableSpots.available ? (
                <p className="text-green-400 text-sm font-medium">
                  ✓ Posti disponibili: <strong>{availableSpots.spots}/{availableSpots.total_spots}</strong>
                </p>
              ) : (
                <p className="text-red-400 text-sm font-medium">
                  ✗ Parcheggio al completo per la fascia oraria selezionata.
                </p>
              )}
            </div>
          )}

          {!dateTimeError && availableSpots?.available && (
            <div className="p-4 rounded-md bg-lib-secondary border border-lib-border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-tertiary">Tariffa oraria:</span>
                  <span className="text-primary font-semibold">€{Number(parking.hourly_rate || parking.hourlyRate || 0).toFixed(2)}/ora</span>
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
              // Abilitiamo il pulsante SOLO se la targa c'è, non ci sono errori e il DB dice che ci sono posti!
              disabled={!selectedPlate || !availableSpots?.available || dateTimeError !== '' || isLoadingSpots}
              className={`px-4 py-2 rounded-md shadow-sm transition-colors ${
                !selectedPlate || !availableSpots?.available || dateTimeError !== '' || isLoadingSpots
                  ? 'bg-lib-secondary text-tertiary cursor-not-allowed'
                  : 'bg-lib-primary text-on-primary hover:opacity-90'
              }`}
            >
              {!selectedPlate && 'Aggiungi una targa'}
              {selectedPlate && dateTimeError && 'Orario non valido'}
              {selectedPlate && !dateTimeError && availableSpots && !availableSpots.available && 'Completo'}
              {selectedPlate && !dateTimeError && (!availableSpots || isLoadingSpots) && 'Seleziona orario'}
              {selectedPlate && !dateTimeError && availableSpots?.available && !isLoadingSpots && 'Conferma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;