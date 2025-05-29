import React, { useState } from "react";
import "./App.css";

function App() {
  const [frontList, setFrontList] = useState([]);
  const [backList, setBackList] = useState([]);
  const [usedBacks, setUsedBacks] = useState([]);

  const [mode, setMode] = useState("front"); // 'front' or 'back'

  const handleScan = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (!value) return;

      if (mode === "front") {
        setFrontList([...frontList, value]);
      } else {
        setBackList([...backList, value]);
      }

      e.target.value = "";
    }
  };

  const extractPacketFromBack = (back) => {
    const parts = back.split(",");
    const last = parts[parts.length - 1];
    return last.trim();
  };

  const comparePackets = (front, backList, usedList) => {
    const partsFront = front.split("-");
    const baseFront = partsFront.slice(0, 2).join("-");
    const suffixFront = partsFront[2] || null;

    let matchIndex = backList.findIndex((back, idx) => {
      const packetBack = extractPacketFromBack(back);
      const partsBack = packetBack.split("-");
      const baseBack = partsBack.slice(0, 2).join("-");
      return baseBack === baseFront && !usedList.includes(idx);
    });

    if (matchIndex === -1) return { matched: false };

    const match = backList[matchIndex];
    const packetBack = extractPacketFromBack(match);
    const suffixBack = packetBack.split("-")[2] || null;

    return {
      matched: true,
      exact: suffixFront === suffixBack,
      suffixFront,
      suffixBack,
      usedIndex: matchIndex,
      fullBack: match,
    };
  };

  const renderResult = (front) => {
    const result = comparePackets(front, backList, usedBacks);
    if (!result.matched) {
      return (
        <span className="status error">❌ Not Scanned</span>
      );
    }

    const { exact, suffixFront, suffixBack, usedIndex } = result;

    if (!usedBacks.includes(usedIndex)) {
      setUsedBacks([...usedBacks, usedIndex]);
    }

    if (exact) {
      return <span className="status success">✅ Matched</span>;
    } else {
      return (
        <span className="status warning">
          ⚠️ Diff: {suffixFront || "None"} vs {suffixBack || "None"}
        </span>
      );
    }
  };

  return (
    <div className="App">
      <h1>💎 Diamond Packet Front-Back Checker</h1>

      <div className="controls">
        <button
          className={mode === "front" ? "active" : ""}
          onClick={() => setMode("front")}
        >
          Scan Front
        </button>
        <button
          className={mode === "back" ? "active" : ""}
          onClick={() => setMode("back")}
        >
          Scan Back
        </button>
      </div>

      <input
        type="text"
        onKeyDown={handleScan}
        placeholder={`Scan ${mode.toUpperCase()} Barcode`}
        autoFocus
      />

      <div className="lists">
        <div className="front-list">
          <h2>Front Barcodes</h2>
          <ul>
            {frontList.map((front, idx) => (
              <li key={idx}>
                <strong>{front}</strong> - {renderResult(front)}
              </li>
            ))}
          </ul>
        </div>

        <div className="back-list">
          <h2>Back Barcodes</h2>
          <ul>
            {backList.map((back, idx) => {
              const packet = extractPacketFromBack(back);
              const used = usedBacks.includes(idx);
              return (
                <li
                  key={idx}
                  className={used ? "used" : "unused"}
                >
                  {packet}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
