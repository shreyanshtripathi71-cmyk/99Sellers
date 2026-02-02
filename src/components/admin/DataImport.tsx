"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

interface ImportResult {
  success: boolean;
  totalRows: number;
  imported: number;
  failed: number;
  errors: string[];
}

const IMPORT_TARGETS = [
  { id: "properties", name: "Properties", icon: "fa-building", description: "Import property listings" },
  { id: "owners", name: "Owners", icon: "fa-user-tie", description: "Import owner information" },
  { id: "auctions", name: "Auctions", icon: "fa-gavel", description: "Import auction data" },
  { id: "loans", name: "Loans", icon: "fa-money-bill-wave", description: "Import loan records" },
  { id: "users", name: "Users", icon: "fa-users", description: "Import user accounts" },
];

const DataImport = () => {
  const [selectedTarget, setSelectedTarget] = useState<string>("properties");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".csv")) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
    parsePreview(selectedFile);
  };

  const parsePreview = async (file: File) => {
    // Simple CSV preview parser
    const text = await file.text();
    const lines = text.split("\n").slice(0, 6); // Header + 5 rows
    const parsed = lines.map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")));
    setPreview(parsed);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", selectedTarget);

      // Simulate API call - in production this would be a real endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result
      const mockResult: ImportResult = {
        success: true,
        totalRows: Math.floor(Math.random() * 100) + 50,
        imported: Math.floor(Math.random() * 90) + 40,
        failed: Math.floor(Math.random() * 10),
        errors: [],
      };
      mockResult.errors = mockResult.failed > 0 
        ? [`Row 12: Invalid email format`, `Row 45: Missing required field 'address'`]
        : [];

      setResult(mockResult);
      toast.success(`Successfully imported ${mockResult.imported} records!`);
    } catch (error) {
      toast.error("Import failed. Please try again.");
      setResult({
        success: false,
        totalRows: 0,
        imported: 0,
        failed: 0,
        errors: ["Connection error. Please try again."],
      });
    } finally {
      setImporting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
          Data Import
        </h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Upload CSV or Excel files to import data directly to the database
        </p>
      </div>

      {/* Target Selection */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
          1. Select Import Target
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {IMPORT_TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedTarget(target.id)}
              style={{
                padding: 16,
                border: selectedTarget === target.id ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                borderRadius: 8,
                background: selectedTarget === target.id ? "#eff6ff" : "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <i className={`fa-solid ${target.icon}`} style={{ 
                color: selectedTarget === target.id ? "#3b82f6" : "#64748b",
                fontSize: 20,
                marginBottom: 8,
                display: "block",
              }} />
              <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{target.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{target.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
          2. Upload File
        </h3>
        
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? "#3b82f6" : "#d1d5db"}`,
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
            background: dragActive ? "#eff6ff" : "#f8fafc",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          
          {file ? (
            <>
              <i className="fa-solid fa-file-csv" style={{ fontSize: 48, color: "#22c55e", marginBottom: 16 }} />
              <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{file.name}</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                style={{
                  marginTop: 16,
                  padding: "8px 16px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                <i className="fa-solid fa-times me-2"></i>
                Remove
              </button>
            </>
          ) : (
            <>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 48, color: "#94a3b8", marginBottom: 16 }} />
              <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                Drop your file here or click to browse
              </div>
              <div style={{ color: "#64748b", fontSize: 14 }}>
                Supports CSV, XLS, XLSX files up to 10MB
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
            3. Preview Data
          </h3>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {preview[0]?.map((header: string, i: number) => (
                    <th key={i} style={{ 
                      padding: "10px 12px", 
                      textAlign: "left", 
                      background: "#f1f5f9",
                      borderBottom: "2px solid #e2e8f0",
                      fontWeight: 600,
                      color: "#374151",
                      whiteSpace: "nowrap",
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} style={{ 
                        padding: "10px 12px", 
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: 16, color: "#64748b", fontSize: 13 }}>
            Showing first 5 rows of data
          </div>
        </div>
      )}

      {/* Import Button */}
      {file && (
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <button
            onClick={handleImport}
            disabled={importing}
            style={{
              padding: "14px 32px",
              background: importing ? "#94a3b8" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: importing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {importing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Importing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-database"></i>
                Import to {IMPORT_TARGETS.find(t => t.id === selectedTarget)?.name}
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{
          background: result.success ? "#f0fdf4" : "#fef2f2",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          border: `1px solid ${result.success ? "#86efac" : "#fecaca"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <i className={`fa-solid ${result.success ? "fa-check-circle" : "fa-times-circle"}`}
               style={{ fontSize: 24, color: result.success ? "#22c55e" : "#ef4444" }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: result.success ? "#166534" : "#991b1b", margin: 0 }}>
              {result.success ? "Import Completed" : "Import Failed"}
            </h3>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{result.totalRows}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Total Rows</div>
            </div>
            <div style={{ background: "#fff", padding: 16, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{result.imported}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Imported</div>
            </div>
            <div style={{ background: "#fff", padding: 16, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{result.failed}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Failed</div>
            </div>
          </div>
          
          {result.errors.length > 0 && (
            <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, color: "#991b1b", marginBottom: 8 }}>Errors:</div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#64748b", fontSize: 13 }}>
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Template Download */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
          Need a template?
        </h3>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
          Download a CSV template with the correct column headers for each data type
        </p>
        
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {IMPORT_TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => toast.info(`Downloading ${target.name} template...`)}
              style={{
                padding: "8px 16px",
                background: "#f1f5f9",
                color: "#374151",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-download"></i>
              {target.name} Template
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataImport;
