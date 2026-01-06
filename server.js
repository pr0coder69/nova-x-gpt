const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.get(`https://api-library-kohi.onrender.com/api/chatgpt`, {
            params: { prompt: prompt }
        });

        // DEBUG LOG
        console.log("Raw API Response:", response.data);

        // FIX: Ang sagot pala ay nasa response.data.data base sa log mo
        const aiMessage = response.data.data || response.data.result || response.data.content || "No response found.";

        res.json({ response: aiMessage });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ response: "Connection error. Please try again." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Nova AI Fixed on port ${PORT}`);
});
