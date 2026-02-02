const db = require('./models');

async function createReferenceData() {
    try {
        console.log('🔧 Creating reference data for CRUD operations...');
        
        // Create basic motive types
        console.log('\n📝 Creating motive types...');
        const motiveTypes = await db.MotiveTypes.bulkCreate([
            { code: 'FOR', name: 'Foreclosure' },
            { code: 'DIV', name: 'Divorce' },
            { code: 'PRO', name: 'Probate' },
            { code: 'TAX', name: 'Tax Sale' }
        ], { ignoreDuplicates: true });
        console.log('✅ Motive types created');
        
        // Create sites_groups first (needed for site)
        console.log('\n🏢 Creating sites groups...');
        const sitesGroup = await db.SitesGroups.create({
            name: 'Reference Group'
        }, { ignoreDuplicates: true });
        console.log('✅ Sites group created - ID:', sitesGroup.id);
        
        // Create basic site record first (needed for proaddress)
        console.log('\n🌐 Creating site records...');
        const site = await db.Site.create({
            group_id: sitesGroup.id,
            url: 'http://reference-site.com',
            module: 'reference',
            owner_format: 'reference',
            property_format: 'reference',
            tables_to_use: 'reference',
            last_run: new Date(),
            priority: 1,
            crawler_name: 'reference-crawler'
        }, { ignoreDuplicates: true });
        console.log('✅ Site record created - ID:', site.id);
        
        // Create basic county record
        console.log('\n🏛️ Creating county records...');
        const county = await db.County.create({
            name: 'Reference County',
            index: 'REF',
            use: 1,
            address_template: 'Reference Template',
            num_fields: 10
        }, { ignoreDuplicates: true });
        console.log('✅ County record created - ID:', county.id);
        
        // Create basic proaddress record
        console.log('\n📍 Creating proaddress records...');
        const proaddress = await db.Proaddress.create({
            listing_id: 'REF-001',
            PStreetNum: '123',
            backup_street_name: 'Reference Street',
            PStreetName: 'Reference St',
            PSuiteNum: 'N/A',
            Pcity: 'Reference City',
            PState: 'RC',
            Pzip: '12345',
            word: 'reference',
            abbreviation: 'REF',
            owner_name: 'Reference Owner',
            PMotiveType: 'FOR',
            counties: 'Reference County',
            price: 250000,
            url: 'http://reference.com',
            beds: '3',
            baths: '2',
            proptype: 'Single Family',
            square_feet: 1500,
            PYearBuilt: '2020',
            floors: 2,
            school_district: 'Reference District',
            garage_size: 2,
            lot_size: '0.25 acres',
            amenities: 'Reference amenities',
            comments: 'Reference comments',
            owner_phone: '123-456-7890',
            site_id: site.id,
            DATE_TIMEOFEXTRACTION: new Date()
        }, { ignoreDuplicates: true });
        console.log('✅ Proaddress record created - ID:', proaddress.id);
        
        // Create basic files_urls record
        console.log('\n📁 Creating files_urls records...');
        const filesUrl = await db.FilesUrls.create({
            url: 'http://reference.com/file.pdf',
            contents: 'Reference file contents',
            property_card: 'Reference property card',
            parsed: 1,
            site_id: site.id,
            county_id: county.id,
            html_md5: 'reference-md5-hash',
            proaddress_id: proaddress.id,
            ownername_id: 1,
            motive_type_id: motiveTypes[0].id,
            PMotiveType: 'FOR'
        }, { ignoreDuplicates: true });
        console.log('✅ Files URL record created - ID:', filesUrl.id);
        
        console.log('\n🎉 Reference data creation complete!');
        console.log('\n📊 Created Reference Data:');
        console.log('- Motive Types:', motiveTypes.length, 'records');
        console.log('- Sites Groups:', sitesGroup.id);
        console.log('- Site:', site.id);
        console.log('- County:', county.id);
        console.log('- Proaddress:', proaddress.id);
        console.log('- Files URLs:', filesUrl.id);
        
        console.log('\n🔑 Reference IDs for Testing:');
        console.log('proaddress_id:', proaddress.id);
        console.log('motive_type_id:', motiveTypes[0].id);
        console.log('PFilesUrlsId:', filesUrl.id);
        console.log('site_id:', site.id);
        console.log('county_id:', county.id);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error creating reference data:', error.message);
        process.exit(1);
    }
}

createReferenceData();
