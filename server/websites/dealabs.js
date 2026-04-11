import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';

const COOKIE = "f_v=%2298a0e346-f60e-11f0-88dd-0242ac110003%22; _fbp=fb.1.1768920303159.884270691286475403; dont-track=0; f_c=1; g_p=1; cookie_policy_agreement=3; pepper_session=%22qqr6wOmXQPtfxQEOZvjIeagsgV4FuQntiTGQrqbF%22; remember_6fc0f483e7f442dc50848060ae780d66=%223446501%7CjDQxPcJqqqBQanN9nQCs1lnyimXZMDoX8eKeNjdvdfFg0AvZYxoQcvB3lXaA%7C%242y%2412%24ksQcQzvE5jOG.5AiIC%5C%2FUYOOrW3POoKqayBDCKjltnABqHp5kc6S8S%22; u_l=1; xsrf_t=%22Oy4OTesNKEKZEX0sjk1EfZDLin6jyVq0xk3qSunm%22";

import * as cheerio from 'cheerio';

const parse = data => {
  const $ = cheerio.load(data);
  const deals = [];

  $('div.js-vue3').each((i, element) => {
    try {
      const raw = $(element).attr('data-vue3');
      if (!raw) return;
      const json = JSON.parse(raw);
      if (json.name !== 'ThreadMainListItemNormalizer') return;
      const t = json.props.thread;

      const link = t.shareableLink || '';
      const title = t.title || '';
      const price = t.price ?? null;
      const temperature = t.temperature ?? null;
      const comments = t.commentCount ?? 0;
      const published = t.publishedAt ?? null;
      const photo = t.mainImage ? `https://static-pepper.dealabs.com/${t.mainImage.path}/${t.mainImage.name}/re/300x300/qt/60/${t.mainImage.name}.jpg` : null;
      const idMatch = title.match(/\b(\d{4,6})\b/);
      const id = idMatch ? idMatch[1] : null;
      const nextBestPrice = t.nextBestPrice ?? null;
      const discount = (price && nextBestPrice && nextBestPrice > 0) 
        ? Math.round((1 - price / nextBestPrice) * 100) 
        : null;

      if (!title) return;
      deals.push({ title, price, discount, link, id, temperature, comments, photo, published, uuid: uuidv5(link, uuidv5.URL) });
    } catch (e) {}
  });

  return deals;
};


const scrape = async url => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'fr-FR,fr;q=0.9',
      'cookie': COOKIE
    }
  });

  if (response.ok) {
    const body = await response.text();
    fs.writeFileSync('debug2.html', body);
    console.log('HTML saved');
    return parse(body);
  }

  console.error(response);
  return null;
};

export { scrape };