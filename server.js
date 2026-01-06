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
        // Tumatawag sa ChatGPT endpoint ng Kohi
        const response = await axios.get(`https://api-library-kohi.onrender.com/api/chatgpt`, {
            params: { prompt: prompt }
        });

        // Ito ay lalabas sa logs ng Render para makita natin ang format
        console.log("Kohi ChatGPT API raw response:", response.data);

        // Sinusubukan kunin ang text sa lahat ng posibleng formats
        const aiMessage = 
            response.data.result || 
            response.data.response || 
            response.data.content || 
            response.data.reply ||
            (typeof response.data === 'string' ? response.data : null);

        if (aiMessage) {
            res.json({ response: aiMessage });
        } else {
            // Kung walang mahanap na text sa JSON, ibabato ang buong data para makita natin
            res.json({ response: "Rumesponde ang API pero hindi mahanap ang text property. Data: " + JSON.stringify(response.data) });
        }

    } catch (error) {
        console.error('Fetch Error:', error.message);
        res.status(500).json({ response: "Hindi makakonekta sa Nova AI server. Subukan muli mamaya." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Nova AI is active on port ${PORT}`);
});
