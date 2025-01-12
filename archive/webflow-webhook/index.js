const express = require('express');
const app = express();
require('dotenv').config();  // Load environment variables

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log(`Webflow URL: ${process.env.WEBFLOW_URL}`);  // Log the Webflow URL
});

module.exports = app;  // Export the app for testing or other uses
