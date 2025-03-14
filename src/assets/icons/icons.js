import L from "leaflet";

export const rittersteinIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36">
      <path fill="#1e81b0" stroke="black" stroke-width="2" d="M12 1C6.48 1 2 5.48 2 11c0 7.18 10 21 10 21s10-13.82 10-21c0-5.52-4.48-10-10-10z"/>
      <circle cx="12" cy="11" r="4" fill="white" stroke="black" stroke-width="2"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

export const closestRittersteinIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36">
      <path fill="#e1591f" stroke="black" stroke-width="2" d="M12 1C6.48 1 2 5.48 2 11c0 7.18 10 21 10 21s10-13.82 10-21c0-5.52-4.48-10-10-10z"/>
      <circle cx="12" cy="11" r="4" fill="white" stroke="black" stroke-width="2"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

export const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <rect x="10" y="0" width="4" height="24" fill="#e1591f"/>
      <rect x="0" y="10" width="24" height="4" fill="#e1591f"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});