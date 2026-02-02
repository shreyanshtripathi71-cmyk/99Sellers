const db = require('../../models');
const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

/**
 * Import data from CSV/Excel file to database
 * Automatically detects and imports properties, owners, auctions, and loans
 */
exports.importData = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let data = [];
        const filePath = file.path;
        const fileExt = file.originalname.split('.').pop().toLowerCase();

        // Parse file based on extension
        if (fileExt === 'csv') {
            data = await parseCSV(filePath);
        } else if (['xlsx', 'xls'].includes(fileExt)) {
            data = parseExcel(filePath);
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file format. Use CSV or Excel.' });
        }

        // Automatically parse and import all entity types
        const result = await parseAndImportAll(data);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            message: 'Data imported successfully',
            stats: {
                totalRows: data.length,
                properties: result.properties.imported,
                owners: result.owners.imported,
                auctions: result.auctions.imported,
                loans: result.loans.imported,
                errors: result.totalErrors
            },
            errors: result.allErrors
        });

    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

/**
 * Parse Excel file
 */
function parseExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

/**
 * Parse and import all entity types from a single CSV file
 * Detects properties, owners, auctions, and loans based on column patterns
 */
async function parseAndImportAll(data) {
    const results = {
        properties: { imported: 0, failed: 0, errors: [] },
        owners: { imported: 0, failed: 0, errors: [] },
        auctions: { imported: 0, failed: 0, errors: [] },
        loans: { imported: 0, failed: 0, errors: [] },
        totalErrors: 0,
        allErrors: []
    };

    // Categorize rows by entity type based on column presence
    const categorizedData = {
        properties: [],
        owners: [],
        auctions: [],
        loans: []
    };

    // Property indicators: address, city, state, zip, property-specific fields
    const propertyColumns = ['address', 'city', 'state', 'zip', 'propertytype', 'bedrooms', 'bathrooms', 'squarefeet', 'yearbuilt', 'price', 'county', 'apn', 'lotsize'];
    // Owner indicators: owner name, owner contact info
    const ownerColumns = ['ownername', 'firstname', 'lastname', 'email', 'phone', 'contact', 'owneraddress'];
    // Auction indicators: auction date, bid, auction status
    const auctionColumns = ['auctiondate', 'auctiontime', 'startingbid', 'auctionstatus', 'auctioneer', 'saletype', 'openingbid'];
    // Loan indicators: loan amount, lender, interest rate
    const loanColumns = ['loanamount', 'loantype', 'interestrate', 'lendername', 'lender', 'mortgageamount', 'deedtype'];

    for (const row of data) {
        const lowerKeys = Object.keys(row).map(k => k.toLowerCase().replace(/[^a-z]/g, ''));
        
        // Check if row contains property data
        if (propertyColumns.some(col => lowerKeys.includes(col))) {
            categorizedData.properties.push(row);
        }
        
        // Check if row contains owner data
        if (ownerColumns.some(col => lowerKeys.includes(col))) {
            categorizedData.owners.push(row);
        }
        
        // Check if row contains auction data
        if (auctionColumns.some(col => lowerKeys.includes(col))) {
            categorizedData.auctions.push(row);
        }
        
        // Check if row contains loan data
        if (loanColumns.some(col => lowerKeys.includes(col))) {
            categorizedData.loans.push(row);
        }
    }

    // Import each category
    if (categorizedData.properties.length > 0) {
        const result = await importToTable('properties', categorizedData.properties);
        results.properties = result;
        results.totalErrors += result.failed;
        results.allErrors.push(...result.errors);
    }

    if (categorizedData.owners.length > 0) {
        const result = await importToTable('owners', categorizedData.owners);
        results.owners = result;
        results.totalErrors += result.failed;
        results.allErrors.push(...result.errors);
    }

    if (categorizedData.auctions.length > 0) {
        const result = await importToTable('auctions', categorizedData.auctions);
        results.auctions = result;
        results.totalErrors += result.failed;
        results.allErrors.push(...result.errors);
    }

    if (categorizedData.loans.length > 0) {
        const result = await importToTable('loans', categorizedData.loans);
        results.loans = result;
        results.totalErrors += result.failed;
        results.allErrors.push(...result.errors);
    }

    return results;
}

/**
 * Import data to specified table
 */
async function importToTable(target, data) {
    let imported = 0;
    let failed = 0;
    const errors = [];

    const modelMap = {
        'properties': db.Property,
        'owners': db.Owner,
        'auctions': db.Auction,
        'loans': db.Loan,
        'users': db.UserLogin
    };

    const Model = modelMap[target];
    if (!Model) {
        throw new Error(`Unknown import target: ${target}`);
    }

    for (let i = 0; i < data.length; i++) {
        try {
            await Model.create(data[i]);
            imported++;
        } catch (error) {
            failed++;
            errors.push(`Row ${i + 2}: ${error.message}`);
            if (errors.length >= 10) {
                errors.push('... and more errors');
                break;
            }
        }
    }

    return { imported, failed, errors };
}

/**
 * Get download template for a target
 */
exports.getTemplate = async (req, res) => {
    try {
        const { target } = req.params;

        const templates = {
            properties: ['Address', 'City', 'State', 'Zip', 'PropertyType', 'Bedrooms', 'Bathrooms', 'SquareFeet', 'YearBuilt', 'Price'],
            owners: ['FirstName', 'LastName', 'Email', 'Phone', 'Address', 'City', 'State', 'Zip'],
            auctions: ['PropertyId', 'AuctionDate', 'StartingBid', 'Status', 'Location'],
            loans: ['PropertyId', 'LoanAmount', 'LoanType', 'InterestRate', 'LenderName', 'Status'],
            users: ['FirstName', 'LastName', 'Email', 'Password', 'Contact', 'Address', 'City', 'State', 'Zip', 'UserType']
        };

        const columns = templates[target];
        if (!columns) {
            return res.status(400).json({ error: 'Unknown template target' });
        }

        // Create CSV content
        const csvContent = columns.join(',') + '\n';

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${target}_template.csv`);
        res.send(csvContent);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
