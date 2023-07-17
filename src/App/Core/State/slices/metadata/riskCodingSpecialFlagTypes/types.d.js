/**
 * @typedef {object} RiskCodingSpecialFlagTypes
 * @property {number} riskCodingSpecialFlagTypeID
 * @property {string} specialFlagText
 * @property {string} active
 * @property {number} sequence
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
 */


/**
 * Actions for the RiskCodingSpecialFlagTypesSlice slice
 *
 * @typedef {object} RiskCodingSpecialFlagTypesActions
 * @property {Function} get
 */

/** 
 * Line Of Business Coding Type selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<RiskCodingSpecialFlagTypes>} RiskCodingSpecialFlagTypeselectors
 */

/** @typedef {import('../../types.d').StateSlice<RiskCodingSpecialFlagTypesActions, RiskCodingSpecialFlagTypesSelectors>} RiskCodingSpecialFlagTypesSlice */

export const KEY = 'CLAIM_RISK_CODING';