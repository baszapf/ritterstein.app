import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDistance } from 'geolib';
import { rittersteinIcon, closestRittersteinIcon, userIcon } from './assets/icons/icons';

function MapController({ userPosition }) {
  const map = useMap();

  useEffect(() => {
    if (userPosition) {
      map.setView([userPosition.lat, userPosition.lon], map.getZoom(), { animate: true });
    }
  }, [userPosition, map]);

  return null;
}

function RittersteinMap() {
  const [rittersteine, setRittersteine] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [closestRittersteine, setClosestRittersteine] = useState([]);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    fetch('rittersteine.json')
      .then(response => response.json())
      .then(data => setRittersteine(data));

    const updateUserPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserPosition(newPosition);
        });
      }
    };

    updateUserPosition();
    const interval = setInterval(updateUserPosition, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userPosition && rittersteine.length > 0) {
      const sortedSteine = rittersteine
        .map((stein) => ({
          ...stein,
          distance: getDistance(
            { latitude: userPosition.lat, longitude: userPosition.lon },
            { latitude: stein.lat, longitude: stein.lon }
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setClosestRittersteine(sortedSteine.slice(0, 3));
    }
  }, [userPosition, rittersteine]);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {showOverlay && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          zIndex: 2000,
          transition: 'opacity 1s ease-out',
          opacity: showOverlay ? 1 : 0,
        }}>
          Ritterstein Finder
        </div>
      )}

      <MapContainer
        center={[49.44, 7.76]}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
      >
        <MapController userPosition={userPosition} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lon]} icon={userIcon}>
            <Popup>Deine Position</Popup>
          </Marker>
        )}

        {rittersteine.map((stein, index) => (
          <Marker key={index} position={[stein.lat, stein.lon]} icon={rittersteinIcon}>
            <Popup>{stein.name}</Popup>
          </Marker>
        ))}

        {closestRittersteine.map((stein, index) => (
          <Marker key={index} position={[stein.lat, stein.lon]} icon={closestRittersteinIcon}>
            <Popup>{`${stein.name} - ${Math.round(stein.distance / 100)} Meter entfernt`}</Popup>
          </Marker>
        ))}

        {userPosition &&
          closestRittersteine.map((stein, index) => (
            <Polyline
              key={index}
              positions={[
                [userPosition.lat, userPosition.lon],
                [stein.lat, stein.lon],
              ]}
              color="black"
              weight={1}
            >
              <Popup>
                {stein.name}: {Math.round(stein.distance)} Meter
              </Popup>
            </Polyline>
          ))}
      </MapContainer>

      <button
        onClick={() => {
          if (userPosition) {
            const map = mapRef.current;
            if (map) {
              map.setView([userPosition.lat, userPosition.lon], map.getZoom(), { animate: true });
            }
          }
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '10px',
          background: 'white',
          border: '1px solid black',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Meine Position
      </button>
    </div>
  );
}

export default RittersteinMap;