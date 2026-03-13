export default function AdminStats({ selectedParking }) {
    // Se nessun parcheggio è selezionato
    if (!selectedParking) {
        return (
            <div className="mt-6 bg-lib-card rounded-lg p-6 border border-lib-border shadow transition-colors duration-300">
                <h3 className="text-lg font-semibold text-primary mb-4">Statistiche</h3>
                <p className="text-tertiary text-center py-8">Seleziona un parcheggio per vedere le statistiche</p>
            </div>
        );
    }

    // Calcola i posti in base al parcheggio selezionato
    // Per ora: posti occupati = 0 (da backend in futuro)
    const totalAvailable = selectedParking.maxSpots;
    const totalOccupied = 0;

    return (
        <div className="mt-6 bg-lib-card rounded-lg p-6 border border-lib-border shadow transition-colors duration-300">
            <h3 className="text-lg font-semibold text-primary mb-2">Statistiche</h3>
            <p className="text-sm text-secondary mb-4">Parcheggio: <span className="font-semibold text-primary">{selectedParking.name}</span></p>

            <div className="grid grid-cols-2 gap-4">
                {/* Posti Disponibili */}
                <div className="bg-lib-secondary rounded-lg p-4 shadow-sm border border-lib-border">
                    <p className="text-secondary text-sm font-medium mb-1">Disponibili</p>
                    <p className="text-3xl font-bold text-green-400">{totalAvailable - totalOccupied}</p>
                </div>

                {/* Posti Occupati */}
                <div className="bg-lib-secondary rounded-lg p-4 shadow-sm border border-lib-border">
                    <p className="text-secondary text-sm font-medium mb-1">Occupati</p>
                    <p className="text-3xl font-bold text-red-400">{totalOccupied}</p>
                </div>
            </div>
        </div>
    );
}