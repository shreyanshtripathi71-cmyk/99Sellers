const db = require('../../models');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('fast-csv');
const JSZip = require('jszip');

/**
 * Get available data types for export
 */
exports.getExportTypes = async (req, res) => {
    try {
        const exportTypes = [
            {
                type: 'properties',
                name: 'Properties',
                description: 'All property data with details',
                estimatedSize: '1-5 MB',
                fields: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PCounty', 'PType', 'PSqFt', 'PYearBuilt', 'PPrice', 'PBeds', 'PBaths', 'PFloors', 'PDescription']
            },
            {
                type: 'auctions',
                name: 'Auctions',
                description: 'All auction data with property details',
                estimatedSize: '500KB-2MB',
                fields: ['AAuctionID', 'AAuctionDateTime', 'AAuctionPlace', 'AAuctionPlaceAddr1', 'AAuctionCity', 'AAuctionState', 'AAuctionZip', 'AAuctionDescription']
            },
            {
                type: 'owners',
                name: 'Property Owners',
                description: 'All property owner information',
                estimatedSize: '200KB-1MB',
                fields: ['id', 'OLastName', 'OMiddleName', 'OFirstName', 'OStreetAddr1', 'OStreetAddr2', 'OCity', 'OState', 'OZip', 'OProperty_id']
            },
            {
                type: 'loans',
                name: 'Property Loans',
                description: 'All loan data with property details',
                estimatedSize: '300KB-1.5MB',
                fields: ['id', 'property_id', 'deed_id', 'borrower_name', 'lender_name', 'lender_address', 'datetime', 'loan_amount']
            },
            {
                type: 'users',
                name: 'Users',
                description: 'All user accounts and subscription data',
                estimatedSize: '100KB-500KB',
                fields: ['id', 'Email', 'FirstName', 'LastName', 'Contact', 'Address', 'City', 'State', 'Zip', 'UserType', 'CreatedAt']
            },
            {
                type: 'subscriptions',
                name: 'Subscriptions',
                description: 'All subscription data with user details',
                estimatedSize: '200KB-1MB',
                fields: ['id', 'userId', 'planId', 'status', 'price', 'billingCycle', 'startDate', 'endDate', 'stripeSubscriptionId']
            },
            {
                type: 'trials',
                name: 'Trials',
                description: 'All trial data with usage statistics',
                estimatedSize: '100KB-500KB',
                fields: ['id', 'userId', 'trialType', 'startDate', 'endDate', 'duration', 'status', 'usageStats']
            },
            {
                type: 'leads',
                name: 'Leads',
                description: 'All lead data with scoring and status',
                estimatedSize: '500KB-2MB',
                fields: ['id', 'userId', 'leadType', 'leadScore', 'priority', 'status', 'estimatedValue', 'potentialCommission']
            },
            {
                type: 'equity',
                name: 'Property Equity',
                description: 'All property equity calculations',
                estimatedSize: '200KB-1MB',
                fields: ['id', 'propertyId', 'appraisedAmount', 'marketValue', 'totalLiens', 'equityAmount', 'equityPercentage', 'lastUpdated']
            },
            {
                type: 'user_activity',
                name: 'User Activity',
                description: 'All user activity logs and analytics',
                estimatedSize: '1-5MB',
                fields: ['id', 'userId', 'activityType', 'resourceType', 'resourceId', 'createdAt', 'success']
            },
            {
                type: 'crawler_runs',
                name: 'Crawler Runs',
                description: 'All crawler execution logs',
                estimatedSize: '500KB-2MB',
                fields: ['CrawlerId', 'Stage', 'CrawlerFile', 'LogFile', 'CrawlerName', 'RunStatus', 'LastRunStart', 'LastRunEnd']
            },
            {
                type: 'crawler_errors',
                name: 'Crawler Errors',
                description: 'All crawler error logs',
                estimatedSize: '100KB-1MB',
                fields: ['id', 'Erroneous_id', 'OwnerName', 'error', 'createdAt']
            }
        ];

        res.json({ exportTypes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Export data to CSV
 */
exports.exportToCsv = async (req, res) => {
    try {
        const { dataType, filters = {}, format = 'csv' } = req.body;
        
        // Validate data type
        const validTypes = ['properties', 'auctions', 'owners', 'loans', 'users', 'subscriptions', 'trials', 'leads', 'equity', 'user_activity', 'crawler_runs', 'crawler_errors'];
        if (!validTypes.includes(dataType)) {
            return res.status(400).json({ error: 'Invalid data type' });
        }

        // Get the appropriate model
        let model;
        let modelName;
        let include = [];
        let where = {};
        let attributes;

        switch (dataType) {
            case 'properties':
                model = db.Property;
                modelName = 'Property';
                include = [
                    { model: db.Proaddress, as: 'proaddress' },
                    { model: db.MotiveTypes, as: 'motive_type' },
                    { model: db.FilesUrls, as: 'files' }
                ];
                attributes = ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PCounty', 'PType', 'PSqFt', 'PYearBuilt', 'PPrice', 'PBeds', 'PBaths', 'PFloors', 'PDescription'];
                break;
            case 'auctions':
                model = db.Auction;
                modelName = 'Auction';
                include = [
                    { model: db.Property, as: 'Property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PType'] }
                ];
                attributes = ['AAuctionID', 'AAuctionDateTime', 'AAuctionPlace', 'AAuctionPlaceAddr1', 'AAuctionCity', 'AAuctionState', 'AAuctionZip', 'AAuctionDescription'];
                break;
            case 'owners':
                model = db.Owner;
                modelName = 'Owner';
                include = [
                    { model: db.Property, as: 'Property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip'] }
                ];
                attributes = ['id', 'OLastName', 'OMiddleName', 'OFirstName', 'OStreetAddr1', 'OStreetAddr2', 'OCity', 'OState', 'OZip', 'OProperty_id'];
                break;
            case 'loans':
                model = db.Loan;
                modelName = 'Loan';
                include = [
                    { model: db.Property, as: 'Property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip'] }
                ];
                attributes = ['id', 'property_id', 'deed_id', 'borrower_name', 'lender_name', 'lender_address', 'datetime', 'loan_amount'];
                break;
            case 'users':
                model = db.UserLogin;
                modelName = 'UserLogin';
                attributes = ['id', 'Email', 'FirstName', 'LastName', 'Contact', 'Address', 'City', 'State', 'Zip', 'UserType'];
                break;
            case 'subscriptions':
                model = db.Subscription;
                modelName = 'Subscription';
                include = [
                    { model: db.UserLogin, as: 'user', attributes: ['Email', 'FirstName', 'LastName'] },
                    { model: db.SubscriptionPlan, as: 'plan', attributes: ['name', 'type', 'price'] }
                ];
                attributes = ['id', 'userId', 'planId', 'status', 'price', 'billingCycle', 'startDate', 'endDate'];
                break;
            case 'trials':
                model = db.Trial;
                modelName = 'Trial';
                attributes = ['id', 'userId', 'trialType', 'startDate', 'endDate', 'duration', 'status', 'usageStats'];
                break;
            case 'leads':
                model = db.Lead;
                modelName = 'Lead';
                include = [
                    { model: db.Property, as: 'property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip'] },
                    { model: db.Auction, as: 'auction', attributes: ['AAuctionID', 'AAuctionDateTime'] },
                    { model: db.Owner, as: 'owner', attributes: ['OLastName', 'OFirstName'] },
                    { model: db.Loan, as: 'loan', attributes: ['loan_amount', 'lender_name'] }
                ];
                attributes = ['id', 'userId', 'leadType', 'leadScore', 'priority', 'status', 'estimatedValue', 'potentialCommission'];
                break;
            case 'equity':
                model = db.PropertyEquity;
                modelName = 'PropertyEquity';
                include = [
                    { model: db.Property, as: 'property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PPrice'] }
                ];
                attributes = ['id', 'propertyId', 'appraisedAmount', 'marketValue', 'totalLiens', 'equityAmount', 'equityPercentage', 'lastUpdated'];
                break;
            case 'user_activity':
                model = db.UserActivity;
                modelName = 'UserActivity';
                attributes = ['id', 'userId', 'activityType', 'resourceType', 'resourceId', 'createdAt', 'success'];
                break;
            case 'crawler_runs':
                model = db.CrawlerRun;
                modelName = 'CrawlerRun';
                attributes = ['CrawlerId', 'Stage', 'CrawlerFile', 'LogFile', 'CrawlerName', 'RunStatus', 'LastRunStart', 'LastRunEnd'];
                break;
            case 'crawler_errors':
                model = db.ErroneousLinks;
                modelName = 'ErroneousLinks';
                attributes = ['id', 'Erroneous_id', 'OwnerName', 'error', 'createdAt'];
                break;
        }

        // Apply filters if provided
        if (filters && Object.keys(filters).length > 0) {
            where = filters;
        }

        // Fetch data
        const data = await model.findAll({
            where,
            include,
            attributes,
            order: [['id', 'DESC']],
            limit: 10000 // Limit to prevent memory issues
        });

        // Convert to CSV
        const csvData = data.map(row => {
            const flatRow = {};
            
            // Flatten nested objects
            const flattenObject = (obj, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (value === null || value === undefined) {
                        flatRow[`${prefix}${key}`] = '';
                    } else if (typeof value === 'object' && !Array.isArray(value)) {
                        flattenObject(value, `${prefix}${key}_`);
                    } else {
                        flatRow[`${prefix}${key}`] = value;
                    }
                });
            };

            flattenObject(row);
            return flatRow;
        });

        // Create CSV
        const csvString = await new Promise((resolve, reject) => {
            const csvWriter = createObjectCsvWriter({
                headers: Object.keys(csvData[0] || {}),
                rowDelimiter: ',',
                quote: '"'
            });
            
            csvWriter.writeRecords(csvData)
                .on('finish', () => resolve(csvString))
                .on('error', reject);
        });

        // Set response headers for CSV download
        const filename = `${modelName}_${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.send(csvString);

        // Log export
        console.log(`📊 Export completed: ${dataType} - ${data.length} records`);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Export data to JSON
 */
exports.exportToJson = async (req, res) => {
    try {
        const { dataType, filters = {} } = req.body;
        
        // Validate data type
        const validTypes = ['properties', 'auctions', 'owners', 'loans', 'users', 'subscriptions', 'trials', 'leads', 'equity', 'user_activity', 'crawler_runs', 'crawler_errors'];
        if (!validTypes.includes(dataType)) {
            return res.status(400).json({ error: 'Invalid data type' });
        }

        // Get the appropriate model (same logic as CSV export)
        let model;
        let include = [];
        let where = {};
        let attributes;

        switch (dataType) {
            case 'properties':
                model = db.Property;
                include = [
                    { model: db.Proaddress, as: 'proaddress' },
                    { model: db.MotiveTypes, as: 'motive_type' },
                    { model: db.FilesUrls, as: 'files' }
                ];
                attributes = ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PCounty', 'PType', 'PSqFt', 'PYearBuilt', 'PPrice', 'PBeds', 'PBaths', 'PFloors', 'PDescription'];
                break;
            case 'auctions':
                model = db.Auction;
                include = [
                    { model: db.Property, as: 'Property', attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PType'] }
                ];
                attributes = ['AAuctionID', 'AAuctionDateTime', 'AAuctionPlace', 'AAuctionPlaceAddr1', 'AAuctionCity', 'AAuctionState', 'AAuctionZip', 'AAuctionDescription'];
                break;
            // Add other cases as needed...
        }

        // Apply filters if provided
        if (filters && Object.keys(filters).length > 0) {
            where = filters;
        }

        // Fetch data
        const data = await model.findAll({
            where,
            include,
            attributes,
            order: [['id', 'DESC']],
            limit: 10000
        });

        // Set response headers for JSON download
        const filename = `${dataType}_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.json(data);

        // Log export
        console.log(`📊 Export completed: ${dataType} - ${data.length} records`);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Export multiple data types to ZIP
 */
