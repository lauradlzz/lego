import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

const parse = data => {
  const $ = cheerio.load(data, { xmlMode: true });

  return $('article.thread')
    .map((i, element) => {
      const title = $(element).find('.thread-title').text().trim();
      const link = $(element).find('a.thread-link').attr('href') || '';
      const priceText = $(element).find('.threadItemCard-price').text().trim();
      const discountText = $(element).find('.textBadge--green').text().trim();

      const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) || null;
      const discount = parseInt(discountText.replace(/[^\d]/g, '')) || null;

      return { title, price, discount, link, uuid: uuidv5(link, uuidv5.URL) };
    })
    .get()
    .filter(d => d.title);
};

const scrape = async url => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'fr-FR,fr;q=0.9',
    }
  });

  if (response.ok) {
    const body = await response.text();
    return parse(body);
  }

  console.error(response);
  return null;
};

export { scrape };