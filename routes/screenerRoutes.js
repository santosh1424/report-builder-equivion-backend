const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

// Scrape all company data from Screener.in using Puppeteer
router.get('/company-consolidated/:company', async (req, res) => {
  const { company } = req.params;
  const url = `https://www.screener.in/company/${company}/consolidated/`;

  let browser;
  try {
    // Launch a new browser instance
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the URL and wait for the page content to load
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.sub', { timeout: 30000 });

    const companyData = await page.evaluate(() => {
      const cleanData = (text) => text.replace(/\s+/g, ' ').trim();
      const data = {};
      // Extract company name from h1 tag
      const companyNameElement = document.querySelector('h1.show-from-tablet-landscape');
      data.companyName = companyNameElement ? cleanData(companyNameElement.innerText) : "Company name not found";

      // Extract company profile (About section)
      const aboutSection = document.querySelector('.company-profile .title');
      data.about = aboutSection ? cleanData(aboutSection.nextElementSibling?.innerText) : "About data not found";

      // Extract Key Points section
      const keyPointsSection = document.querySelector('.company-profile .commentary');
      data.keyPoints = keyPointsSection ? cleanData(keyPointsSection.innerText) : "Key points data not found";

      // Extract all <p class="sub"> elements
      const sectorIndustrySections = document.querySelectorAll('.sub');

      sectorIndustrySections.forEach(section => {
        const textContent = section.textContent;
        // Look for the "Sector:" label and extract the next <a> tag
        if (textContent.includes("Sector:")) {
          const sectorLink = section.querySelector('a');
          data.sector = sectorLink ? cleanData(sectorLink.textContent) : 'Sector not found.';
        }

        // Look for the "Industry:" label and extract the second <a> tag for Industry
        if (textContent.includes("Industry:")) {
          const industryLink = section.querySelectorAll('a')[1]; // Select second <a> for Industry
          data.industry = industryLink ? cleanData(industryLink.textContent) : 'Industry not found.';
        }
      });

      // If no sector or industry is found, set default values
      if (!data.sector) {
        data.sector = 'Sector not found.';
      }
      if (!data.industry) {
        data.industry = 'Industry not found.';
      }

      // Extract Shareholding Pattern
      data.shareholdingPattern = {};

      // Extract Latest Shareholding Pattern (Last Available Quarter)
      const yearlyRows = document.querySelectorAll('#yearly-shp tbody tr');
      if (yearlyRows.length > 0) {
        const latestShareholding = [];

        yearlyRows.forEach((row) => {
          const categoryCell = row.querySelector('td.text button');
          const latestValueCell = row.querySelector('td:last-child'); // Get the last column (latest quarter)

          if (categoryCell && latestValueCell) {
            const category = cleanData(categoryCell.textContent);
            const value = cleanData(latestValueCell.textContent);
            latestShareholding.push({ category, value });
          }
        });

        data.shareholdingPattern.latest = latestShareholding;
      } else {
        data.shareholdingPattern.latest = 'No data available';
      }


      return data;
    });



    // Send the scraped data as JSON response
    res.json(companyData);
  } catch (error) {
    console.error('Error fetching consolidated company data:', error.message);
    res.status(500).json({ error: 'Failed to scrape consolidated company data' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
