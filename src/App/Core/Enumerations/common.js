import {
    capitalize
} from '../Utility/capitalize';
import {
    safeStr
} from '../Utility/safeObject';

/**
 * Turn a key from an enum into a more human readable string
 * @param {string} key
 * @returns {string}
 */
export function enumKeyToString(key) {
    return safeStr(key).split('_').map(word => capitalize(word)).join(' ');
}
