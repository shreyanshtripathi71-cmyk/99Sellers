"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface UpgradePromptModalProps {
  onClose: () => void;
  title?: string;
  message?: string;
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({ 
  onClose, 
  title = "Unlock Full Property Details",
  message = "Get access to complete addresses, owner contact info, and detailed property data with a premium subscription."
}) => {
  const { startTrial, isTrialActive, refreshSubscription } = useAuth();
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    try {
      const result = await startTrial();
      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        await refreshSubscription();
        onClose();
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Failed to start trial. Please try again.", { position: "top-center" });
    } finally {
      setIsStartingTrial(false);
    }
  };

  const trialActive = isTrialActive();

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }} 
      tabIndex={-1}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div 
          className="modal-content border-0 shadow-lg" 
          style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
          {/* Header with gradient */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              padding: '32px 24px 24px',
              textAlign: 'center'
            }}
          >
            <div 
              style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <i className="fa-solid fa-lock" style={{ fontSize: 28, color: '#fff' }}></i>
            </div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>{title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0 }}>{message}</p>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose} 
              aria-label="Close"
              style={{ position: 'absolute', top: 16, right: 16 }}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-4">
            {/* Features list */}
            <div style={{ marginBottom: 24 }}>
              <div className="d-flex align-items-start gap-3 mb-3">
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: '#EEF2FF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#2563EB', fontSize: 14 }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: 2 }}>Full Property Addresses</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>See complete street addresses for all listings</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: '#EEF2FF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-user" style={{ color: '#2563EB', fontSize: 14 }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: 2 }}>Owner Contact Info</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Access names, phone numbers, and emails</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: '#EEF2FF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-download" style={{ color: '#2563EB', fontSize: 14 }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: 2 }}>Export & Download</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Export leads to CSV for your CRM</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-column gap-2">
              {!trialActive && (
                <button 
                  onClick={handleStartTrial}
                  disabled={isStartingTrial}
                  className="btn btn-primary w-100 rounded-pill fw-bold py-3"
                  style={{ 
                    backgroundColor: '#2563EB', 
                    borderColor: '#2563EB',
                    fontSize: 15
                  }}
                >
                  {isStartingTrial ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Starting Trial...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket me-2"></i>
                      Start 15-Day Free Trial
                    </>
                  )}
                </button>
              )}
              
              <Link 
                href="/dashboard/subscription" 
                className="btn btn-outline-primary w-100 rounded-pill fw-bold py-3"
                style={{ fontSize: 15 }}
                onClick={onClose}
              >
                <i className="fa-solid fa-crown me-2"></i>
                View Subscription Plans
              </Link>

              <button 
                onClick={onClose}
                className="btn btn-link text-muted w-100"
                style={{ fontSize: 13 }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePromptModal;
