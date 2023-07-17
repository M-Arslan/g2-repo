import { ensureNonEmptyString } from './rules';

/**
 * Capitalize the first letter of a word
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
    const s = (ensureNonEmptyString(str) ? str : `${str}`);
    return `${s[0].toUpperCase()}${s.substr(1)}`;
}

/**
 * Splits camel or pascal cased strings into spaced sentence phrases
 * @param {string} str
 * @returns {string}
 */
export function sentencize(str) {
    return str.split(/(?=[A-Z][a-z0-9]+)/).join(' ');
}