import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { X, MapPin } from 'lucide-react';
import '../styles/CityMapModal.css';

const CityMapModal = ({ isOpen, onClose, city, chainName, stores }) => {
  const [selectedStore, setSelectedStore] = useState(null);

  // City coordinates (you can expand this list)
  const cityCoordinates = {
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Seattle': { lat: 47.6062, lng: -122.3321 },
    'Boston': { lat: 42.3601, lng: -71.0589 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Seoul': { lat: 37.5665, lng: 126.9780 },
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'Barcelona': { lat: 41.3851, lng: 2.1734 }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = cityCoordinates[city] || { lat: 40.7128, lng: -74.0060 };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  const onMapClick = useCallback(() => {
    setSelectedStore(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="map-modal-backdrop" onClick={onClose}>
      <div className="map-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="map-modal-header">
          <div className="map-modal-title">
            <MapPin className="map-modal-icon" />
            <div>
              <h2>{chainName} Locations</h2>
              <p>{city} - {stores.length} {stores.length === 1 ? 'Store' : 'Stores'}</p>
            </div>
          </div>
          <button className="map-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="map-modal-body">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dN5QiVZoFD0R4o'}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              options={mapOptions}
              onClick={onMapClick}
            >
              {stores.map((store, index) => (
                <Marker
                  key={index}
                  position={store.position}
                  onClick={() => setSelectedStore(store)}
                  animation={window.google?.maps?.Animation?.DROP}
                />
              ))}

              {selectedStore && (
                <InfoWindow
                  position={selectedStore.position}
                  onCloseClick={() => setSelectedStore(null)}
                >
                  <div className="info-window-content">
                    <h3>{selectedStore.name}</h3>
                    <p>{selectedStore.address}</p>
                    {selectedStore.hours && <p><strong>Hours:</strong> {selectedStore.hours}</p>}
                    {selectedStore.phone && <p><strong>Phone:</strong> {selectedStore.phone}</p>}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="map-modal-footer">
          <div className="store-list">
            <h3>Store Locations</h3>
            <div className="store-list-items">
              {stores.map((store, index) => (
                <div 
                  key={index} 
                  className="store-item"
                  onClick={() => setSelectedStore(store)}
                >
                  <MapPin size={16} />
                  <div>
                    <strong>{store.name}</strong>
                    <p>{store.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMapModal;
