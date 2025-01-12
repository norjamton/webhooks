const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Directory to save the downloaded site
const DOWNLOAD_DIR = '/Users/jamesnorton/Downloads/webhook downloads';

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', req.body);

  // Verify it's a site_publish event
  if (req.body.triggerType === 'site_publish') {
    try {
      const siteUrl = 'https://tom-clover-clone.webflow.io/'; // Your Webflow site URL

      console.log('Downloading the site...');
      const response = await axios.get(siteUrl, { responseType: 'arraybuffer' });

      // Save the main HTML file
      const filePath = path.join(DOWNLOAD_DIR, 'index.html');
      fs.writeFileSync(filePath, response.data);

      console.log(`Site downloaded successfully to ${filePath}`);
    } catch (error) {
      console.error('Error downloading site:', error.message);
    }
  }

  res.status(200).send('Webhook received');
});

// Add a simple GET route for the root URL
app.get('/', (req, res) => {
  res.send('Webhook listener is running. Send a POST request to /webhook.');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook listener running on http://localhost:${PORT}`);
});