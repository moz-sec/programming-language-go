import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RailwayLine {
  positions: [number, number][];
  company: string;
  name: string;
}

const RailwayMap: React.FC = () => {
  const [railways, setRailways] = useState<RailwayLine[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetch("/kyoto.geojson")
      .then((res) => res.json())
      .then((data) => {
        const lines = data.features.map((feature: any) => ({
          positions: feature.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          ),
          company: feature.properties.operator || "その他",
          name: feature.properties.name || "路線",
        }));
        setRailways(lines);

        setSelectedCompanies(
          new Set(lines.map((line: RailwayLine) => line.company))
        );
      });
  }, []);

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(company)) {
        newSet.delete(company);
      } else {
        newSet.add(company);
      }
      return newSet;
    });
  };

  // railroad companies (remove duplicates)
  const companies = Array.from(
    new Set(railways.map((line) => line.company))
  ).sort();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#000",
          width: "200px",
          overflowY: "auto",
          color: "#fff",
        }}
      >
        <h3>鉄道会社一覧</h3>
        {companies.map((company) => (
          <div key={company} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedCompanies.has(company)}
                onChange={() => toggleCompany(company)}
              />
              {company}
            </label>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[35.0, 135.7]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {railways
            .filter((line) => selectedCompanies.has(line.company))
            .map((line, idx) => (
              <Polyline
                key={idx}
                positions={line.positions}
                pathOptions={{
                  color: getCompanyColor(line.company),
                  weight: 3,
                  opacity: 0.7,
                }}
              >
                <Popup>{line.name}</Popup>
              </Polyline>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

const getCompanyColor = (company: string): string => {
  const colors: { [key: string]: string } = {
    西日本旅客鉄道: "#0066CC",
    阪急電鉄: "#FFD700",
    京阪電気鉄道: "#00FF00",
    近畿日本鉄道: "#FFA500",
    京福電気鉄道: "#800080",
    京都丹後鉄道: "#FF69B4",
    その他: "#808080",
  };
  return colors[company] || "#808080";
};

export default RailwayMap;
