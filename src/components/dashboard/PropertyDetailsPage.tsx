"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardShell from "@/components/search/DashboardShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/search/styles/dashboard.module.scss";

// Extended Lead interface with all details
export interface PropertyDetails {
  id: number;
  // Basic Info
  type: string; // Foreclosure, Pre-Foreclosure, Probate, Divorce, Tax Lien, Eviction, Code Violation, Bankruptcy
  status: "Active" | "Pending" | "Sold";
  publishedOn: string;
  
  // Property Info
  property: {
    image: string;
    images: string[];
    address: string;
    city: string;
    state: string;
    zip: string;
    county: string;
    parcelNumber: string;
    legalDescription: string;
    beds: number;
    baths: number;
    sqft: number;
    lotSize: number;
    yearBuilt: number;
    propertyType: string;
    zoning: string;
    appraisedValue: number;
    taxAssessedValue: number;
    lastSalePrice: number;
    lastSaleDate: string;
  };
  
  // Owner Info
  owner: {
    name: string;
    mailingAddress: string;
    mailingCity: string;
    mailingState: string;
    mailingZip: string;
    phone?: string;
    email?: string;
    ownershipType: string;
    yearsOwned: number;
    isAbsentee: boolean;
    isCorporate: boolean;
  };
  
  // Loan/Mortgage Details
  loans: {
    loanNumber: number;
    lender: string;
    loanAmount: number;
    loanDate: string;
    loanType: string;
    interestRate?: number;
    monthlyPayment?: number;
    maturityDate?: string;
    position: "1st" | "2nd" | "3rd";
  }[];
  
  // Financial Summary
  financials: {
    totalDebt: number;
    estimatedEquity: number;
    equityPercent: number;
    monthlyRent?: number;
    hoaFees?: number;
    propertyTaxes: number;
    taxDelinquent: boolean;
    taxDelinquentAmount?: number;
  };
  
  // Distress-specific details
  foreclosure?: {
    status: string;
    filingDate: string;
    auctionDate: string;
    auctionTime: string;
    auctionLocation: string;
    defaultAmount: number;
    trustee: string;
    trusteePhone: string;
    caseNumber: string;
    documentNumber: string;
  };
  
  probate?: {
    caseNumber: string;
    courtName: string;
    filingDate: string;
    hearingDate: string;
    hearingTime: string;
    hearingLocation: string;
    deceasedName: string;
    deceasedDate: string;
    executorName: string;
    executorPhone?: string;
    attorney: string;
    attorneyPhone: string;
    estimatedValue: number;
  };
  
  divorce?: {
    caseNumber: string;
    courtName: string;
    filingDate: string;
    petitioner: string;
    respondent: string;
    status: string;
    attorney?: string;
  };
  
  taxLien?: {
    lienAmount: number;
    lienDate: string;
    yearsDelinquent: number;
    redemptionDeadline: string;
    taxingAuthority: string;
    saleDate?: string;
    saleLocation?: string;
  };
  
  eviction?: {
    caseNumber: string;
    filingDate: string;
    status: string;
    reason: string;
    tenantName?: string;
    hearingDate?: string;
    courtName: string;
  };
  
  codeViolation?: {
    violationNumber: string;
    violationType: string;
    violationDate: string;
    description: string;
    fineAmount: number;
    status: string;
    complianceDeadline: string;
    inspector: string;
    department: string;
  };
  
  bankruptcy?: {
    caseNumber: string;
    chapter: "7" | "11" | "13";
    filingDate: string;
    courtName: string;
    trustee: string;
    attorney: string;
    status: string;
    dischargeDate?: string;
  };
}

