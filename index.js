const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to handle TTS conversion
app.post('/convert', (req, res) => {
    const { text } = req.body;
    const fileName = `output.wav`;
    const filePath = path.join(__dirname, fileName);

    exec(`espeak "${text}" --stdout > ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing text-to-speech');
        }

        res.set('Content-Type', 'audio/wav');
        fs.createReadStream(filePath).pipe(res);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
