const express = require('express');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;

const allowedTypes = ['word', 'line', 'paragraph', 'block', 'symbol'];

app.post('/get-text', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    const buffer = Buffer.from(image, 'base64');
    const result = await Tesseract.recognize(buffer, 'eng');

    res.json({ text: result.data.text });
  } catch (error) {
    console.error('Error in /get-text:', error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
});

app.post('/get-boxes', async (req, res) => {
  try {
    const { image, type } = req.body;

    if (!image || !type) {
      return res.status(400).json({ error: 'Image data and type are required.' });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid bounding box type.' });
    }

    const buffer = Buffer.from(image, 'base64');
    const result = await Tesseract.recognize(buffer, 'eng');
    const items = result.data[type + 's'];

    const boxes = items.map(item => ({
      text: item.text,
      bbox: item.bbox
    }));

    res.json({ boxes });
  } catch (error) {
    console.error('Error in /get-boxes:', error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});