import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminStats({ selectedParking }) {
    const [stats, setStats] = useState({ total_spots: 0, occupied_spots: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (selectedParking) {
            setLoading(true);
            api.getParkingStats(selectedParking.id)
                .then(data => {
                    if (isMounted) {
                        setStats(data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error("Errore statistiche:", err);
                    if (isMounted) setLoading(false);
                });
        }

        return () => { isMounted = false; };
    }, [selectedParking]);

    if (!selectedParking) {
        return (
            <div className="mt-6 bg-lib-card rounded-lg p-6 border border-lib-border shadow transition-colors duration-300">
                <h3 className="text-lg font-semibold text-primary mb-4">Statistiche</h3>
                <p className="text-tertiary text-center py-8">Seleziona un parcheggio per vedere le statistiche</p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-lib-card rounded-lg p-6 border border-lib-border shadow transition-colors duration-300">
            <h3 className="text-lg font-semibold text-primary mb-2">Statistiche in Tempo Reale</h3>
            <p className="text-sm text-secondary mb-4">Parcheggio: <span className="font-semibold text-primary">{selectedParking.name}</span></p>

            {loading ? (
                <div className="flex justify-center py-4">
                    <p className="text-tertiary animate-pulse">Calcolo auto presenti in corso...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {/* Posti Disponibili */}
                    <div className="bg-lib-secondary rounded-lg p-4 shadow-sm border border-lib-border">
                        <p className="text-secondary text-sm font-medium mb-1">Liberi Ora</p>
                        <p className="text-3xl font-bold text-green-400">
                            {Math.max(0, stats.total_spots - stats.occupied_spots)}
                        </p>
                    </div>

                    {/* Posti Occupati */}
                    <div className="bg-lib-secondary rounded-lg p-4 shadow-sm border border-lib-border relative overflow-hidden">
                        <p className="text-secondary text-sm font-medium mb-1">Occupati Ora</p>
                        <p className="text-3xl font-bold text-red-400 relative z-10">{stats.occupied_spots}</p>
                        
                        {/* Barra di progresso visiva opzionale */}
                        <div 
                            className="absolute bottom-0 left-0 h-1 bg-red-500/50 transition-all duration-500" 
                            style={{ width: `${stats.total_spots > 0 ? (stats.occupied_spots / stats.total_spots) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}