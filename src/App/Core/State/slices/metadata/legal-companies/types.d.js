/**
 * @typedef {object} LegalCompany
 * @property {number} companyEntityTypeID
 * @property {string} companyName
 * @property {number} sequenceNumber
 * @property {boolean} active
 */

/**
 * Actions for the Legal Company slice
 *
 * @typedef {object} LegalCompanyActions
 * @property {Function} get
 */

/** 
 * Risk State selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<LagalCompany>} LagalCompanySelectors
 */

/** @typedef {import('../../types.d').StateSlice<LegalCompanyActions, LagalCompanySelectors>} LegalCompanySlice */

export const KEY = 'LEGAL_COMPANIES_TYPES';