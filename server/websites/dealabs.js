import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

const COOKIE = "f_v=%2298a0e346-f60e-11f0-88dd-0242ac110003%22; _fbp=fb.1.1768920303159.884270691286475403; dont-track=0; f_c=1; g_p=1; cookie_policy_agreement=3; view_layout_horizontal=%221-1%22; show_my_tab=0; hide_local=0; time_frame=365; browser_push_permission_requested=1768922316; hide_expired=1; sort_by=%22new%22; cw-test-00000000_htlbid-tude_0_100=tude; cw-test-20250625_prebid-v2-test_1_99=control; cw-test-20250908_bcss_50_50=test; _lr_env_src_ats=false; _lr_geo_location_state=IDF; _lr_geo_location=FR; _lr_sampling_rate=100; navi=%7B%22homepage%22%3A%22highlights%22%7D; _lr_retry_request=true; __gads=ID=5dd99a7e1f6b3a2f:T=1768920305:RT=1775913315:S=ALNI_MYLjeZGiWqhh-OGA8javyuiDJKlTw; __eoi=ID=7a2a349d59ec3016:T=1768920305:RT=1775913316:S=AA-AfjazYiRbkYpz5e_MRACjLsZU; pepper_session=%22qqr6wOmXQPtfxQEOZvjIeagsgV4FuQntiTGQrqbF%22; remember_6fc0f483e7f442dc50848060ae780d66=%223446501%7CjDQxPcJqqqBQanN9nQCs1lnyimXZMDoX8eKeNjdvdfFg0AvZYxoQcvB3lXaA%7C%242y%2412%24ksQcQzvE5jOG.5AiIC%5C%2FUYOOrW3POoKqayBDCKjltnABqHp5kc6S8S%22; u_l=1; xsrf_t=%22Oy4OTesNKEKZEX0sjk1EfZDLin6jyVq0xk3qSunm%22";

const parse = data => {
  const $ = cheerio.load(data, { xmlMode: true });

  return $('article.thread')
    .map((i, element) => {
      const title = $(element).find('.thread-title').text().trim();
      const link = $(element).find('a.thread-link').attr('href') || '';
      const priceText = $(element).find('.threadItemCard-price').text().trim();
      const discountText = $(element).find('.textBadge--green').text().trim();
      const temperature = parseFloat($(element).find('.vote-temp').text().trim()) || null;
      const comments = parseInt($(element).find('.thread-comment-container').text().trim()) || 0;
      const idMatch = title.match(/\b(\d{4,6})\b/);
      const id = idMatch ? idMatch[1] : null;

      const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) || null;
      const discount = parseInt(discountText.replace(/[^\d]/g, '')) || null;

      if (!title) return null;
      return { title, price, discount, link, id, temperature, comments, uuid: uuidv5(link, uuidv5.URL) };
    })
    .get()
    .filter(Boolean);
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
    return parse(body);
  }

  console.error(response);
  return null;
};

export { scrape };