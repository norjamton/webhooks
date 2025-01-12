const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize Express application
const app = express();
app.use(express.json());

// Server configuration
const PORT = process.env.PORT || 8080;

// Webflow API configuration
// TODO: Move these to environment variables for security
const WEBFLOW_API_TOKEN = '5c829c1b22bd113a74269ac7dc8dbac7dc8f93abd47b85bf79612a05197ea40ec';
const SITE_ID = '6500a6fb88e090f54f784e77';
const TEMP_DIR = '/Users/jamesnorton/Downloads/webhook downloads';

/**
 * Webhook endpoint to handle Webflow site publications
 * Downloads the entire site as a ZIP file using Webflow's API
 */
app.post('/webhook', async (req, res) => {
    const { triggerType, payload } = req.body;

    // Validate webhook trigger type
    if (triggerType !== 'site_publish' || !payload) {
        return res.status(400).json({ error: 'Bad Request' });
    }

    try {
        // Download site export from Webflow API
        const response = await axios.get(`https://api.webflow.com/sites/${SITE_ID}/export`, {
            headers: { Authorization: `Bearer ${WEBFLOW_API_TOKEN}`, 'accept-version': '1.0.0' },
            responseType: 'arraybuffer',
        });

        // Ensure download directory exists
        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
        }

        // Save downloaded ZIP file
        fs.writeFileSync(path.join(TEMP_DIR, 'site.zip'), response.data);
        res.status(200).send('Site downloaded successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Cloud Functions
exports.webflowWebhook = app;