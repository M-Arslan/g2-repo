/**
 * @typedef {object} LegalEntity
 * @property {number} g2LegalEntityID
 * @property {string} g2LegalEntityDesc
 */

/**
 * Actions for the LegalEntity slice
 *
 * @typedef {object} LegalEntityActions
 * @property {Function} get
 */

/** 
 * LegalEntity selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<LegalEntity>} LegalEntitySelectors
 */

/** @typedef {import('../../types.d').StateSlice<LegalEntityActions, LegalEntitySelectors>} LegalEntitySlice */

export const KEY = 'LEGAL_ENTITY_TYPES';