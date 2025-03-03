import { useEffect, useState } from "react";
import { orderByDistance } from "geolib";
import RittersteinMap from "./RittersteinMap";

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [rittersteine, setRittersteine] = useState([]);
  const [nearest, setNearest] = useState([]);

  useEffect(() => {
    // JSON-Datei laden
    fetch("/rittersteine.json")
      .then((res) => res.json())
      .then((data) => setRittersteine(data))
      .catch((err) => console.error("Fehler beim Laden der Daten:", err));

    // Nutzerposition holen
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (userLocation && rittersteine.length > 0) {
      const sorted = orderByDistance(userLocation, rittersteine).slice(0, 3);
      setNearest(sorted);
    }
  }, [userLocation, rittersteine]);

  return (
    <div>
      <h1>Ritterstein Finder</h1>
      <RittersteinMap userLocation={userLocation} nearest={nearest} />
    </div>
  );
}

export default App;
