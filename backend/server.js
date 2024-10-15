const express = require('express');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 5000;

// Flipkart Scraper Function
const flipkartScraper = async (search) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://www.flipkart.com/search?q=${search}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const products = [];
    const productElements = $(".KzDlHZ");

    // Fetch at least 5 products
    productElements.each((index, element) => {
        if (index >= 5) return false; // Stop after fetching 5 items

        const product = $(element).text();
        let priceText = $(".Nx9bqj, .yRaY8j").eq(index).text().trim(); // Adjust selector for price
        const image = $(".DByuf4").eq(index).attr("src"); // Adjust selector for image
        const productUrl = $(".CGtC98").eq(index).attr("href"); // Adjust selector for URL

        // Remove currency symbol and commas from price for sorting
        let priceNumeric = parseFloat(priceText.replace(/[₹,]/g, ''));

        if (!isNaN(priceNumeric)) {
            products.push({
                product: product.trim(),
                price: priceText, // Original price with ₹ for display
                priceNumeric: priceNumeric, // Numeric price for sorting
                image: image || 'No image available',
                productUrl: productUrl ? `https://www.flipkart.com${productUrl}` : undefined
            });
        }
    });

    // Sort products by numeric price in ascending order
    products.sort((a, b) => a.priceNumeric - b.priceNumeric);

    await browser.close();
    return products;
};




// Updated Amazon Scraper Function
const amazonScraper = async (search) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://www.amazon.in/s?k=${search}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const products = [];
    
    // Use the correct selectors for Amazon products
    $(".s-main-slot .s-result-item").each((index, element) => {
        const product = $(element).find("h2 a span").text().trim();
        let priceWhole = $(element).find(".a-price-whole").text().trim();
        let priceFraction = $(element).find(".a-price-fraction").text().trim();
        
        let priceText = `₹${priceWhole}.${priceFraction}`; // Keep ₹ symbol in price
        // Remove currency symbol and commas from price for sorting
        let priceNumeric = parseFloat(`${priceWhole}${priceFraction}`.replace(/,/g, ''));

        const image = $(element).find(".s-image").attr("src");
        const productUrl = $(element).find("h2 a").attr("href");

        if (product && !isNaN(priceNumeric)) { // Ensure valid product and price before adding
            products.push({
                product,
                price: priceText, // Original price with ₹ for display
                priceNumeric: priceNumeric, // Numeric price for sorting
                image: image || 'No image available',
                productUrl: productUrl ? `https://www.amazon.in${productUrl}` : undefined
            });
        }
    });

    // Sort products by numeric price in ascending order
    products.sort((a, b) => a.priceNumeric - b.priceNumeric);

    await browser.close();
    return products;
};




// Endpoint to scrape data
app.get('/scrape', async (req, res) => {
    const { search } = req.query;

    if (typeof search !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const flipkartResults = await flipkartScraper(search);
        const amazonResults = await amazonScraper(search);

        res.json({ flipkart: flipkartResults, amazon: amazonResults });
    } catch (error) {
        console.error('Error during scraping:', error);
        console.log(error);
        res.status(500).json({ error: 'An error occurred while scraping' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
