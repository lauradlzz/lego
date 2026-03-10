'use strict';

/**
 * Get an array of unique Lego set IDs from deals
 * @param {Array} deals - list of deals
 * @returns {Array} list of unique lego set ids
 */
const getIdsFromDeals = deals => {
  const ids = deals.map(deal => deal.id).filter(id => id != null);
  return [...new Set(ids)]; // Retire les doublons
};

/**
 * Calculate percentile from an array of numbers
 * @param {Array} data - array of prices
 * @param {Number} percentile - percentile to calculate (ex: 50 for median)
 * @returns {Number}
 */
const calculatePercentile = (data, percentile) => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

/**
 * Calculate lifetime value in days from an array of sales
 * @param {Array} sales - array of Vinted sales
 * @returns {Number} days
 */
const calculateLifetime = (sales) => {
  if (sales.length === 0) return 0;
  const dates = sales.map(sale => new Date(sale.published).getTime()).filter(t => !isNaN(t));
  if (dates.length === 0) return 0;
  
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const diffTime = Math.abs(maxDate - minDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * LocalStorage management for Favorites
 */
const getFavorites = () => JSON.parse(localStorage.getItem('lego_favorites')) || [];

const toggleFavorite = (uuid) => {
  let favorites = getFavorites();
  if (favorites.includes(uuid)) {
    favorites = favorites.filter(id => id !== uuid);
  } else {
    favorites.push(uuid);
  }
  localStorage.setItem('lego_favorites', JSON.stringify(favorites));
  return favorites;
};