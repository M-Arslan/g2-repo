/**
 * @typedef {object} RiskState
 * @property {number} riskStateID
 * @property {string} stateCode
 * @property {string} stateName
 */

/**
 * Actions for the RiskStates slice
 *
 * @typedef {object} RiskStatesActions
 * @property {Function} get
 */

/** 
 * Risk State selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<RiskState>} RiskStatesSelectors
 */

/** @typedef {import('../../types.d').StateSlice<RiskStatesActions, RiskStatesSelectors>} RiskStatesSlice */

export const KEY = 'RISKSTATES_TYPES';