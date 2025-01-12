const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize Express application
const app = express();
// Parse incoming JSON payloads
app.use(express.json());

// Configure download directory for saved site content
const DOWNLOAD_DIR = '/Users/jamesnorton/Downloads/webhook downloads';

/**
 * Webhook endpoint to handle Webflow site publication events
 * Receives POST requests from Webflow when site is published
 */
app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', req.body);

  // Verify the incoming webhook is a site publication event
  if (req.body.triggerType === 'site_publish') {
    try {
      // Target Webflow site URL to download
      const siteUrl = 'https://tom-clover-clone.webflow.io/';

      console.log('Downloading the site...');
      // Download site content as binary data
      const response = await axios.get(siteUrl, { responseType: 'arraybuffer' });

      // Save downloaded content to local filesystem
      const filePath = path.join(DOWNLOAD_DIR, 'index.html');
      fs.writeFileSync(filePath, response.data);

      console.log(`Site downloaded successfully to ${filePath}`);
    } catch (error) {
      console.error('Error downloading site:', error.message);
    }
  }

  // Always return 200 to acknowledge webhook receipt
  res.status(200).send('Webhook received');
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Webhook listener is running. Send a POST request to /webhook.');
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook listener running on http://localhost:${PORT}`);
});