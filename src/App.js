import React, { useState, useEffect } from "react";

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    marginLeft: 10,
    padding: "2px 8px",
    borderRadius: 5,
    fontWeight: "bold",
    color: "white",
    backgroundColor:
      status === "exact"
        ? "green"
        : status === "not_scanned"
        ? "gray"
        : "orange",
  };
  const text =
    status === "exact"
      ? "✅ Exact Match"
      : status === "not_scanned"
      ? "❌ Not Scanned"
      : "⚠ Suffix Mismatch";
  return <span style={styles}>{text}</span>;
};

// FrontBarcodeInput Component
const FrontBarcodeInput = ({ onAdd }) => {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Front Barcode Scan</h2>
      <input
        type="text"
        placeholder="Enter Front Barcode and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button
        onClick={handleAdd}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          border: "none",
          color: "white",
          borderRadius: 5,
          fontWeight: "bold",
        }}
      >
        Add Front Barcode
      </button>
    </div>
  );
};

// BackBarcodeInput Component
const BackBarcodeInput = ({ onAdd }) => {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Back Barcode Scan</h2>
      <input
        type="text"
        placeholder="Enter Back Barcode and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button
        onClick={handleAdd}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#28a745",
          border: "none",
          color: "white",
          borderRadius: 5,
          fontWeight: "bold",
        }}
      >
        Add Back Barcode
      </button>
    </div>
  );
};

// Main App
export default function App() {
  const [frontBarcodes, setFrontBarcodes] = useState([]);
  const [backBarcodes, setBackBarcodes] = useState([]);
  const [usedBacks, setUsedBacks] = useState([]);

  // Add front barcode
  const addFrontBarcode = (barcode) => {
    if (!frontBarcodes.includes(barcode)) {
      setFrontBarcodes((prev) => [...prev, barcode]);
    }
  };

  // Add back barcode & reset used backs
  const addBackBarcode = (barcode) => {
    if (!backBarcodes.includes(barcode)) {
      setBackBarcodes((prev) => [...prev, barcode]);
      setUsedBacks([]); // reset usage tracking when new back added
    }
  };

  // Compare function
  const comparePackets = (front, backs, used) => {
    const partsFront = front.split("-");
    const baseFront = partsFront.slice(0, 2).join("-");
    const suffixFront = partsFront[2] || null;

    const matchIndex = backs.findIndex(
      (back, idx) => {
        if (used.includes(idx)) return false;
        const partsBack = back.split("-");
        const baseBack = partsBack.slice(0, 2).join("-");
        return baseBack === baseFront;
      }
    );

    if (matchIndex === -1) return { matched: false };

    const matchedBack = backs[matchIndex];
    const suffixBack = matchedBack.split("-")[2] || null;

    return {
      matched: true,
      exact: suffixFront === suffixBack,
      suffixFront,
      suffixBack,
      usedIndex: matchIndex,
    };
  };

  // Get status for front barcode
  const getStatus = (front) => {
    const result = comparePackets(front, backBarcodes, usedBacks);

    if (!result.matched) return { text: "❌ Not Scanned", status: "not_scanned" };

    if (!usedBacks.includes(result.usedIndex)) {
      setUsedBacks((prev) => [...prev, result.usedIndex]);
    }

    if (result.exact) return { text: "✅ Exact Match", status: "exact" };

    return {
      text: `⚠ Base match but suffix differs (Front=${result.suffixFront || "None"}, Back=${result.suffixBack || "None"})`,
      status: "mismatch",
    };
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "30px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 20,
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        borderRadius: 10,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Diamond Barcode Checker
      </h1>

      <FrontBarcodeInput onAdd={addFrontBarcode} />

      <BackBarcodeInput onAdd={addBackBarcode} />

      <div>
        <h2>Front Barcodes Status</h2>
        {frontBarcodes.length === 0 && <p>No front barcodes scanned yet.</p>}
        <ul>
          {frontBarcodes.map((front, idx) => {
            const status = getStatus(front);
            return (
              <li
                key={idx}
                style={{
                  marginBottom: 8,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  backgroundColor:
                    status.status === "exact"
                      ? "#e0f9e0"
                      : status.status === "not_scanned"
                      ? "#f0f0f0"
                      : "#fff4e5",
                  fontWeight: status.status === "mismatch" ? "bold" : "normal",
                }}
              >
                {front} <StatusBadge status={status.status} />
                {status.status === "mismatch" && (
                  <div style={{ marginTop: 6, color: "#d67f00", fontSize: 14 }}>
                    Warning: Suffix mismatch detected!
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Back Barcodes Scanned</h2>
        {backBarcodes.length === 0 && <p>No back barcodes scanned yet.</p>}
        <ul>
          {backBarcodes.map((back, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: 6,
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: 6,
                backgroundColor: "#eef6f7",
              }}
            >
              {back}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
