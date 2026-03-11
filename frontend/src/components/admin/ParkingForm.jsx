import React, { useState, useEffect } from 'react';
import AdminStats from './AdminStats';
import ParkingTable from './ParkingTable';
import { mockApi } from '../../services/mockApi';

export default function ParkingForm() {
    const [parkings, setParkings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedParkingToRemove, setSelectedParkingToRemove] = useState('');
    const [selectedParking, setSelectedParking] = useState(null);

    // Form state per aggiungere parcheggi
    const [formData, setFormData] = useState({
        name: '',
        maxSpots: '',
        description: '',
        address: '',
        hourlyRate: ''
    });

    // Carica i parcheggi all'avvio usando il nostro mockApi
    useEffect(() => {
        // Adattiamo i dati per la tabella del collega che usa "maxSpots" invece di "totalSpots"
        const loadedParkings = mockApi.getParkings().map(p => ({
            ...p,
            maxSpots: p.totalSpots
        }));
        setParkings(loadedParkings);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddParking = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.maxSpots || !formData.address || !formData.hourlyRate) {
            alert('Per favore, compila tutti i campi obbligatori');
            return;
        }

        const newParking = {
            name: formData.name,
            totalSpots: parseInt(formData.maxSpots), // mockApi vuole totalSpots
            freeSpots: parseInt(formData.maxSpots),
            description: formData.description,
            address: formData.address,
            hourlyRate: parseFloat(formData.hourlyRate)
        };

        // Salva nel mockApi
        mockApi.addParking(newParking);

        // Aggiorna la UI
        const updated = mockApi.getParkings().map(p => ({ ...p, maxSpots: p.totalSpots }));
        setParkings(updated);

        setFormData({ name: '', maxSpots: '', description: '', address: '', hourlyRate: '' });
        setShowAddModal(false);
    };

    const handleRemoveParking = (e) => {
        e.preventDefault();

        if (!selectedParkingToRemove) {
            alert('Per favore, seleziona un parcheggio');
            return;
        }

        if (selectedParking?.id.toString() === selectedParkingToRemove) {
            setSelectedParking(null);
        }

        // Rimuove dal mockApi
        mockApi.deleteParking(parseInt(selectedParkingToRemove));

        // Aggiorna la UI
        const updated = mockApi.getParkings().map(p => ({ ...p, maxSpots: p.totalSpots }));
        setParkings(updated);

        setSelectedParkingToRemove('');
        setShowRemoveModal(false);
    };

    return (
        <div className="flex gap-6 w-full">
            {/* Colonna Sinistra: Gestione Parcheggi */}
            <div className="w-96 bg-white rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestione Parcheggi</h2>

                {/* Elenco parcheggi */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Parcheggi</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-200 text-sm"
                            >
                                + Aggiungi
                            </button>
                            <button
                                onClick={() => setShowRemoveModal(true)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-200 text-sm"
                            >
                                - Rimuovi
                            </button>
                        </div>
                    </div>
                    <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto h-52">
                        {parkings.length === 0 ? (
                            <p className="text-gray-400 text-center py-8 text-sm">Nessun parcheggio aggiunto</p>
                        ) : (
                            <ul className="block">
                                {parkings.map(parking => (
                                    <li
                                        key={parking.id}
                                        onClick={() => setSelectedParking(parking)}
                                        className={`block px-4 py-3 border-b border-gray-200 text-sm cursor-pointer transition-colors ${selectedParking?.id === parking.id
                                                ? 'bg-blue-100 text-blue-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {parking.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Modal Aggiungi Parcheggio */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
                        <div className="bg-white rounded-lg p-8 max-w-md w-11/12 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Aggiungi Nuovo Parcheggio</h3>
                            <form onSubmit={handleAddParking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Parcheggio *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Numero Posti Massimi *</label>
                                    <input type="number" name="maxSpots" value={formData.maxSpots} onChange={handleInputChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Indirizzo *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tariffa Oraria (€) *</label>
                                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">Aggiungi</button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Rimuovi Parcheggio */}
                {showRemoveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRemoveModal(false)}>
                        <div className="bg-white rounded-lg p-8 max-w-md w-11/12 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Rimuovi Parcheggio</h3>
                            <form onSubmit={handleRemoveParking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seleziona Parcheggio *</label>
                                    <select value={selectedParkingToRemove} onChange={(e) => setSelectedParkingToRemove(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                                        <option value="">-- Seleziona un parcheggio --</option>
                                        {parkings.map(parking => (
                                            <option key={parking.id} value={parking.id}>{parking.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Rimuovi</button>
                                    <button type="button" onClick={() => setShowRemoveModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <AdminStats selectedParking={selectedParking} />
            </div>

            {/* Colonna Destra: Parking Table */}
            <div className="flex-1">
                <ParkingTable selectedParking={selectedParking} />
            </div>
        </div>
    );
}