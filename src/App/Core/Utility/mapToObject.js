import {
    ensureNonNullObject
} from './rules';

/**
 * Converts a Map instance to a POJO
 * @param {Map<string, any>} map
 * @returns {object}
 */
export function mapToObject(map) {
    if (ensureNonNullObject(map) && typeof map.entries === 'function') {
        return [...map.entries()].reduce((obj, entry) => {
            return { ...obj, [entry[0]]: entry[1] };
        }, {});
    }
    else {
        return null;
    }
}