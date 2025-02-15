const express = require('express');
const path = require('path');
const axios = require('axios');  // For making HTTP requests to the backend
const app = express();
const port = 5000;

// Middleware to serve the Mintlify docs (assuming docs are generated in the 'docs' folder)
app.use(express.static(path.join(__dirname, 'docs')));

// The /api/request endpoint that forwards requests to your backend
app.use(express.json());  // To parse JSON request bodies

app.post('/api/request', async (req, res) => {
  try {
    const reqData = req.body;

    // Forward the request to the real backend
    const response = await axios({
      url: reqData.url,  // The backend URL that came in the payload
      method: reqData.method || 'POST',  // Default to POST if no method is provided
      data: reqData.body || null,  // Send the data if provided
      headers: reqData.header
    });

    // Return the backend response back to the Mintlify UI
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while forwarding the request.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Mintlify docs and API proxy running at http://localhost:${port}`);
});
