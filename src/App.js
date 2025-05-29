import React, { useState } from 'react';
import './App.css';

function App() {
  const [frontBarcodes, setFrontBarcodes] = useState([]);
  const [backBarcodes, setBackBarcodes] = useState([]);
  const [usedBackIndexes, setUsedBackIndexes] = useState([]);
  const [input, setInput] = useState('');
  const [isFrontPhase, setIsFrontPhase] = useState(true);

  const handleScan = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (isFrontPhase) {
      setFrontBarcodes([...frontBarcodes, trimmed]);
    } else {
      setBackBarcodes([...backBarcodes, trimmed]);
    }

    setInput('');
  };

  const extractPacketNo = (barcode) => {
    const parts = barcode.split(',');
    const last = parts[parts.length - 1];
    return last.includes('-') ? last.trim().toUpperCase() : barcode.trim().toUpperCase();
  };

  const comparePackets = (front, backList, usedList) => {
    const partsFront = front.split('-');
    const baseFront = partsFront.slice(0, 2).join('-');
    const suffixFront = partsFront[2] || null;

    let matchIndex = backList.findIndex((back, idx) => {
      const packetBack = extractPacketNo(back);
      const partsBack = packetBack.split('-');
      const baseBack = partsBack.slice(0, 2).join('-');
      return baseBack === baseFront && !usedList.includes(idx);
    });

    if (matchIndex === -1) return { matched: false };

    const matchedBack = extractPacketNo(backList[matchIndex]);
    const suffixBack = matchedBack.split('-')[2] || null;

    return {
      matched: true,
      exact: suffixFront === suffixBack,
      suffixFront,
      suffixBack,
      usedIndex: matchIndex
    };
  };

  const finalizeBackScan = () => {
    const updated = [];
    const newUsed = [];

    frontBarcodes.forEach((front) => {
      const result = comparePackets(front, backBarcodes, newUsed);
      if (result.matched) {
        newUsed.push(result.usedIndex);
      }
      updated.push(result);
    });

    setUsedBackIndexes(newUsed);
    return updated;
  };

  const results = finalizeBackScan();

  return (
    <div className="App">
      <h1>📦 Diamond Packet Checker</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setIsFrontPhase(true)} disabled={isFrontPhase}>
          1️⃣ Scan Front
        </button>
        <button onClick={() => setIsFrontPhase(false)} disabled={!isFrontPhase}>
          2️⃣ Scan Back
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          placeholder={isFrontPhase ? 'Scan front barcode...' : 'Scan back barcode...'}
          style={{ padding: 8, width: 300 }}
        />
        <button onClick={handleScan} style={{ marginLeft: 8 }}>➕ Add</button>
      </div>

      <div className="results">
        {frontBarcodes.map((front, idx) => {
          const result = results[idx];
          let statusIcon = '⏳';
          let message = 'Not Scanned';

          if (result) {
            if (!result.matched) {
              statusIcon = '❌';
              message = 'No matching back found';
            } else if (result.exact) {
              statusIcon = '✅';
              message = 'Matched';
            } else {
              statusIcon = '⚠️';
              message = `Suffix mismatch: Front [${result.suffixFront || '-'}], Back [${result.suffixBack || '-'}]`;
            }
          }

          return (
            <div key={idx} className="result-item">
              <strong>{idx + 1}. {front}</strong> — <span>{statusIcon} {message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
