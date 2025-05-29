import React, { useState } from "react";

function App() {
  const [frontBarcodes, setFrontBarcodes] = useState([]);
  const [backBarcodes, setBackBarcodes] = useState([]);
  const [usedBacks, setUsedBacks] = useState([]);
  const [frontInput, setFrontInput] = useState("");
  const [backInput, setBackInput] = useState("");

  // Compare front and back packets
  const comparePackets = (front, backList, usedList) => {
    const partsFront = front.split("-");
    const baseFront = partsFront.slice(0, 2).join("-");
    const suffixFront = partsFront[2] || null;

    let matchIndex = backList.findIndex((back, idx) => {
      const partsBack = back.split("-");
      const baseBack = partsBack.slice(0, 2).join("-");
      return baseBack === baseFront && !usedList.includes(idx);
    });

    if (matchIndex === -1) return { matched: false };

    const match = backList[matchIndex];
    const suffixBack = match.split("-")[2] || null;

    return {
      matched: true,
      exact: suffixFront === suffixBack,
      suffixFront,
      suffixBack,
      usedIndex: matchIndex,
    };
  };

  // Handle front barcode scan (add)
  const handleFrontScan = () => {
    if (frontInput.trim() !== "") {
      setFrontBarcodes((prev) => [...prev, frontInput.trim()]);
      setFrontInput("");
    }
  };

  // Handle back barcode scan (add)
  const handleBackScan = () => {
    if (backInput.trim() !== "") {
      setBackBarcodes((prev) => [...prev, backInput.trim()]);
      setBackInput("");
      setUsedBacks([]); // reset used backs on every new back barcode added
    }
  };

  // Get status for each front packet
  const getStatus = (packet) => {
    const result = comparePackets(packet, backBarcodes, usedBacks);

    if (!result.matched) return "❌ Not Scanned";

    // Mark this back barcode as used
    if (!usedBacks.includes(result.usedIndex)) {
      setUsedBacks((prev) => [...prev, result.usedIndex]);
    }

    if (result.exact) return "✅ Exact Match";

    return `⚠ Number Match thay pn lochho che (Front=${result.suffixFront || "None"}, Back=${result.suffixBack || "None"})`;
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial" }}>
      <h1>Diamond Packet Barcode Checker</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>Scan Front Barcodes</h2>
        <input
          type="text"
          placeholder="Enter Front Barcode and press Enter"
          value={frontInput}
          onChange={(e) => setFrontInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFrontScan();
          }}
          style={{ width: "100%", padding: 8, fontSize: 16 }}
        />
        <button onClick={handleFrontScan} style={{ marginTop: 10, padding: "8px 16px" }}>
          Add Front Barcode
        </button>
        <ul>
          {frontBarcodes.map((packet, idx) => (
            <li key={idx}>
              {packet} — <strong>{getStatus(packet)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>Scan Back Barcodes</h2>
        <input
          type="text"
          placeholder="Enter Back Barcode and press Enter"
          value={backInput}
          onChange={(e) => setBackInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBackScan();
          }}
          style={{ width: "100%", padding: 8, fontSize: 16 }}
        />
        <button onClick={handleBackScan} style={{ marginTop: 10, padding: "8px 16px" }}>
          Add Back Barcode
        </button>
        <ul>
          {backBarcodes.map((packet, idx) => (
            <li key={idx}>{packet}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
