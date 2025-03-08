import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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
    fetch('rittersteine.json')
      .then(response => response.json())
      .then(data => setRittersteine(data));

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

  return (
    <div>
      <MapContainer
        center={userPosition ? [userPosition.lat, userPosition.lon] : [49.44, 7.76]}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userPosition && <MapCenter position={[userPosition.lat, userPosition.lon]} />}

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

        {/* Linien zu den 3 nächstgelegenen Rittersteinen */}
        {userPosition &&
          closestRittersteine.map((stein, index) => (
            <Polyline
              key={index}
              positions={[
                [userPosition.lat, userPosition.lon],
                [stein.lat, stein.lon],
              ]}
              color="black"
              weight={1} // Dünne Linie
            >
              <Popup>
                {stein.name}: {Math.round(stein.distance)} Meter
              </Popup>
            </Polyline>
          ))}
      </MapContainer>
    </div>
  );
}

export default RittersteinMap;