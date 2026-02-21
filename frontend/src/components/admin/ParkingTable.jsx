export default function ParkingTable({ selectedParking }) {
  // Non mostrare nulla se nessun parcheggio è selezionato
  if (!selectedParking) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center min-h-96">
        <p className="text-gray-400 text-center">Seleziona un parcheggio per visualizzare i posti</p>
      </div>
    );
  }

  const totalSpots = selectedParking.maxSpots;
  const spotsPerRow = 10;
  const spots = Array.from({ length: totalSpots }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Posti Parcheggio</h3>
      <p className="text-sm text-gray-600 mb-4">{selectedParking.name} - {totalSpots} posti totali</p>

      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-96">
        {spots.map(spotNumber => (
          <div
            key={spotNumber}
            className="w-16 h-16 border-2 border-green-500 rounded-lg bg-transparent flex items-center justify-center text-sm font-semibold text-gray-600 cursor-pointer hover:bg-green-50 transition-colors"
          >
            {spotNumber}
          </div>
        ))}
      </div>
    </div>
  );
}
