import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';

const ParkingList = ({ onSelectParking, onFocusParking, refreshTrigger }) => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParkings = async () => {
      try {
        setLoading(true);
        const data = await api.getParkingLots();
        
        // Adattiamo i dati del vero DB per la UI (aggiungiamo campi fittizi per l'estetica se mancano nel DB)
        const formattedData = data.map(p => ({
          ...p,
          address: "Brescia", // Non abbiamo l'indirizzo nel DB attuale, mettiamo un default
          co2: 150,
          hourlyRate: 1.50
        }));
        
        setParkings(formattedData);
      } catch (error) {
        console.error("Errore nel caricamento parcheggi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParkings();
  }, [refreshTrigger]);

  if (loading) return <div className="text-center p-4 text-tertiary">Caricamento parcheggi in corso...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Parcheggi Disponibili a Brescia
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((parking) => (
          <div key={parking.id} className="bg-lib-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between border border-lib-border">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-bold text-primary">{parking.name}</h4>
                {/* Etichetta Green */}
                <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  -{parking.co2}g CO2
                </span>
              </div>
              <p className="text-tertiary text-sm mt-1">{parking.address}</p>
            </div>

            <div className="mt-4">
              <div className="mb-4 p-3 bg-lib-secondary rounded-md border border-lib-border">
                <p className="text-sm text-tertiary">
                  Tariffa oraria: <span className="text-primary font-semibold">€{parking.hourlyRate.toFixed(2)}/ora</span>
                </p>
                <p className="text-sm text-tertiary mt-1">
                  Posti totali: <span className="text-primary font-semibold">{parking.total_spots}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onSelectParking(parking)}
                  className="flex-1 py-2 px-4 rounded-md font-medium transition-colors bg-lib-primary text-on-primary hover:opacity-90"
                >
                  Prenota Posto
                </button>
                <button 
                  onClick={() => onFocusParking(parking.id)}
                  className="py-2 px-4 rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  title="Visualizza sulla mappa"
                >
                  🗺️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;