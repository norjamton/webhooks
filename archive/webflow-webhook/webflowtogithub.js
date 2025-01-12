const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const WEBFLOW_API_TOKEN = '5c829c1b22bd113a74269ac7d2dbac7dc8f93abd47b85bf79612a05197ea40ec';
const SITE_ID = '6500a6fb88e090f54f784e77';
const TEMP_DIR = '/Users/jamesnorton/Downloads/webhook downloads';

app.post('/webhook', async (req, res) => {
    const { triggerType, payload } = req.body;

    if (triggerType !== 'site_publish' || !payload) {
        return res.status(400).json({ error: 'Bad Request' });
    }

    try {
        const response = await axios.get(`https://api.webflow.com/sites/${SITE_ID}/export`, {
            headers: { Authorization: `Bearer ${WEBFLOW_API_TOKEN}`, 'accept-version': '1.0.0' },
            responseType: 'arraybuffer',
        });

        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
        }

        fs.writeFileSync(path.join(TEMP_DIR, 'site.zip'), response.data);
        res.status(200).send('Site downloaded successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

exports.webflowWebhook = app;