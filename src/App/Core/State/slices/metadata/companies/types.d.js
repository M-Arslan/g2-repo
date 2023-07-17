/**
 * @typedef {object} Company
 * @property {number} g2CompanyNameID
 * @property {number} g2LegalEntityID
 * @property {string} companyName
 * @property {number} sequenceNumber
 */

/**
 * Actions for the Company slice
 *
 * @typedef {object} CompanyActions
 * @property {Function} get
 */

/** 
 * Risk State selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<Company>} CompanySelectors
 */

/** @typedef {import('../../types.d').StateSlice<CompanyActions, CompanySelectors>} CompanySlice */

export const KEY = 'COMPANIES_TYPES';