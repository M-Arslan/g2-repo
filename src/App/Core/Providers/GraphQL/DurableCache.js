
class Cache {

    constructor() {
        this._cache = new Map();
    }

    /** @type {Map<string, Map>} */
    get cache() {
        return this._cache;
    }

    hasCache(key) {
        return this.cache.has(key);
    }

    initCache(key) {
        this.cache.set(key, new Map());
    }

    invalidateCache(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
    }

    hasDataFor(cacheKey, itemKey) {
        return (this.cache.has(cacheKey) && this.cache.get(cacheKey).has(itemKey));
    }

    getDataFor(cacheKey, itemKey) {
        return (this.cache.has(cacheKey) ? this.cache.get(cacheKey).get(itemKey) : null);
    }

    setDataFor(cacheKey, itemKey, data) {
        if (this.hasCache(cacheKey) !== true) {
            this.initCache(cacheKey);
        }

        return this.cache.get(cacheKey).set(itemKey, data);
    }
}

export const DurableCache = new Cache();
