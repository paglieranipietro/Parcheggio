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
    const spots = Array.from({ length: totalSpots }, (_, i) => i + 1);

    return (
        <div className="bg-lib-card rounded-lg shadow p-6 border border-lib-border transition-colors duration-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Posti Parcheggio</h3>
            <p className="text-sm text-secondary mb-4">{selectedParking.name} - {totalSpots} posti totali</p>

            <div className="flex flex-wrap gap-3 overflow-y-auto max-h-96">
                {spots.map(spotNumber => (
                    <div
                        key={spotNumber}
                        className="w-16 h-16 border-2 border-green-400 rounded-lg bg-lib-secondary flex items-center justify-center text-sm font-semibold text-secondary cursor-pointer hover:bg-green-500/20 transition-colors"
                    >
                        {spotNumber}
                    </div>
                ))}
            </div>

            {/* Sezione info parcheggio selezionato */}
            <div className="mt-8 bg-lib-secondary rounded-lg border border-lib-border p-6 min-h-[80px] flex items-center justify-center">
                <span className="text-tertiary text-center text-lg font-semibold">Statistiche dettagliate in arrivo...</span>
            </div>
        </div>
    );
}