"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";

interface Property {
  id: number;
  PStreetNum?: string;
  PStreetName?: string;
  PCity?: string;
  PState?: string;
  PZip?: string;
  PType?: string;
  PPrice?: string | number;
  PBeds?: string;
  PBaths?: string;
  PSqFt?: string;
  status?: string;
  createdAt?: string;
}

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.properties.getAll();
      if (response.success && response.data) {
        setProperties(response.data);
      } else {
        setError(response.error || "Failed to fetch properties");
      }
    } catch (err) {
      setError("Failed to fetch properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const response = await adminAPI.properties.delete(propertyId);
      if (response.success) {
        await fetchProperties();
      } else {
        setError(response.error || "Failed to delete property");
      }
    } catch (err) {
      setError("Failed to delete property");
      console.error(err);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const address = ((property.PStreetNum || "") + " " + (property.PStreetName || "") + " " + (property.PCity || "")).toLowerCase();
    const matchesSearch = address.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || property.PType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price?: string | number) => {
    if (!price) return "N/A";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const propertyTypes = ["all", "Single Family", "Multi Family", "Condo", "Townhouse", "Commercial", "Land"];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 8 }}>
              Properties Management
            </h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
              Manage all properties in the system ({properties.length} total)
            </p>
          </div>
          <button
            onClick={fetchProperties}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          padding: 16,
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          color: "#991B1B",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B" }}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <i className="fa-solid fa-search" style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              fontSize: 14,
            }}></i>
            <input
              type="text"
              placeholder="Search by address, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {propertyTypes.map(type => (
              <option key={type} value={type}>
                {type === "all" ? "All Property Types" : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          color: "#64748b",
        }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
          Loading properties...
        </div>
      ) : (
        /* Properties Table */
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>City</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>State</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                      No properties found
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, 50).map((property, idx) => (
                    <tr key={property.id} style={{ borderTop: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>{property.id}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                        {property.PStreetNum} {property.PStreetName}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>{property.PCity || "-"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>{property.PState || "-"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "4px 10px",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                        }}>
                          {property.PType || "Unknown"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                        {formatPrice(property.PPrice)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <a
                            href={"/property/" + property.id}
                            target="_blank"
                            style={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#eff6ff",
                              color: "#3b82f6",
                              borderRadius: 6,
                              textDecoration: "none",
                            }}
                            title="View"
                          >
                            <i className="fa-solid fa-eye" style={{ fontSize: 12 }}></i>
                          </a>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            style={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#fef2f2",
                              color: "#ef4444",
                              border: "none",
                              borderRadius: 6,
                              cursor: "pointer",
                            }}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash" style={{ fontSize: 12 }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing {Math.min(filteredProperties.length, 50)} of {filteredProperties.length} properties
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertiesPage;
