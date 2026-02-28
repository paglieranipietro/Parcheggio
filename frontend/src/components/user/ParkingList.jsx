import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';

const ParkingList = ({ onSelectParking, refreshTrigger }) => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = mockApi.getParkings();
    setParkings(data);
    setLoading(false);
  }, [refreshTrigger]);

  if (loading) return <div className="text-center p-4 text-tertiary">Caricamento parcheggi...</div>;

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
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className={parking.freeSpots > 0 ? "text-secondary" : "text-red-500 font-bold"}>
                  Posti liberi: <strong className="text-lg">{parking.freeSpots}</strong>
                </span>
              </div>

              <button 
                onClick={() => onSelectParking(parking)}
                disabled={parking.freeSpots === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  parking.freeSpots > 0 
                    ? 'bg-lib-primary text-on-primary hover:opacity-90' 
                    : 'bg-lib-secondary text-tertiary cursor-not-allowed'
                }`}
              >
                {parking.freeSpots > 0 ? 'Prenota Posto' : 'Completo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;