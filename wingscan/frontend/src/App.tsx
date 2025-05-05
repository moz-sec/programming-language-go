import { useState, useEffect } from "react";
import logo_light from "./assets/images/logo-light.png";
import logo_dark from "./assets/images/logo-dark.png";
import "./App.css";
import { ScanPort, ScanPorts } from "../wailsjs/go/main/App";

// Initialize the theme based on local storage and system settings
// The priorities are as follows.
// 1. local storage settings
// 2. system settings
const initializeTheme = (setIsDarkMode: (value: boolean) => void) => {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme ? savedTheme === "dark" : systemPrefersDark;

  setIsDarkMode(initialTheme);
  if (initialTheme) {
    document.body.classList.add("dark-mode");
  }
};

// Toggle the theme between light and dark mode
const toggleTheme = (
  isDarkMode: boolean,
  setIsDarkMode: (value: boolean) => void
) => {
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", newTheme ? "dark" : "light");
};

// Handle system theme changes
const watchSystemTheme = (setIsDarkMode: (value: boolean) => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem("theme")) {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
};

const handleScan = async (
  ipAddress: string,
  startPort: string,
  endPort: string,
  setResultText: (text: string) => void
) => {
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

function App() {
  const [resultText, setResultText] = useState("");
  const [ipAddress, setIpAddress] = useState("localhost");
  const [startPort, setStartPort] = useState("1");
  const [endPort, setEndPort] = useState("1024");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    initializeTheme(setIsDarkMode);
  }, []);

  useEffect(() => {
    watchSystemTheme(setIsDarkMode);
  }, []);

  return (
    <div id="App" className={isDarkMode ? "dark-mode" : ""}>
      <div className="theme-toggle">
        <span className="theme-label">Light</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => toggleTheme(isDarkMode, setIsDarkMode)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="theme-label">Dark</span>
      </div>
      <img
        src={isDarkMode ? logo_dark : logo_light}
        id="logo"
        alt="logo"
        className={isDarkMode ? "dark-logo" : "light-logo"}
      />
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
        <button
          className="btn"
          onClick={() =>
            handleScan(ipAddress, startPort, endPort, setResultText)
          }
        >
          Scan
        </button>
      </div>
    </div>
  );
}

export default App;
