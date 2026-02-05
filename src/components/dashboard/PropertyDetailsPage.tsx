"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/search/DashboardShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { toggleSavedLead, isLeadSaved } from "@/services/savedLeadsService";
import FeatureGatePopup from "@/components/ui/FeatureGatePopup";
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

// Mock data for demonstration - 5 different property types
const MOCK_PROPERTIES: Record<number, PropertyDetails> = {
  // Property 1: Foreclosure
  1: {
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
  },

  // Property 2: Probate
  2: {
    id: 2,
    type: "Probate",
    status: "Active",
    publishedOn: "2025-01-10",
    property: {
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800",
      ],
      address: "742 Sunset Boulevard",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      county: "Dallas",
      parcelNumber: "9876543210",
      legalDescription: "LOT 12, BLOCK 7, HIGHLAND PARK ESTATES",
      beds: 5,
      baths: 4,
      sqft: 3200,
      lotSize: 0.35,
      yearBuilt: 1998,
      propertyType: "Single Family",
      zoning: "Residential",
      appraisedValue: 650000,
      taxAssessedValue: 580000,
      lastSalePrice: 420000,
      lastSaleDate: "2010-03-22",
    },
    owner: {
      name: "Estate of Margaret Williams",
      mailingAddress: "742 Sunset Boulevard",
      mailingCity: "Dallas",
      mailingState: "TX",
      mailingZip: "75201",
      phone: "(214) 555-0456",
      email: "williams.estate@email.com",
      ownershipType: "Estate",
      yearsOwned: 15,
      isAbsentee: true,
      isCorporate: false,
    },
    loans: [
      {
        loanNumber: 1,
        lender: "Bank of America",
        loanAmount: 350000,
        loanDate: "2010-03-22",
        loanType: "Conventional",
        interestRate: 5.0,
        monthlyPayment: 2100,
        maturityDate: "2040-03-22",
        position: "1st",
      },
    ],
    financials: {
      totalDebt: 280000,
      estimatedEquity: 370000,
      equityPercent: 57,
      monthlyRent: 3500,
      hoaFees: 200,
      propertyTaxes: 12000,
      taxDelinquent: false,
    },
    probate: {
      caseNumber: "PR-2024-08234",
      courtName: "Dallas County Probate Court No. 2",
      filingDate: "2024-09-15",
      hearingDate: "2025-02-20",
      hearingTime: "9:00 AM",
      hearingLocation: "Dallas County Courthouse, 600 Commerce St, Dallas, TX 75202",
      deceasedName: "Margaret A. Williams",
      deceasedDate: "2024-08-20",
      executorName: "Robert Williams",
      executorPhone: "(214) 555-0789",
      attorney: "Thompson & Associates Law Firm",
      attorneyPhone: "(214) 555-1234",
      estimatedValue: 650000,
    },
  },

  // Property 3: Divorce
  3: {
    id: 3,
    type: "Divorce",
    status: "Active",
    publishedOn: "2025-01-08",
    property: {
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      images: [
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      ],
      address: "888 Oak Lane",
      city: "Houston",
      state: "TX",
      zip: "77002",
      county: "Harris",
      parcelNumber: "5551234567",
      legalDescription: "LOT 3, BLOCK 15, RIVER OAKS SECTION 2",
      beds: 3,
      baths: 2,
      sqft: 1850,
      lotSize: 0.18,
      yearBuilt: 2012,
      propertyType: "Single Family",
      zoning: "Residential",
      appraisedValue: 380000,
      taxAssessedValue: 340000,
      lastSalePrice: 290000,
      lastSaleDate: "2016-08-10",
    },
    owner: {
      name: "Michael & Sarah Johnson",
      mailingAddress: "888 Oak Lane",
      mailingCity: "Houston",
      mailingState: "TX",
      mailingZip: "77002",
      phone: "(713) 555-0321",
      email: "m.johnson@email.com",
      ownershipType: "Joint Tenancy",
      yearsOwned: 9,
      isAbsentee: false,
      isCorporate: false,
    },
    loans: [
      {
        loanNumber: 1,
        lender: "Quicken Loans",
        loanAmount: 260000,
        loanDate: "2016-08-10",
        loanType: "FHA",
        interestRate: 3.75,
        monthlyPayment: 1450,
        maturityDate: "2046-08-10",
        position: "1st",
      },
    ],
    financials: {
      totalDebt: 220000,
      estimatedEquity: 160000,
      equityPercent: 42,
      monthlyRent: 2200,
      propertyTaxes: 7500,
      taxDelinquent: false,
    },
    divorce: {
      caseNumber: "DR-2024-45678",
      courtName: "Harris County Family Court",
      filingDate: "2024-10-05",
      petitioner: "Sarah Johnson",
      respondent: "Michael Johnson",
      status: "Pending Property Division",
      attorney: "Garcia Family Law, PLLC",
    },
  },

  // Property 4: Tax Lien
  4: {
    id: 4,
    type: "Tax Lien",
    status: "Active",
    publishedOn: "2025-01-05",
    property: {
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
        "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      ],
      address: "456 Mesquite Drive",
      city: "San Antonio",
      state: "TX",
      zip: "78205",
      county: "Bexar",
      parcelNumber: "3334445556",
      legalDescription: "LOT 8, BLOCK 4, ALAMO HEIGHTS ADDITION",
      beds: 2,
      baths: 1,
      sqft: 1100,
      lotSize: 0.12,
      yearBuilt: 1985,
      propertyType: "Single Family",
      zoning: "Residential",
      appraisedValue: 185000,
      taxAssessedValue: 165000,
      lastSalePrice: 95000,
      lastSaleDate: "2008-04-15",
    },
    owner: {
      name: "Carlos Mendez",
      mailingAddress: "1200 Commerce St, Apt 4B",
      mailingCity: "San Antonio",
      mailingState: "TX",
      mailingZip: "78210",
      phone: "(210) 555-0654",
      email: "c.mendez@email.com",
      ownershipType: "Fee Simple",
      yearsOwned: 17,
      isAbsentee: true,
      isCorporate: false,
    },
    loans: [
      {
        loanNumber: 1,
        lender: "Local Credit Union",
        loanAmount: 80000,
        loanDate: "2008-04-15",
        loanType: "Conventional",
        interestRate: 6.0,
        monthlyPayment: 650,
        maturityDate: "2038-04-15",
        position: "1st",
      },
    ],
    financials: {
      totalDebt: 45000,
      estimatedEquity: 140000,
      equityPercent: 76,
      monthlyRent: 1400,
      propertyTaxes: 4200,
      taxDelinquent: true,
      taxDelinquentAmount: 18500,
    },
    taxLien: {
      lienAmount: 18500,
      lienDate: "2022-03-01",
      yearsDelinquent: 3,
      redemptionDeadline: "2025-06-30",
      taxingAuthority: "Bexar County Tax Office",
      saleDate: "2025-07-15",
      saleLocation: "Bexar County Courthouse, 100 Dolorosa, San Antonio, TX 78205",
    },
  },

  // Property 5: Eviction
  5: {
    id: 5,
    type: "Eviction",
    status: "Active",
    publishedOn: "2025-01-12",
    property: {
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
      ],
      address: "2100 Riverside Avenue",
      city: "Fort Worth",
      state: "TX",
      zip: "76102",
      county: "Tarrant",
      parcelNumber: "7778889990",
      legalDescription: "LOT 22, BLOCK 9, RIVERSIDE TERRACE",
      beds: 4,
      baths: 2,
      sqft: 2100,
      lotSize: 0.22,
      yearBuilt: 2000,
      propertyType: "Single Family",
      zoning: "Residential",
      appraisedValue: 320000,
      taxAssessedValue: 285000,
      lastSalePrice: 180000,
      lastSaleDate: "2014-11-20",
    },
    owner: {
      name: "Riverside Investment LLC",
      mailingAddress: "500 Main Street, Suite 300",
      mailingCity: "Fort Worth",
      mailingState: "TX",
      mailingZip: "76102",
      phone: "(817) 555-0987",
      email: "info@riversideinvest.com",
      ownershipType: "LLC",
      yearsOwned: 11,
      isAbsentee: true,
      isCorporate: true,
    },
    loans: [
      {
        loanNumber: 1,
        lender: "First National Bank",
        loanAmount: 160000,
        loanDate: "2014-11-20",
        loanType: "Commercial",
        interestRate: 5.5,
        monthlyPayment: 1100,
        maturityDate: "2044-11-20",
        position: "1st",
      },
    ],
    financials: {
      totalDebt: 120000,
      estimatedEquity: 200000,
      equityPercent: 63,
      monthlyRent: 2000,
      propertyTaxes: 6800,
      taxDelinquent: false,
    },
    eviction: {
      caseNumber: "EV-2025-00123",
      filingDate: "2025-01-02",
      status: "Pending Hearing",
      reason: "Non-payment of rent - 3 months behind ($6,000 total)",
      tenantName: "James Anderson",
      hearingDate: "2025-02-15",
      courtName: "Tarrant County Justice of the Peace, Precinct 1",
    },
  },
};

