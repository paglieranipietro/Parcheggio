import React, { useState, useEffect } from 'react';
import AdminStats from './AdminStats';
import ParkingTable from './ParkingTable';
import api from '../../services/api';

export default function ParkingForm() {
    const [parkings, setParkings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedParkingToRemove, setSelectedParkingToRemove] = useState('');
    const [selectedParking, setSelectedParking] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Form state per aggiungere parcheggi
    const [formData, setFormData] = useState({
        name: '',
        maxSpots: '',
        description: '',
        address: '',
        hourlyRate: ''
    });

    // Carica i parcheggi all'avvio usando il nostro api
    useEffect(() => {
        const loadParkings = async () => {
            try {
                // Adattiamo i dati per la tabella del collega che usa "maxSpots" invece di "totalSpots"
                const loadedParkings = await api.getParkingLots().then(data =>
                    data.map(p => ({
                        ...p,
                        maxSpots: p.totalSpots || p.total_spots || 0
                    }))
                );
                setParkings(loadedParkings);
            } catch (error) {
                console.error('Errore nel caricamento parcheggi:', error);
            }
        };
        loadParkings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddParking = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.maxSpots || !formData.address || !formData.hourlyRate) {
            return;
        }

        try {
            // 1. GEOCODING: Trasformiamo l'indirizzo in coordinate GPS usando OpenStreetMap
            let lat = 45.5415; // Default Brescia
            let lng = 10.2160;
            
            try {
                // Cerchiamo l'indirizzo (aggiungiamo "Brescia" se non c'è, per aiutare la ricerca)
                const searchQuery = formData.address.toLowerCase().includes('brescia') 
                    ? formData.address 
                    : `${formData.address}, Brescia, Italy`;
                    
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
                const geoData = await geoRes.json();

                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lng = parseFloat(geoData[0].lon); // Nominatim lo chiama 'lon'
                } else {
                    console.warn('Coordinate non trovate per questo indirizzo, uso il default.');
                }
            } catch (geoError) {
                console.error('Errore nel geocoding:', geoError);
            }

            // 2. Prepariamo l'oggetto COMPLETO da mandare al backend
            const newParking = {
                name: formData.name,
                totalSpots: parseInt(formData.maxSpots), 
                freeSpots: parseInt(formData.maxSpots),
                description: formData.description,
                address: formData.address,
                hourlyRate: parseFloat(formData.hourlyRate),
                lat: lat, // Ora passiamo le coordinate!
                lng: lng,
                co2: 120 // Un valore di default realistico per il risparmio CO2
            };

            // 3. Inviamo al server
            await api.addParking(newParking);
            
            // Aggiorna la UI
            const updated = await api.getParkingLots();
            const formattedParkings = updated.map(p => ({ ...p, maxSpots: p.totalSpots || p.total_spots || 0 }));
            setParkings(formattedParkings);
            
            // Svuota e chiudi silenziosamente
            setFormData({ name: '', maxSpots: '', description: '', address: '', hourlyRate: '' });
            setShowAddModal(false);
        } catch (error) {
            console.error(`Errore durante l'aggiunta: ${error.message}`);
        }
    };

    const handleRemoveParking = async (e) => {
        e.preventDefault();

        if (!selectedParkingToRemove) {
            return;
        }

        if (selectedParking?.id.toString() === selectedParkingToRemove) {
            setSelectedParking(null);
        }

        try {
            await api.deleteParking(parseInt(selectedParkingToRemove));
            
            // Aggiorna la UI
            const updated = await api.getParkingLots();
            const formattedParkings = updated.map(p => ({ ...p, maxSpots: p.totalSpots || p.total_spots || 0 }));
            setParkings(formattedParkings);
            
            // Resetta e chiudi la modale silenziosamente
            setSelectedParkingToRemove('');
            setShowRemoveModal(false);
        } catch (error) {
            // Niente più alert, loggiamo l'errore solo in console per debug
            console.error(`Errore durante l'eliminazione: ${error.message}`);
        }
    };

    const handleOpenEdit = () => {
        if (!selectedParking) return; // Sicurezza
        
        // Pre-popoliamo il form con i dati attuali del parcheggio selezionato
        setFormData({
            name: selectedParking.name,
            maxSpots: selectedParking.total_spots || selectedParking.maxSpots || '',
            description: selectedParking.description || '',
            address: selectedParking.address || '',
            hourlyRate: selectedParking.hourly_rate || selectedParking.hourlyRate || ''
        });
        setShowEditModal(true);
    };

    const handleEditParking = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.maxSpots || !formData.address || !formData.hourlyRate) return;

        try {
            // 1. GEOCODING (come nell'aggiunta)
            let lat = selectedParking.lat; // Default a quelli vecchi
            let lng = selectedParking.lng;
            
            // Ricalcoliamo le coordinate solo se l'indirizzo è stato cambiato
            if (formData.address !== selectedParking.address) {
                try {
                    const searchQuery = formData.address.toLowerCase().includes('brescia') 
                        ? formData.address : `${formData.address}, Brescia, Italy`;
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
                    const geoData = await geoRes.json();

                    if (geoData && geoData.length > 0) {
                        lat = parseFloat(geoData[0].lat);
                        lng = parseFloat(geoData[0].lon);
                    }
                } catch (geoError) {
                    console.error('Errore geocoding in modifica:', geoError);
                }
            }

            // 2. Prepariamo i dati
            const updatedData = {
                name: formData.name,
                total_spots: parseInt(formData.maxSpots), 
                address: formData.address,
                lat: lat,
                lng: lng,
                hourly_rate: parseFloat(formData.hourlyRate),
                co2: selectedParking.co2 || 120
            };

            // 3. Inviamo al server
            await api.updateParking(selectedParking.id, updatedData);
            
            // 4. Aggiorna UI
            const updated = await api.getParkingLots();
            const formattedParkings = updated.map(p => ({ ...p, maxSpots: p.totalSpots || p.total_spots || 0 }));
            setParkings(formattedParkings);
            
            // Chiudi silenziosamente e aggiorna il parcheggio selezionato
            setShowEditModal(false);
            setSelectedParking(formattedParkings.find(p => p.id === selectedParking.id));
        } catch (error) {
            console.error(`Errore durante la modifica: ${error.message}`);
        }
    };

    return (
        <div className="flex gap-6 w-full">
            {/* Colonna Sinistra: Gestione Parcheggi */}
            <div className="w-96 bg-lib-card rounded-lg shadow p-6 flex flex-col border border-lib-border transition-colors duration-300">
                <h2 className="text-2xl font-bold text-primary mb-6">Gestione Parcheggi</h2>

                {/* Elenco parcheggi */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-secondary">Parcheggi</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-green-500 hover:bg-green-600 text-on-primary font-semibold py-1 px-2 rounded-lg transition-colors duration-200 text-xs"
                            >
                                + Aggiungi
                            </button>
                            <button
                                onClick={handleOpenEdit}
                                className="bg-blue-500 hover:bg-blue-600 text-on-primary font-semibold py-1 px-2 rounded-lg transition-colors duration-200 text-xs"
                            >
                                * Modifica
                            </button>
                            <button
                                onClick={() => setShowRemoveModal(true)}
                                className="bg-red-500 hover:bg-red-600 text-on-primary font-semibold py-1 px-2 rounded-lg transition-colors duration-200 text-xs"
                            >
                                - Rimuovi
                            </button>
                        </div>
                    </div>
                    <div className="border border-lib-border rounded-lg bg-lib-secondary overflow-y-auto h-52">
                        {parkings.length === 0 ? (
                            <p className="text-tertiary text-center py-8 text-sm">Nessun parcheggio aggiunto</p>
                        ) : (
                            <ul className="block">
                                {parkings.map(parking => (
                                    <li
                                        key={parking.id}
                                        onClick={() => setSelectedParking(parking)}
                                        className={`block px-4 py-3 border-b border-lib-border text-sm cursor-pointer transition-colors ${selectedParking?.id === parking.id
                                                ? 'bg-lib-primary text-on-primary font-medium'
                                                : 'text-secondary hover:bg-lib-card'
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
                        <div className="bg-lib-card rounded-lg p-8 max-w-md w-11/12 shadow-xl border border-lib-border" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-primary mb-6">Aggiungi Nuovo Parcheggio</h3>
                            <form onSubmit={handleAddParking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Nome Parcheggio *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Numero Posti Massimi *</label>
                                    <input type="number" name="maxSpots" value={formData.maxSpots} onChange={handleInputChange} min="1" className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Indirizzo *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Tariffa Oraria (€) *</label>
                                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} step="0.01" min="0" className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-on-primary font-semibold py-2 px-4 rounded-lg">Aggiungi</button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-on-primary font-semibold py-2 px-4 rounded-lg">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* === NUOVA MODALE DI MODIFICA === */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                        <div className="bg-lib-card rounded-lg p-8 max-w-md w-11/12 shadow-xl border border-lib-border" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-primary mb-6">Modifica Parcheggio</h3>
                            <form onSubmit={handleEditParking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Nome Parcheggio *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Numero Posti Massimi *</label>
                                    <input type="number" name="maxSpots" value={formData.maxSpots} onChange={handleInputChange} min="1" className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Indirizzo *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Tariffa Oraria (€) *</label>
                                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} step="0.01" min="0" className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-on-primary font-semibold py-2 px-4 rounded-lg">Salva Modifiche</button>
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-on-primary font-semibold py-2 px-4 rounded-lg">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* === FINE MODALE DI MODIFICA === */}


                {/* Modal Rimuovi Parcheggio */}
                {showRemoveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRemoveModal(false)}>
                        <div className="bg-lib-card rounded-lg p-8 max-w-md w-11/12 shadow-xl border border-lib-border" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-primary mb-6">Rimuovi Parcheggio</h3>
                            <form onSubmit={handleRemoveParking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-2">Seleziona Parcheggio *</label>
                                    <select value={selectedParkingToRemove} onChange={(e) => setSelectedParkingToRemove(e.target.value)} className="w-full px-4 py-2 border border-lib-border rounded-lg bg-lib-secondary text-primary" required>
                                        <option value="">-- Seleziona un parcheggio --</option>
                                        {parkings.map(parking => (
                                            <option key={parking.id} value={parking.id}>{parking.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 text-on-primary font-semibold py-2 px-4 rounded-lg">Rimuovi</button>
                                    <button type="button" onClick={() => setShowRemoveModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-on-primary font-semibold py-2 px-4 rounded-lg">Annulla</button>
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