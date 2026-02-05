// Saved Leads Service - Real-time persistence with localStorage
// This service provides shared state for saved leads across components

import { Lead } from "@/components/search/components/LeadTableView";

const STORAGE_KEY = "99sellers_saved_leads";

export interface SavedLead extends Lead {
    savedOn: string;
}

// Get all saved leads
export const getSavedLeads = (): SavedLead[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Save a lead
export const saveLead = (lead: Lead): SavedLead[] => {
    const savedLeads = getSavedLeads();
    const existing = savedLeads.find((l) => l.id === lead.id);

    if (!existing) {
        const newSavedLead: SavedLead = {
            ...lead,
            savedOn: new Date().toISOString().split("T")[0],
        };
        const updated = [newSavedLead, ...savedLeads];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Dispatch custom event for real-time updates across components
        window.dispatchEvent(new CustomEvent("savedLeadsUpdated", { detail: updated }));

        return updated;
    }

    return savedLeads;
};

// Remove a saved lead
export const removeSavedLead = (leadId: number): SavedLead[] => {
    const savedLeads = getSavedLeads();
    const updated = savedLeads.filter((l) => l.id !== leadId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("savedLeadsUpdated", { detail: updated }));

    return updated;
};

// Check if a lead is saved
export const isLeadSaved = (leadId: number): boolean => {
    const savedLeads = getSavedLeads();
    return savedLeads.some((l) => l.id === leadId);
};

// Toggle lead saved status
export const toggleSavedLead = (lead: Lead): { saved: boolean; leads: SavedLead[] } => {
    const isSaved = isLeadSaved(lead.id);

    if (isSaved) {
        const leads = removeSavedLead(lead.id);
        return { saved: false, leads };
    } else {
        const leads = saveLead(lead);
        return { saved: true, leads };
    }
};

// Get saved leads count
export const getSavedLeadsCount = (): number => {
    return getSavedLeads().length;
};

// Export saved leads for CSV/Excel
export const exportSavedLeadsData = () => {
    return getSavedLeads().map((lead) => ({
        address: `${lead.address}, ${lead.city}, ${lead.state} ${lead.zip}`,
        ownerName: lead.ownerName || "John Smith",
        ownerPhone: lead.ownerPhone || "(555) 123-4567",
        ownerEmail: lead.ownerEmail || "owner@email.com",
        propertyType: lead.type,
        beds: lead.beds,
        baths: lead.baths,
        sqft: lead.sqft,
        appraisedValue: lead.appraised,
        debt: lead.debt,
        equity: lead.appraised - lead.debt,
        auctionDate: lead.auctionDate,
        savedOn: lead.savedOn,
    }));
};
