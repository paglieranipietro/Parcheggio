import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/leaflet.css';

// Fix per le icone di default di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ParkingMap = ({ parkings = [], activeBookings = [], onSelectParking, onFullscreen, isFullscreen = false }) => {
  // Centro su Brescia
  const center = [45.5384, 10.2116];
  const zoom = 14;

  // Funzione per ottenere l'icona del marker basata sul fatto che sia prenotato o meno
  const getMarkerIcon = (parkingId) => {
    const isBooked = activeBookings.some(b => b.parkingId === parkingId);
    
    // Crea un'icona personalizzata usando SVG
    const svgIcon = isBooked
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
          <path d="M12 1C6.5 1 2 5.5 2 11c0 7 10 12 10 12s10-5 10-12c0-5.5-4.5-10-10-10z" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>
          <circle cx="12" cy="11" r="3" fill="white"/>
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
          <path d="M12 1C6.5 1 2 5.5 2 11c0 7 10 12 10 12s10-5 10-12c0-5.5-4.5-10-10-10z" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
          <circle cx="12" cy="11" r="3" fill="white"/>
        </svg>`;
    
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 41;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgIcon);
    
    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  // Funzione per ottenere la prenotazione attiva per un parcheggio
  const getActiveBooking = (parkingId) => {
    return activeBookings.find(b => b.parkingId === parkingId);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-lib-border relative z-10" style={{ height: isFullscreen ? '100%' : '24rem' }}>
      {/* Bottone Fullscreen */}
      {!isFullscreen && (
        <button 
          onClick={onFullscreen}
          className="absolute top-3 right-3 z-20 bg-white hover:bg-gray-200 text-gray-800 p-2 rounded-lg shadow-md transition-colors"
          title="Apri a schermo intero"
        >
          ⛶
        </button>
      )}
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        
        {parkings?.map((parking) => {
          const activeBooking = getActiveBooking(parking.id);
          
          return (
          <Marker 
            key={parking.id} 
            position={[parking.lat, parking.lng]}
            icon={getMarkerIcon(parking.id)}
          >
            <Popup>
              <div className="p-2 min-w-64">
                <h4 className="font-bold text-lg text-gray-800 mb-1">{parking.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{parking.address}</p>
                
                {/* Se c'è una prenotazione attiva, mostra i dettagli */}
                {activeBooking ? (
                  <div className="bg-green-50 p-3 rounded mb-3 border-2 border-green-500">
                    <h5 className="font-semibold text-green-700 mb-2">✅ Prenotazione Attiva</h5>
                    <div className="space-y-1 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Codice:</span>
                        <span className="font-mono font-bold text-green-600">{activeBooking.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-semibold">{activeBooking.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ora:</span>
                        <span className="font-semibold">{activeBooking.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durata:</span>
                        <span className="font-semibold">{activeBooking.duration}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Targa:</span>
                        <span className="font-mono font-bold">{activeBooking.licensePlate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Totale:</span>
                        <span className="font-bold text-green-600">€{activeBooking.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-2 rounded mb-3 border border-gray-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Posti disponibili:</span>
                      <span className="font-semibold text-gray-800">{parking.freeSpots}/{parking.totalSpots}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tariffa:</span>
                      <span className="font-semibold text-gray-800">€{parking.hourlyRate.toFixed(2)}/h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CO2 Risparmiata:</span>
                      <span className="font-semibold text-green-600">-{parking.co2}g</span>
                    </div>
                  </div>
                )}
                
                {!activeBooking && (
                  <button 
                    onClick={() => onSelectParking(parking)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded text-sm transition-colors"
                  >
                    Prenota Posto
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
        })}
        ))}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;
