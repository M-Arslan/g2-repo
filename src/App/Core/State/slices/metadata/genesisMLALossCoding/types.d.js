/**
 * @typedef {object} OpenLineBobCoverage
 * @property {number} boBCoverageID
 * @property {number} attachmentPoint
 * @property {number} limit
 * @property {number} grcParticipation
 * @property {string} coverage
 * @property {string} trigger
 * @property {string} expense
 */

/**
 * Actions for the OpenLineBobCoverage slice
 *
 * @typedef {object} OpenLineBobCoverageActions
 * @property {Function} get
 */

/** 
 * Risk State selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<OpenLineBobCoverage>} OpenLineBobCoverageSelectors
 */

/** @typedef {import('../../types.d').StateSlice<OpenLineBobCoverageActions, OpenLineBobCoverageSelectors>} OpenLineBobCoverageSlice */

export const KEY = 'OpenLineBobCoverage';