const NodeCache = require('node-cache');
const { CACHE_TTL } = require('../config');

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 120 });

/**
 * Generate a consistent cache key for a GitHub request.
 * @param {string} username
 * @param {number} page
 * @returns {string}
 */
const genKey = (username, page = 1) => `github:${username.toLowerCase()}:${page}`;

/**
 * Get a value from cache.
 * @param {string} key
 * @returns {any|undefined}
 */
const get = (key) => cache.get(key);

/**
 * Set a value in cache.
 * @param {string} key
 * @param {any} value
 */
const set = (key, value) => cache.set(key, value);

module.exports = { get, set, genKey };
