const db = require('../../models');

// In-memory settings store (in production, use a settings table or config file)
let adminSettings = {
    downloadEnabled: true,
    maxDownloadsPerDay: 100,
    allowedUserTypes: ['Premium', 'Pro']
};

let poppins = [];

/**
 * Get admin settings
 */
exports.getSettings = async (req, res) => {
    try {
        res.status(200).json(adminSettings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update admin settings
 */
exports.updateSettings = async (req, res) => {
    try {
        const { downloadEnabled, maxDownloadsPerDay, allowedUserTypes } = req.body;
        
        adminSettings = {
            downloadEnabled: downloadEnabled !== undefined ? downloadEnabled : adminSettings.downloadEnabled,
            maxDownloadsPerDay: maxDownloadsPerDay !== undefined ? maxDownloadsPerDay : adminSettings.maxDownloadsPerDay,
            allowedUserTypes: allowedUserTypes || adminSettings.allowedUserTypes
        };
        
        res.status(200).json({ 
            message: 'Settings updated successfully',
            settings: adminSettings 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Check if downloads are enabled for a user type
 */
exports.checkDownloadAccess = async (req, res) => {
    try {
        const { userType } = req.query;
        
        const hasAccess = adminSettings.downloadEnabled && 
                          adminSettings.allowedUserTypes.includes(userType);
        
        res.status(200).json({ 
            allowed: hasAccess,
            maxDownloadsPerDay: adminSettings.maxDownloadsPerDay
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all poppins
 */
exports.getAllPoppins = async (req, res) => {
    try {
        res.status(200).json(poppins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create or update a poppin
 */
exports.savePoppin = async (req, res) => {
    try {
        const poppin = req.body;
        
        const existingIndex = poppins.findIndex(p => p.id === poppin.id);
        
        if (existingIndex >= 0) {
            poppins[existingIndex] = poppin;
        } else {
            poppins.push(poppin);
        }
        
        res.status(200).json({ 
            message: 'Poppin saved successfully',
            poppin 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete a poppin
 */
exports.deletePoppin = async (req, res) => {
    try {
        const { id } = req.params;
        poppins = poppins.filter(p => p.id !== id);
        
        res.status(200).json({ message: 'Poppin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get active poppins for a specific page (public endpoint)
 */
exports.getActivePoppins = async (req, res) => {
    try {
        const { page } = req.query;
        
        const activePoppins = poppins.filter(p => 
            p.isActive && 
            (p.pages.includes(page) || p.pages.includes('*'))
        );
        
        res.status(200).json(activePoppins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
