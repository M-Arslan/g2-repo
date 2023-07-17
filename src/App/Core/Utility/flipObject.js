import {
    safeObj
} from './safeObject';

/**
 * Swaps property keys and values in an object to create a lookup.
 * @param {object} obj
 * @returns {object}
 */
export function flipObject(obj) {
    return Object.keys(safeObj(obj)).reduce((fo, key) => {
        return { ...fo, [obj[key]]: key }
    }, {});
}