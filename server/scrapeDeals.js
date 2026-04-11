import * as dealabs from './websites/dealabs.js';
import fs from 'fs';

const url = 'https://www.dealabs.com/groupe/lego';

async function scrapeDeals() {
  try {
    console.log(`🕵️‍♀️ browsing ${url}`);
    const deals = await dealabs.scrape(url);
    console.log(deals);
    fs.writeFileSync('deals.json', JSON.stringify(deals, null, 2));
    console.log('done');
  } catch (e) {
    console.error(e);
  }
}

scrapeDeals();