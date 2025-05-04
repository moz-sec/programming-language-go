import { useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { ScanPort, ScanPorts } from "../wailsjs/go/main/App";

function App() {
  const [resultText, setResultText] = useState("");
  const [ipAddress, setIpAddress] = useState("localhost");
  const [startPort, setStartPort] = useState("1");
  const [endPort, setEndPort] = useState("1024");

  const handleScan = async () => {
    try {
      const start = parseInt(startPort);
      const end = parseInt(endPort);
      const results = await ScanPorts(ipAddress, start, end);

      let openPorts = [];
      for (const [port, isOpen] of Object.entries(results)) {
        if (isOpen) {
          openPorts.push(port);
        }
      }

      if (openPorts.length > 0) {
        setResultText(`Open ports: ${openPorts.join(", ")}`);
      } else {
        setResultText("No open ports found.");
      }
    } catch (error) {
      setResultText(`Error : ${error}`);
    }
  };

  return (
    <div id="App">
      <img src={logo} id="logo" alt="logo" />
      <div id="result" className="result">
        {resultText}
      </div>
      <div id="input" className="input-box">
        <input
          id="ipAddress"
          className="input"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="IP Address or Domain"
          autoComplete="off"
        />
        <input
          id="startPort"
          className="input"
          type="number"
          value={startPort}
          onChange={(e) => setStartPort(e.target.value)}
          placeholder="Start Port"
        />
        <input
          id="endPort"
          className="input"
          type="number"
          value={endPort}
          onChange={(e) => setEndPort(e.target.value)}
          placeholder="End Port"
        />
        <button className="btn" onClick={handleScan}>
          Scan
        </button>
      </div>
    </div>
  );
}

export default App;
