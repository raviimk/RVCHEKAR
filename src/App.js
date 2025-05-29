import React, { useState } from 'react';

function App() {
  const [frontBarcode, setFrontBarcode] = useState('');
  const [backBarcode, setBackBarcode] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  const extractPacketFront = (barcode) => {
    const regex = /([0-9]+-[0-9]+(-[A-Z])?)$/;
    const match = barcode.match(regex);
    return match ? match[0] : null;
  };

  const extractPacketBack = (barcode) => {
    const parts = barcode.split(',');
    return parts.length ? parts[parts.length - 1].trim() : null;
  };

  const checkMatch = () => {
    const front = extractPacketFront(frontBarcode);
    const back = extractPacketBack(backBarcode);
    if (!front || !back) {
      setMatchResult(null);
      return;
    }
    setMatchResult(front === back);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Diamond Packet Barcode Checker</h2>
      <div style={{ marginBottom: 15 }}>
        <label>Front Barcode:</label><br />
        <input
          type="text"
          value={frontBarcode}
          onChange={e => setFrontBarcode(e.target.value)}
          placeholder="e.g. R61-59-D"
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <div style={{ marginBottom: 15 }}>
        <label>Back Barcode:</label><br />
        <input
          type="text"
          value={backBarcode}
          onChange={e => setBackBarcode(e.target.value)}
          placeholder="e.g. 1.64,13.1,32.50,...,61-59-D"
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <button onClick={checkMatch} style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}>
        Check Match
      </button>
      <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
        {matchResult === null && <span>Enter barcodes and click Check Match</span>}
        {matchResult === true && <span style={{ color: 'green' }}>✅ Barcodes Match</span>}
        {matchResult === false && <span style={{ color: 'red' }}>❌ Barcodes Do Not Match</span>}
      </div>
    </div>
  );
}

export default App;
