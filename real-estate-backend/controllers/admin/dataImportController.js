const db = require('../../models');
const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

/**
 * Import data from CSV/Excel file to database
 */
exports.importData = async (req, res) => {
    try {
        const { target } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!target) {
            return res.status(400).json({ error: 'Import target not specified' });
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

        // Import to appropriate table
        const result = await importToTable(target, data);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            totalRows: data.length,
            imported: result.imported,
            failed: result.failed,
            errors: result.errors
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
