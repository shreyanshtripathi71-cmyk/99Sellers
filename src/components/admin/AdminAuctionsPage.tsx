"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";

interface Auction {
  AAuctionID?: number | string;
  APropertyID?: number | string;
  AAuctionDateTime?: string;
  AAuctionPlace?: string;
  AAuctionCity?: string;
  AAuctionState?: string;
  AAuctionDescription?: string;
  status?: string;
  Property?: {
    id?: number | string;
    PStreetNum?: string;
    PStreetName?: string;
    PCity?: string;
    PState?: string;
    PPrice?: number | string;
  };
}

const AdminAuctionsPage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.auctions.getAll();
      if (response.success && response.data) {
        setAuctions(response.data);
      } else {
        setError(response.error || "Failed to fetch auctions");
      }
    } catch (err) {
      setError("Failed to fetch auctions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId: number | string | undefined) => {
    if (!auctionId) return;
    if (!confirm("Are you sure you want to delete this auction?")) return;
    try {
      const response = await adminAPI.auctions.delete(Number(auctionId));
      if (response.success) {
        await fetchAuctions();
      } else {
        setError(response.error || "Failed to delete auction");
      }
    } catch (err) {
      setError("Failed to delete auction");
      console.error(err);
    }
  };

  const filteredAuctions = auctions.filter((auction) => {
    const address = ((auction.Property?.PStreetNum || "") + " " + (auction.Property?.PStreetName || "") + " " + (auction.Property?.PCity || "")).toLowerCase();
    const matchesSearch = address.includes(searchTerm.toLowerCase()) || 
                          (auction.AAuctionPlace || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || auction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price?: number | string) => {
    if (!price) return "N/A";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return { bg: "#dcfce7", color: "#166534" };
      case "upcoming": return { bg: "#dbeafe", color: "#1d4ed8" };
      case "ended": return { bg: "#f1f5f9", color: "#475569" };
      case "cancelled": return { bg: "#fef2f2", color: "#dc2626" };
      default: return { bg: "#fef3c7", color: "#92400e" };
    }
  };

  // Stats
  const totalAuctions = auctions.length;
  const activeAuctions = auctions.filter(a => a.status === "active").length;
  const upcomingAuctions = auctions.filter(a => a.status === "upcoming").length;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 8 }}>
              Auctions Management
            </h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
              Manage property auctions and bidding
            </p>
          </div>
          <button
            onClick={fetchAuctions}
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

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Total Auctions</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalAuctions}</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Active</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{activeAuctions}</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Upcoming</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{upcomingAuctions}</div>
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
              placeholder="Search by address or venue..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
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
          Loading auctions...
        </div>
      ) : (
        /* Auctions Table */
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
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Property</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date & Time</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuctions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                      No auctions found
                    </td>
                  </tr>
                ) : (
                  filteredAuctions.slice(0, 50).map((auction, idx) => {
                    const statusStyle = getStatusColor(auction.status);
                    return (
                      <tr key={auction.AAuctionID} style={{ borderTop: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>{auction.AAuctionID}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                          {auction.Property ? (
                            (auction.Property.PStreetNum || "") + " " + (auction.Property.PStreetName || "")
                          ) : (
                            <span style={{ color: "#94a3b8" }}>No property linked</span>
                          )}
                          {auction.Property?.PCity && (
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                              {auction.Property.PCity}, {auction.Property.PState}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>
                          {formatDate(auction.AAuctionDateTime)}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>
                          {auction.AAuctionPlace || "-"}
                          {auction.AAuctionCity && (
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                              {auction.AAuctionCity}, {auction.AAuctionState}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                          {formatPrice(auction.Property?.PPrice)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}>
                            {auction.status || "Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <a
                              href={"/property/" + auction.APropertyID}
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
                              title="View Property"
                            >
                              <i className="fa-solid fa-eye" style={{ fontSize: 12 }}></i>
                            </a>
                            <button
                              onClick={() => handleDeleteAuction(auction.AAuctionID)}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing {Math.min(filteredAuctions.length, 50)} of {filteredAuctions.length} auctions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuctionsPage;
