/**
 * Actions available for the Config slice
 *
 * @typedef {object} ConfigActions
 * @property {Function} get
 */

/**
 * Application Configuration Data
 * 
 * @typedef {object} AppConfig
 * 
 * @property {string} adminUrl
 * @property {string} agGridKey
 * @property {string} allowedAttachmentExtensions
 * @property {string} caraClaimFileUrl
 * @property {string} caraClaimUwFileUrl
 * @property {string} caraInvoiceClaimFileUrl
 * @property {string} caraUwFileUrl
 * @property {string} facReinsuranceUrl
 * @property {string} qaPendingRandom
 * @property {string} supportUrl
 * @property {string} caraClaimLegalFileURL
 */

/** @typedef {import('../types.d').BaseSelectors<AppConfig>} ConfigSelectors */

/** @typedef {import('../types.d').StateSlice<ConfigActions, ConfigSelectors>} ConfigSlice */

export const KEY = 'CONFIG_TYPES';