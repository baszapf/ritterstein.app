import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function RittersteinMap() {
  const [rittersteine, setRittersteine] = useState([]);

  useEffect(() => {
    fetch(`rittersteine.json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setRittersteine(data);
      });
  }, []);

  return (
    <MapContainer center={[49.44, 7.76]} zoom={10} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {rittersteine.map((stein, index) => (
        <Marker key={index} position={[stein.lat, stein.lon]}>
          <Popup>{stein.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default RittersteinMap;