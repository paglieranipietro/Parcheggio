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

const ParkingMap = ({ parkings = [], onSelectParking, onFullscreen, isFullscreen = false }) => {
  // Centro su Brescia
  const center = [45.5384, 10.2116];
  const zoom = 14;

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
        
        {parkings?.map((parking) => (
          <Marker 
            key={parking.id} 
            position={[parking.lat, parking.lng]}
          >
            <Popup>
              <div className="p-2 min-w-64">
                <h4 className="font-bold text-lg text-gray-800 mb-1">{parking.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{parking.address}</p>
                
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
                
                <button 
                  onClick={() => onSelectParking(parking)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded text-sm transition-colors"
                >
                  Prenota Posto
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;
