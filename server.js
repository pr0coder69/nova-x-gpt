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

        const aiMessage = response.data.result || response.data.response || response.data.content || "No response.";
        res.json({ response: aiMessage });
    } catch (error) {
        res.status(500).json({ response: "Error: Connection lost." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Nova AI running on port ${PORT}`));
