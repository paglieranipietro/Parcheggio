import { useState } from 'react';
import AdminStats from './AdminStats';
import ParkingTable from './ParkingTable';

export default function ParkingForm() {
  const [parkings, setParkings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedParkingToRemove, setSelectedParkingToRemove] = useState('');
  const [selectedParking, setSelectedParking] = useState(null);
  const [devCounter, setDevCounter] = useState(1);

  // Form state per aggiungere parcheggi
  const [formData, setFormData] = useState({
    name: '',
    maxSpots: '',
    description: '',
    address: '',
    hourlyRate: ''
  });

  // Handle input change nel form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aggiungere un nuovo parcheggio
  const handleAddParking = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.maxSpots || !formData.address || !formData.hourlyRate) {
      alert('Per favore, compila tutti i campi obbligatori');
      return;
    }

    const newParking = {
      id: Date.now(),
      name: formData.name,
      maxSpots: parseInt(formData.maxSpots),
      description: formData.description,
      address: formData.address,
      hourlyRate: parseFloat(formData.hourlyRate)
    };

    setParkings(prev => [...prev, newParking]);
    setFormData({ name: '', maxSpots: '', description: '', address: '', hourlyRate: '' });
    setShowAddModal(false);
  };

  // Rimuovere un parcheggio
  const handleRemoveParking = (e) => {
    e.preventDefault();

    if (!selectedParkingToRemove) {
      alert('Per favore, seleziona un parcheggio');
      return;
    }

    // Se il parcheggio rimosso era quello selezionato, resetta la selezione
    if (selectedParking?.id.toString() === selectedParkingToRemove) {
      setSelectedParking(null);
    }

    setParkings(prev => prev.filter(p => p.id.toString() !== selectedParkingToRemove));
    setSelectedParkingToRemove('');
    setShowRemoveModal(false);
  };

  // Aggiungere un parcheggio di test (DEV)
  const handleAddDevParking = () => {
    const newParking = {
      id: Date.now(),
      name: devCounter.toString(),
      maxSpots: devCounter,
      description: devCounter.toString(),
      address: devCounter.toString(),
      hourlyRate: devCounter
    };

    setParkings(prev => [...prev, newParking]);
    setDevCounter(prev => prev + 1);
  };

  return (
    <div className="flex gap-6 w-full h-full">
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
            <button
              onClick={handleAddDevParking}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-lg transition duration-200 text-xs"
            >
              DEV
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
                  className={`block px-4 py-3 border-b border-gray-200 text-sm cursor-pointer transition-colors ${
                    selectedParking?.id === parking.id
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-11/12 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Aggiungi Nuovo Parcheggio</h3>
            <form onSubmit={handleAddParking} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Parcheggio *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Es: Parcheggio Centro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="maxSpots" className="block text-sm font-semibold text-gray-700 mb-2">
                  Numero Posti Massimi *
                </label>
                <input
                  type="number"
                  id="maxSpots"
                  name="maxSpots"
                  value={formData.maxSpots}
                  onChange={handleInputChange}
                  placeholder="Es: 100"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrizione
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrizione del parcheggio"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Indirizzo *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Es: Via Roma 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tariffa Oraria (€) *
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  placeholder="Es: 2.50"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Aggiungi
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rimuovi Parcheggio */}
      {showRemoveModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowRemoveModal(false)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-11/12 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Rimuovi Parcheggio</h3>
            <form onSubmit={handleRemoveParking} className="space-y-5">
              <div>
                <label htmlFor="parkingSelect" className="block text-sm font-semibold text-gray-700 mb-2">
                  Seleziona Parcheggio *
                </label>
                <select
                  id="parkingSelect"
                  value={selectedParkingToRemove}
                  onChange={(e) => setSelectedParkingToRemove(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                >
                  <option value="">-- Seleziona un parcheggio --</option>
                  {parkings.map(parking => (
                    <option key={parking.id} value={parking.id}>
                      {parking.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Rimuovi
                </button>
                <button
                  type="button"
                  onClick={() => setShowRemoveModal(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sezione Statistiche */}
      <AdminStats selectedParking={selectedParking} />
    </div>

    {/* Colonna Destra: Parking Table */}
    <div className="flex-1">
      <ParkingTable selectedParking={selectedParking} />
    </div>
    </div>
  );
}