exports.exportToZip = async (req, res) => {
    try {
        const { dataTypes, format = 'csv' } = req.body;
        
        if (!Array.isArray(dataTypes) || dataTypes.length === 0) {
            return res.status(400).json({ error: 'No data types specified' });
        }

        const zip = new JSZip();

        for (const dataType of dataTypes) {
            // Get the appropriate model
            let model;
            let modelName;
            let include = [];
            let attributes;

            switch (dataType) {
                case 'properties':
                    model = db.Property;
                    modelName = 'Property';
                    include = [
                        { model: db.Proaddress, as: 'proaddress' },
                        { model: db.MotiveTypes, as: 'motive_type' },
                        { model: db.FilesUrls, as: 'files' }
                    ];
                    attributes = ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PCounty', 'PType', 'PSqFt', 'PYearBuilt', 'PPrice', 'PBeds', 'PBaths', 'PFloors', 'PDescription'];
                    break;
                // Add other cases as needed...
                default:
                    continue; // Skip invalid types
            }

            // Fetch data
            const data = await model.findAll({
                include,
                attributes,
                order: [['id', 'DESC']],
                limit: 10000
            });

            // Convert to CSV
            const csvData = data.map(row => {
                const flatRow = {};
                const flattenObject = (obj, prefix = '') => {
                    Object.keys(obj).forEach(key => {
                        const value = obj[key];
                        if (value === null || value === undefined) {
                            flatRow[`${prefix}${key}`] = '';
                        } else if (typeof value === 'object' && !Array.isArray(value)) {
                            flattenObject(value, `${prefix}${key}_`);
                        } else {
                            flatRow[`${prefix}${key}`] = value;
                        }
                    });
                };
                flattenObject(row);
                return flatRow;
            });

            // Create CSV string
            const csvString = await new Promise((resolve, reject) => {
                const csvWriter = createObjectCsvWriter({
                    headers: Object.keys(csvData[0] || {}),
                    rowDelimiter: ',',
                    quote: '"'
                });
                
                csvWriter.writeRecords(csvData)
                    .on('finish', () => resolve(csvString))
                    .on('error', reject);
            });

            // Add to ZIP
            const filename = `${modelName}_${new Date().toISOString().split('T')[0]}.csv`;
            zip.file(filename, csvString);
        }

        // Generate ZIP buffer
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        // Set response headers
        const zipFilename = `export_${new Date().toISOString().split('T')[0]}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
        
        res.send(zipBuffer);

        // Log export
        console.log(`📦 ZIP export completed: ${dataTypes.join(', ')} - Total size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get export history
 */
exports.getExportHistory = async (req, res) => {
    try {
        // This would require creating an export history model
        // For now, return empty history
        res.json({
            history: [],
            message: 'Export history tracking not implemented yet'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get export statistics
 */
exports.getExportStats = async (req, res) => {
    try {
        const stats = {
            properties: await db.Property.count(),
            auctions: await db.Auction.count(),
            owners: await db.Owner.count(),
            loans: await db.Loan.count(),
            users: await db.UserLogin.count(),
            subscriptions: await db.Subscription.count(),
            trials: await db.Trial.count(),
            leads: await db.Lead.count(),
            equity: await db.PropertyEquity.count(),
            userActivities: await db.UserActivity.count(),
            crawlerRuns: await db.CrawlerRun.count(),
            crawlerErrors: await db.ErroneousLinks.count()
        };

        // Calculate estimated sizes
        const estimatedSizes = {
            properties: stats.properties * 0.001, // ~1KB per property
            auctions: stats.auctions * 0.0005, // ~500B per auction
            owners: stats.owners * 0.0003, // ~300B per owner
            loans: stats.loans * 0.0008, // ~800B per loan
            users: stats.users * 0.0002, // ~200B per user
            subscriptions: stats.subscriptions * 0.0005, // ~500B per subscription
            trials: stats.trials * 0.0002, // ~200B per trial
            leads: stats.leads * 0.0004, // ~400B per lead
            equity: stats.equity * 0.0005, // ~500B per equity record
            userActivities: stats.userActivities * 0.0001, // ~100B per activity
            crawlerRuns: stats.crawlerRuns * 0.001, // ~1KB per run
            crawlerErrors: stats.crawlerErrors * 0.0001 // ~100B per error
        };

        const totalEstimatedSize = Object.values(estimatedSizes).reduce((total, size) => total + size, 0);

        res.json({
            stats,
            estimatedSizes,
            totalEstimatedSize: totalEstimatedSize.toFixed(2),
            totalEstimatedSizeMB: (totalEstimatedSize / 1024 / 1024).toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
