export class LocalStorageMock {
    constructor() {
        this._ls = new Map();
    }

    getItem(key) {
        return this._ls.get(key);
    }

    setItem(key, value) {
        this._ls.set(key, value);
    }

    removeItem(key) {
        this._ls.delete(key);
    }

    clear() {
        this._ls = new Map();
    }
}