export default function AdminStats({ selectedParking }) {
  // Se nessun parcheggio è selezionato
  if (!selectedParking) {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiche</h3>
        <p className="text-gray-500 text-center py-8">Seleziona un parcheggio per vedere le statistiche</p>
      </div>
    );
  }

  // Calcola i posti in base al parcheggio selezionato
  // Per ora: posti occupati = 0 (da backend in futuro)
  const totalAvailable = selectedParking.maxSpots;
  const totalOccupied = 0;

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistiche</h3>
      <p className="text-sm text-gray-600 mb-4">Parcheggio: <span className="font-semibold">{selectedParking.name}</span></p>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Posti Disponibili */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Disponibili</p>
          <p className="text-3xl font-bold text-green-600">{totalAvailable - totalOccupied}</p>
        </div>

        {/* Posti Occupati */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Occupati</p>
          <p className="text-3xl font-bold text-red-600">{totalOccupied}</p>
        </div>
      </div>
    </div>
  );
}
