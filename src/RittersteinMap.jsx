import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Für benutzerdefinierte Marker-Icons
import { getDistance } from 'geolib'; // Für Entfernungsberechnungen

function RittersteinMap() {
  const [rittersteine, setRittersteine] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [closestRittersteine, setClosestRittersteine] = useState([]);

  useEffect(() => {
    // Daten für Rittersteine laden
    fetch('rittersteine.json')
      .then(response => response.json())
      .then(data => {
        setRittersteine(data);
      });

    // Benutzerposition abrufen
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (userPosition && rittersteine.length > 0) {
      // Berechnung der 3 nächstgelegenen Rittersteine
      const sortedSteine = rittersteine
        .map((stein) => ({
          ...stein,
          distance: getDistance(
            { latitude: userPosition.lat, longitude: userPosition.lon },
            { latitude: stein.lat, longitude: stein.lon }
          ),
        }))
        .sort((a, b) => a.distance - b.distance); // Sortiere nach Nähe

      setClosestRittersteine(sortedSteine.slice(0, 3)); // Nimm nur die 3 nächsten
    }
  }, [userPosition, rittersteine]);

  return (
    <div>
      {/* Karte */}
      <MapContainer
        center={[49.44, 7.76]}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Benutzerposition */}
        {userPosition && (

          <Marker
            key={index}
            position={[userPosition.lat, userPosition.lon]}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png', // Standard-Leaflet-Icon
              iconSize: [25, 41], // Größe des Icons
              iconAnchor: [12, 41], // Ankerpunkt für das Icon
              popupAnchor: [1, -34], // Position des Popups
            })}
          >
            <Popup>{stein.name}</Popup>
          </Marker>
        )}

        {/* Rittersteine */}
        {rittersteine.map((stein, index) => (
          <Marker
            key={index}
            position={[stein.lat, stein.lon]}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png', // Hier kann ein benutzerdefiniertes Icon angegeben werden
              iconSize: [25, 41], // Größe des Icons
              iconAnchor: [12, 41], // Ankerpunkt für das Icon
            })}
          >
            <Popup>{stein.name}</Popup>
          </Marker>
        ))}

        {/* Nächstgelegene Rittersteine */}
        {closestRittersteine.map((stein, index) => (
          <Marker key={index} position={[stein.lat, stein.lon]}>
            <Popup>{`${stein.name} - ${Math.round(stein.distance / 100)} Meter entfernt`}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Liste der 3 nächstgelegenen Rittersteine */}
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
