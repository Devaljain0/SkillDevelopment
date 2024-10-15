const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  // Refine search query by appending price-related terms
  const refinedQuery = `${query} price OR cost OR buy`;

  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: 'AIzaSyB2mXI_kvSBjeqnwVVGAEgCa6e48T-N4Mw',          // Replace with your API key
        cx: '50ca85d46029d437d',  // Replace with your Custom Search Engine ID
        q: refinedQuery,
      },
    });

    // Extract relevant information from the search results
    const results = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Google Custom Search API');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
