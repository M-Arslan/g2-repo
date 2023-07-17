import { safeObj, safeStr } from './safeObject';

/**
 * Replaces the pattern of "@{property}" within the template with the property values in the replacements object.
 * @param {string} template
 * @param {object} replacements
 * @returns {string}
 */
export function processTemplateString(template, replacements) {
    const rp = safeObj(replacements);

    return Object.keys(rp).reduce((str, property) => {
        return str.replaceAll(`@{${property}}`, rp[property]);
    }, safeStr(template));
}