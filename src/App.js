import React, { useState } from 'react';

function App() {
  const [frontBarcodes, setFrontBarcodes] = useState([]);
  const [backBarcodes, setBackBarcodes] = useState([]);
  const [mode, setMode] = useState('front'); // 'front' or 'back'

  const extractPacketFront = (barcode) => {
    const regex = /([0-9]+-[0-9]+(-[A-Z])?)$/;
    const match = barcode.match(regex);
    return match ? match[0] : null;
  };

  const extractPacketBack = (barcode) => {
    const parts = barcode.split(',');
    return parts.length ? parts[parts.length - 1].trim() : null;
  };

  const handleScan = (e) => {
    const value = e.target.value.trim();
    if (!value) return;
    e.target.value = '';

    if (mode === 'front') {
      const packet = extractPacketFront(value);
      if (packet && !frontBarcodes.includes(packet)) {
        setFrontBarcodes([...frontBarcodes, packet]);
      }
    } else {
      const packet = extractPacketBack(value);
      if (packet && !backBarcodes.includes(packet)) {
        setBackBarcodes([...backBarcodes, packet]);
      }
    }
  };

  const getStatus = (packet) => {
    if (backBarcodes.includes(packet)) return '✅ Match';
    return '❌ Not Scanned';
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Diamond Packet Multi Barcode Checker</h2>

      <div style={{ marginBottom: 15 }}>
        <button onClick={() => setMode('front')} disabled={mode === 'front'}>
          Step 1: Scan Front
        </button>
        <button onClick={() => setMode('back')} disabled={mode === 'back'} style={{ marginLeft: 10 }}>
          Step 2: Scan Back
        </button>
      </div>

      <input
        type="text"
        placeholder={mode === 'front' ? 'Scan front barcode...' : 'Scan back barcode...'}
        onKeyDown={(e) => e.key === 'Enter' && handleScan(e)}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />

      <div style={{ marginTop: 30 }}>
        <h3>Front Packets ({frontBarcodes.length})</h3>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Packet No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {frontBarcodes.map((packet, idx) => (
              <tr key={idx} style={{ backgroundColor: backBarcodes.includes(packet) ? '#c8f7c5' : '#f7c5c5' }}>
                <td>{idx + 1}</td>
                <td>{packet}</td>
                <td>{getStatus(packet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Back Scanned Packets ({backBarcodes.length})</h3>
        <ul>
          {backBarcodes.map((packet, idx) => (
            <li key={idx}>{packet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
