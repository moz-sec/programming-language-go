import { useState, useEffect } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import {
  StartScan,
  StopScan,
  GetAverageRSSI,
  IsScanning,
  InitializeBLE,
} from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

function App() {
  const [resultText, setResultText] = useState(
    "Click on the 'Start Scan' button to start the BLE scan."
  );
  const [devices, setDevices] = useState<main.DeviceRSSI[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Initialize BLE at application startup
  useEffect(() => {
    const initBLE = async () => {
      try {
        await InitializeBLE();
        setResultText("Scanning can be started.");
      } catch (error) {
        setResultText(`Failed to initialize BLE: ${error}`);
      }
    };
    initBLE();
  }, []);

  // Scan status updated every second
  useEffect(() => {
    const checkScanStatus = async () => {
      const status = await IsScanning();
      setIsScanning(status);
    };
    const interval = setInterval(checkScanStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const startScanning = async () => {
    try {
      setDevices([]);
      setResultText("Scanning...");
      await StartScan();
    } catch (error) {
      setResultText(`Error occurred: ${error}`);
    }
  };

  const stopScanning = async () => {
    try {
      await StopScan();
      const averages = await GetAverageRSSI();
      setDevices(averages);
      setResultText("Scan stopped");
    } catch (error) {
      setResultText(`Error occurred during scan stop: ${error}`);
    }
  };

  return (
    <div id="App">
      <img src={logo} id="logo" alt="logo" />
      <div id="result" className="result">
        {resultText}
      </div>
      <div className="button-container">
        <button
          className={isScanning ? "btn stop" : "btn start"}
          onClick={isScanning ? stopScanning : startScanning}
        >
          {isScanning ? "Stop Scan" : "Start Scan"}
        </button>
      </div>
      {devices.length > 0 && (
        <div className="devices-table">
          <h3>Detected Devices:</h3>
          <table>
            <thead>
              <tr>
                <th>Device Address</th>
                <th>Average RSSI (dBm)</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.uuid}>
                  <td>{device.uuid}</td>
                  <td>{device.rssi.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