// Mock data for demonstration
const MOCK_PROPERTY: PropertyDetails = {
  id: 1,
  type: "Foreclosure",
  status: "Active",
  publishedOn: "2025-01-15",
  
  property: {
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    address: "1024 Elm Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
    county: "Travis",
    parcelNumber: "0123456789",
    legalDescription: "LOT 5, BLOCK 2, AUSTIN HEIGHTS SUBDIVISION",
    beds: 4,
    baths: 3,
    sqft: 2450,
    lotSize: 0.25,
    yearBuilt: 2005,
    propertyType: "Single Family",
    zoning: "Residential",
    appraisedValue: 485000,
    taxAssessedValue: 425000,
    lastSalePrice: 320000,
    lastSaleDate: "2018-06-15",
  },
  
  owner: {
    name: "John M. Smith",
    mailingAddress: "1024 Elm Street",
    mailingCity: "Austin",
    mailingState: "TX",
    mailingZip: "78701",
    phone: "(512) 555-0123",
    email: "j.smith@email.com",
    ownershipType: "Fee Simple",
    yearsOwned: 7,
    isAbsentee: false,
    isCorporate: false,
  },
  
  loans: [
    {
      loanNumber: 1,
      lender: "Wells Fargo Bank",
      loanAmount: 280000,
      loanDate: "2018-06-15",
      loanType: "Conventional",
      interestRate: 4.25,
      monthlyPayment: 1876,
      maturityDate: "2048-06-15",
      position: "1st",
    },
    {
      loanNumber: 2,
      lender: "Chase Bank",
      loanAmount: 45000,
      loanDate: "2020-03-20",
      loanType: "HELOC",
      interestRate: 6.5,
      position: "2nd",
    },
  ],
  
  financials: {
    totalDebt: 325000,
    estimatedEquity: 160000,
    equityPercent: 33,
    monthlyRent: 2800,
    hoaFees: 150,
    propertyTaxes: 8500,
    taxDelinquent: false,
  },
  
  foreclosure: {
    status: "Notice of Default",
    filingDate: "2024-11-15",
    auctionDate: "2025-03-15",
    auctionTime: "10:00 AM",
    auctionLocation: "Travis County Courthouse, 1000 Guadalupe St, Austin, TX 78701",
    defaultAmount: 28500,
    trustee: "Barrett Daffin Frappier Turner & Engel, LLP",
    trusteePhone: "(972) 386-5040",
    caseNumber: "D-1-GN-24-007234",
    documentNumber: "2024-0123456",
  },
};

