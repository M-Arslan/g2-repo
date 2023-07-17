/**
 * @typedef {object} TemplateText
 * @property {number} templateTextID
 * @property {string} text
 */

/**
 * Actions for the TemplateText slice
 *
 * @typedef {object} TemplateTextActions
 * @property {Function} get
 */

/** 
 * Risk State selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<TemplateText>} TemplateTextSelectors
 */

/** @typedef {import('../../types.d').StateSlice<TemplateTextActions, TemplateTextSelectors>} TemplateTextSlice */

export const KEY = 'TEMPLATETEXT_TYPES';