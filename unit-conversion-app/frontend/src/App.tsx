import { useState } from "react";
import { ConvertSize } from "../wailsjs/go/main/App";
import "./App.css";

function UnitConverter() {
  const [input, setInput] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("MB");
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDecimals, setShowDecimals] = useState(false);

  const unitOrder = ["B", "KB", "MB", "GB", "TB", "PB"];

  const handleConvert = async () => {
    console.log("Converting input:", input, selectedUnit);

    if (!input) {
      setError("サイズを入力してください");
      return;
    }

    try {
      const inputWithUnit = `${input}${selectedUnit}`;
      const converted = await ConvertSize(inputWithUnit);

      if (!converted || Object.keys(converted).length === 0) {
        setError(
          "無効な入力形式です。正しい形式で入力してください（例: 2048MB, 1GB）"
        );
        return;
      }
      setResults(converted);
      setError(null);
    } catch (err) {
      setError("エラーが発生しました。入力を確認してください。");
    }
  };

  return (
    <div className="container">
      <h1>バイト換算</h1>
      <div className="input-group">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="サイズを入力"
          onKeyDown={(e) => e.key === "Enter" && handleConvert()}
        />
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="unit-select"
        >
          {unitOrder.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <button onClick={handleConvert}>変換</button>
      </div>

      <div className="options">
        <label>
          小数点以下を表示
          <input
            type="checkbox"
            checked={showDecimals}
            onChange={(e) => setShowDecimals(e.target.checked)}
          />
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      {results && (
        <div className="results">
          {unitOrder
            .filter((unit) => unit in results)
            .map((unit) => (
              <div key={unit} className="result-item">
                <span className="unit">
                  {results[unit].toLocaleString(undefined, {
                    minimumFractionDigits: showDecimals ? 2 : 0,
                    maximumFractionDigits: showDecimals ? 2 : 0,
                  })}
                </span>
                <span className="unit">{unit}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default UnitConverter;
