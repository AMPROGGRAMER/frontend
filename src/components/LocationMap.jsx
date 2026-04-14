import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue with webpack/vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Default Leaflet icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when center changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
      // Force a resize to ensure map renders correctly in modals
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [center, zoom, map]);
  return null;
};

// Component to handle map resize when modal opens
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    // Multiple resize attempts for modals
    const timeouts = [100, 300, 500, 800];
    timeouts.forEach(delay => {
      setTimeout(() => {
        map.invalidateSize();
      }, delay);
    });
  }, [map]);
  return null;
};

const LocationMap = ({ 
  lat, 
  lng, 
  address,
  height = '300px',
  zoom = 15,
  showPopup = true 
}) => {
  // Convert to numbers if strings
  const numLat = lat ? Number(lat) : null;
  const numLng = lng ? Number(lng) : null;
  
  // Default coordinates (India center) if no coordinates provided
  const defaultLat = 20.5937;
  const defaultLng = 78.9629;
  
  const hasValidCoordinates = numLat !== null && numLng !== null && !isNaN(numLat) && !isNaN(numLng);
  const position = hasValidCoordinates ? [numLat, numLng] : [defaultLat, defaultLng];
  const displayZoom = hasValidCoordinates ? zoom : 5;

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={displayZoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={position} zoom={displayZoom} />
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasValidCoordinates && (
          <Marker position={position}>
            {showPopup && address && (
              <Popup>
                <div style={{ maxWidth: '250px' }}>
                  <strong>Service Location</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>{address}</p>
                </div>
              </Popup>
            )}
          </Marker>
        )}
      </MapContainer>
      {!hasValidCoordinates && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          fontSize: '14px',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
          <div>No GPS coordinates available</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
            Only address text is saved for this booking
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
