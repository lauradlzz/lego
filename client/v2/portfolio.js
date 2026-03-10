'use strict';

// État global
let currentDeals = [];
let displayedDeals = []; // Deals actuellement affichés (après filtre/tri)
let currentPagination = {};
let currentSales = [];

// Sélecteurs
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectSort = document.querySelector('#sort-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals');
const sectionSales = document.querySelector('#sales');

// Sélecteurs Indicateurs
const spanNbDeals = document.querySelector('#nbDeals');
const spanNbSales = document.querySelector('#nbSales');
const spanP5 = document.querySelector('#p5Price');
const spanP25 = document.querySelector('#p25Price');
const spanP50 = document.querySelector('#p50Price');
const spanLifetime = document.querySelector('#lifetimeValue');

// Boutons Filtres
const btnFilterDiscount = document.querySelector('#filter-discount');
const btnFilterComments = document.querySelector('#filter-comments');
const btnFilterHot = document.querySelector('#filter-hot');
const btnFilterFavorites = document.querySelector('#filter-favorites');
const btnFilterReset = document.querySelector('#filter-reset');

/**
 * Fetch deals from api
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`);
    const body = await response.json();
    if (body.success !== true) return {result: [], meta: {}};
    return body.data;
  } catch (error) {
    console.error(error);
    return {result: [], meta: {}};
  }
};

/**
 * Fetch Vinted sales for a specific set ID
 */
const fetchSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();
    if (body.success !== true) return [];
    return body.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Render list of deals
 */
const renderDeals = (deals) => {
  const favorites = getFavorites();
  
  if (deals.length === 0) {
    sectionDeals.innerHTML = '<p>No deals found.</p>';
    return;
  }

  const template = deals.map(deal => {
    const isFav = favorites.includes(deal.uuid);
    return `
      <div class="card" id="${deal.uuid}">
        <span>ID: <strong>${deal.id}</strong></span><br>
        <a href="${deal.link}" target="_blank">${deal.title}</a>
        <p>💰 Price: <strong>${deal.price} €</strong> (Discount: ${deal.discount}%)</p>
        <p>🌡️ Temp: ${deal.temperature} | 💬 Comments: ${deal.comments}</p>
        <button class="fav-btn" data-uuid="${deal.uuid}">
          ${isFav ? '⭐ Remove Favorite' : '☆ Add to Favorite'}
        </button>
      </div>
    `;
  }).join('');

  sectionDeals.innerHTML = template;

  // Ajout des écouteurs pour les boutons favoris
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const uuid = e.target.getAttribute('data-uuid');
      toggleFavorite(uuid);
      renderDeals(displayedDeals); // Re-render pour MAJ l'UI du bouton
    });
  });
};

/**
 * Render list of Vinted sales
 */
const renderSales = (sales) => {
  if (sales.length === 0) {
    sectionSales.innerHTML = '<p>No Vinted sales found for this ID.</p>';
    return;
  }
  const template = sales.map(sale => `
    <div class="card">
      <a href="${sale.link}" target="_blank">${sale.title}</a>
      <p>💰 Sold Price: <strong>${sale.price} €</strong></p>
      <p>📅 Date: ${new Date(sale.published).toLocaleDateString()}</p>
    </div>
  `).join('');
  sectionSales.innerHTML = template;
};

/**
 * Update global indicators
 */
const renderIndicators = (pagination, sales) => {
  spanNbDeals.innerHTML = pagination.count || 0;
  spanNbSales.innerHTML = sales.length;

  const prices = sales.map(s => s.price);
  spanP5.innerHTML = calculatePercentile(prices, 5).toFixed(2) + ' €';
  spanP25.innerHTML = calculatePercentile(prices, 25).toFixed(2) + ' €';
  spanP50.innerHTML = calculatePercentile(prices, 50).toFixed(2) + ' €';
  
  spanLifetime.innerHTML = calculateLifetime(sales) + ' days';
};

/**
 * Render Selectors (Pages & IDs)
 */
const renderPagination = (pagination) => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from({'length': pageCount}, (v, i) => 
    `<option value="${i + 1}" ${i + 1 === currentPage ? 'selected' : ''}>Page ${i + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
};

const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  const options = `<option value="">Select an ID</option>` + ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');
  selectLegoSetIds.innerHTML = options;
};

/**
 * Main render function
 */
const render = (deals, pagination, sales = []) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination, sales);
  renderSales(sales);
};

/**
 * Load initial data
 */
const loadData = async (page = 1, size = 6) => {
  const data = await fetchDeals(page, size);
  currentDeals = data.result;
  displayedDeals = [...currentDeals];
  currentPagination = data.meta;
  
  renderLegoSetIds(currentDeals); // On met à jour la liste des IDs dispo
  render(displayedDeals, currentPagination, currentSales);
};

// ========================
// LISTENERS (Events)
// ========================

// 1. Pagination & Pagination Size
selectShow.addEventListener('change', (e) => loadData(1, parseInt(e.target.value)));
selectPage.addEventListener('change', (e) => loadData(parseInt(e.target.value), selectShow.value));

// 2. Fetch Vinted Sales on ID selection
selectLegoSetIds.addEventListener('change', async (e) => {
  const id = e.target.value;
  if (!id) {
    currentSales = [];
  } else {
    currentSales = await fetchSales(id);
  }
  renderIndicators(currentPagination, currentSales);
  renderSales(currentSales);
});

// 3. Sorting logic
selectSort.addEventListener('change', (e) => {
  const sortType = e.target.value;
  let sorted = [...displayedDeals];

  if (sortType === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  if (sortType === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  if (sortType === 'date-desc') sorted.sort((a, b) => new Date(b.published) - new Date(a.published));
  if (sortType === 'date-asc') sorted.sort((a, b) => new Date(a.published) - new Date(b.published));
  
  displayedDeals = sorted;
  renderDeals(displayedDeals);
});

// 4. Filtering logic
const applyFilter = (filterFunc) => {
  displayedDeals = currentDeals.filter(filterFunc);
  renderDeals(displayedDeals);
};

btnFilterDiscount.addEventListener('click', () => applyFilter(deal => deal.discount > 50));
btnFilterComments.addEventListener('click', () => applyFilter(deal => deal.comments > 15));
btnFilterHot.addEventListener('click', () => applyFilter(deal => deal.temperature > 100));
btnFilterFavorites.addEventListener('click', () => {
  const favs = getFavorites();
  applyFilter(deal => favs.includes(deal.uuid));
});
btnFilterReset.addEventListener('click', () => {
  displayedDeals = [...currentDeals];
  selectSort.value = 'default';
  renderDeals(displayedDeals);
});

// 5. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadData(1, parseInt(selectShow.value));
});