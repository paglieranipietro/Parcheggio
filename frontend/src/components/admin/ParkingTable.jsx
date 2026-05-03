export default function ParkingTable({ selectedParking }) {
    // Non mostrare nulla se nessun parcheggio è selezionato
    if (!selectedParking) {
        return (
            <div className="bg-lib-card rounded-lg shadow p-6 flex items-center justify-center min-h-96 border border-lib-border transition-colors duration-300">
                <p className="text-tertiary text-center">Seleziona un parcheggio per visualizzare i posti</p>
            </div>
        );
    }

    // Usiamo total_spots che arriva dal vero database
    const totalSpots = selectedParking.total_spots || selectedParking.maxSpots || 0;
    
    // Calcoliamo quanti posti sono occupati (Totali - Disponibili)
    const availableSpots = selectedParking.available_spots !== undefined ? Number(selectedParking.available_spots) : totalSpots;
    const occupiedSpots = totalSpots - availableSpots;

    const spots = Array.from({ length: totalSpots }, (_, i) => i + 1);

    return (
        <div className="bg-lib-card rounded-lg shadow p-6 border border-lib-border transition-colors duration-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Posti Parcheggio</h3>
            <p className="text-sm text-secondary mb-4">{selectedParking.name} - {totalSpots} posti totali</p>

            <div className="flex flex-wrap gap-3 overflow-y-auto max-h-96">
                {spots.map((spotNumber, index) => {
                    // Se l'indice è minore del numero di posti occupati, coloralo di rosso!
                    const isOccupied = index < occupiedSpots;

                    return (
                        <div
                            key={spotNumber}
                            className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                                isOccupied 
                                    ? 'border-red-500 bg-red-500/10 text-red-500 cursor-not-allowed' // Rosso se occupato
                                    : 'border-green-400 bg-lib-secondary text-secondary cursor-pointer hover:bg-green-500/20' // Verde se libero
                            }`}
                            title={isOccupied ? "Posto Occupato" : "Posto Libero"}
                        >
                            {spotNumber}
                        </div>
                    );
                })}
            </div>

            {/* Sezione info parcheggio selezionato */}
            <div className="mt-8 bg-lib-secondary rounded-lg border border-lib-border p-6 min-h-[80px] flex items-center justify-center">
                <span className="text-tertiary text-center text-lg font-semibold">
                    {occupiedSpots > 0 
                        ? `${occupiedSpots} ${occupiedSpots === 1 ? 'posto attualmente occupato' : 'posti attualmente occupati'}.` 
                        : 'Nessun veicolo presente al momento.'}
                </span>
            </div>
        </div>
    );
}