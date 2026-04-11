import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import SALES from "./sources/vinted.json" with { type: "json" };
import DEALS from "./sources/deals.json" with { type: "json" };

const PORT = 8092;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


// GET /deals/search
app.get('/deals/search', (request, response) => {
  try {
    const limit = parseInt(request.query.limit) || 12;
    const price = parseFloat(request.query.price) || null;
    const date = request.query.date || null;
    const filterBy = request.query.filterBy || null;

    let results = [...DEALS];

    if (price) results = results.filter(d => d.price <= price);
    if (date) results = results.filter(d => new Date(d.published * 1000) >= new Date(date));
    if (filterBy === 'best-discount') results = results.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (filterBy === 'most-commented') results = results.sort((a, b) => (b.comments || 0) - (a.comments || 0));

    results = results.sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, limit);

    return response.status(200).json({
      'success': true,
      'data': {'limit': limit, 'total': results.length, 'results': results}
    });
  } catch (error) {
    return response.status(500).json({'success': false});
  }
});

// GET /deals/:id
app.get('/deals/:id', (request, response) => {
  try {
    const deal = DEALS.find(d => d.uuid === request.params.id);
    if (!deal) return response.status(404).json({'success': false, 'data': null});
    return response.status(200).json({'success': true, 'data': deal});
  } catch (error) {
    return response.status(500).json({'success': false});
  }
});

// GET /sales/search
app.get('/sales/search', async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const limit = parseInt(request.query.limit) || 12;
    const { legoSetId } = request.query;
    
    if (!legoSetId) {
      return response.status(200).json({
        'success': true,
        'data': {'limit': limit, 'total': 0, 'result': []}
      });
    }

    // Scrape Vinted en temps réel
    const vintedResponse = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=${Math.floor(Date.now()/1000)}&search_text=${legoSetId}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids`, {
      headers: {
        'accept': 'application/json',
        'accept-language': 'fr-FR,fr;q=0.9',
        'cookie': process.env.VINTED_COOKIE || ''
      }
    });

    if (!vintedResponse.ok) {
      // Fallback sur le fichier statique
      const result = (SALES[legoSetId] || []).slice(0, limit);
      return response.status(200).json({
        'success': true,
        'data': {'limit': limit, 'total': result.length, 'result': result}
      });
    }

    const body = await vintedResponse.json();
    const items = body.items || [];
    const result = items.slice(0, limit).map(item => ({
      link: item.url,
      price: { amount: item.total_item_price?.amount || item.price?.amount, currency_code: 'EUR' },
      title: item.title,
      published: item.photo?.high_resolution?.timestamp,
      uuid: item.id
    }));

    return response.status(200).json({
      'success': true,
      'data': {'limit': limit, 'total': result.length, 'result': result}
    });

  } catch (error) {
    console.error(error);
    return response.status(404).json({'success': false, 'data': {'result': []}});
  }
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);