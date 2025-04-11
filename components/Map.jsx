import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ funders }) {
  return (
    <MapContainer center={[54.5, -3]} zoom={6} style={{ height: "80vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {funders.map((funder, idx) => (
        <CircleMarker
          key={idx}
          center={[funder.lat, funder.lng]}
          radius={Math.min(20, Math.max(5, funder.totalAmount / 10000))}
          pathOptions={{
            color:
              funder.totalAmount < 5000 ? "gray" :
              funder.totalAmount < 20000 ? "orange" : "blue",
            fillOpacity: 0.5
          }}
        >
          <Popup>
            <strong>{funder.name}</strong><br />
            Theme: {funder.theme}<br />
            Postcode: {funder.postcode}<br />
            Grant Amount: £{funder.totalAmount.toLocaleString()}<br />
            Grants: {funder.grants}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