// Default property for fallback
const DEFAULT_PROPERTY_ID = 1;

interface PropertyDetailsPageProps {
  propertyId?: number;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ propertyId }) => {
  const { canAccessPremium, maskData, startTrial } = useAuth();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "owner" | "loans" | "distress">("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Look up property by ID, fallback to property 1
  const property = MOCK_PROPERTIES[propertyId || DEFAULT_PROPERTY_ID] || MOCK_PROPERTIES[DEFAULT_PROPERTY_ID];

  // Check if lead is already saved on mount
  useEffect(() => {
    setIsSaved(isLeadSaved(property.id));
  }, [property.id]);

  // Masking helper
  const getMaskedOrReal = (value: string, type: "name" | "address" | "phone" | "email" = "name") => {
    if (canAccessPremium()) return value;
    return maskData(value, type);
  };

  // Handle saving lead to localStorage
  const handleSaveLead = () => {
    const leadData = {
      id: property.id,
      image: property.property.image,
      type: property.type,
      address: property.property.address,
      city: property.property.city,
      state: property.property.state,
      zip: property.property.zip,
      beds: property.property.beds,
      baths: property.property.baths,
      appraised: property.property.appraisedValue,
      debt: property.financials.totalDebt,
      sqft: property.property.sqft,
      year: property.property.yearBuilt,
      auctionDate: property.foreclosure?.auctionDate || "N/A",
      publishedOn: property.publishedOn,
      saved: !isSaved,
    };
    const result = toggleSavedLead(leadData);
    setIsSaved(result.saved);
  };

  // Handle export with premium check - show format dialog
  const handleExport = () => {
    if (!canAccessPremium()) {
      setShowPremiumModal(true);
      return;
    }
    setShowExportModal(true);
  };

  // Download property data in selected format
  const downloadPropertyData = (format: "csv" | "excel" | "json") => {
    const timestamp = Date.now();
    const exportData = {
      property: property.property,
      owner: property.owner,
      financials: property.financials,
      loans: property.loans,
      distressType: property.type,
      ...(property.foreclosure && { foreclosure: property.foreclosure }),
      ...(property.probate && { probate: property.probate }),
      ...(property.divorce && { divorce: property.divorce }),
      ...(property.taxLien && { taxLien: property.taxLien }),
      ...(property.eviction && { eviction: property.eviction }),
      ...(property.codeViolation && { codeViolation: property.codeViolation }),
      ...(property.bankruptcy && { bankruptcy: property.bankruptcy }),
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `property-${property.id}-export-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // CSV/Excel format
      const headers = ["Field", "Value"];
      const rows: string[][] = [
        ["Property Address", property.property.address],
        ["City", property.property.city],
        ["State", property.property.state],
        ["ZIP", property.property.zip],
        ["Beds", String(property.property.beds)],
        ["Baths", String(property.property.baths)],
        ["Sqft", String(property.property.sqft)],
        ["Year Built", String(property.property.yearBuilt)],
        ["Appraised Value", `$${property.property.appraisedValue.toLocaleString()}`],
        ["", ""],
        ["Owner Name", property.owner.name],
        ["Owner Phone", property.owner.phone || "N/A"],
        ["Owner Email", property.owner.email || "N/A"],
        ["Mailing Address", property.owner.mailingAddress],
        ["", ""],
        ["Distress Type", property.type],
        ["Total Debt", `$${property.financials.totalDebt.toLocaleString()}`],
        ["Equity", `$${property.financials.estimatedEquity.toLocaleString()}`],
      ];

      let csvContent = "\uFEFF"; // BOM for Excel
      csvContent += headers.join(",") + "\n";
      rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `property-${property.id}-export-${timestamp}.${format === "excel" ? "xlsx.csv" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setShowExportModal(false);
  };

  // Handle starting trial
  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    const result = await startTrial();
    setIsStartingTrial(false);
    if (result.success) {
      setShowPremiumModal(false);
    } else {
      alert(result.message);
    }
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
    // Use consistent blue color for professional look
    return "#2563EB";
  };

  const getDistressIcon = (type: string) => {
    // Use consistent icon for professional look
    return "fa-solid fa-tag";
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
      <FeatureGatePopup
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        title="Upgrade to Export"
        message="Export features are available for premium members. Download property details, owner information, financial data, and more."
        featureName="Export Feature"
        onStartTrial={handleStartTrial}
        onUpgrade={() => router.push("/dashboard/subscription")}
        showTrialButton={true}
      />

      {/* Export Format Selection Modal */}
      {showExportModal && (
        <>
          <div
            onClick={() => setShowExportModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: "90%",
              maxWidth: 480,
              zIndex: 1000,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <i className="fa-solid fa-download" style={{ fontSize: 28, color: "#fff" }}></i>
              </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
                Choose Export Format
              </h3>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6B7280" }}>
                Select how you&apos;d like to download this property data
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {[
                { id: "csv", name: "CSV", desc: "Opens in Excel, Google Sheets", icon: "fa-file-csv", color: "#10B981" },
                { id: "excel", name: "Excel", desc: "Native spreadsheet format", icon: "fa-file-excel", color: "#059669" },
                { id: "json", name: "JSON", desc: "For developers & integrations", icon: "fa-code", color: "#3B82F6" },
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => downloadPropertyData(format.id as "csv" | "excel" | "json")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    background: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F3F4F6";
                    e.currentTarget.style.borderColor = format.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: `${format.color}15`,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className={`fa-solid ${format.icon}`} style={{ fontSize: 22, color: format.color }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{format.name}</div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>{format.desc}</div>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ color: "#9CA3AF", fontSize: 14 }}></i>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                color: "#4B5563",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

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
              onClick={handleSaveLead}
            >
              <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark me-2`}></i>
              {isSaved ? "Saved" : "Save Lead"}
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleExport}>
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
                    <span className={styles.detailValue}>{getMaskedOrReal(property.property.address, "address")}, {property.property.city}, {property.property.state} {property.property.zip}</span>
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
