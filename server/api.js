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
app.get('/sales/search', (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const limit = parseInt(request.query.limit) || 12;
    const { legoSetId } = request.query;
    let result = SALES[legoSetId] || [];
    result = result.sort((a, b) => b.published - a.published).slice(0, limit);
    return response.status(200).json({
      'success': true,
      'data': {'limit': limit, 'total': result.length, 'result': result}
    });
  } catch (error) {
    return response.status(404).json({'success': false, 'data': {'result': []}});
  }
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);