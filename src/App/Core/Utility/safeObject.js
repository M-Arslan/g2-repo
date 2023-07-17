import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from './rules';

/**
 * allows null-safe array operations
 * @param {any} arr
 * @returns {Array}
 */
export const safeArray = (arr) => (ensureNonEmptyArray(arr) ? arr : []);

/**
 * allows null-safe object operations
 * @param {any} obj
 * @returns {object}
 */
export const safeObj = (obj) => (ensureNonNullObject(obj) ? obj : {});

/**
 * allows null-safe string operations
 * @param {any} str
 * @returns {string}
 */
export const safeStr = (str) => (ensureNonEmptyString(str) ? str : '');

/**
 * allows safe Promise operations
 * @param {any} promise
 */
export const safePromise = (promise) => (promise instanceof Promise ? promise : Promise.resolve(promise));

/**
 * performs a deep object freeze throughout the entire object graph
 * if argument is not an non-null object, returns the argument without modification
 * @param {any} obj value to attempt to freeze
 * @returns {any}
 */
export const immutable = (obj) => {
    return obj;

    if (ensureNonEmptyArray(obj) === true || ensureNonNullObject(obj) === false) {
        return obj;
    }
    else {
        const r = Object.keys(obj).reduce((o, key) => {
            return { ...o, [key]: immutable(obj[key]) };
        }, {});

        return Object.freeze(r);
    }
}

export function safeJsonParse(str) {
    if (typeof str !== 'string') {
        return ['Not a string', str];
    }

    try {
        return [null, JSON.parse(str)];
    } catch (err) {
        return [err, str];
    }
}

export function firstOrNull(arr) {
    return (ensureNonEmptyArray(arr) ? arr[0] : null);
}