interface PropertyDetailsPageProps {
  propertyId?: number;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ propertyId }) => {
  const { canAccessPremium, maskData } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "owner" | "loans" | "distress">("overview");
  const [isSaved, setIsSaved] = useState(false);
  
  // In production, fetch property by ID
  const property = MOCK_PROPERTY;
  
  // Masking helper
  const getMaskedOrReal = (value: string, type: "name" | "address" | "phone" | "email" = "name") => {
    if (canAccessPremium()) return value;
    return maskData(value, type);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDistressColor = (type: string) => {
    const colors: Record<string, string> = {
      "Foreclosure": "#DC2626",
      "Pre-Foreclosure": "#EA580C",
      "Probate": "#7C3AED",
      "Divorce": "#DB2777",
      "Tax Lien": "#CA8A04",
      "Eviction": "#0891B2",
      "Code Violation": "#65A30D",
      "Bankruptcy": "#6366F1",
    };
    return colors[type] || "#6B7280";
  };

  const getDistressIcon = (type: string) => {
    const icons: Record<string, string> = {
      "Foreclosure": "fa-solid fa-gavel",
      "Pre-Foreclosure": "fa-solid fa-triangle-exclamation",
      "Probate": "fa-solid fa-scroll",
      "Divorce": "fa-solid fa-heart-crack",
      "Tax Lien": "fa-solid fa-file-invoice-dollar",
      "Eviction": "fa-solid fa-door-open",
      "Code Violation": "fa-solid fa-clipboard-list",
      "Bankruptcy": "fa-solid fa-ban",
    };
    return icons[type] || "fa-solid fa-house";
  };

  const renderDistressDetails = () => {
    const type = property.type;
    
    if (type === "Foreclosure" && property.foreclosure) {
      const fc = property.foreclosure;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Foreclosure Details</h3>
              <p className={styles.sectionSubtitle}>Auction and legal information</p>
            </div>
          </div>
          
          <div className={styles.alertBox} style={{ borderColor: getDistressColor(type), background: `${getDistressColor(type)}08` }}>
            <i className="fa-solid fa-clock" style={{ color: getDistressColor(type) }}></i>
            <div>
              <strong>Auction Scheduled</strong>
              <p>{formatDate(fc.auctionDate)} at {fc.auctionTime}</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
                  {fc.status}
                </span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Case Number</span>
              <span className={styles.detailValue}>{fc.caseNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Filing Date</span>
              <span className={styles.detailValue}>{formatDate(fc.filingDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Default Amount</span>
              <span className={styles.detailValue} style={{ color: getDistressColor(type), fontWeight: 700 }}>
                {formatCurrency(fc.defaultAmount)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Document Number</span>
              <span className={styles.detailValue}>{fc.documentNumber}</span>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-location-dot me-2"></i>Auction Location</h4>
            <p>{fc.auctionLocation}</p>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-user-tie me-2"></i>Trustee Information</h4>
            <div className={styles.contactInfo}>
              <p><strong>{fc.trustee}</strong></p>
              <p><i className="fa-solid fa-phone me-2"></i>{fc.trusteePhone}</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (type === "Probate" && property.probate) {
      const pb = property.probate;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Probate Details</h3>
              <p className={styles.sectionSubtitle}>Estate and court information</p>
            </div>
          </div>
          
          {pb.hearingDate && (
            <div className={styles.alertBox} style={{ borderColor: getDistressColor(type), background: `${getDistressColor(type)}08` }}>
              <i className="fa-solid fa-calendar" style={{ color: getDistressColor(type) }}></i>
              <div>
                <strong>Hearing Scheduled</strong>
                <p>{formatDate(pb.hearingDate)} at {pb.hearingTime}</p>
              </div>
            </div>
          )}
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Case Number</span>
              <span className={styles.detailValue}>{pb.caseNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Court</span>
              <span className={styles.detailValue}>{pb.courtName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Filing Date</span>
              <span className={styles.detailValue}>{formatDate(pb.filingDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Estimated Value</span>
              <span className={styles.detailValue} style={{ color: "#10B981", fontWeight: 700 }}>
                {formatCurrency(pb.estimatedValue)}
              </span>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-user me-2"></i>Deceased Information</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{pb.deceasedName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date of Death</span>
                <span className={styles.detailValue}>{formatDate(pb.deceasedDate)}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-user-tie me-2"></i>Executor / Administrator</h4>
            <div className={styles.contactInfo}>
              <p><strong>{pb.executorName}</strong></p>
              {pb.executorPhone && <p><i className="fa-solid fa-phone me-2"></i>{pb.executorPhone}</p>}
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-scale-balanced me-2"></i>Attorney</h4>
            <div className={styles.contactInfo}>
              <p><strong>{pb.attorney}</strong></p>
              <p><i className="fa-solid fa-phone me-2"></i>{pb.attorneyPhone}</p>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-location-dot me-2"></i>Hearing Location</h4>
            <p>{pb.hearingLocation}</p>
          </div>
        </div>
      );
    }
    
    if (type === "Eviction" && property.eviction) {
      const ev = property.eviction;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Eviction Details</h3>
              <p className={styles.sectionSubtitle}>Case and court information</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Case Number</span>
              <span className={styles.detailValue}>{ev.caseNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
                  {ev.status}
                </span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Filing Date</span>
              <span className={styles.detailValue}>{formatDate(ev.filingDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Court</span>
              <span className={styles.detailValue}>{ev.courtName}</span>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-circle-info me-2"></i>Reason for Eviction</h4>
            <p>{ev.reason}</p>
          </div>
          
          {ev.hearingDate && (
            <div className={styles.alertBox} style={{ borderColor: getDistressColor(type), background: `${getDistressColor(type)}08` }}>
              <i className="fa-solid fa-calendar" style={{ color: getDistressColor(type) }}></i>
              <div>
                <strong>Hearing Scheduled</strong>
                <p>{formatDate(ev.hearingDate)}</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (type === "Code Violation" && property.codeViolation) {
      const cv = property.codeViolation;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Code Violation Details</h3>
              <p className={styles.sectionSubtitle}>Violation and compliance information</p>
            </div>
          </div>
          
          <div className={styles.alertBox} style={{ borderColor: getDistressColor(type), background: `${getDistressColor(type)}08` }}>
            <i className="fa-solid fa-exclamation-triangle" style={{ color: getDistressColor(type) }}></i>
            <div>
              <strong>Compliance Deadline</strong>
              <p>{formatDate(cv.complianceDeadline)}</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Violation Number</span>
              <span className={styles.detailValue}>{cv.violationNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Violation Type</span>
              <span className={styles.detailValue}>{cv.violationType}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
                  {cv.status}
                </span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fine Amount</span>
              <span className={styles.detailValue} style={{ color: getDistressColor(type), fontWeight: 700 }}>
                {formatCurrency(cv.fineAmount)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Violation Date</span>
              <span className={styles.detailValue}>{formatDate(cv.violationDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Department</span>
              <span className={styles.detailValue}>{cv.department}</span>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-file-lines me-2"></i>Violation Description</h4>
            <p>{cv.description}</p>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-user-tie me-2"></i>Inspector</h4>
            <p><strong>{cv.inspector}</strong></p>
          </div>
        </div>
      );
    }
    
    if (type === "Tax Lien" && property.taxLien) {
      const tl = property.taxLien;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Tax Lien Details</h3>
              <p className={styles.sectionSubtitle}>Delinquent tax information</p>
            </div>
          </div>
          
          <div className={styles.alertBox} style={{ borderColor: getDistressColor(type), background: `${getDistressColor(type)}08` }}>
            <i className="fa-solid fa-calendar-xmark" style={{ color: getDistressColor(type) }}></i>
            <div>
              <strong>Redemption Deadline</strong>
              <p>{formatDate(tl.redemptionDeadline)}</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Lien Amount</span>
              <span className={styles.detailValue} style={{ color: getDistressColor(type), fontWeight: 700, fontSize: 20 }}>
                {formatCurrency(tl.lienAmount)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Years Delinquent</span>
              <span className={styles.detailValue}>{tl.yearsDelinquent} years</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Lien Date</span>
              <span className={styles.detailValue}>{formatDate(tl.lienDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Taxing Authority</span>
              <span className={styles.detailValue}>{tl.taxingAuthority}</span>
            </div>
          </div>
          
          {tl.saleDate && (
            <div className={styles.detailsCard}>
              <h4><i className="fa-solid fa-gavel me-2"></i>Tax Sale Information</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sale Date</span>
                  <span className={styles.detailValue}>{formatDate(tl.saleDate)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sale Location</span>
                  <span className={styles.detailValue}>{tl.saleLocation}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (type === "Bankruptcy" && property.bankruptcy) {
      const bk = property.bankruptcy;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Bankruptcy Details</h3>
              <p className={styles.sectionSubtitle}>Chapter {bk.chapter} filing information</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Case Number</span>
              <span className={styles.detailValue}>{bk.caseNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Chapter</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
                  Chapter {bk.chapter}
                </span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>{bk.status}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Filing Date</span>
              <span className={styles.detailValue}>{formatDate(bk.filingDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Court</span>
              <span className={styles.detailValue}>{bk.courtName}</span>
            </div>
            {bk.dischargeDate && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Discharge Date</span>
                <span className={styles.detailValue}>{formatDate(bk.dischargeDate)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-user-tie me-2"></i>Trustee</h4>
            <p><strong>{bk.trustee}</strong></p>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-scale-balanced me-2"></i>Attorney</h4>
            <p><strong>{bk.attorney}</strong></p>
          </div>
        </div>
      );
    }
    
    if (type === "Divorce" && property.divorce) {
      const dv = property.divorce;
      return (
        <div className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
              <i className={getDistressIcon(type)}></i>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Divorce Details</h3>
              <p className={styles.sectionSubtitle}>Case and parties information</p>
            </div>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Case Number</span>
              <span className={styles.detailValue}>{dv.caseNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge} style={{ background: `${getDistressColor(type)}15`, color: getDistressColor(type) }}>
                  {dv.status}
                </span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Court</span>
              <span className={styles.detailValue}>{dv.courtName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Filing Date</span>
              <span className={styles.detailValue}>{formatDate(dv.filingDate)}</span>
            </div>
          </div>
          
          <div className={styles.detailsCard}>
            <h4><i className="fa-solid fa-users me-2"></i>Parties</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Petitioner</span>
                <span className={styles.detailValue}>{dv.petitioner}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Respondent</span>
                <span className={styles.detailValue}>{dv.respondent}</span>
              </div>
            </div>
          </div>
          
          {dv.attorney && (
            <div className={styles.detailsCard}>
              <h4><i className="fa-solid fa-scale-balanced me-2"></i>Attorney</h4>
              <p><strong>{getMaskedOrReal(dv.attorney, "name")}</strong></p>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <ProtectedRoute>
      <DashboardShell
        title="Property Details"
        subtitle={`${getMaskedOrReal(property.property.address, "address")}, ${property.property.city}, ${property.property.state}`}
        actions={
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/search" className={`${styles.btn} ${styles.btnSecondary}`}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              Back to Search
            </Link>
            <button
              className={`${styles.btn} ${isSaved ? styles.btnSecondary : styles.btnPrimary}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark me-2`}></i>
              {isSaved ? "Saved" : "Save Lead"}
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <i className="fa-solid fa-download me-2"></i>
              Export
            </button>
          </div>
      }
    >
      <div className={styles.propertyDetailsPage}>
        {/* Hero Section with Images */}
        <div className={styles.propertyHero}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <Image
                src={property.property.images[activeImageIndex]}
                alt={property.property.address}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className={styles.imageBadges}>
                <span className={styles.distressBadge} style={{ background: getDistressColor(property.type) }}>
                  <i className={`${getDistressIcon(property.type)} me-1`}></i>
                  {property.type}
                </span>
                <span className={`${styles.statusBadge} ${property.status === "Active" ? styles.active : ""}`}>
                  {property.status}
                </span>
              </div>
            </div>
            <div className={styles.thumbnailStrip}>
              {property.property.images.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ""}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.priceCard}>
              <span className={styles.priceLabel}>Appraised Value</span>
              <span className={styles.priceValue}>{formatCurrency(property.property.appraisedValue)}</span>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <i className="fa-solid fa-bed"></i>
                <span>{property.property.beds} Beds</span>
              </div>
              <div className={styles.statItem}>
                <i className="fa-solid fa-bath"></i>
                <span>{property.property.baths} Baths</span>
              </div>
              <div className={styles.statItem}>
                <i className="fa-solid fa-ruler-combined"></i>
                <span>{property.property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className={styles.statItem}>
                <i className="fa-solid fa-calendar"></i>
                <span>Built {property.property.yearBuilt}</span>
              </div>
            </div>
            <div className={styles.equityBar}>
              <div className={styles.equityHeader}>
                <span>Estimated Equity</span>
                <span className={styles.equityValue}>{formatCurrency(property.financials.estimatedEquity)}</span>
              </div>
              <div className={styles.equityProgress}>
                <div className={styles.equityFill} style={{ width: `${property.financials.equityPercent}%` }}></div>
              </div>
              <span className={styles.equityPercent}>{property.financials.equityPercent}% equity</span>
            </div>
            
            {/* Quick Action Buttons */}
            <div className={styles.quickActions}>
              {property.owner.phone && (
                <a href={`tel:${property.owner.phone}`} className={`${styles.btn} ${styles.btnSuccess}`} style={{ flex: 1 }}>
                  <i className="fa-solid fa-phone me-2"></i>
                  Call Owner
                </a>
              )}
              <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ flex: 1 }}>
                <i className="fa-solid fa-envelope me-2"></i>
                Send Mail
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fa-solid fa-house me-2"></i>
            Property Overview
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "owner" ? styles.active : ""}`}
            onClick={() => setActiveTab("owner")}
          >
            <i className="fa-solid fa-user me-2"></i>
            Owner Details
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "loans" ? styles.active : ""}`}
            onClick={() => setActiveTab("loans")}
          >
            <i className="fa-solid fa-landmark me-2"></i>
            Loan Details
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "distress" ? styles.active : ""}`}
            onClick={() => setActiveTab("distress")}
          >
            <i className={`${getDistressIcon(property.type)} me-2`}></i>
            {property.type} Details
          </button>
        </div>
        
        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className={styles.detailsSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon} style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563EB" }}>
                  <i className="fa-solid fa-house"></i>
                </div>
                <div>
                  <h3 className={styles.sectionTitle}>Property Information</h3>
                  <p className={styles.sectionSubtitle}>Complete property details and specifications</p>
                </div>
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Full Address</span>
                  <span className={styles.detailValue}>{property.property.address}, {property.property.city}, {property.property.state} {property.property.zip}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>County</span>
                  <span className={styles.detailValue}>{property.property.county}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Parcel Number</span>
                  <span className={styles.detailValue}>{property.property.parcelNumber}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Property Type</span>
                  <span className={styles.detailValue}>{property.property.propertyType}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Zoning</span>
                  <span className={styles.detailValue}>{property.property.zoning}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Year Built</span>
                  <span className={styles.detailValue}>{property.property.yearBuilt}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Living Area</span>
                  <span className={styles.detailValue}>{property.property.sqft.toLocaleString()} sq ft</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Lot Size</span>
                  <span className={styles.detailValue}>{property.property.lotSize} acres</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bedrooms</span>
                  <span className={styles.detailValue}>{property.property.beds}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bathrooms</span>
                  <span className={styles.detailValue}>{property.property.baths}</span>
                </div>
              </div>
              
              <div className={styles.detailsCard}>
                <h4><i className="fa-solid fa-file-lines me-2"></i>Legal Description</h4>
                <p style={{ fontFamily: "monospace", fontSize: 13 }}>{property.property.legalDescription}</p>
              </div>
              
              <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
                <div className={styles.sectionIcon} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div>
                  <h3 className={styles.sectionTitle}>Value & Financial Summary</h3>
                  <p className={styles.sectionSubtitle}>Property valuation and debt information</p>
                </div>
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Appraised Value</span>
                  <span className={styles.detailValue} style={{ color: "#10B981", fontWeight: 700 }}>{formatCurrency(property.property.appraisedValue)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tax Assessed Value</span>
                  <span className={styles.detailValue}>{formatCurrency(property.property.taxAssessedValue)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Sale Price</span>
                  <span className={styles.detailValue}>{formatCurrency(property.property.lastSalePrice)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Sale Date</span>
                  <span className={styles.detailValue}>{formatDate(property.property.lastSaleDate)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Total Debt</span>
                  <span className={styles.detailValue} style={{ color: "#DC2626" }}>{formatCurrency(property.financials.totalDebt)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Estimated Equity</span>
                  <span className={styles.detailValue} style={{ color: "#10B981", fontWeight: 700 }}>{formatCurrency(property.financials.estimatedEquity)} ({property.financials.equityPercent}%)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Annual Property Taxes</span>
                  <span className={styles.detailValue}>{formatCurrency(property.financials.propertyTaxes)}</span>
                </div>
                {property.financials.monthlyRent && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Est. Monthly Rent</span>
                    <span className={styles.detailValue}>{formatCurrency(property.financials.monthlyRent)}/mo</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Owner Tab */}
          {activeTab === "owner" && (
            <div className={styles.detailsSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <h3 className={styles.sectionTitle}>Owner Information</h3>
                  <p className={styles.sectionSubtitle}>Property owner details and contact information</p>
                </div>
              </div>
              
              {/* Premium upgrade prompt for free users */}
              {!canAccessPremium() && (
                <div className={styles.alertBox} style={{ borderColor: "#2563EB", background: "rgba(37, 99, 235, 0.08)" }}>
                  <i className="fa-solid fa-lock" style={{ color: "#2563EB" }}></i>
                  <div>
                    <strong>Owner data is masked</strong>
                    <p>Upgrade to a paid plan to see full owner contact information.</p>
                  </div>
                  <Link href="/dashboard/subscription" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginLeft: "auto" }}>
                    Unlock Data
                  </Link>
                </div>
              )}
              
              <div className={styles.ownerCard}>
                <div className={styles.ownerAvatar}>
                  {property.owner.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className={styles.ownerInfo}>
                  <h3 className={styles.ownerName}>{getMaskedOrReal(property.owner.name, "name")}</h3>
                  <div className={styles.ownerTags}>
                    <span className={styles.ownerTag}>
                      <i className="fa-solid fa-clock me-1"></i>
                      {property.owner.yearsOwned} years owned
                    </span>
                    {property.owner.isAbsentee && (
                      <span className={styles.ownerTag} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" }}>
                        <i className="fa-solid fa-plane me-1"></i>
                        Absentee Owner
                      </span>
                    )}
                    {property.owner.isCorporate && (
                      <span className={styles.ownerTag} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                        <i className="fa-solid fa-building me-1"></i>
                        Corporate
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ownership Type</span>
                  <span className={styles.detailValue}>{property.owner.ownershipType}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Years Owned</span>
                  <span className={styles.detailValue}>{property.owner.yearsOwned} years</span>
                </div>
              </div>
              
              <div className={styles.detailsCard}>
                <h4><i className="fa-solid fa-envelope me-2"></i>Mailing Address</h4>
                <p>
                  {getMaskedOrReal(property.owner.mailingAddress, "address")}<br />
                  {property.owner.mailingCity}, {property.owner.mailingState} {property.owner.mailingZip}
                </p>
              </div>
              
              {(property.owner.phone || property.owner.email) && (
                <div className={styles.detailsCard}>
                  <h4><i className="fa-solid fa-address-book me-2"></i>Contact Information</h4>
                  <div className={styles.contactInfo}>
                    {property.owner.phone && (
                      <span className={styles.contactLink} style={{ cursor: canAccessPremium() ? "pointer" : "not-allowed" }}>
                        <i className="fa-solid fa-phone"></i>
                        {getMaskedOrReal(property.owner.phone, "phone")}
                      </span>
                    )}
                    {property.owner.email && (
                      <span className={styles.contactLink} style={{ cursor: canAccessPremium() ? "pointer" : "not-allowed" }}>
                        <i className="fa-solid fa-envelope"></i>
                        {getMaskedOrReal(property.owner.email, "email")}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Skip Trace CTA */}
              <div className={styles.skipTraceCta}>
                <div className={styles.skipTraceIcon}>
                  <i className="fa-solid fa-magnifying-glass-location"></i>
                </div>
                <div className={styles.skipTraceInfo}>
                  <h4>Need More Contact Info?</h4>
                  <p>Use Skip Tracing to find additional phone numbers, emails, and social media profiles.</p>
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  <i className="fa-solid fa-search me-2"></i>
                  Skip Trace Owner
                </button>
              </div>
            </div>
          )}
          
          {/* Loans Tab */}
          {activeTab === "loans" && (
            <div className={styles.detailsSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                  <i className="fa-solid fa-landmark"></i>
                </div>
                <div>
                  <h3 className={styles.sectionTitle}>Loan & Mortgage Details</h3>
                  <p className={styles.sectionSubtitle}>{property.loans.length} mortgage(s) on file</p>
                </div>
              </div>
              
              {/* Loan Summary */}
              <div className={styles.loanSummary}>
                <div className={styles.loanSummaryItem}>
                  <span className={styles.loanSummaryLabel}>Total Debt</span>
                  <span className={styles.loanSummaryValue} style={{ color: "#DC2626" }}>
                    {formatCurrency(property.financials.totalDebt)}
                  </span>
                </div>
                <div className={styles.loanSummaryItem}>
                  <span className={styles.loanSummaryLabel}>Appraised Value</span>
                  <span className={styles.loanSummaryValue} style={{ color: "#10B981" }}>
                    {formatCurrency(property.property.appraisedValue)}
                  </span>
                </div>
                <div className={styles.loanSummaryItem}>
                  <span className={styles.loanSummaryLabel}>Est. Equity</span>
                  <span className={styles.loanSummaryValue} style={{ color: "#2563EB" }}>
                    {formatCurrency(property.financials.estimatedEquity)}
                  </span>
                </div>
              </div>
              
              {/* Individual Loans */}
              {property.loans.map((loan, index) => (
                <div key={index} className={styles.loanCard}>
                  <div className={styles.loanHeader}>
                    <span className={styles.loanPosition}>{loan.position} Mortgage</span>
                    <span className={styles.loanAmount}>{formatCurrency(loan.loanAmount)}</span>
                  </div>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Lender</span>
                      <span className={styles.detailValue}>{loan.lender}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Loan Type</span>
                      <span className={styles.detailValue}>{loan.loanType}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Original Amount</span>
                      <span className={styles.detailValue}>{formatCurrency(loan.loanAmount)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Loan Date</span>
                      <span className={styles.detailValue}>{formatDate(loan.loanDate)}</span>
                    </div>
                    {loan.interestRate && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Interest Rate</span>
                        <span className={styles.detailValue}>{loan.interestRate}%</span>
                      </div>
                    )}
                    {loan.monthlyPayment && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Monthly Payment</span>
                        <span className={styles.detailValue}>{formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                    )}
                    {loan.maturityDate && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Maturity Date</span>
                        <span className={styles.detailValue}>{formatDate(loan.maturityDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Distress-specific Tab */}
          {activeTab === "distress" && renderDistressDetails()}
        </div>
      </div>
      </DashboardShell>
    </ProtectedRoute>
  );
};

export default PropertyDetailsPage;
