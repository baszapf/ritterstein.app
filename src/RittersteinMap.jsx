import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Für benutzerdefinierte Marker-Icons
import { getDistance } from 'geolib'; // Für Entfernungsberechnungen

function RittersteinMap() {
  const [rittersteine, setRittersteine] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [closestRittersteine, setClosestRittersteine] = useState([]);

  const userIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <rect x="9" y="0" width="6" height="24" fill="red"/>
      <rect x="0" y="9" width="24" height="6" fill="red"/>
    </svg>`,
    className: '', // Entfernt Leaflet-Standard-Styling
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
  export default userIcon;

  const rittersteinIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36">
      <path fill="red" stroke="black" stroke-width="2" d="M12 1C6.48 1 2 5.48 2 11c0 7.18 10 21 10 21s10-13.82 10-21c0-5.52-4.48-10-10-10z"/>
      <circle cx="12" cy="11" r="4" fill="white" stroke="black" stroke-width="2"/>
    </svg>`,
    className: '',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
  });
  export default rittersteinIcon;

  

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
          <Marker position={[userPosition.lat, userPosition.lon]} icon={userIcon}>
            <Popup>Deine Position</Popup>
          </Marker>
        )}

        {/* Rittersteine */}
        {rittersteine.map((stein, index) => (

          <Marker
            key={index}
            position={[stein.lat, stein.lon]}
            icon={rittersteinIcon}
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