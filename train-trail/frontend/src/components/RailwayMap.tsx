import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RailwayMap: React.FC = () => {
  const [railways, setRailways] = useState<any[]>([]);

  useEffect(() => {
    fetch("/kyoto.geojson") // ←ダウンロードしたGeoJSONファイルをpublicフォルダに置く
      .then((res) => res.json())
      .then((data) => {
        const lines = data.features.map((feature: any) =>
          feature.geometry.coordinates.map(([lng, lat]: [number, number]) => [
            lat,
            lng,
          ])
        );
        setRailways(lines);
      });
  }, []);

  return (
    <MapContainer
      center={[35.0, 135.7]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {railways.map((positions, idx) => (
        <Polyline key={idx} positions={positions} color="blue">
          <Popup>Train Line {idx + 1}</Popup>
        </Polyline>
      ))}
    </MapContainer>
  );
};

export default RailwayMap;
