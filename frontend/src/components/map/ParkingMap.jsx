import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/leaflet.css';

// Fix per le icone di default di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente helper per il focus sulla mappa
const MapFocusHandler = ({ parkings, focusParkingId }) => {
  const map = useMap();

  useEffect(() => {
    if (focusParkingId) {
      const parking = parkings.find(p => p.id === focusParkingId);
      if (parking) {
        map.flyTo([parking.lat, parking.lng], 17, {
          duration: 1.5,
          easeLinearity: 0.5
        });
      }
    }
  }, [focusParkingId, parkings, map]);

  return null;
};

// Componente interno che contiene il marker e usa getMap
const ParkingMarker = ({ parking, icon, parkingBookings, onSelectParking, hasBookings }) => {
  const map = useMap();
  
  const handleFocus = () => {
    // flyTo con animazione al marker
    map.flyTo([parking.lat, parking.lng], 17, {
      duration: 1.5,
      easeLinearity: 0.5
    });
  };

  return (
    <Marker 
      position={[parking.lat, parking.lng]}
      icon={icon}
    >
      <Popup>
        <div style={{ minWidth: '300px', padding: '8px' }}>
          <h4 style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937', marginBottom: '4px' }}>{parking.name}</h4>
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>{parking.address}</p>
          
          {/* Se ci sono prenotazioni attive, mostra il riepilogo */}
          {hasBookings ? (
            <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', marginBottom: '12px', border: '2px solid #22c55e' }}>
              <h5 style={{ fontWeight: '600', color: '#15803d', marginBottom: '8px' }}>✅ Prenotazioni Attive ({parkingBookings.length})</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parkingBookings.map((booking, idx) => (
                  <div key={idx} style={{ backgroundColor: 'white', padding: '8px', borderRadius: '4px', fontSize: '12px', border: '1px solid #dcfce7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#4b5563' }}>
                        📍 {booking.date} • {booking.time}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px' }}>
                        {booking.code}
                      </span>
                    </div>
                    <div style={{ color: '#374151', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{booking.licensePlate}</span> • {booking.duration}h • €{booking.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#4b5563' }}>Posti disponibili:</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{parking.freeSpots}/{parking.totalSpots}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#4b5563' }}>Tariffa:</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>€{parking.hourlyRate.toFixed(2)}/h</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#4b5563' }}>CO2 Risparmiata:</span>
                <span style={{ fontWeight: '600', color: '#22c55e' }}>-{parking.co2}g</span>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => onSelectParking(parking)}
              style={{
                flex: 1,
                backgroundColor: '#a855f7',
                color: 'white',
                fontWeight: '600',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#9333ea'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#a855f7'}
            >
              {hasBookings ? '➕ Aggiungi' : 'Prenota'}
            </button>
            <button 
              onClick={handleFocus}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '600',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              title="Focus su questo parcheggio"
            >
              🗺️
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const ParkingMap = ({ parkings = [], activeBookings = [], onSelectParking, onFullscreen, focusParkingId, isFullscreen = false }) => {
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

  // Funzione per ottenere tutte le prenotazioni attive per un parcheggio
  const getActiveBookingsForParking = (parkingId) => {
    return activeBookings.filter(b => b.parkingId === parkingId);
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
        
        <MapFocusHandler parkings={parkings} focusParkingId={focusParkingId} />
        
        {parkings?.map((parking) => {
          const parkingBookings = getActiveBookingsForParking(parking.id);
          const hasBookings = parkingBookings.length > 0;
          
          return (
            <ParkingMarker 
              key={parking.id}
              parking={parking}
              icon={getMarkerIcon(parking.id)}
              parkingBookings={parkingBookings}
              onSelectParking={onSelectParking}
              hasBookings={hasBookings}
            />
          );
        })}
        ))}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;
