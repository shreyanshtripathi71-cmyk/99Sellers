const db = require('../../models');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads/content');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Get content by key
 */
exports.getContent = async (req, res) => {
    try {
        const { key } = req.params;

        // Try to get from database
        let content = await db.SiteContent?.findOne({ where: { key } });

        if (!content) {
            // Return default content based on key
            const defaults = getDefaultContent(key);
            return res.status(200).json({
                key,
                value: defaults,
                isDefault: true
            });
        }

        // Parse JSON value
        let value = content.value;
        try {
            value = JSON.parse(content.value);
        } catch (e) {
            // Keep as string if not valid JSON
        }

        res.status(200).json({
            key: content.key,
            value,
            contentType: content.contentType,
            updatedAt: content.updatedAt
        });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update content by key
 */
exports.updateContent = async (req, res) => {
    try {
        const { key } = req.params;
        const { value, contentType } = req.body;

        // Stringify if object
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;

        // Upsert the content
        const [content, created] = await db.SiteContent.findOrCreate({
            where: { key },
            defaults: {
                value: stringValue,
                contentType: contentType || 'json',
                updatedBy: req.user?.id
            }
        });

        if (!created) {
            await content.update({
                value: stringValue,
                contentType: contentType || content.contentType,
                updatedBy: req.user?.id
            });
        }

        res.status(200).json({
            message: 'Content updated successfully',
            key,
            created
        });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Upload an image for content
 */
exports.uploadImage = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique filename
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
        const destPath = path.join(UPLOADS_DIR, filename);

        // Move file from temp to content uploads
        fs.renameSync(file.path, destPath);

        // Return the URL
        const imageUrl = `/uploads/content/${filename}`;

        res.status(200).json({
            success: true,
            url: imageUrl,
            filename
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete an uploaded image
 */
exports.deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({ error: 'Filename required' });
        }

        const filePath = path.join(UPLOADS_DIR, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all content items
 */
exports.getAllContent = async (req, res) => {
    try {
        const contents = await db.SiteContent?.findAll() || [];

        const result = contents.map(c => {
            let value = c.value;
            try {
                value = JSON.parse(c.value);
            } catch (e) { }

            return {
                key: c.key,
                value,
                contentType: c.contentType,
                updatedAt: c.updatedAt
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Get all content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get default content for a key
 */
function getDefaultContent(key) {
    const defaults = {
        hero_images: [
            {
                id: 1,
                url: '/images/hero/hero-1.jpg',
                title: 'Want basket full of sales lead today?',
                subtitle: 'Hundreds and thousands of distressed sellers are just waiting for you',
                order: 1
            }
        ],
        hero_text: {
            title: 'Find Off-Market Real Estate Deals Instantly',
            subtitle: 'Access exclusive foreclosure, tax default, and distressed property leads before they hit the market.',
            cta_primary: 'Get Started Free',
            cta_secondary: 'See How It Works'
        },
        about_content: {
            title: 'About 99Sellers',
            description: 'We help real estate investors find motivated sellers faster.'
        },
        contact_info: {
            phone: '(800) 555-1234',
            email: 'support@99sellers.com',
            address: '123 Main St, Los Angeles, CA 90001'
        },
        footer_content: {
            copyright: '© 2024 99Sellers. All rights reserved.',
            social_links: []
        }
    };

    return defaults[key] || null;
}
