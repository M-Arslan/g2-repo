/**
 * @typedef {object} LineOfBusinessCodingType
 * @property {number} lineOfBusinessCodingTypeID
 * @property {string} lineOfBusinessCodingText
 * @property {string} active
 * @property {number} sequence
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
 */


/**
 * Actions for the LineOfBusinessCodingTypeSlice slice
 *
 * @typedef {object} LineOfBusinessCodingTypeActions
 * @property {Function} get
 */

/** 
 * Line Of Business Coding Type selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<LineOfBusinessCodingType>} LineOfBusinessCodingTypeSelectors
 */

/** @typedef {import('../../types.d').StateSlice<LineOfBusinessCodingTypeActions, LineOfBusinessCodingTypeSelectors>} LineOfBusinessCodingTypeSlice */

export const KEY = 'CLAIM_RISK_CODING';