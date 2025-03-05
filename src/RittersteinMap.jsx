import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDistance } from 'geolib';
import { rittersteinIcon, closestRittersteinIcon, userIcon } from './assets/icons/icons';

function MapCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
}

function RittersteinMap() {
  const [rittersteine, setRittersteine] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [closestRittersteine, setClosestRittersteine] = useState([]);

  useEffect(() => {
    // Lade die Rittersteine-Daten
    fetch('rittersteine.json')
      .then(response => response.json())
      .then(data => setRittersteine(data));

    // Funktion, um die Position des Benutzers abzurufen
    const updateUserPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        });
      }
    };

    // Initiale Position abrufen
    updateUserPosition();
    
    // Aktualisiere die Position alle 10 Sekunden
    const interval = setInterval(updateUserPosition, 10000);
    
    // Aufräumen des Intervalls bei Unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userPosition && rittersteine.length > 0) {
      // Berechne die Entfernungen zu den Rittersteinen
      const sortedSteine = rittersteine
        .map((stein) => ({
          ...stein,
          distance: getDistance(
            { latitude: userPosition.lat, longitude: userPosition.lon },
            { latitude: stein.lat, longitude: stein.lon }
          ),
        }))
        .sort((a, b) => a.distance - b.distance); // Sortiere nach Entfernungen

      // Speichere die drei nächstgelegenen Rittersteine
      setClosestRittersteine(sortedSteine.slice(0, 3));
    }
  }, [userPosition, rittersteine]);

  return (
    <div>
      <MapContainer
        center={userPosition ? [userPosition.lat, userPosition.lon] : [49.44, 7.76]}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Karte immer auf Benutzerposition zentrieren */}
        {userPosition && <MapCenter position={[userPosition.lat, userPosition.lon]} />}

        {/* Marker für Benutzerposition */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lon]} icon={userIcon}>
            <Popup>Deine Position</Popup>
          </Marker>
        )}

        {/* Ritterstein Marker */}
        {rittersteine.map((stein, index) => (
          <Marker key={index} position={[stein.lat, stein.lon]} icon={rittersteinIcon}>
            <Popup>{stein.name}</Popup>
          </Marker>
        ))}

        {/* Marker für die drei nächstgelegenen Rittersteine */}
        {closestRittersteine.map((stein, index) => (
          <Marker key={index} position={[stein.lat, stein.lon]} icon={closestRittersteinIcon}>
            <Popup>{`${stein.name} - ${Math.round(stein.distance / 100)} Meter entfernt`}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Liste der nächstgelegenen Rittersteine */}
      <div>
        <h3>Nächstgelegene 3 Rittersteine:</h3>
        <ul>
          {closestRittersteine.map((stein, index) => (
            <li key={index}>{stein.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RittersteinMap;
