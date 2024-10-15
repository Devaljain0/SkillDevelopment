import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export const flipkartScrapper = async (search) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://www.flipkart.com/search?q=${search}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  const htmlcontent = await page.content();
  const $ = cheerio.load(htmlcontent);

  // Scrape at least 5 items
  const products = [];
  const productElements = $(".KzDlHZ");  // Correct class for product name

  productElements.each((index, element) => {
    if (index >= 5) return false; // Stop after fetching 5 items

    const product = $(element).text();
    const price = $(".Nx9bqj._4b5DiR").eq(index).text();  // Correct class for price
    const image = $(".DByuf4").eq(index).attr("src");  // Correct class for image
    const productUrl = $(".CGtC98").eq(index).attr("href");  // Correct class for URL

    products.push({
      product: product.trim(),
      price: price.trim(),
      image: image || 'No image available',
      url: `https://www.flipkart.com${productUrl}`
    });
  });

  await browser.close();

  products.forEach((item, i) => {
    console.log(`Product ${i + 1}:`);
    console.log(`Name: ${item.product}`);
    console.log(`Price: ${item.price}`);
    console.log(`Image URL: ${item.image}`);
    console.log(`Product URL: ${item.url}`);
    console.log('-------------------------');
  });

  return products;
};

flipkartScrapper('iphone');
